import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import * as tf from "@tensorflow/tfjs";
import { useEffect, useState, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

export const TFJSView = ({ result, setResult }) => {
  const [state, setState] = useState(false);
  const [modelState, setModelState] = useState(false);
  const [image, setImage] = useState(null);
  const [model, setModel] = useState();
  const [resourceIO, setResourceIO] = useState();
  const [imageData, setImageData] = useState();
  const [prediction, setPrediction] = useState();

  useEffect(() => {
    async function prepare() {
      await tf.ready();
      setState(true);

      const modelJSON = require("../assets/model/lite.json");
      const weights = require("../assets/model/lite.bin");

      const resourceIO = require("@tensorflow/tfjs-react-native");
      const model = await tf.loadLayersModel(
        resourceIO.bundleResourceIO(modelJSON, weights)
      );

      // model.summary();
      setModelState(true);
      setModel(model);
      setResourceIO(resourceIO);
    }
    prepare();
  }, []);

  useEffect(() => {
    if (tf.ready()) {
      predict();
    }
  }, [resourceIO]);

  const getImageData = async (uri) => {
    console.log("Pre-processing");
    const imgB64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    let imgBuffer = tf.util.encodeString(imgB64, "base64").buffer;
    let raw = new Uint8Array(imgBuffer);
    let decodeImage = resourceIO.decodeJpeg(raw);
    //let input = tf.cast(decodeImage, 'float16');
    let input = decodeImage;
    input = tf.div(input, 255);
    input = tf.reshape(input, [1, 32, 32, 3]);
    console.log("Pre-processed");
    return input;
  };

  const predict = async () => {
    try {
      const resizedPhoto = await ImageManipulator.manipulateAsync(
        result,
        [{ resize: { width: 32, height: 32 } }],
        { format: "jpeg" }
      );

      setImage(result);

      const data = await getImageData(resizedPhoto.uri);
      setImageData(data);
      const input = imageData;
      console.log(input.shape);
      let initialTime = Date.now();
      const output = model.predict(input);
      let predictions = Array.from(output.dataSync());
      let finalTime = Date.now();
      let timeTaken = finalTime - initialTime;
      console.log("TAKEN: " + timeTaken);
      console.log(predictions);
      const decision = predictions[0] > predictions[1] ? "Fair" : "Severe";
      setResult(decision);
      setPrediction(decision);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    > {
    }
      <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
        {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        )}
        <View style={{ marginTop: 40 }}>
          <Text style={{color: "white", fontSize: 36}}>
            TFJS: {state ? "Ready" : "Waiting"} - Model:{" "}
            {modelState ? "Ready" : "Waiting"}
          </Text>
          <Text style={{color: "white", fontSize: 36}}>Result: {prediction}</Text>
          <TouchableOpacity style={{
            borderWidth:1,
            borderColor:'black',
            alignItems:'center',
            justifyContent:'center',
            width:100,
            height:150,
            backgroundColor:'#fff',
            borderRadius:50,
          }} onPress={predict}>
            <Text style={{color: "white", fontSize: 36}}>Forecast</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pentagon: {
    backgroundColor: 'transparent'
  },
  pentagonInner: {
    width: 90,
    borderBottomColor: 'red',
    borderBottomWidth: 0,
    borderLeftColor: 'transparent',
    borderLeftWidth: 18,
    borderRightColor: 'transparent',
    borderRightWidth: 18,
    borderTopColor: 'red',
    borderTopWidth: 50
  },
  pentagonBefore: {
    position: 'absolute',
    height: 0,
    width: 0,
    top: -35,
    left: 0,
    borderStyle: 'solid',
    borderBottomColor: 'red',
    borderBottomWidth: 35,
    borderLeftColor: 'transparent',
    borderLeftWidth: 45,
    borderRightColor: 'transparent',
    borderRightWidth: 45,
    borderTopWidth: 0,
    borderTopColor: 'transparent',
  }
});