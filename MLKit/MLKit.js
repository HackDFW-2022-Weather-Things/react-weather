import { StyleSheet, Text, View, Button, Image } from 'react-native';
import * as tf from '@tensorflow/tfjs'
import { useEffect, useState, useRef, Component } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator'

export const MLModel = ({ imgUri }) => {
  const [state, setState] = useState(false)
  const [modelState, setModelState] = useState(false)
  const [image, setImage] = useState(null);
  const [model, setModel] = useState();
  const [resourceIO, setResourceIO] = useState();
  const [imageData, setImageData] = useState();
  const [result, setResult] = useState();

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
    pickImage();
    predict();
  }, [])

  const pickImage = async () => {
    const resizedPhoto = await ImageManipulator.manipulateAsync(
      imgUri,
      [{ resize: { width: 32, height: 32 } }], 
      { format: 'jpeg' },
    );
    setImage(result.uri);

    const data = await getImageData(resizedPhoto.uri);
    setImageData(data);
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
      let predictions = Array.from(output.dataSync()); 
      let finalTime = Date.now();
      let timeTaken = finalTime - initialTime;
      console.log("TAKEN: " + timeTaken);
      console.log(predictions);
      setResult(predictions)
  }
    catch (err) {
      console.log(err);
    }
  }

  return result;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
