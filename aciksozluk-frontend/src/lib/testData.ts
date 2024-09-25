export const entryContents = [
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
