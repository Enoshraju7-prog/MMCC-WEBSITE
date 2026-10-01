import NotesApp from '@frontend/components/notes/NotesApp'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ q?: string }>
}

export default async function NotePage({ params, searchParams }: Props) {
  const { id } = await params
  const { q } = await searchParams
  return <NotesApp noteId={id} initialQuery={typeof q === 'string' ? q.slice(0, 200) : ''} />
}
