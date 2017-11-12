import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import API from '../api';

export default class App extends React.Component {
  render() {
    return (
      <View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: 114
  },
  item: {
    width: 150,
    margin: 5,
    marginVertical: 7,
    height: 100,
    backgroundColor: "#eee",
    borderRadius: 7,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center"
  },
  haftaText: {
    color: "#fff",
    fontWeight: "bold"
  },
  haftaTitle: {
    fontSize: 21,
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 5,
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 10,
    overflow: "hidden"
  },
  itemActive: {
    backgroundColor: "#55aeae"
  }
});
