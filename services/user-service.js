import { getToken, storeToken } from "../store/tokenStore";
import $api from "../config";

export async function login(email, password) {
  const user = await $api.post('/user/login', { ...email, ...password })
  await storeToken(user.data)
  return user.data
}

export async function register(fullname, email, password, avatar = '') {
  const user = await $api.post('/user/register', { fullname, email, password, avatar })
  await storeToken(user.data)
  return user.data
}

export async function logout() {
  const user = await getToken()
  const refreshToken = user.refreshToken
  await storeToken(null)
  if (!user) return null
  return await $api.post('/user/logout', { refreshToken })
}

export async function refresh() {
  const user = await getToken()
  if (!user) return null
  const response = await $api.post('/user/refresh', { refreshToken: user.refreshToken })
  await storeToken(response.data)
  return response.data
}
