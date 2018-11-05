const mongoose = require("mongoose");
let dbURI = 'mongodb://localhost:27017/loc8r';
if (process.env.NODE_ENV === 'production')
  dbURI = process.env.MLAB_URI;

mongoose.connect(dbURI);
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`);
});
mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error: ', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close ( () => {
    console.log('Mongose disconnected through ', msg);
    callback();
  });
};

// for windows to capture the SIGINT
if (process.platform === 'win32'){
  const rl = require('readLine').createInterface({
    'input': process.stdin,
    'output': process.stdout
  });
  rl.on('SIGINT', () => {
    process.emit('SIGINT');
  });
}
// for nodemon restarts
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// SIGINT (app termination) event listner
process.on('SIGINT', () => {
  gracefulShutdown('termination signal', () => {
    process.exit(0);
  });
});

// Heroku SIGTERM event listner
process.on('SIGTERM', () => {
  gracefulShutdown('heroku app shutdown', () => {
    process.exit(0);
  });
});

require('./location');