import React from 'react';
import { StyleSheet, Text, Image, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { LinearGradient } from 'expo';

import API from '../api';

const size = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
}

import Preview from '../assets/preview.json';
import Images from '../assets/images.js';

export default class App extends React.Component {
  render() {
    if(this.props.post.thumb){
      this.postThumb = Images[this.props.post.thumb.replace(".", "_")];
    }else{
      this.postThumb = require("../appicon.png");
    }
    return (
      <TouchableOpacity onPress={() => API.event.emit("reader", this.props.post.id)}>
        <View style={styles.item}>
          <Image source={this.postThumb} style={styles.image}/>
          <LinearGradient
            colors={['transparent', '#101010']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -5,
              height: size.width / 3,
            }}/>
          <Text style={styles.cat}>{this.props.post.category}</Text>
          <Text style={styles.text}>{this.props.post.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    width: size.width / 2 - 10,
    margin: 5,
    borderWidth: 2,
    borderColor: "#101010",
    height: size.width / 2 - 10,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: 2
  },
  image: {position: "absolute", left: 0, right: 0, width: "100%", height: "100%", resizeMode: "cover"},
  text: {
    backgroundColor: "transparent",
    color: "#fff",
    fontWeight: "bold",
    padding: 10,
    paddingTop: 3,
    fontSize: 16
  },
  cat: {
    backgroundColor: "transparent",
    color: "#ddd",
    fontWeight: "bold",
    padding: 10,
    paddingBottom: 0,
    fontSize: 13
  }
});
