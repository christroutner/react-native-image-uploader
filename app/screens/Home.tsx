import { View, Text } from 'react-native'
import React, {useState, useEffect} from 'react'
import axios from 'axios'
// import { useAuth } from '../context/AuthContext'

export const API_URL = 'http://192.168.1.102:3000'

const Home = () => {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Make call to protected endpoint
        const result = await axios.get(`${API_URL}/api/v1/users`)
        console.log('result.data: ', result.data)
      } catch(e: any) {
        console.error('Error in getting user data: ', e)
        alert(e.message)
      }
    }
    loadUser()
  }, [])

  return (
    <View>
      <Text>Home</Text>
    </View>
  )
}

export default Home
