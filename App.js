import React from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native';

import Header from './component/header';
import Reader from './Reader';
import Switch from './Switch';

export default class App extends React.Component {
  state = {
    refreshing: false,
    currentScreen: "home"
  };

  onRefresh(){
    this.setState({refreshing: true});
    setTimeout(() => {
      this.setState({refreshing: false});
    }, 1000);
  }

  switchScreen(screenString){
    this.setState({
      currentScreen: screenString
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <Header switchTo={this.switchScreen.bind(this)}/>
          <Switch id={this.state.currentScreen}/>
        </View>
        <Reader/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(250,250,250,1)',
  }
});
