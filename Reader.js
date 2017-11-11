import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, RefreshControl, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import weekData from './week_data.js';

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

  renderReader() {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.readerCarrier,  {transform: [{translateX: this.state.slideAnim.interpolate({inputRange: [0, 1], outputRange: [0, size.width]})}]}]}>
          <Header headerText={this.state.currentWeek + ". Hafta"} back={this.back.bind(this)}/>
          <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
          style={styles.content}>
            <Text>{weekData["week1_json"].content}</Text>
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
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 101
  },
  backgroundDiv: {
    backgroundColor: "rgba(0,0,0,0.8)",
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 100
  },
  content: {
    flex: 1
  }
});
