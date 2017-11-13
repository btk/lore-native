import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, RefreshControl, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Images from '../assets/images.js';

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function patternMatch(string, start, end, change){
  let originalChange = change;
	string.split(start).forEach((stringMatchSplit, i) => {
    change = originalChange;
		if(i >= 1){
			let mid = stringMatchSplit.split(end)[0];
			if(mid.includes("//")){
				change = mid.replaceAll(mid.split(" ")[0] + " ", "");
			}else{
				change = change.replace("{$1}", mid);
			}
			if(change == "{[[$1]]}" && mid.includes("|")){
				change = mid.split("|")[1];
        if(mid[0] == "F" && mid[1] == "i" && mid[1] == "l" && mid[1] == "e" && mid[1] == ":"){
          change = "";
        }
			}else if(change == "{[[$1]]}"){
				change = mid;
			}
			string = string.replace(start + mid + end, change);
		}
	});
	return string;
}


function rmDupHeadlines(text){
	return text.replaceAll("==\n==", "");
}

function rmWS(text){
	if(text[0] == " "){
		return rmWS(text.substr(1));
	}else{
		return text;
	}
}

function rmShortBetween(string, start, end){
	string.split(start).forEach((stringMatchSplit, i) => {
		if(i >= 1){
			let mid = stringMatchSplit.split(end)[0];
			if(!mid.includes(" ")){
        string = string.replace(start + mid + end, "");
			}
		}
	});
	return string;
}

export function wikiTextToNative(wikiText, images){
	nativeArray = [];
	// check quote
	wikiText = wikiText.replaceAll("==Gallery==", "").replaceAll("== Gallery ==", "");
	wikiText = wikiText.replaceAll("{{{PAGENAME}}}", "").replaceAll("{{PAGENAME}}", "");
	wikiText = wikiText.replaceAll("undefined\n", "");
	wikiText = wikiText.replaceAll("<refrences />", "");
	wikiText = patternMatch(wikiText, "<gallery", "</gallery>", "");
	wikiText = patternMatch(wikiText, "<nowiki>", "</nowiki>", "");
	wikiText = patternMatch(wikiText, "{{Quote", "}}", "§Quote: {$1}\n");
  wikiText = rmShortBetween(wikiText, "{{{", "}}}");
  wikiText = rmShortBetween(wikiText, "{{", "}}");
	wikiText = patternMatch(wikiText, "{{", "}}", "");
	wikiText = patternMatch(wikiText, "{", "}", "");
	wikiText = patternMatch(wikiText, "[[File:", "]]", "");
	wikiText = patternMatch(wikiText, "[http", "]", "{$1}");
	wikiText = patternMatch(wikiText, "'''''", "'''''", "{$1}");
	wikiText = patternMatch(wikiText, "'''", "'''", "{$1}");
	wikiText = patternMatch(wikiText, '""""', '""""', "{$1}");
	wikiText = patternMatch(wikiText, '""', '""', "{$1}");
	wikiText = patternMatch(wikiText, "<b>", "</b>", "{$1}");
	wikiText = patternMatch(wikiText, "<i>", "</i>", "{$1}");
	wikiText = patternMatch(wikiText, "<ref>", "</ref>", "");
	wikiText = patternMatch(wikiText, "<", ">", "");
	wikiText = patternMatch(wikiText, "[[", "]]", "{[[$1]]}");



	wikiText = wikiText.replaceAll("\n\n\n", "\n").replaceAll("\n\n", "\n");
	let wikiTextLines = wikiText.split("\n");
	let imagePush = 0;
	wikiTextLines.forEach((text, i) => {
		if(text[0] == "*"){
			let toReplace = "*";
			if(text[1] == "*"){ toReplace = "**"; }
			nativeArray.push(
				<View key={i} style={styles.li}>
					<Text style={styles.text}>{rmWS(text.replace(toReplace, ""))}</Text>
				</View>
			);
		}else if(text[0] == "§"){
			// This is quote
			nativeArray.push(
				<View key={i} style={styles.quote}>
					<Text style={[styles.quoteText, {fontSize: 18, paddingBottom: 8}]}>{text.split("|")[1]}</Text>
					<Text style={[styles.quoteText, {color: "#ddd", textAlign: "right"}]}>- {text.split("|")[2]}</Text>
					{ (text.split("|").length == 4) &&
						<Text style={[styles.quoteText, {color: "#aaa", fontStyle: "italic", textAlign: "right"}]}>{text.split("|")[3]}</Text>
					}
				</View>
			);
		}else if(text.includes("====")){
			nativeArray.push(
				<Text key={i} style={styles.h3}>{rmWS(text.replaceAll("====", ""))}</Text>
			);
		}else if(text.includes("===")){
			nativeArray.push(
				<Text key={i} style={styles.h3}>{rmWS(text.replaceAll("===", ""))}</Text>
			);
		}else if(text.includes("==")){
			nativeArray.push(
				<Text key={i} style={styles.h2}>{rmWS(text.replaceAll("==", ""))}</Text>
			);
		}else{
			if(text){
				nativeArray.push(
					<View key={i} style={styles.p}>
						<Text style={styles.text}>{rmWS(text)}</Text>
					</View>
				);
			}
		}
		let jumpLength = Math.floor(wikiTextLines.length / images.length);
		// put an image for every i that can be deviced w/jumpLength

		if(i % jumpLength == 0){
			if(i != 0){
				let im;
				if(images[imagePush]){
					im = images[imagePush].replace(".", "_");
				}else{
					im = images[0].replace(".", "_");
				}
				nativeArray.push(
					<View key={i + "img"} style={styles.imageCarrier}>
						<Image source={Images[im]} style={{width: "100%", height: 200, resizeMode: "contain"}}/>
					</View>
				);
			}
			imagePush++;
		}

	});


	// return the native array
	return nativeArray;
}

const styles = StyleSheet.create({
	quote: {
		padding: 13,
		marginBottom: 5,
		backgroundColor: "rgba(0,0,0,.3)",
		borderBottomWidth: 2,
		borderBottomColor: "#101010"
	},
	quoteText: {
		color: "#fff",
	},
	imageCarrier: {
		paddingVertical: 10
	},
	text: {
		color: "#fff",
		fontSize: 16
	},
	p: {
		paddingBottom: 10,
		paddingHorizontal: 10
	},
	h2: {
		color: "#fff",
		paddingTop: 10,
		paddingBottom: 5,
		paddingHorizontal: 10,
		fontSize: 21,
		fontWeight: "bold"
	},
	h3: {
		color: "#fff",
		paddingTop: 10,
		paddingBottom: 5,
		paddingHorizontal: 10,
		fontSize: 19,
		fontWeight: "bold"
	},
	li: {
		borderBottomWidth: 1,
		borderBottomColor: "#333",
		padding: 10,
	}
});
