import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from './src/utils/routes';
// import CameraScreen from './src/screens/CameraScreen';
import Permission from './src/screens/Permission';
import NoCameraDevice from './src/screens/NoCameraDevice';
import CameraScreen from './src/screens/CameraScreen-v1';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const {wrapper} = styles;
  return (
    <SafeAreaView style={wrapper}>
      <StatusBar backgroundColor={'grey'} />
      <NavigationContainer>
        <Stack.Navigator initialRouteName={ROUTES.PERMISSION}>
          <Stack.Screen
            name={ROUTES.CAMERA}
            component={CameraScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={ROUTES.PERMISSION}
            component={Permission}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={ROUTES.NO_CAMERA_DEVICE}
            component={NoCameraDevice}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

export default App;
