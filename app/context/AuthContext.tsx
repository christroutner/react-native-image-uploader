import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

interface AuthProps {
  authState?: { token: string | null, authenticated: boolean | null }
  onRegister?: ( email: string, password: string) => Promise<any>
  onLogin?: (email: string, password: string) => Promise<any>
  onLogout?: () => Promise<any>
}

const TOKEN_KEY='my-jwt'
// export const API_URL = 'https://api.developbetterapps.com'
export const API_URL = 'http://192.168.1.102:3000'
const AuthContext = createContext<AuthProps>({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({children}: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null
    authenticated: boolean | null
  }>({
    token: null,
    authenticated: null
  })

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY)
      console.log('stored: ', token)

      if(token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        setAuthState({
          token,
          authenticated: true
        })
      }
    }
    loadToken()
  }, [])

  // Service (API call): register new user
  const register = async (email: string, password: string) => {
    try {
      return await axios.post(`${API_URL}/users`, { email, password })
    } catch(e) {
      console.log('e: ', e)
      return {error: true, msg: (e as any).response.data.msg}
    }
  }

  // Service (API call): login user
  const login = async (email: string, password: string) => {
    try {
      // const result = await axios.post(`${API_URL}/login`, { email, password })
      const result = await axios.post(`${API_URL}/api/v1/auth/email/login`, { email, password })
      console.log(`Login result: `, result)

      setAuthState({
        token: result.data.token,
        authenticated: true
      })

      // Add the JWT to the header of all future requests.
      axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`

      // Use the Expo SecureStore to store the JWT token.
      await SecureStore.setItemAsync(TOKEN_KEY, result.data.token)

      return result
    } catch(e) {
      console.log('e: ', e)
      return {error: true, msg: (e as any).response.data.msg}
    }
  }

  const logout = async () => {
    // Delete token from storage
    await SecureStore.deleteItemAsync(TOKEN_KEY)

    // Update HTTP header
    axios.defaults.headers.common['Authorization'] = ''

    // Reset auth state
    setAuthState({
      token: null,
      authenticated: false
    })
  }

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
