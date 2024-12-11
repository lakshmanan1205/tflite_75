import React, {useEffect} from 'react';
import {Alert, Linking, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Camera, useCameraPermission} from 'react-native-vision-camera';
import CustomButton from '../components/CustomButton';
import {ROUTES} from '../utils/routes';

function Permission(): React.JSX.Element {
  const {requestPermission} = useCameraPermission();
  const status = Camera.getCameraPermissionStatus();
  const navigation = useNavigation();
  useEffect(() => {
    function handleRequestAgain() {
      if (status === 'denied' || status === 'restricted') {
        Alert.alert(
          'Permission Needed',
          'Camera access is required. Please enable it in your settings.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => {
                Linking.openSettings();
              },
            },
          ],
        );
      }
    }
    if (status === 'granted') {
      navigation.navigate(ROUTES.CAMERA);
    } else {
      handleRequestAgain();
    }
  }, [status, navigation]);
  return (
    <View>
      <Text>You need to give access to the react vision camera</Text>
      <CustomButton title="Give Access" onPress={requestPermission} />
    </View>
  );
}

export default Permission;
