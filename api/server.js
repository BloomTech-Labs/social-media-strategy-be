const express = require('express');
const server = express();
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const ApiRouter = require('../api/api-routes');

server.use(cors());

server.use(express.json());
server.use(morgan('combined'));
server.use(helmet());

server.get('/', (req, res) => {
  res.status(200).json({ message: 'ITS WORKING!!!' });
});

server.use('/api', ApiRouter);

module.exports = server;
