import { PlanoPageContent } from './PlanoPageContent'

export default function PlanoPage({
  params,
}: {
  params: { id: string }
}) {
  return <PlanoPageContent id={params.id} />
} 