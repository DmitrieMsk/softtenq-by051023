const express = require("express");
const cors = require("cors");

const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
app.get('/', (req, res) => {
  res.send('succl resp');
});
app.get('/api/fr', (req, res) => {
  res.send('back and front are friends');
});
/*router.get('/homepagepage', (req, res) => {
  res.send('homepage');
});*/
//app.use("/homepagepage", wiki);
const db = require("./models");
const Role = db.role;

db.sequelize.sync({force: false});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "moderator"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
}


  require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

app.listen(3000, () => console.log('Example app is listening on port 3000.'));
//module.exports = express.Router
