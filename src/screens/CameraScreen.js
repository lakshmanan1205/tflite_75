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

function CameraScreen() {
  const navigation = useNavigation();
  const device = useCameraDevice('back');
  const {hasPermission} = useCameraPermission();
  const {container, flashWrapper} = styles;
  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    console.log(`Frame: ${frame.width}x${frame.height} (${frame.pixelFormat})`);
  }, []);
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
