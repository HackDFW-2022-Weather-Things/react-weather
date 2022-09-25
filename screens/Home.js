import { Camera } from "expo-camera";
import { useEffect, useState } from "react";
import { StyleSheet, Dimensions, Button } from "react-native";
import { Icon } from 'react-native-elements'
import { FloatingAction } from "react-native-floating-action";
import MapView, { PROVIDER_GOOGLE, Heatmap, Circle } from 'react-native-maps';
import Constants from 'expo-constants';
import React from "react";

let heat = [
  { latitude: 32.838272431292694, longitude: -96.77094068629309, weight: 50},
  { latitude: 32.8382725, longitude: -96.770941, weight: 50},
  { latitude: 32.815382443031886, longitude: -96.78812151824181, weight: 50},
  { latitude: 32.81538245, longitude: -96.788121518, weight: 50},
  { latitude: 32.80395685158983, longitude: -96.7830568624278, weight: 50},
  { latitude: 32.8039569, longitude: -96.78305687, weight: 50},
  { latitude: 32.80280757094701, longitude: -96.78174283233699, weight: 50},
  { latitude: 32.8028076, longitude: -96.7817428, weight: 50},
  { latitude: 32.78855847373976, longitude: -96.78917645908992, weight: 50},
  { latitude: 32.7885585, longitude: -96.7891764, weight: 50},
  { latitude: 32.79104408627386, longitude: -96.79236399978161, weight: 50},
  { latitude: 32.79104409, longitude: -96.7923639998, weight: 50},
  { latitude: 32.797111552427815, longitude: -96.79321372307366, weight: 50},
  { latitude: 32.79711155, longitude: -96.79321372, weight: 50},
  { latitude: 32.7929949357948, longitude: -96.79633181403945, weight: 50},
  { latitude: 32.7929950, longitude: -96.7963318, weight: 50},
  { latitude: 32.79449506902755, longitude: -96.79074840504205, weight: 50},
  { latitude: 32.7944951, longitude: -96.7907484, weight: 50},
  { latitude: 32.787765194355416, longitude: -96.79480323889685, weight: 50 },
  { latitude: 32.7877651, longitude: -96.7948032, weight: 50 },
  { latitude: 32.787765194134326, longitude: -96.79480353834685, weight: 50 },
  { latitude: 32.78776731, longitude: -96.794802352, weight: 50 },
];

export const Home = ({ navigation }) => {
  region = null;
    const [mapRegion, setmapRegion] = useState({latitude: 32.80545491167204, longitude: -96.79254451739494, latitudeDelta: 0.01, longitudeDelta: 0.01});
    const mapRef = React.createRef();


  useEffect( () => {
    mapRef.current.animateCamera({center: mapRegion});
  }, [])

  return (
    <>
      <MapView
      ref={mapRef}
        style={{
          zIndex: -1, width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
        provider={PROVIDER_GOOGLE}
        region={mapRegion}
        showsUserLocation={true}>

        <Heatmap 
          points={heat} 
          radius={50}
          gradient={{
            colors: ["black", "purple", "red", "yellow", "white"],
            startPoints: [0.01, 0.04, 0.1, 0.45, 0.5],
            colorMapSize: 2000
          }} 
          opacity={1}
        />

        
      </MapView>
      <FloatingAction
        style={{ zIndex: 5 }}
        color="#2EAF7D"
        actions={actions}
        onPressItem={(name) => {
          navigation.navigate(name)
        }}
      />
    </>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
  },
  anotherLayer: {
    zIndex: 2
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  searchContainer: {
    position: 'absolute',
    width: '90%',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 9,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight,
  },
  input: {
    borderColor: '#888',
    borderWidth: 1,
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: 'left',
    alignItems: 'left',
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 20,
    left: 110,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    left: 5,
    bottom: -5,
  },
});

export const actions = [
  {
    text: "Drive",
    icon: <Icon size="30" name="directions-car" color="white"></Icon>,
    name: "drive",
    position: 2,
    color: "#2EAF7D",
  },
  {
    text: "Camera",
    icon: <Icon size="30" name="camera-alt" color="white"></Icon>,
    name: "camera",
    position: 1,
    color: "#2EAF7D"
  },
  {
    text: "Reports",
    icon: <Icon size="30" name="cloud" color="white"></Icon>,
    name: "bt_room",
    position: 3,
    color: "#2EAF7D"
  },
  {
    text: "Settings",
    icon: <Icon size="30" name="settings" color="white"></Icon>,
    name: "bt_videocam",
    position: 4,
    color: "#2EAF7D"
  }
];