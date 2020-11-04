var mdb = require('mime-db');
var axios = require("axios");
var fs = require("fs");
var up = require("url");

module.exports = async function(url,name) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });
    if (!name) {
      name = up.parse(url,true).pathname.split("/").reverse[0];
      name+=name.length==0?"file":"";
    }
    var ext = mdb[response.headers["content-type"].split(";")[0].trim()];
    if (ext) name = name+"."+ext.extensions[0];
    var writer = fs.createWriteStream(name);
    return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(name))
        writer.on('error', () => reject(false))
      })
  }
  catch (e) {
    console.log("Invalid url");
  }
}
