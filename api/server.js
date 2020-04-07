const express = require('express');
const server = express();
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const ApiRouter = require('../api/api-routes');
// Access-Control-Expose-Headers: Access-Control-Allow-Origin
// var corsOptions = {
//   origin: '*'
// };
// const corsOptions = {
//   origin: '*',
//   allowedHeaders: [
//     'Content-Type',
//     'Authorization',
//     'Access-Control-Allow-Methods',
//     'Access-Control-Request-Headers'
//   ],
//   credentials: true,
//   enablePreflight: true
// };

// server.options('*', cors(corsOptions)); // Enable options for preflight
server.use(cors());

server.use(express.json());
server.use(morgan('combined'));
server.use(helmet());

server.get('/', (req, res) => {
  res.status(200).json({ message: 'ITS WORKING!!!' });
});

server.use('/api', ApiRouter);

module.exports = server;
