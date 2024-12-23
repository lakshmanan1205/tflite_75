import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

export default Passport = ({route}) => {
  console.log('route', route);
  const {wrapper} = styles;
  return (
    <View style={wrapper}>
      <Text>Passport</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
