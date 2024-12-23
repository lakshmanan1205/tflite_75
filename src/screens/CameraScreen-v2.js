import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';
import Feather from 'react-native-vector-icons/Feather';
import {ROUTES} from '../utils/routes';
import {useTensorflowModel} from 'react-native-fast-tflite';
import {useResizePlugin} from 'vision-camera-resize-plugin';

function CameraScreen() {
  const navigation = useNavigation();
  const device = useCameraDevice('back');
  const {hasPermission} = useCameraPermission();
  const {container, flashWrapper} = styles;
  // FRAMEPRESSOR
  const objectDetection = useTensorflowModel(
    require('../assets/passport_detection_model.tflite'),
  );
  const model =
    objectDetection.state === 'loaded' ? objectDetection.model : undefined;
  const resize = useResizePlugin();
  console.log('resioze', resize);
  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      if (!model) return;
      return console.log('frame', frame);
      // Convert frame to an array buffer
      const buffer = frame.toArrayBuffer();

      // Assuming the frame is 4K, preprocess the buffer to resize it manually
      // or pass it to a JavaScript-based resizing library

      const outputs = model.runSync([buffer]);
      const detection_boxes = outputs[0]; // Coordinates of boxes
      const detection_classes = outputs[1]; // Class labels
      const detection_scores = outputs[2]; // Confidence scores

      const parsedDetections = [];
      for (let i = 0; i < detection_scores.length; i++) {
        if (detection_scores[i] > 0.5) {
          parsedDetections.push({
            box: detection_boxes.slice(i * 4, i * 4 + 4),
            label: detection_classes[i],
            score: detection_scores[i],
          });
        }
      }

      console.log(parsedDetections);
    },
    [model],
  );

  // const frameProcessor = useFrameProcessor(frame => {
  //   'worklet';
  //   if (model === null) return;
  //   // 1. Resize 4k Frame to 192x192x3 using vision-camera-resize-plugin
  //   const resized = resize(frame, {
  //     scale: {
  //       width: 192,
  //       height: 192,
  //     },
  //     pixelFormat: 'rgb',
  //     dataType: 'uint8',
  //   });
  //   // 2. Run model with given input buffer synchronously
  //   const outputs = model?.runSync([frame]);
  //   // // 3. Interpret outputs accordingly
  //   const detection_boxes = outputs[0];
  //   const detection_classes = outputs[1];
  //   const detection_scores = outputs[2];
  //   const num_detections = outputs[3];
  //   // console.log(`Detected ${num_detections[0]} objects!`);
  //   console.log(`Frame: ${frame.width}x${frame.height} (${frame.pixelFormat})`);

  //   for (let i = 0; i < detection_boxes.length; i += 4) {
  //     const confidence = detection_scores[i / 4];
  //     if (confidence > 0.7) {
  //       // 4. Draw a red box around the detected object!
  //       const left = detection_boxes[i];
  //       const top = detection_boxes[i + 1];
  //       const right = detection_boxes[i + 2];
  //       const bottom = detection_boxes[i + 3];
  //       // const rect = SkRect.Make(left, top, right, bottom);
  //       // canvas.drawRect(rect, SkColors.Red);
  //     }
  //   }
  // }, []);
  if (!hasPermission) {
    navigation.navigate(ROUTES.PERMISSION);
  }
  return (
    <View style={container}>
      {device ? (
        <>
          <Camera
            device={device}
            isActive={true}
            style={container}
            frameProcessor={frameProcessor}
            frameProcessorFps={1}
          />
          <TouchableOpacity
            onPress={() => console.log('flash pressed')}
            style={flashWrapper}>
            <Feather name="zap" size={30} color={'#111'} />
          </TouchableOpacity>
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
  flashcontainer: {},
});
export default CameraScreen;
