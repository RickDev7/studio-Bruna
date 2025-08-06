'use client'

import { PlanoPageContent } from './PlanoPageContent'

interface Props {
  id: string
}

export function PlanoPageClient({ id }: Props) {
  return <PlanoPageContent id={id} />
}