import { View, Text } from 'react-native'
import React, {useState, useEffect} from 'react'

const Home = () => {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Make call to protected endpoint
      } catch(e: any) {
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
