import { Camera } from "expo-camera";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useRef, useState } from "react";
import { Button, ImageBackground, Text, TouchableOpacity, View, StyleSheet} from "react-native";
import { Icon } from 'react-native-elements'
import { Box, Divider, IconButton } from "@react-native-material/core";
import { FAB } from 'react-native-paper';
import { FloatingAction } from "react-native-floating-action";
import { CameraWrapper } from "./screens/Camera";
import { Home } from "./screens/Home";


const Statistics = () => {
  return (
    <>
    </>
  )
}

const Drive = () => {
  return (
    <Box width="100%" height="100%" style={{ display: "flex", flexDirection: "column", alignItems: "left" }}>
      <Box style={{ width: "100%", height: "40%", backgroundColor: "#2EAF7D" }}></Box>
      <Box p={40} width="100%">
        <Text style={{ fontSize: 36, fontWeight: "heavier" }}>Statistics</Text>
        <Divider style={{ marginTop: 20 }} width="100%"></Divider>
      </Box>
    </Box>
  )
}

const Settings = () => {
  return (
    <></>
  )
}

const Stack = createStackNavigator()

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{
        title: 'Weathered Cloud',
        headerStyle: {
          height: 100,
          opacity: 1,
          backgroundColor: '#2EAF7D',
          
          
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'medium',
          fontSize: 24
        },
      }} />
      <Stack.Screen name="camera" component={CameraWrapper} options={{
        title: '',
        headerStyle: {
          height: 0,
          opacity: 0,
          backgroundColor: '#2EAF7D',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />
      <Stack.Screen name="drive" component={Drive} options={{
        title: 'Drive',
        headerStyle: {
          backgroundColor: '#2EAF7D',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [status, requestPermission] = Camera.useCameraPermissions();
  if (!status?.granted) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
      >
        <Text style={{ textAlign: "center" }}>
          We need access to your camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}


export const actions = [
  {
      text: "Drive",
      icon: <Icon size="30" name="directions-car" color = "white"></Icon>,
      name: "drive",
      position: 2,
      color: "#2EAF7D",
  },
  {
      text: "Camera",
      icon: <Icon size="30" name="camera-alt" color = "white"></Icon>,
      name: "camera",
      position: 1,
      color: "#2EAF7D"
  },
  {
      text: "Reports",
      icon: <Icon size="30" name="cloud" color = "white"></Icon>,
      name: "bt_room",
      position: 3,
      color: "#2EAF7D"
  },
  {
      text: "Settings",
      icon: <Icon size="30" name="settings" color = "white"></Icon>,
      name: "bt_videocam",
      position: 4,
      color: "#2EAF7D"
  }
];