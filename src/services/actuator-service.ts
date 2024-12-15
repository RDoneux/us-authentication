import axios, { AxiosResponse } from 'axios';
import { errorLog } from '../globals/logging-globals';
import { dataSource } from '../globals/data-source';

const SERVER_URL = process.env.SERVER_URL;
const IMAGE_SERVICE_URL = process.env.IMAGE_SERVICE_URL;

export interface ServiceHealth {
  status: 'UP' | 'DOWN';
}

export async function serverHealth(): Promise<ServiceHealth> {
  console.log('server_url', SERVER_URL);
  try {
    const response: AxiosResponse = await axios.get(`${SERVER_URL}/actuator/health`);
    if (response.data.status === 'UP') {
      return { status: 'UP' };
    } else {
      return { status: 'DOWN' };
    }
  } catch (error) {
    errorLog(error);
    return { status: 'DOWN' };
  }
}

export async function imageServiceHealth(): Promise<ServiceHealth> {
  try {
    const response: AxiosResponse = await axios.get(`${IMAGE_SERVICE_URL}/actuator/health`);
    if (response.data.status === 'UP') {
      return { status: 'UP' };
    } else {
      return { status: 'DOWN' };
    }
  } catch (error) {
    errorLog(error);
    return { status: 'DOWN' };
  }
}

export async function databaseHealth(): Promise<ServiceHealth> {
  try {
    await dataSource.query('SELECT 1');
    return { status: 'UP' };
  } catch (error) {
    errorLog(error);
    return { status: 'DOWN' };
  }
}
