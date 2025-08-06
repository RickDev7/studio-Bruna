import { PlanoPageClient } from './page.client'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Detalhes do Plano | BS Estética & Unhas',
  description: 'Confira os detalhes do plano selecionado e escolha a melhor opção para você.'
}

export default async function PlanoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams])
  return <PlanoPageClient id={resolvedParams.id} />
} 