const { v4: uuidv4 } = require('uuid')

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const { pathname } = new URL(request.url)
  let headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-type': 'application/json',
  }
  if (pathname === '/posts') {
    if (request.method === 'GET') {
      const posts = await POSTS.list()
      const result = await Promise.all(
        posts.keys.map(({ name }) => POSTS.get(name, { type: 'json' })),
      )
      return new Response(JSON.stringify(result), { headers })
    } else if (request.method === 'POST') {
      headers['Content-Type'] = 'text/plain'
      const newId = uuidv4()
      const body = await request.json()
      if (
        !(
          body.username &&
          body.username.length > 0 &&
          body.title &&
          body.title.length > 0 &&
          body.content &&
          body.content.length > 0
        )
      ) {
        return new Response(
          'Post must have username, title, and content values.',
          {
            status: 400,
            headers: {
              'content-type': 'text/plain',
              'Access-Control-Allow-Origin': '*',
            },
          },
        )
      }
      await POSTS.put(
        newId,
        JSON.stringify({
          username: body.username,
          title: body.title,
          type: body.type,
          content: body.content,
          postedAt: new Date(),
        }),
      )
      return new Response('success', { headers })
    }
  }
}
