var mdb = require('mime-db');
var axios = require("axios");
var fs = require("fs");
var up = require("url");

module.exports = async function(url) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });
    var ext = mdb[response.headers["content-type"].split(";")[0].trim()];
    var name = "file"+Math.floor(1000*Math.random())+"."+ext.extensions[0];
    var writer = fs.createWriteStream(name);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(name));
      writer.on('error', () => reject(false));
    })
  }
  catch (e) {
    console.log(e.message);
    return false;
  }
}
