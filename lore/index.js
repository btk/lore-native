var fetch = require('node-fetch');
var cheerio = require('cheerio');
var FormData = require('form-data');

var form = new FormData();

function rand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function capitalize(s){
    return s.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
};

var location = ["Stockholm, Sweden", "Hamburg, Germany", "Ottowa, Canada", "Toronto, Canada", "Melbourne, Australia", "San Francisco, CA", "London, England", "Asia Pacific", "Trentino, Italy"];

fetch('https://randomuser.me/api/')
  .then(function(res) {
      return res.json();
  }).then(function(a) {
        let res = a.results[0];
        console.log(res.picture.large);
    form.append('handle', res.name.first);
    form.append('name', capitalize(res.name.first + ' ' + res.name.last));
    form.append('avatar', res.picture.large);
    form.append('bio', "");
    form.append('place', location[rand(0, location.length - 1)]);

    fetch('http://46.101.180.166/listapi/user.php', { method: 'POST', body: form })
    .then(function(res) {
        return res.text();
    }).then(function(json) {
        console.log(json);
    });
  });
