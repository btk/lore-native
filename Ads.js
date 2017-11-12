import React from 'react';
import { StyleSheet, Text, View, Animated, Dimensions, TouchableOpacity, Platform } from 'react-native';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  Constants
} from 'expo';

import API from './api';

const size = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
}

export default class App extends React.Component {
  state = {
    insterstitial: false
  };

  componentWillMount(){
    let interstitialUnitID = null;
    if(Platform.OS === "ios"){
      interstitialUnitID = "ca-app-pub-3602356900147773/5811224025";
    }else{
      interstitialUnitID = "ca-app-pub-3602356900147773/5811224025";
    }
    AdMobInterstitial.setAdUnitID(interstitialUnitID);
    AdMobInterstitial.setTestDeviceID('EMULATOR');

    API.event.on("ads", data => {
      console.log("Triggered Ads: ", data);
      if(data == "interstitial"){
        this.displayInterstitial();
      }
      if(data == "rewardedVid"){
        this.displayRewardedVid();
      }
    });
  }

  componentWillUnmount(){
    API.event.removeAllListeners("ads");
  }

  displayInterstitial(){
    //API.segment.trackWithProperties("ads", {type: "insterstitial", network: "Admob"});
    AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd());
  }

  displayRewardedVid(){
    //API.segment.trackWithProperties("ads", {type: "rewardedVid", network: "Admob"});
    AdMobRewarded.requestAd(() => AdMobRewarded.showAd());
  }


  render() {
    return null;
  }
}

const styles = StyleSheet.create({
  mock: {
    alignItems: "center"
  }
});
