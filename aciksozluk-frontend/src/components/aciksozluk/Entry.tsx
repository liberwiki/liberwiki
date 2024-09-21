'use client'

import { useState } from 'react'

import { Button } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { Sheet, SheetContent, SheetTrigger } from '@/components/shadcn/sheet'
import Editor from '@/components/tiptap/Editor'
import { useTailwindConfig } from '@/lib/utils'

import _ from 'lodash'
import { ArrowDown, ArrowUp, Heart, MoreHorizontal, Share2 } from 'lucide-react'
import Link from 'next/link'

const contents = [
  {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        attrs: {
          textAlign: 'left',
        },
        content: [
          {
            type: 'text',
            text: 'An awesome language with english looking syntax. ',
          },
        ],
      },
      {
        type: 'paragraph',
        attrs: {
          textAlign: 'left',
        },
        content: [
          {
            type: 'hardBreak',
          },
          {
            type: 'text',
            text: 'To print something to stdout you just write ',
          },
        ],
      },
      {
        type: 'codeBlock',
        attrs: {
          language: 'js',
        },
        content: [
          {
            type: 'text',
            text: 'print("Hello world") ',
          },
        ],
      },
      {
        type: 'paragraph',
        attrs: {
          textAlign: 'left',
        },
        content: [
          {
            type: 'text',
            text: 'unlike java where you have to write some abomination like',
          },
        ],
      },
      {
        type: 'codeBlock',
        attrs: {
          language: 'js',
        },
        content: [
          {
            type: 'text',
            text: 'class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!"); \n  }\n}',
          },
        ],
      },
      {
        type: 'paragraph',
        attrs: {
          textAlign: 'left',
        },
        content: [
          {
            type: 'hardBreak',
          },
          {
            type: 'text',
            text: 'Is also of the major languages used in web development, data science and AI. ',
          },
        ],
      },
    ],
  },
  {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        attrs: {
          textAlign: 'left',
        },
        content: [
          {
            type: 'text',
            text: 'The language ',
          },
          {
            type: 'text',
            marks: [
              {
                type: 'link',
                attrs: {
                  href: 'https://www.djangoproject.com/',
                  target: '_blank',
                  rel: 'noopener noreferrer nofollow',
                  class: null,
                },
              },
            ],
            text: 'django',
          },
          {
            type: 'text',
            text: ' web framework is written in. ',
          },
        ],
      },
    ],
  },
  {
    type: 'doc',
    content: [
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: 'left',
                },
                content: [
                  {
                    type: 'text',
                    marks: [
                      {
                        type: 'bold',
                      },
                    ],
                    text: 'Requests',
                  },
                  {
                    type: 'text',
                    text: ' - Simple HTTP library for Python.',
                  },
                ],
              },
              {
                type: 'bulletList',
                content: [
                  {
                    type: 'listItem',
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'link',
                                attrs: {
                                  href: 'https://docs.python-requests.org/en/latest/',
                                  target: '_blank',
                                  rel: 'noopener noreferrer nofollow',
                                  class: null,
                                },
                              },
                            ],
                            text: 'https://docs.python-requests.org/en/latest/',
                          },
                          {
                            type: 'hardBreak',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: 'left',
                },
                content: [
                  {
                    type: 'text',
                    marks: [
                      {
                        type: 'bold',
                      },
                    ],
                    text: 'NumPy',
                  },
                  {
                    type: 'text',
                    text: ' - Library for numerical computing with powerful N-dimensional array objects.',
                  },
                ],
              },
              {
                type: 'bulletList',
                content: [
                  {
                    type: 'listItem',
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'link',
                                attrs: {
                                  href: 'https://numpy.org/doc/stable/',
                                  target: '_blank',
                                  rel: 'noopener noreferrer nofollow',
                                  class: null,
                                },
                              },
                            ],
                            text: 'https://numpy.org/doc/stable/',
                          },
                          {
                            type: 'hardBreak',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: 'left',
                },
                content: [
                  {
                    type: 'text',
                    marks: [
                      {
                        type: 'bold',
                      },
                    ],
                    text: 'Pandas',
                  },
                  {
                    type: 'text',
                    text: ' - Data manipulation and analysis library.',
                  },
                ],
              },
              {
                type: 'bulletList',
                content: [
                  {
                    type: 'listItem',
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'link',
                                attrs: {
                                  href: 'https://pandas.pydata.org/docs/',
                                  target: '_blank',
                                  rel: 'noopener noreferrer nofollow',
                                  class: null,
                                },
                              },
                            ],
                            text: 'https://pandas.pydata.org/docs/',
                          },
                          {
                            type: 'hardBreak',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: 'left',
                },
                content: [
                  {
                    type: 'text',
                    marks: [
                      {
                        type: 'bold',
                      },
                    ],
                    text: 'Flask',
                  },
                  {
                    type: 'text',
                    text: ' - Lightweight web framework.',
                  },
                ],
              },
              {
                type: 'bulletList',
                content: [
                  {
                    type: 'listItem',
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'link',
                                attrs: {
                                  href: 'https://flask.palletsprojects.com/en/latest/',
                                  target: '_blank',
                                  rel: 'noopener noreferrer nofollow',
                                  class: null,
                                },
                              },
                            ],
                            text: 'https://flask.palletsprojects.com/en/latest/',
                          },
                          {
                            type: 'hardBreak',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: 'left',
                },
                content: [
                  {
                    type: 'text',
                    marks: [
                      {
                        type: 'bold',
                      },
                    ],
                    text: 'Django',
                  },
                  {
                    type: 'text',
                    text: ' - High-level web framework for building secure and scalable web applications.',
                  },
                ],
              },
              {
                type: 'bulletList',
                content: [
                  {
                    type: 'listItem',
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'link',
                                attrs: {
                                  href: 'https://docs.djangoproject.com/en/stable/',
                                  target: '_blank',
                                  rel: 'noopener noreferrer nofollow',
                                  class: null,
                                },
                              },
                            ],
                            text: 'https://docs.djangoproject.com/en/stable/',
                          },
                          {
                            type: 'hardBreak',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: 'left',
                },
                content: [
                  {
                    type: 'text',
                    marks: [
                      {
                        type: 'bold',
                      },
                    ],
                    text: 'FastAPI',
                  },
                  {
                    type: 'text',
                    text: ' - High-performance web framework for building APIs with Python 3.7+.',
                  },
                ],
              },
              {
                type: 'bulletList',
                content: [
                  {
                    type: 'listItem',
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'link',
                                attrs: {
                                  href: 'https://fastapi.tiangolo.com/',
                                  target: '_blank',
                                  rel: 'noopener noreferrer nofollow',
                                  class: null,
                                },
                              },
                            ],
                            text: 'https://fastapi.tiangolo.com/',
                          },
                          {
                            type: 'hardBreak',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: 'left',
                },
                content: [
                  {
                    type: 'text',
                    marks: [
                      {
                        type: 'bold',
                      },
                    ],
                    text: 'SQLAlchemy',
                  },
                  {
                    type: 'text',
                    text: ' - SQL toolkit and Object-Relational Mapping (ORM) library.',
                  },
                ],
              },
              {
                type: 'bulletList',
                content: [
                  {
                    type: 'listItem',
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'link',
                                attrs: {
                                  href: 'https://docs.sqlalchemy.org/en/latest/',
                                  target: '_blank',
                                  rel: 'noopener noreferrer nofollow',
                                  class: null,
                                },
                              },
                            ],
                            text: 'https://docs.sqlalchemy.org/en/latest/',
                          },
                          {
                            type: 'hardBreak',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: 'left',
                },
                content: [
                  {
                    type: 'text',
                    marks: [
                      {
                        type: 'bold',
                      },
                    ],
                    text: 'Pydantic',
                  },
                  {
                    type: 'text',
                    text: ' - Data validation and settings management using Python type hints.',
                  },
                ],
              },
              {
                type: 'bulletList',
                content: [
                  {
                    type: 'listItem',
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'link',
                                attrs: {
                                  href: 'https://docs.pydantic.dev/',
                                  target: '_blank',
                                  rel: 'noopener noreferrer nofollow',
                                  class: null,
                                },
                              },
                            ],
                            text: 'https://docs.pydantic.dev/',
                          },
                          {
                            type: 'hardBreak',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: 'left',
                },
                content: [
                  {
                    type: 'text',
                    marks: [
                      {
                        type: 'bold',
                      },
                    ],
                    text: 'Celery',
                  },
                  {
                    type: 'text',
                    text: ' - Distributed task queue for background processing.',
                  },
                ],
              },
              {
                type: 'bulletList',
                content: [
                  {
                    type: 'listItem',
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'link',
                                attrs: {
                                  href: 'https://docs.celeryproject.org/en/stable/',
                                  target: '_blank',
                                  rel: 'noopener noreferrer nofollow',
                                  class: null,
                                },
                              },
                            ],
                            text: 'https://docs.celeryproject.org/en/stable/',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: 'left',
                },
              },
            ],
          },
        ],
      },
    ],
  },
]

export function Entry() {
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [isDownvoted, setIsDownvoted] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const tailwindConfig = useTailwindConfig()

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

  const OptionsMenu = () => (
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
  )

  return (
    <Card className="w-full mx-auto border-0 my-2">
      <CardContent className="pt-6">
        <p className="text-lg mb-4">
          <Editor readonly={true} content={_.sample(contents) as object} />
        </p>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={handleUpvote} className={isUpvoted ? 'text-green-500' : ''}>
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDownvote} className={isDownvoted ? 'text-red-500' : ''}>
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleBookmark}>
              <Heart fill={isBookmarked ? tailwindConfig.theme.colors.white : ''} className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
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
            <div className="hidden md:block">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40">
                  <OptionsMenu />
                </PopoverContent>
              </Popover>
            </div>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom">
                  <OptionsMenu />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
