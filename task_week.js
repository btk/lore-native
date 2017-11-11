let fs = require("fs");

mdtojson(1);
mdtojson(2);

function mdtojson(wid){
	let weekpath = "weeks/week" + wid;
	let weekJsonPath = "weeks/json/week" + wid;

	var text = fs.readFileSync(weekpath+".md",'utf8');

	let splitted = text.split("---");

	let header = splitted[1];

	let attr = header.split(";");


	let headerInfo = {};
	/*
	attrData[0]; // hafta
	attrData[1]; // 1
	*/

	attr.forEach((myAttr) => {
		let attrData = myAttr.split(":");
		let theData;
		if(attrData[1]){
			if(attrData[1].includes('"')){
				theData = attrData[1].replace(' "', "").replace('"', "");
			}else if(attrData[1].includes("\n  - ")){
				let listA = attrData[1].split("\n  - ");
				theData = [];
				listA.forEach((line) => {
					if(line){
						theData.push(line.replace("\n", ""));
					}
				});
			}else{
				theData = Number(attrData[1].replace(" ", ""));
			}
			headerInfo[attrData[0].replace("\n", "")] = theData;
		}
	});

	console.log("week parsed: " + wid);

	let outObj = {header: headerInfo, content: splitted[2]};
	fs.writeFileSync(weekJsonPath+".json", JSON.stringify(outObj));
}
