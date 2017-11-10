import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Constants } from 'expo';

export default class App extends React.Component {
  state = {
    currentScreen: "home"
  };

  switchScreen(screenString){
    console.log("Screen Switched to", screenString);
    this.setState({
      currentScreen: screenString
    });
    this.props.switchTo(screenString);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItemCarrier} onPress={() => this.switchScreen("home")}>
            <Text style={[styles.menuItem, {opacity: (this.state.currentScreen == "home")?1:0.6}]}>Anasayfa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItemCarrier} onPress={() => this.switchScreen("program")}>
            <Text style={[styles.menuItem, {opacity: (this.state.currentScreen == "program")?1:0.6}]}>Program</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.icon}>
          <Ionicons name="ios-settings" size={30} color="#666" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: "rgba(0,0,0,0.1)",
    borderBottomWidth: 1,
    height: 65,
    paddingTop: Constants.statusBarHeight,
    width: "100%",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  menu: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  menuItemCarrier: {
    height: 65,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItem: {
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.6
  },
  icon: {
    paddingHorizontal: 12
  }
});
