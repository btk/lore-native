import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Constants } from 'expo';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.menu}>
          <TouchableOpacity style={[styles.menuItemCarrier, styles.icon]} onPress={() => this.props.back()}>
            <Ionicons name="md-arrow-back" size={30} color="#999" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.menuItem, styles.centerText, {opacity: 1}]}>{this.props.headerText}</Text>
        <View style={styles.icon}>
          <Ionicons name="ios-settings" size={30} color="#999" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: "rgba(0,0,0,0.5)",
    borderBottomWidth: 1,
    height: 65,
    paddingTop: Constants.statusBarHeight,
    width: "100%",
    backgroundColor: "#101010",
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
    color: "#fff",
    fontWeight: "600",
    opacity: 0.6
  },
  centerText: {
  },
  icon: {
    paddingHorizontal: 12
  }
});
