import { notFound } from 'next/navigation'
import Image from 'next/image'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import RichText from '@/components/RichText'
import { ExpandableDescription } from '@/components/expandable-description'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import ReadButton from '@/components/read-button'
import { queryBookBySlug } from '@/queries'
import Chapters from '@/components/chapters'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

const NovelPage: React.FC<Args> = async ({ params }) => {
  const { slug = '' } = await params
  const book = await queryBookBySlug({ slug })
  if (!book) return notFound()

  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 py-4 md:py-8">
      <div className="flex flex-col gap-2 relative">
        {typeof book.coverImage === 'object' && (
          <Image
            src={book.coverImage?.url || ''}
            alt={book.coverImage?.alt || ''}
            width={book.coverImage?.width || 300}
            height={book.coverImage?.height || 300}
            className="rounded-lg aspect-[1/1.5] object-cover w-full max-w-[350px] mx-auto"
          />
        )}
        <div>
          Автор:{' '}
          <Link href="/author/test" className="text-blue-500 hover:underline">
            {typeof book.author !== 'string' ? book.author.name : book.author}
          </Link>
        </div>
        <div className="flex gap-2 flex-wrap">
          {book.genres?.map((genre) => {
            if (typeof genre === 'string') return null
            return (
              <Badge key={genre.id} className="text-sm" variant="outline">
                {genre.title}
              </Badge>
            )
          })}
        </div>
        <ReadButton className="w-full" bookSlug={book.slug || slug} />
      </div>
      <div className="flex flex-col gap-2 relative col-span-1 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl">{book.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpandableDescription>
              <RichText data={book.description} />
            </ExpandableDescription>
          </CardContent>
        </Card>
        <Chapters book={book} />
      </div>
    </div>
  )
}

export default NovelPage
