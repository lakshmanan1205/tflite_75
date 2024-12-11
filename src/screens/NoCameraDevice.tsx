import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

function NoCameraDevice(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text>No Camera found</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default NoCameraDevice;
