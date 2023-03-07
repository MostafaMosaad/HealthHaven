const app = require('./app');
const mongoose = require('mongoose')
const DB = "mongodb://127.0.0.1:27017/Mearn"
const port = 3000;

mongoose.set('strictQuery', true);
mongoose.connect(DB).then(con => {
  console.log("DB Connection Successful");
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
})



