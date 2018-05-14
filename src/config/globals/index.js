import ROUTES from './../routes/'

let API_DOMAIN = 'https://api-test.uptoo.fr'

if (process.env.NODE_ENV === 'production') {
    API_DOMAIN = 'https://api.uptoo.fr'
}

const JWT_TOKEN = 'devToken'
const AUTHORIZED_USERS = ['developer']

export {
    ROUTES,
    API_DOMAIN,
    JWT_TOKEN,
    AUTHORIZED_USERS
}