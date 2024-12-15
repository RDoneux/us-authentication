import { Request, Response, Router } from 'express';
import { databaseHealth, imageServiceHealth, serverHealth } from '../services/actuator-service';

const actuatorController = Router();

actuatorController.get('/actuator/health', getHealth);

async function getHealth(request: Request, response: Response) {
  const imageServiceStatus = await imageServiceHealth();
  const serverStatus = await serverHealth();
  const databaseStatus = await databaseHealth();

  if (
    imageServiceStatus.status === 'DOWN' ||
    serverStatus.status === 'DOWN' ||
    databaseStatus.status === 'DOWN'
  ) {
    response.status(500).json({ status: 'DOWN', imageServiceStatus, serverStatus, databaseStatus });
    return;
  }
  response.status(200).json({ status: 'UP', imageServiceStatus, serverStatus, databaseStatus });
}

export default actuatorController;
