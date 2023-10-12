const express = require('express');

//ПОДКЛЮЧЕНИЕ БАЗЫ в отедльный файл конфига


/*сonst User = sequelize.define('User', {
  
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  username: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE

});
const jane = User.create({
 id: 1
});

const users = User.findAll()*/


const app = express();
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
app.listen(3000, () => console.log('Example app is listening on port 3000.'));
//module.exports = express.Router
