// import this file for static assets
  let Obj = {
    week1_json: require('./weeks/json/week1.json'), week2_json: require('./weeks/json/week2.json'),
    search: function(key) {
      if(this.hasOwnProperty(key)) {
        return this[key];
      } else {
        return -1;
      }
    },
    format: function(extention) {
      let filteredArray = this.filter(assetSlug => (assetSlug.includes("-"+extention)));
      if(filteredArray.length){
        return filteredArray;
      } else {
        return -1;
      }
    }
  }
  export default Obj;
  