type GetLink<T extends Record<string, string>> = (
  key: keyof T,
  config: {
    withOrigin?: boolean
    queries?: Record<string, string | number>
    hash?: string
    lang?: string
  }
) => string | null

export const routes = <T extends Record<string, string>>({
  origin,
  links,
}: {
  origin: string
  links: T
}): {
  getLink: GetLink<T>
} => {
  const getLink: GetLink<T> = (key, { withOrigin, queries, hash, lang }) => {
    if (!links[key]) {
      return null
    }

    const link = links[key]

    if (queries) {
      for (const [key, value] of Object.entries(queries)) {
        link.replace(`:${key}`, value.toString())
      }
    }

    const queriesFormatted = queries
      ? Object.entries(queries)
          .map(([key, value]) => {
            return `${key}=${value}`
          })
          .join('&')
      : ''

    let url = ''
    if (withOrigin) {
      url += origin
    }
    if (lang) {
      url += `/${lang}`
    }
    url += link
    url += queriesFormatted
    if (hash) {
      url += `#${hash}`
    }
    return url
  }

  return {
    getLink,
  }
}

const { getLink } = routes({
  origin: 'https://www.google.com',
  links: {
    home: '/',
    about: '/about/:foo',
    contact: '/contact',
    test: '/test/:bar',
  },
})

getLink('test', {
  queries: {},
})
