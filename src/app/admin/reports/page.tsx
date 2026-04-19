'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  endOfDay,
  endOfMonth,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
} from 'date-fns'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { createClient } from '@/config/supabase-client'
import { paymentMethodLabel } from '@/lib/admin/revenuePaymentLabels'
import { formatSupabaseError } from '@/lib/admin/supabaseErrors'
import type { Database } from '@/types/database.types'
import { toast } from 'sonner'

type CashFlowRow = Database['public']['Tables']['cash_flow']['Row']

type RevenueEntryBrief = Pick<
  Database['public']['Tables']['service_logs']['Row'],
  | 'client_name'
  | 'service_name'
  | 'payment_method'
  | 'advance_payment_method'
  | 'remaining_payment_method'
>

/** Linha de fluxo de caixa + dados da entrada de receitas (service_logs), quando existir ligação. */
type CashFlowReportRow = CashFlowRow & {
  revenueEntry?: RevenueEntryBrief | null
}

const EUR_DE = (n: number) =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(n)

function formatDateDE(iso: string) {
  try {
    return format(parseISO(iso), 'dd.MM.yyyy')
  } catch {
    return '—'
  }
}

function formatDateTimeDE(iso: string) {
  try {
    return format(parseISO(iso), 'dd.MM.yyyy HH:mm')
  } catch {
    return '—'
  }
}

type CategoryAgg = { category: string; income: number; expense: number }

type MonthAgg = {
  key: string
  label: string
  income: number
  expense: number
  net: number
}

function aggregateByCategory(rows: CashFlowReportRow[]): CategoryAgg[] {
  const map = new Map<string, { income: number; expense: number }>()
  for (const r of rows) {
    const cat = String(r.category ?? 'other')
    const a = Number(r.amount)
    if (!Number.isFinite(a)) continue
    const cur = map.get(cat) ?? { income: 0, expense: 0 }
    if (r.type === 'income') cur.income += a
    else cur.expense += a
    map.set(cat, cur)
  }
  return Array.from(map.entries())
    .map(([category, v]) => ({
      category,
      income: Math.round(v.income * 100) / 100,
      expense: Math.round(v.expense * 100) / 100,
    }))
    .sort((a, b) => a.category.localeCompare(b.category))
}

function aggregateByMonth(rows: CashFlowReportRow[]): MonthAgg[] {
  const map = new Map<string, { income: number; expense: number }>()
  for (const r of rows) {
    const key = format(parseISO(r.created_at), 'yyyy-MM')
    const a = Number(r.amount)
    if (!Number.isFinite(a)) continue
    const cur = map.get(key) ?? { income: 0, expense: 0 }
    if (r.type === 'income') cur.income += a
    else cur.expense += a
    map.set(key, cur)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, v]) => ({
      key,
      label: key,
      income: Math.round(v.income * 100) / 100,
      expense: Math.round(v.expense * 100) / 100,
      net: Math.round((v.income - v.expense) * 100) / 100,
    }))
}

type DayGroup = { dayKey: string; display: string; rows: CashFlowReportRow[] }

/** Método adequado por linha de fluxo (sinal vs saldo vs outro). */
function journalPaymentLabel(row: CashFlowReportRow): string {
  const e = row.revenueEntry
  if (!e) return '—'
  const cat = row.category
  if (cat === 'service_advance') {
    return paymentMethodLabel(e.advance_payment_method ?? e.payment_method)
  }
  if (cat === 'service_payment') {
    return paymentMethodLabel(e.remaining_payment_method ?? e.payment_method)
  }
  return paymentMethodLabel(e.payment_method)
}

function cashFlowCategoryLabelDE(cat: string): string {
  const m: Record<string, string> = {
    stock: 'Lager',
    service: 'Service',
    service_advance: 'Service (Anzahlung)',
    service_payment: 'Service (Restzahlung)',
    other: 'Sonstiges',
    product_sale: 'Produktverkauf',
    fixed_cost: 'Fixkosten',
  }
  return m[cat] ?? cat
}

function groupRowsByDaySorted(rows: CashFlowReportRow[]): DayGroup[] {
  const m = new Map<string, CashFlowReportRow[]>()
  for (const r of rows) {
    const dayKey = format(parseISO(r.created_at), 'yyyy-MM-dd')
    const list = m.get(dayKey) ?? []
    list.push(r)
    m.set(dayKey, list)
  }
  return Array.from(m.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, list]) => ({
      dayKey: key,
      display: format(parseISO(`${key}T00:00:00`), 'dd.MM.yyyy'),
      rows: [...list].sort((a, b) =>
        b.created_at.localeCompare(a.created_at)
      ),
    }))
}

const PDF_MARGIN_MM = 12
/** Largura ~A4 a 96dpi para layout estável no canvas */
const PDF_CAPTURE_PX_W = 794

function settleLayout(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

async function exportReportToPdf(
  element: HTMLElement,
  fileBase: string
): Promise<void> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  const el = element
  const inline: Array<{ node: HTMLElement; display: string }> = []

  const prev = {
    width: el.style.width,
    maxWidth: el.style.maxWidth,
    boxSizing: el.style.boxSizing,
    padding: el.style.padding,
  }

  el.style.boxSizing = 'border-box'
  el.style.width = `${PDF_CAPTURE_PX_W}px`
  el.style.maxWidth = 'none'
  el.style.padding = '24px'

  el.querySelectorAll<HTMLElement>('.no-print').forEach((node) => {
    inline.push({ node, display: node.style.display })
    node.style.display = 'none'
  })

  const printHeader = el.querySelector<HTMLElement>('#financial-report-pdf-header')
  if (printHeader) {
    inline.push({ node: printHeader, display: printHeader.style.display })
    printHeader.classList.remove('hidden')
    printHeader.style.display = 'block'
    printHeader.style.visibility = 'visible'
  }

  const chartHosts = el.querySelectorAll<HTMLElement>('.report-chart-host')
  const chartStylePrev = Array.from(chartHosts).map((host) => ({
    minHeight: host.style.minHeight,
    width: host.style.width,
  }))
  chartHosts.forEach((host) => {
    host.style.minHeight = '260px'
    host.style.width = '100%'
  })

  await settleLayout()
  await new Promise((r) => setTimeout(r, 150))

  let canvas: HTMLCanvasElement
  try {
    canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: el.scrollWidth,
      height: el.scrollHeight,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: false,
      imageTimeout: 20000,
    })
  } finally {
    el.style.width = prev.width
    el.style.maxWidth = prev.maxWidth
    el.style.boxSizing = prev.boxSizing
    el.style.padding = prev.padding
    inline.reverse().forEach(({ node, display }) => {
      node.style.display = display
    })
    chartHosts.forEach((host, i) => {
      const p = chartStylePrev[i]
      if (p) {
        host.style.minHeight = p.minHeight
        host.style.width = p.width
      }
    })
    if (printHeader) {
      printHeader.style.visibility = ''
      printHeader.classList.add('hidden')
    }
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  const innerW = pageW - 2 * PDF_MARGIN_MM
  const innerH = pageH - 2 * PDF_MARGIN_MM

  const srcW = canvas.width
  const srcH = canvas.height
  const totalHeightMm = (srcH / srcW) * innerW

  const addSliceToPdf = (sliceCanvas: HTMLCanvasElement, sliceHmm: number) => {
    const data = sliceCanvas.toDataURL('image/jpeg', 0.94)
    pdf.addImage(data, 'JPEG', PDF_MARGIN_MM, PDF_MARGIN_MM, innerW, sliceHmm)
  }

  if (totalHeightMm <= innerH + 0.25) {
    const data = canvas.toDataURL('image/jpeg', 0.94)
    pdf.addImage(
      data,
      'JPEG',
      PDF_MARGIN_MM,
      PDF_MARGIN_MM,
      innerW,
      totalHeightMm
    )
  } else {
    const slicePxTarget = Math.max(1, (innerH / totalHeightMm) * srcH)
    let yPx = 0
    let first = true
    while (yPx < srcH) {
      if (!first) pdf.addPage()
      first = false
      const slicePx = Math.min(Math.ceil(slicePxTarget), srcH - yPx)
      const sliceHmm = (slicePx / srcH) * totalHeightMm

      const slice = document.createElement('canvas')
      slice.width = srcW
      slice.height = slicePx
      const ctx = slice.getContext('2d')
      if (!ctx) throw new Error('Canvas context')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, slice.width, slice.height)
      ctx.drawImage(canvas, 0, yPx, srcW, slicePx, 0, 0, srcW, slicePx)

      addSliceToPdf(slice, sliceHmm)
      yPx += slicePx
    }
  }

  const safe = fileBase.replace(/[^a-zA-Z0-9-_]/g, '')
  pdf.save(`financial-statement-${safe || 'report'}.pdf`)
}

export default function AdminFinancialReportsPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const reportRef = useRef<HTMLDivElement>(null)

  const [sessionReady, setSessionReady] = useState(false)
  const [rows, setRows] = useState<CashFlowReportRow[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  const [startDate, setStartDate] = useState(() =>
    format(startOfMonth(new Date()), 'yyyy-MM-dd')
  )
  const [endDate, setEndDate] = useState(() =>
    format(endOfMonth(new Date()), 'yyyy-MM-dd')
  )
  const [companyName, setCompanyName] = useState('Unternehmen')
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null)

  const fetchRows = useCallback(async () => {
    setLoading(true)
    try {
      const start = startOfDay(parseISO(startDate)).toISOString()
      const end = endOfDay(parseISO(endDate)).toISOString()
      const { data: cfData, error } = await supabase
        .from('cash_flow')
        .select('*')
        .gte('created_at', start)
        .lte('created_at', end)
        .order('created_at', { ascending: false })

      if (error) throw error
      const cf = (cfData ?? []) as CashFlowRow[]
      const ids = [
        ...new Set(
          cf.map((r) => r.service_log_id).filter((id): id is string => Boolean(id))
        ),
      ]
      const entryById = new Map<string, RevenueEntryBrief>()
      if (ids.length > 0) {
        const { data: logs, error: logErr } = await supabase
          .from('service_logs')
          .select(
            'id, client_name, service_name, payment_method, advance_payment_method, remaining_payment_method'
          )
          .in('id', ids)
        if (logErr) throw logErr
        for (const L of logs ?? []) {
          entryById.set(L.id, {
            client_name: L.client_name,
            service_name: L.service_name,
            payment_method: L.payment_method,
            advance_payment_method: L.advance_payment_method,
            remaining_payment_method: L.remaining_payment_method,
          })
        }
      }
      const enriched: CashFlowReportRow[] = cf.map((r) => ({
        ...r,
        revenueEntry: r.service_log_id
          ? entryById.get(r.service_log_id) ?? null
          : null,
      }))
      setRows(enriched)
    } catch (e) {
      toast.error(formatSupabaseError(e))
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [supabase, startDate, endDate])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (cancelled) return
      if (!session) {
        router.replace('/login')
        return
      }
      setSessionReady(true)
      await fetchRows()
    })()
    return () => {
      cancelled = true
    }
  }, [supabase, router, fetchRows])

  useEffect(() => {
    document.body.classList.add('financial-report-print-active')
    const el = document.createElement('style')
    el.setAttribute('id', 'financial-report-print-styles')
    el.textContent = `
@media print {
  @page { size: A4; margin: 12mm; }
  body.financial-report-print-active {
    background: #fff !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  body.financial-report-print-active .admin-app > header {
    display: none !important;
  }
  body.financial-report-print-active [data-sonner-toaster],
  body.financial-report-print-active .no-print {
    display: none !important;
  }
  body.financial-report-print-active .admin-app > main {
    max-width: none !important;
    padding: 0 !important;
  }
  body.financial-report-print-active .financial-report-print-root {
    box-shadow: none !important;
    border: none !important;
    max-width: none !important;
    padding: 0 !important;
    margin: 0 !important;
    background: #fff !important;
    color: #000 !important;
  }
  body.financial-report-print-active .financial-report-print-root * {
    color: #000 !important;
    box-shadow: none !important;
  }
  body.financial-report-print-active .report-table,
  body.financial-report-print-active .report-table th,
  body.financial-report-print-active .report-table td {
    border-color: #333 !important;
  }
}
`
    document.head.appendChild(el)
    return () => {
      document.body.classList.remove('financial-report-print-active')
      document.getElementById('financial-report-print-styles')?.remove()
    }
  }, [])

  const totals = useMemo(() => {
    let income = 0
    let expense = 0
    for (const r of rows) {
      const a = Number(r.amount)
      if (!Number.isFinite(a)) continue
      if (r.type === 'income') income += a
      else expense += a
    }
    income = Math.round(income * 100) / 100
    expense = Math.round(expense * 100) / 100
    return {
      income,
      expense,
      net: Math.round((income - expense) * 100) / 100,
    }
  }, [rows])

  const categoryData = useMemo(() => aggregateByCategory(rows), [rows])
  const chartData = useMemo(
    () =>
      categoryData.map((c) => ({
        name: cashFlowCategoryLabelDE(c.category),
        Einnahmen: c.income,
        Ausgaben: c.expense,
      })),
    [categoryData]
  )

  const monthlyData = useMemo(() => aggregateByMonth(rows), [rows])

  const dayGroups = useMemo(() => groupRowsByDaySorted(rows), [rows])

  const handleLogo = (file: File | null) => {
    if (!file) {
      setLogoDataUrl(null)
      return
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Bitte eine Bilddatei wählen.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setLogoDataUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handlePrint = () => {
    window.print()
  }

  const handlePdf = async () => {
    if (!reportRef.current) return
    setExporting(true)
    try {
      reportRef.current.scrollIntoView({ block: 'start', behavior: 'auto' })
      const stamp = format(new Date(), 'yyyy-MM-dd')
      await exportReportToPdf(reportRef.current, stamp)
      toast.success('PDF exportiert.')
    } catch (e) {
      toast.error(formatSupabaseError(e))
    } finally {
      setExporting(false)
    }
  }

  if (!sessionReady && loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-neutral-600">
        Wird geladen…
      </div>
    )
  }

  return (
    <>
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
            Berichte
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            <Link
              href="/admin/financas"
              className="underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-600"
            >
              Zurück zu Finanzen
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="rounded border border-neutral-400 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
          >
            Drucken
          </button>
          <button
            type="button"
            disabled={exporting || loading}
            onClick={handlePdf}
            className="rounded border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {exporting ? 'PDF…' : 'PDF exportieren'}
          </button>
        </div>
      </div>

      <div
        ref={reportRef}
        className="financial-report-print-root mx-auto max-w-4xl border border-neutral-300 bg-white p-6 shadow-sm md:p-10 print:shadow-none print:border-0"
      >
        <header className="no-print mb-8 border-b border-neutral-300 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-wrap items-start gap-4">
              {logoDataUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoDataUrl}
                  alt="Logo"
                  className="max-h-[60px] w-auto object-contain"
                />
              )}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-neutral-600">
                  Firmenname
                </label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-1 w-full min-w-[12rem] border-b border-neutral-400 bg-transparent text-lg font-semibold text-neutral-900 outline-none focus:border-neutral-900"
                />
              </div>
            </div>
            <div className="text-sm text-neutral-600">
              <p className="font-medium text-neutral-900">Logo (optional)</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleLogo(e.target.files?.[0] ?? null)}
                className="mt-2 max-w-full text-xs"
              />
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 md:text-2xl">
              Financial Statement
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Financial Report – Germany (Finanzamt Cuxhaven)
            </p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-neutral-600">
                Von (Datum)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-600">
                Bis (Datum)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => void fetchRows()}
            disabled={loading}
            className="mt-4 rounded border border-neutral-400 bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 disabled:opacity-50"
          >
            {loading ? 'Aktualisiere…' : 'Daten laden'}
          </button>
        </header>

        <div
          id="financial-report-pdf-header"
          className="print-header mb-6 hidden border-b border-neutral-900 pb-4 print:!block"
        >
          <div className="flex items-start gap-4">
            {logoDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoDataUrl}
                alt=""
                className="max-h-[60px] w-auto object-contain"
              />
            )}
            <div>
              <p className="text-lg font-bold text-neutral-900">{companyName}</p>
              <p className="text-sm font-semibold text-neutral-900">
                Financial Statement
              </p>
              <p className="text-xs text-neutral-600">
                Financial Report – Germany (Finanzamt Cuxhaven)
              </p>
              <p className="mt-2 text-xs text-neutral-600">
                Zeitraum: {formatDateDE(startDate)} – {formatDateDE(endDate)}
              </p>
            </div>
          </div>
        </div>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="border border-neutral-300 p-4">
            <p className="text-xs font-medium uppercase text-neutral-600">
              Gesamteinnahmen
            </p>
            <p className="mt-2 text-xl font-semibold tabular-nums text-neutral-900">
              {EUR_DE(totals.income)}
            </p>
          </div>
          <div className="border border-neutral-300 p-4">
            <p className="text-xs font-medium uppercase text-neutral-600">
              Gesamtausgaben
            </p>
            <p className="mt-2 text-xl font-semibold tabular-nums text-neutral-900">
              {EUR_DE(totals.expense)}
            </p>
          </div>
          <div className="border border-neutral-300 p-4">
            <p className="text-xs font-medium uppercase text-neutral-600">
              Saldo (netto)
            </p>
            <p className="mt-2 text-xl font-semibold tabular-nums text-neutral-900">
              {EUR_DE(totals.net)}
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-900">
            Kategorieübersicht
          </h3>
          <div className="overflow-x-auto border border-neutral-300">
            <table className="report-table w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-400 bg-neutral-100">
                  <th className="px-3 py-2 font-semibold text-neutral-900">
                    Kategorie
                  </th>
                  <th className="px-3 py-2 font-semibold text-neutral-900">
                    Einnahmen
                  </th>
                  <th className="px-3 py-2 font-semibold text-neutral-900">
                    Ausgaben
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-3 py-4 text-neutral-600"
                    >
                      Keine Buchungen im Zeitraum.
                    </td>
                  </tr>
                ) : (
                  categoryData.map((c) => (
                    <tr key={c.category} className="border-b border-neutral-200">
                      <td className="px-3 py-2 text-neutral-900">
                        {cashFlowCategoryLabelDE(c.category)}
                      </td>
                      <td className="px-3 py-2 tabular-nums text-neutral-900">
                        {EUR_DE(c.income)}
                      </td>
                      <td className="px-3 py-2 tabular-nums text-neutral-900">
                        {EUR_DE(c.expense)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8 w-full border border-neutral-300 p-4">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-neutral-900">
            Einnahmen / Ausgaben nach Kategorie
          </h3>
          <div className="report-chart-host h-[280px] w-full min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 12, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="name" tick={{ fill: '#111', fontSize: 10 }} />
                <YAxis tick={{ fill: '#111', fontSize: 10 }} width={44} />
                <Tooltip
                  formatter={(v: number) => EUR_DE(v)}
                  contentStyle={{
                    border: '1px solid #333',
                    borderRadius: 0,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: '#111' }} />
                <Bar
                  dataKey="Einnahmen"
                  fill="#222222"
                  radius={[0, 0, 0, 0]}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="Ausgaben"
                  fill="#888888"
                  radius={[0, 0, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-900">
            Monatsübersicht
          </h3>
          <div className="overflow-x-auto border border-neutral-300">
            <table className="report-table w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-400 bg-neutral-100">
                  <th className="px-3 py-2 font-semibold text-neutral-900">Monat</th>
                  <th className="px-3 py-2 font-semibold text-neutral-900">
                    Einnahmen
                  </th>
                  <th className="px-3 py-2 font-semibold text-neutral-900">
                    Ausgaben
                  </th>
                  <th className="px-3 py-2 font-semibold text-neutral-900">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-neutral-600">
                      Keine Daten.
                    </td>
                  </tr>
                ) : (
                  monthlyData.map((m) => (
                    <tr key={m.key} className="border-b border-neutral-200">
                      <td className="px-3 py-2 text-neutral-900">{m.label}</td>
                      <td className="px-3 py-2 tabular-nums text-neutral-900">
                        {EUR_DE(m.income)}
                      </td>
                      <td className="px-3 py-2 tabular-nums text-neutral-900">
                        {EUR_DE(m.expense)}
                      </td>
                      <td className="px-3 py-2 tabular-nums text-neutral-900">
                        {EUR_DE(m.net)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-900">
            Buchungsjournal (nach Datum gruppiert)
          </h3>
          {dayGroups.length === 0 ? (
            <p className="text-sm text-neutral-600">Keine Buchungen.</p>
          ) : (
            dayGroups.map((g) => (
              <div key={g.dayKey} className="mb-6">
                <p className="mb-2 border-b border-neutral-400 pb-1 text-xs font-bold text-neutral-900">
                  {g.display}
                </p>
                <div className="overflow-x-auto border border-neutral-300">
                  <table className="report-table w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-neutral-400 bg-neutral-50">
                        <th className="px-2 py-2 font-semibold text-neutral-900">
                          Datum
                        </th>
                        <th className="px-2 py-2 font-semibold text-neutral-900">
                          Kunde
                        </th>
                        <th className="px-2 py-2 font-semibold text-neutral-900">
                          Leistung
                        </th>
                        <th className="px-2 py-2 font-semibold text-neutral-900">
                          Zahlungsmethode
                        </th>
                        <th className="px-2 py-2 font-semibold text-neutral-900">
                          Beschreibung
                        </th>
                        <th className="px-2 py-2 font-semibold text-neutral-900">
                          Kategorie
                        </th>
                        <th className="px-2 py-2 font-semibold text-neutral-900">
                          Art
                        </th>
                        <th className="px-2 py-2 text-right font-semibold text-neutral-900">
                          Betrag
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.rows.map((r) => (
                        <tr key={r.id} className="border-b border-neutral-200">
                          <td className="px-2 py-2 tabular-nums text-neutral-800">
                            {formatDateTimeDE(r.created_at)}
                          </td>
                          <td className="max-w-[9rem] px-2 py-2 text-neutral-900">
                            {r.revenueEntry?.client_name?.trim() || '—'}
                          </td>
                          <td className="max-w-[10rem] px-2 py-2 text-neutral-900">
                            <span className="line-clamp-2 block break-words">
                              {r.revenueEntry?.service_name?.trim() || '—'}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-neutral-900">
                            {journalPaymentLabel(r)}
                          </td>
                          <td className="max-w-[14rem] px-2 py-2 text-neutral-900">
                            {r.description}
                          </td>
                          <td className="px-2 py-2 text-neutral-900">
                            {cashFlowCategoryLabelDE(r.category)}
                          </td>
                          <td className="px-2 py-2 text-neutral-900">
                            {r.type === 'income' ? 'Einnahme' : 'Ausgabe'}
                          </td>
                          <td className="px-2 py-2 text-right tabular-nums text-neutral-900">
                            {EUR_DE(Number(r.amount))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </section>

        <footer className="mt-10 border-t border-neutral-300 pt-4 text-center text-xs text-neutral-600">
          Erstellt am {format(new Date(), 'dd.MM.yyyy HH:mm')} · Nur für
          interne Zwecke · Keine Steuerberatung
        </footer>
      </div>
    </>
  )
}
