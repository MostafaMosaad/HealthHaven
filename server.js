const app = require('./app');
const mongoose = require('mongoose')
const DB = "mongodb+srv://mostafamosaad6789:2GxKB3gQJR2OCSI8@cluster0.wjvyhny.mongodb.net/Mearn?retryWrites=true&w=majority"
const port = process.env.PORT || 3000;

mongoose.set('strictQuery', true);
mongoose.connect(DB).then(con => {
  console.log("DB Connection Successful");
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
})



