import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';
var EventEmitter = require('events').EventEmitter;
EventEmitter.defaultMaxListeners = 40;

const _FLUSH = false;
// Flush all user generated data to assigned currents

let storage = new Storage({
	size: 1000,
	storageBackend: AsyncStorage,
	defaultExpires: null,
	enableCache: true,
	sync: {}
});

class API {
  constructor(){
		this.event = new EventEmitter();
    console.log("API: Created instance");
    this.initApiCurrents();
		if(_FLUSH){
			this.flush();
		}
  }

	flush(){
		// Flush to the begining state
		this.setData("exampleData", 1);
	}

  initApiCurrents(){
    this.getData("exampleData").then(ed => {
        console.log("API: exampleData: ", ed);
    }, err => {
      if(err.name == "NotFoundError"){
        this.setData("exampleData", 1);
      }
    });
  }


  // These are like kinda private;
  // But fuck it, use them in the general app, who cares.
  setData(key, data){
    return storage.save({key, data});
  }

  getData(key){
    // returns promise
    return storage.load({key});
  }
}

let apiInstance = new API();

export default apiInstance;
