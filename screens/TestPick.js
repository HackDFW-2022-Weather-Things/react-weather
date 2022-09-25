import { StyleSheet, Text, View, Button, Image } from 'react-native';
import * as tf from '@tensorflow/tfjs'
import { useEffect, useState, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator'

export function tfjsML() {
  const [state, setState] = useState(false)
  const [modelState, setModelState] = useState(false)
  const [image, setImage] = useState(null);
  const [model, setModel] = useState();
  const [resourceIO, setResourceIO] = useState();
  const [imageData, setImageData] = useState();

  useEffect(() => {
    async function prepare() {
      await tf.ready()
      setState(true)

      const modelJSON = require('../assets/model/lite.json')
      const weights = require('../assets/model/lite.bin')

      const resourceIO = require('@tensorflow/tfjs-react-native')
      const model = await tf.loadLayersModel(resourceIO.bundleResourceIO(modelJSON, weights));

      // model.summary();
      setModelState(true);
      setModel(model);
      setResourceIO(resourceIO);
    }
    prepare();
  }, [])

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    const resizedPhoto = await ImageManipulator.manipulateAsync(
      result.uri,
      [{ resize: { width: 32, height: 32 } }], 
      { format: 'jpeg' },
    );

    if (!result.cancelled) {
      setImage(result.uri);

      const data = await getImageData(resizedPhoto.uri);
      setImageData(data);
    }
  };

  const getImageData = async(uri) => {
    console.log("Pre-processing")
    const imgB64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    let imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
    let raw = new Uint8Array(imgBuffer);
    let decodeImage = resourceIO.decodeJpeg(raw);
    //let input = tf.cast(decodeImage, 'float16');
    let input = decodeImage
    input = tf.div(input, 255);
    input = tf.reshape(input, [1, 32, 32, 3]);
    console.log("Pre-processed")
    return input;
  }

  const predict = async () => {
    try {
      const input = imageData;
      console.log(input.shape);
      let initialTime = Date.now();
      const output = model.predict(input).print();
      // let predictions = Array.from(output.dataSync()); 
      let finalTime = Date.now();
      let timeTaken = finalTime - initialTime;
      console.log("TAKEN: " + timeTaken);
  }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
        }}>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Text>
        TFJS: {state ? "Ready" : "Waiting"} - Model: {modelState ? "Ready" : "Waiting"}
      </Text>
      <Button title='Pick Image' onPress={pickImage} />
      <Button title='Predict' onPress={predict} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
