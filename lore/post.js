var fetch = require('node-fetch');
var cheerio = require('cheerio');
var request = require('request');
var FormData = require('form-data');
var fs = require("fs");
var path = require('path');


const folder = "cuphead";
const nameApp = "General"
let contentPrev = [];
var listOfLinks = fs.readFileSync("linklist.txt",'utf8').split("\n");

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    //console.log('content-type:', res.headers['content-type']);
    //console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

Object.prototype.toArray=function(){
var arr=new Array();
for( var i in this ) {
    if (this.hasOwnProperty(i)){
        arr.push(this[i]);
    }
}
return arr;
};

function makeid(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < length; i++)
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

function capitalize(s){
    return s.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
};

function getSource(l){
  return new Promise((resolve) => {
    let urlData = l.split("/wiki/");
    fetch(`${urlData[0]}/api.php?action=query&prop=revisions&rvprop=content&titles=${urlData[1]}&format=json`).then(function(res) {
          return res.json();
      }).then(function(body) {
          let lists = [];
          let id = Object.keys(body.query.pages)[0];
          let title = body.query.pages[id].title;
          let rawText = body.query.pages[id].revisions[0]['*'];
          let maxImageToGet = Math.ceil(rawText.split("==").length / 10);
          console.log(title);
          resolve({
              title,
              source: rawText,
              maxImage: maxImageToGet
          });
    });
  }, (error) => {
    console.log(err);
  });
}

function getPage(list, curr, max){
  let li = list[curr];
  getSource(li).then((res) => {
    fetch(`${li}`).then(function(res) {
          return res.text();
      }).then(function(body) {
        let $ = cheerio.load(body);
        let images = $("#mw-content-text img");
        let imageArray = [];
        let imagesFiltered = [];
        let j = 0;
        while(j < images.length){
          if(images[j]){
            if(images[j].attribs.width > 240 && images[j].attribs.height > 100){
              imagesFiltered.push(images[j]);
            }
          }
          j++;
        }

        let i = 0;
        while(i <= res.maxImage){
          if(imagesFiltered[i]){
            let image = imagesFiltered[i].attribs.src;
            if(image.includes("/revision")){
              image = image.split("/revision")[0];
              let imageName = "IMG" + makeid(8);
            	download(image, folder + "/images/" + imageName + ".png", (res) => {
                console.log("downloaded image: " + i);
              });
              imageArray.push(imageName + ".png");
            }
          }
          i++;
        }
        let catArr = res.source.split("{{");
        let cat = catArr[catArr.length - 1].split("}}")[0];
        let contenFileObj = res;
        contenFileObj.images = imageArray;
        if(cat.length < 30){
          contenFileObj.category = cat;
        }else{
          contenFileObj.category = nameApp;
        }
        let contentName = makeid(8);
        fs.writeFileSync(folder + "/contents/p" + (curr+1) + ".json", JSON.stringify(contenFileObj));
        addToPreview(contenFileObj, curr+1);
        if(curr + 1 <= max){
          getPage(list, curr + 1, max);
        }
      }).catch((err) => {
        console.log(err);
      });
  }).catch(function(error) {
      console.log('request failed', error)
      getPage(list, curr, max);
  });
}

function addToPreview(all, id){
  contentPrev.push({
    id,
    title: all.title,
    thumb: all.images[0],
    category: all.category
  });
  if(contentPrev.length == listOfLinks.length - 1){
    fs.writeFileSync(folder + "/preview.json", JSON.stringify(contentPrev));
  }
}

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
      fs.readdirSync(path).forEach(function(file) {
        var curPath = path + "/" + file;
          if(fs.statSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);
          } else { // delete file
              fs.unlinkSync(curPath);
          }
      });
      fs.rmdirSync(path);
    }
};

fs.readdir(folder, (err, files) => {
  if (err) throw err;
  deleteFolderRecursive(folder);
  var dir = folder;
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  var dir1 = folder + "/contents";
  if (!fs.existsSync(dir1)){
      fs.mkdirSync(dir1);
  }
  var dir2 = folder + "/images";
  if (!fs.existsSync(dir2)){
      fs.mkdirSync(dir2);
  }
});

function getLinks(){
  getPage(listOfLinks, 0, listOfLinks.length - 1);
}

getLinks();
