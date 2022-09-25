import { Camera } from "expo-camera";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useRef, useState } from "react";
import {
  Button,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from 'react-native-elements'
import { Box, Divider, IconButton } from "@react-native-material/core";
import { FAB } from 'react-native-paper';
import { FloatingAction } from "react-native-floating-action";

const Statistics = () => {
  return (
    <>
    </>
  )
}

const camButton = [
{
  text: "CamIcon",
  icon: <Icon size="36" name="camera=alt" color = "white"></Icon>,
  name: "camicon",
  position: 1,
  color: "#2EAF7D",
  size: 'medium'

}


]

const actions = [
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

const Home = ({ navigation }) => {
  return (
    <Box width="100%" height="100%">
      <FloatingAction
        color = "#2EAF7D"
        actions={actions}
        onPressItem={(name) => {
          navigation.navigate(name)
        }}
      />
    </Box>
  )
}

const CameraWrapper = ({ navigation }) => {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);
  const [lastPhotoURI, setLastPhotoURI] = useState(null);

  if (lastPhotoURI !== null) {
    return (
      <Box width="100%" height="100%" display="flex" flexDirection="row" pt={60} pl={20}>
        <IconButton onPress={() => {
          setLastPhotoURI(null)
        }} icon={() => (<Icon size="36" name="close"></Icon>)}></IconButton>
        <Text style={{ fontSize: 24, marginTop: 10, marginLeft: 10 }} >Weather Report</Text>
        <Statistics />
      </Box>
    );
  }

  return (
    <Camera style={{ position: "fixed", height: "100%", width: "100%" }} type={type} ref={cameraRef}>
      <Box style={{ width: "100%", height: "100%", paddingTop: 40, alignItems: "center" }}>
        <Box style={{ width: "100%", height: "20%", padding: 30, alignItems: "left", justifyContent: "top" }}>
          <IconButton icon={(props) => (<Icon size={48} name="arrow-back" color={"white"}></Icon>)} onPress={() => {
            navigation.navigate("Home")
          }} title="back"></IconButton>
        </Box>
        
        <Button
          icon={(props) => (<Icon width={50} height={50} size={50} name="camera-alt" color={"white"}></Icon>)}
          style={{ position: "absolute", bottom: 100, width: 80, height: 80 }}
          onPress={async () => {
            if (cameraRef.current) {
              let photo = await cameraRef.current.takePictureAsync();
              setLastPhotoURI(photo.uri);
              const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: {data: 2, id: 2},
              };

              try {
                let resp = await fetch('http://54.161.43.254/publish', requestOptions)
                let resp2 = await resp.json()
                console.log(resp2)
              } catch (err) {
                console.log(err)
              }
            }
          }}>
          </Button>
      </Box>
    </Camera>
  )
}

const Drive = () => {
  return (
    <Box width="100%" height="100%" style={{ display: "flex", flexDirection: "column", alignItems: "left" }}>
      <Box style={{ width: "100%", height: "40%", backgroundColor: "#135ECB" }}></Box>
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
        title: 'WeatherPro',
        headerStyle: {
          height: 120,
          opacity: 1,
          backgroundColor: '#135ECB',
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
          backgroundColor: '#135ECB',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />
      <Stack.Screen name="drive" component={Drive} options={{
        title: 'Drive',
        headerStyle: {
          backgroundColor: '#135ECB',
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


