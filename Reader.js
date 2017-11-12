import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, RefreshControl, Animated, Easing, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { LinearGradient } from 'expo';

import Contents from './assets/contents.js';
import Images from './assets/images.js';
import Preview from './assets/preview.json';

import { wikiTextToNative } from './js/wikiTextToNative.js';

const ANIMTIMING = 500;
import API from './api';

import Header from './component/reader-header';

const size = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
}

export default class App extends React.Component {
  state = {
    refreshing: false,
    slideAnim: new Animated.Value(1),
    currentWeek: 0,
  };

  componentDidMount(){
    API.event.on("reader", (toWeek) => {
      this.changeWeek(toWeek);
      let nextT = Preview.filter(function (val) {
        return val.id === toWeek + 1;
      });
      this.nextTopic = "";
      if(nextT.length){
        this.nextTopic = nextT[0];
        if(this.nextTopic.thumb){
          this.nextTopicThumb = Images[this.nextTopic.thumb.replace(".", "_")];
        }else{
          this.nextTopicThumb = require("./appicon.png");
        }
      }
      if(toWeek > 3){
        API.event.emit("ads", "interstitial");
      }
    });
  }

  changeWeek(toWeek){
    if(toWeek == 0){
      setTimeout(() => {
        this.setState({
          currentWeek: toWeek
        });
      }, ANIMTIMING);
    }else{
      this.setState({
        currentWeek: toWeek
      });
    }
    console.log(this.state.currentWeek, toWeek);

    Animated.timing(
      this.state.slideAnim,
      {
        toValue: (toWeek)?0:1,
        duration: ANIMTIMING,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true
      }
    ).start();
  }

  onRefresh(){
    this.setState({refreshing: true});
    setTimeout(() => {
      this.setState({refreshing: false});
    }, 1000);
  }

  back(){
    this.changeWeek(0);
  }

  toNext(){
    this._scrollView.scrollTo({x: 0, y: 500, animated: false});
    this._scrollView.scrollTo({x: 0, y: 0, animated: true});
      API.event.emit("reader", this.state.currentWeek + 1);
  }

  prepContent(rContent, images){
    return wikiTextToNative(rContent, images);
  }

  renderReader() {
    let contentObj = Contents["p"+this.state.currentWeek+"_json"];
    let thumbImage;
    if(contentObj.images[0]){
      thumbImage = Images[contentObj.images[0].replace(".", "_")];
    }else{
      thumbImage = require("./appicon.png");
    }
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.readerCarrier,  {transform: [{translateX: this.state.slideAnim.interpolate({inputRange: [0, 1], outputRange: [0, size.width]})}]}]}>
          <Header headerText={contentObj.title} back={this.back.bind(this)}/>
          <ScrollView
          ref={(c) => { this._scrollView = c; }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}/>
          }
          style={styles.content}>
            <View style={styles.imageCarrier}>
              <Image source={thumbImage} style={{width: size.width, height: size.height / 3, resizeMode: "cover"}}/>
              <LinearGradient
                colors={['transparent', '#1e1e1e']}
                style={styles.cover}/>
              <View style={styles.titleCarrier}>
                <Text style={styles.category}>{contentObj.category}</Text>
                <Text style={styles.title}>{contentObj.title}</Text>
              </View>
            </View>
            <View>{this.prepContent(contentObj.source, contentObj.images)}</View>

            {(this.nextTopic != "") &&
              <View style={styles.imageCarrier}>
                <Image source={this.nextTopicThumb} style={{width: size.width, height: size.height / 3, resizeMode: "cover"}}/>
                <LinearGradient
                  colors={['#1e1e1e', 'transparent']}
                  style={styles.coverTop}/>
                <View style={styles.titleCarrierTop}>
                  <Text style={styles.category}>Next Topic</Text>
                  <Text style={styles.title}>{this.nextTopic.title}</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => this.toNext()}>
                  <Text style={styles.buttonText}>Read The Next Topic</Text>
                </TouchableOpacity>
              </View>
            }
          </ScrollView>
        </Animated.View>
        <Animated.View style={[styles.backgroundDiv,  { opacity: this.state.slideAnim.interpolate({inputRange: [0, 1], outputRange: [1, 0]})}]}>
        </Animated.View>
      </View>
    );
  }

  render(){
    if(this.state.currentWeek){
      return this.renderReader();
    }else{
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    zIndex: 99,
    backgroundColor: "transparent"
  },
  readerCarrier: {
    backgroundColor: "#1e1e1e",
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 101
  },
  imageCarrier: {
    position: "relative",
    height: size.height / 3
  },
  cover: {
    position: "absolute",
    bottom: -5,
    left: 0,
    right: 0,
    zIndex: 99,
    height: size.height / 3
  },
  coverTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99,
    height: size.height / 3
  },
  titleCarrier: {
    position: "absolute",
    bottom: -5,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "column",
    padding: 20,
    paddingHorizontal: 10,
    backgroundColor: "transparent"
  },
  titleCarrierTop: {
    position: "absolute",
    top: -5,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "column",
    padding: 20,
    paddingHorizontal: 10,
    backgroundColor: "transparent"
  },
  title: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "transparent"
  },
  category: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#ddd",
    paddingBottom: 5,
    backgroundColor: "transparent"
  },
  backgroundDiv: {
    backgroundColor: "rgba(0,0,0,0.9)",
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 100
  },
  content: {
    flex: 1
  },
  button: {
    marginHorizontal: 10,
    height: 40,
    width: size.width - 20,
    borderRadius: 7,
    backgroundColor: "#4a81bd",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    zIndex: 102
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff"
  }
});
