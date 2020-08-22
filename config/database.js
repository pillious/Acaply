const mongoose = require('mongoose');

const dbUsername = process.env.DATABASE_USERNAME;
const dbPassword = process.env.DATABASE_PASSWORD;

const databaseURL =
  'mongodb+srv://' +
  dbUsername +
  ':' +
  dbPassword +
  '@nnhs-forum-tqvkq.azure.mongodb.net/acaply?retryWrites=true&w=majority';

//Connect to the MongoDB database.
const connectDatabase = async () => {
  try {
    await mongoose.connect(databaseURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log('Connected to MongoDB for Acaply.');
  } catch (err) {
    console.log(err.message);

    //Exit process with failure.
    process.exit(1);
  }
};

module.exports = connectDatabase;
