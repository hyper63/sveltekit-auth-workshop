import fetch from 'node-fetch'
const tokenURL = 'https://github.com/login/oauth/access_token'
const userURL = 'https://api.github.com/user'

const clientId = import.meta.env.VITE_CLIENT_ID
const secret = import.meta.env.VITE_CLIENT_SECRET

export async function get(request) {
  const code = request.query.get('code')

  // get accessToken
  const token = await getToken(code)
  // get user
  const user = await getUser(token)

  request.locals.user = user.login

  return {
    status: 302,
    headers: {
      location: '/'
    }
  }
}

function getUser(token) {
  return fetch(userURL, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
    .then(r => r.json())
}

function getToken(code) {
  return fetch(tokenURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: secret,
      code
    })
  }).then(r => r.json())
    .then(r => r.access_token)
}