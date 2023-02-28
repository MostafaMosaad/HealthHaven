const app = require('./app');
const mongoose = require('mongoose')
const DB = "mongodb+srv://HealthHaven:1234567890@cluster0.lfuzvsu.mongodb.net/HealthHaven?&retryWrites=true&w=majority"
const port = 3000;

mongoose.set('strictQuery', true);
mongoose.connect(DB).then(con => {
  console.log("DB Connection Successful");
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
})



