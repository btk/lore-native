import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class App extends React.Component {
  render() {
    return (
      <View>
        <View style={styles.item}><Text>a</Text></View>
        <View style={styles.item}><Text>b</Text></View>
        <View style={styles.item}><Text>c</Text></View>
        <View style={styles.item}><Text>d</Text></View>
        <View style={styles.item}><Text>e</Text></View>
        <View style={styles.item}><Text>f</Text></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    flex: 1,
    margin: 5,
    height: 100,
    borderWidth: 1,
    borderColor: "#eee"
  }
});
