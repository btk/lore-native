import React from 'react';
import { StyleSheet, Text, Image, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import API from '../api';

import Card from './card';
import Preview from '../assets/preview.json';
import Images from '../assets/images.js';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {
          Preview.map((p, i) => {
            return (<Card key={i} post={p}/>);
          })
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row"
  }
});
