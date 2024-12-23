import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {
  Tensor,
  TensorflowModel,
  useTensorflowModel,
} from 'react-native-fast-tflite';
import {useResizePlugin} from 'vision-camera-resize-plugin';
// import {useSharedValue} from 'react-native-reanimated';
import {ROUTES} from '../utils/routes';
import {useRunOnJS, useWorklet} from 'react-native-worklets-core';

function tensorToString(tensor) {
  return `\n  - ${tensor.dataType} ${tensor.name}[${tensor.shape}]`;
}
function modelToString(model) {
  return (
    `TFLite Model (${model.delegate}):\n` +
    `- Inputs: ${model.inputs.map(tensorToString).join('')}\n` +
    `- Outputs: ${model.outputs.map(tensorToString).join('')}`
  );
}

function CameraScreen() {
  const navigation = useNavigation();
  const device = useCameraDevice('back');
  const {hasPermission} = useCameraPermission();
  const {container, flashWrapper} = styles;
  const [prediction, setPrediction] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const lastProcessedRef = useRef(Date.now());
  // FRAMEPRESSOR
  const model = useTensorflowModel(
    require('../assets/passport_detection_model.tflite'),
  );
  const actualModel = model.state === 'loaded' ? model.model : undefined;
  const resize = useResizePlugin();
  const classLabels = ['blurry', 'not_passport', 'passport'];
  const savePrediction = useRunOnJS(label => {
    setPrediction(label);
    // console.log("hello from JS!")
  }, []);

  const worklet = useWorklet(
    'default',
    label => {
      'worklet';
      // console.log('hello from worklet!');
      savePrediction(label);
    },
    [savePrediction],
  );
  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      // const now = Date.now();
      // if (now - lastProcessedRef.current >= 3000) { // 3000ms = 3 seconds
      //   // Your frame processing logic here
      //   console.log('Processing frame:', frame);

      //   // Update the last processed timestamp
      //   lastProcessedRef.current = now;
      // }
      const resized = resize.resize(frame, {
        scale: {
          width: 320,
          height: 320,
        },
        pixelFormat: 'rgb',
        dataType: 'uint8',
      });
      // Run inference with the TensorFlow Lite model
      const result = actualModel?.runSync([resized]);
      // Get the index of the class with the highest confidence
      const confidences = result[0];
      // const predictedIndex = confidences.indexOf(Math.max(...confidences));
      // Map the index to the class label
      // const predictedClass = classLabels[predictedIndex];
      // setPrediction(predictedClass);
      // Log inference results
      // const num_detections = result[3]?.[0] ?? 0;
      const indexOfMax = arr => {
        if (arr.length === 0) {
          return -1;
        }

        var max = arr[0];
        var maxIndex = 0;

        for (var i = 1; i < arr.length; i++) {
          if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
          }
        }

        return maxIndex;
      };
      const maxIndex = indexOfMax(Object.values(confidences));
      console.log('abc', maxIndex);
      const label = classLabels[indexOfMax(Object.values(confidences))];
      worklet(label);
      const today = new Date();
      console.log(
        'Result: ',
        label,
        `${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}`,
      );
    },
    [actualModel],
  );
  if (!hasPermission) {
    navigation.navigate(ROUTES.PERMISSION);
  }
  useEffect(() => {
    if (actualModel == null) return;
    console.log(`Model loaded! Shape:\n${modelToString(actualModel)}]`);
  }, [actualModel]);
  return (
    <View style={container}>
      {device ? (
        <>
          <Camera
            device={device}
            isActive={true}
            style={container}
            pixelFormat="rgb"
            frameProcessor={frameProcessor}
            frameProcessorFps={1} // Process one frame per second
            // fps={30}
          />
          <TouchableOpacity
            onPress={() => console.log('flash pressed')}
            style={flashWrapper}>
            <Feather name="zap" size={30} color={'#111'} />
          </TouchableOpacity>
          {/* Display the prediction */}
          <View style={styles.predictionWrapper}>
            <Text style={styles.predictionText}>Prediction: {prediction}</Text>
          </View>
        </>
      ) : (
        <>
          <Text>No Camera found</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  flashWrapper: {
    position: 'absolute',
    right: 20,
    top: 10,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: '100%',
    backgroundColor: '#e9ecef',
  },
  predictionWrapper: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 10,
  },
  predictionText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  flashcontainer: {},
});
export default CameraScreen;
