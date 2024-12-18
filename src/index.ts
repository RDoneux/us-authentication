import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import logger from './middleware/logger';
import actuatorController from './controllers/actuator.controller';
import { errorLog, infoLog } from './globals/logging-globals';
import { dataSource } from './globals/data-source';
import eventsProxyController from './controllers/events-proxy.controller';
import imageProxyController from './controllers/image-proxy.controller';
import isAuthenticated from './middleware/isAuthenticated';
import authenticationController from './controllers/authentication.controller';
import cors from 'cors';

export const environment = process.env.NODE_ENV || 'development';
console.log(
  `starting server in ${environment} environment... if there is no further logging, ensure DEBUG=<project-name>:* is defined in environment variables`
);
infoLog('Starting server...');

export const application = express();
let PORT = process.env.PORT || 4000;
// if running in test environment, force to port 4001 to avoid conflicts with potentially running instances
if (environment === 'test') PORT = 4001;

const corsOptions = {
  origin: ['http://localhost:5173', 'https://us-spa-production.up.railway.app'],
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

application.use(cors(corsOptions));

// middleware
application.use(logger);

// authentication
application.use(actuatorController);
application.use(authenticationController);

// authentication middleware
application.use(isAuthenticated);

// controllers
application.use(eventsProxyController);
application.use(imageProxyController);

// root endpoints
application.use((request: Request, response: Response) => {
  response.status(404).json('endpoint not found, did you remember  to use the controller?');
});

// start server
/* eslint-disable @typescript-eslint/no-unused-expressions */
export const server = application.listen(PORT, (error?: Error) => {
  error
    ? errorLog(error)
    : infoLog(`Server launched successfully, listening at: http://localhost:${PORT}`);
});

function initalizeDatabase(attempt: number = 1) {
  // test environment will handle dataSource connection, no need to establish it in server
  if (environment !== 'test') {
    // connect to database
    dataSource
      .initialize()
      .then(() => {
        infoLog('Database initalised successfully');
      })
      .catch((error: Error) => {
        errorLog(`There was an error initalising database: ${error}`);
        if (attempt < 5) {
          infoLog(`Attempting to connect again...`);
          setTimeout(() => {
            initalizeDatabase(attempt + 1);
          }, 5000);
        }
      });
  }
}

initalizeDatabase();
