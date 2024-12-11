import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

const CustomButton = ({title = '', onPress = () => {}}) => {
  const {button, buttonText} = styles;
  return (
    <TouchableOpacity style={button} onPress={onPress}>
      <Text style={buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#5c7cfa',
    borderRadius: 4,
    padding: 4,
  },
  buttonText: {
    color: '#fff',
  },
});

export default CustomButton;
