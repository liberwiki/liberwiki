'use client'

import Link from 'next/link'

import { useState } from 'react'

import * as Icons from 'lucide-react'

import _ from 'lodash'

import { Button } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'
import { Overlay, OverlayContent, OverlayTrigger } from '@/components/shadcn/overlay'
import Editor from '@/components/tiptap/Editor'

import { entryContents as contents } from '@/lib/testData'
import { cn } from '@/lib/utils'

export function Entry({ id }: { id: string }) {
  console.log(id)
  const [isUpvoted, setIsUpvoted] = useState<boolean>(false)
  const [isDownvoted, setIsDownvoted] = useState<boolean>(false)
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false)

  const handleUpvote = () => {
    setIsUpvoted(!isUpvoted)
    if (isDownvoted) setIsDownvoted(false)
  }

  const handleDownvote = () => {
    setIsDownvoted(!isDownvoted)
    if (isUpvoted) setIsUpvoted(false)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  return (
    <Card className="w-full mx-auto border-0 my-2">
      <CardContent className="pt-6">
        <p className="text-lg mb-4">
          <Editor readonly={true} content={_.sample(contents) as object} />
        </p>
        <div className="flex justify-between items-center -mx-4">
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={handleUpvote} className={isUpvoted ? 'text-green-500' : ''}>
              <Icons.ArrowUp className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDownvote} className={isDownvoted ? 'text-red-500' : ''}>
              <Icons.ArrowDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleBookmark}>
              <Icons.Heart className={cn('h-4 w-4', isBookmarked && 'fill-white')} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icons.Share2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2 items-center">
            <div className="text-sm text-gray-500">
              <Link href="/" className="font-medium text-primary hover:underline">
                isik-kaplan
              </Link>
              <span className="mx-1">•</span>
              <span>09.21.2024</span>
            </div>
            <Overlay breakpoint="md">
              <OverlayTrigger>
                <Button variant="ghost" size="icon">
                  <Icons.MoreHorizontal className="h-4 w-4" />
                </Button>
              </OverlayTrigger>
              <OverlayContent side="bottom" align="end">
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    Edit
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Delete
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Report
                  </Button>
                </div>
              </OverlayContent>
            </Overlay>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
