import { View, Text, StyleSheet, StatusBar, Button, SafeAreaView, Image } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Camera } from 'expo-camera'
import { shareAsync } from 'expo-sharing'
import * as MediaLibrary from 'expo-media-library'


export const API_URL = 'http://192.168.1.102:3000'

const Home = () => {
  let cameraRef = useRef()
  const [hasCameraPermission, setHasCameraPermission] = useState()
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState()
  const [photo, setPhoto] = useState()
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        // Make call to protected endpoint
        // const result = await axios.get(`${API_URL}/api/v1/users`)
        // console.log('result.data: ', result.data)

        const cameraPermission = await Camera.requestCameraPermissionsAsync()
        const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync()
        setHasCameraPermission(cameraPermission.status === 'granted')
        setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted')
      } catch(e: any) {
        console.error('Error in getting permissions: ', e)
        alert(e.message)
      }
    }
    loadPermissions()
  }, [])

  // Wait for camera permissions to be granted.
  if(hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>
  } else if (!setHasCameraPermission) {
    return <Text>Permission for camera not granted. Please chagne this in settings.</Text>
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    }

    let newPhoto = await cameraRef.current.takePictureAsync(options)
    setPhoto(newPhoto)
  }

  if(photo) {
    let sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined)
      })
    }

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined)
      })
    }

    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64}} />
        <Button title="Share" onPress={sharePic} />
        { hasMediaLibraryPermission ? <Button title="Save" onPress={savePhoto} /> : undefined }
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    )
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <Text>Home</Text>
        <Button title="Take Pic" onPress={takePic} />
      </View>

      <StatusBar style="auto" />
    </Camera>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    flex: 1,
    justifyContent: 'center'
  },
  buttonContainer: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end'
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1
  }
})

export default Home
