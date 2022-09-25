import { Camera } from "expo-camera";
import { useRef, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { Box, IconButton } from "@react-native-material/core";
import { TFJSView } from "./TestPick";
import * as ImageManipulator from "expo-image-manipulator";
import { useNetInfo } from "@react-native-community/netinfo";
import * as Network from "expo-network";

export const CameraWrapper = ({ navigation }) => {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);
  const [lastPhotoURI, setLastPhotoURI] = useState(null);
  const [result, setResult] = useState(0);

  if (lastPhotoURI !== null) {
    return (
      <>
        <Box
          width="100%"
          height="100%"
          display="flex"
          flexDirection="column"
          style={{ backgroundColor: "#2EAF7D" }}
          pt={60}
          pl={20}
        >
          <Box display="flex" flexDirection="row"> 
            <IconButton
              onPress={() => {
                setLastPhotoURI(null);
              }}
              icon={() => <Icon size="36" color={"white"} name="close"></Icon>}
            ></IconButton>
            <Text
              style={{
                color: "white",
                fontSize: 24,
                marginTop: 10,
                marginLeft: 10,
              }}
            >
              Weather Report
            </Text>
          </Box>
          <TFJSView result={lastPhotoURI} setResult={setResult} />
        </Box>
      </>
    );
  }

  return (
    <Camera
      style={{ position: "fixed", height: "100%", width: "100%" }}
      type={type}
      ref={cameraRef}
    >
      <Box
        style={{
          width: "100%",
          height: "100%",
          paddingTop: 40,
          alignItems: "center",
        }}
      >
        <Box
          style={{
            width: "100%",
            height: "20%",
            padding: 30,
            alignItems: "left",
            justifyContent: "top",
          }}
        >
          <IconButton
            icon={(props) => (
              <Icon size={48} name="arrow-back" color={"white"}></Icon>
            )}
            onPress={() => {
              navigation.navigate("Home");
            }}
            title="back"
          ></IconButton>
        </Box>

        <TouchableOpacity
          style={{
            width: 70,
            height: 70,
            justifyContent: "left",
            alignItems: "left",
            padding: 10,
            borderRadius: 100,
            backgroundColor: "#2EAF7D",
            position: "absolute",
            bottom: "10%",
            left: "46%",
          }}
          color="white"
          onPress={() => {
            Detect({ ref: cameraRef, setLastPhotoURI: setLastPhotoURI });
          }}
        >
          <Icon size="50" name="camera" type="ionicon" color="white" />
        </TouchableOpacity>
      </Box>
    </Camera>
  );
};

const Detect = async ({ ref, setLastPhotoURI }) => {
  if (ref.current) {
    let photo = await ref.current.takePictureAsync({ skipProcessing: true });
    if ((await Network.getNetworkStateAsync()).isConnected) {
      //waiting for you
      const resizedPhoto = await ImageManipulator.manipulateAsync(photo.uri, [
        { resize: { width: 128, height: 128 } },
      ]);
      setLastPhotoURI(photo.uri);
      const imgB64 = await FileSystem.readAsStringAsync(resizedPhoto.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const imgBuffer = utf8.encode(imgB64);

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo: imgBuffer, x: 0, y: 0 }),
      };

      try {
        let resp = await fetch(
          "http://10.20.9.94:5000/prediction",
          requestOptions
        );
        let resp2 = await resp.json();
        console.log(resp2);

        setResult(resp2[0]);
      } catch (err) {
        console.log(err);
      }
    }
    setLastPhotoURI(photo.uri);
  }
};
