const express = require('express');
/*var router = express.Router();
var wiki = require("./homepagepage.js");*/

const app = express();
app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
app.get('/', (req, res) => {
  res.send('ьфьф');
});
app.get('/api/fr', (req, res) => {
  res.send('ьфьфdruzya');
});
/*router.get('/homepagepage', (req, res) => {
  res.send('homepage');
});*/
//app.use("/homepagepage", wiki);
app.listen(3000, () => console.log('Example app is listening on port 3000.'));
//module.exports = express.Router
