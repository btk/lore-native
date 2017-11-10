import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Weeks from '../component/weeks';
import Posts from '../component/posts';

export default class App extends React.Component {
  render() {
    return (
      <View>
        <Weeks/>
        <Posts/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
