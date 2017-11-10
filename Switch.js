import React from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl, Animated, Easing } from 'react-native';

import HomeScreen from './screen/home';
import ProgramScreen from './screen/program';

const ANIMTIMING = 150;

export default class App extends React.Component {
  state = {
    refreshing: false,
    switchAnim: new Animated.Value(1),
    currentScreen: this.props.id
  };

  componentWillReceiveProps(newProps){
    if(this.state.currentScreen != newProps.id){
      Animated.timing(
        this.state.switchAnim,
        {
          toValue: 0,
          duration: ANIMTIMING,
          useNativeDriver: true
        }
      ).start();
      setTimeout(() => {
        this.setState({
          currentScreen: newProps.id
        });
        Animated.timing(
          this.state.switchAnim,
          {
            toValue: 1,
            duration: ANIMTIMING,
            useNativeDriver: true
          }
        ).start();
      }, ANIMTIMING);
    }
  }

  onRefresh(){
    this.setState({refreshing: true});
    setTimeout(() => {
      this.setState({refreshing: false});
    }, 1000);
  }

  renderScreen(screen){
    if(screen == "home"){
      return (
        <HomeScreen/>
      );
    }else if(screen == "program"){
      return (
        <ProgramScreen/>
      );
    }
  }

  render() {
    return (
      <Animated.View style={[styles.container,  {opacity: this.state.switchAnim.interpolate({inputRange: [0, 1], outputRange: [0, 1]})}]}>
        <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
        style={styles.content}>
          {this.renderScreen(this.state.currentScreen)}
        </ScrollView>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1
  }
});
