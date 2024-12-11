import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const target = process.env.IMAGE_SERVICE_URL;
const changeOrigin = true;

const imageProxyController = Router();

const images = createProxyMiddleware({ target, changeOrigin });

imageProxyController.get('/get', images);
imageProxyController.get('/list', images);
imageProxyController.get('/print', images);

export default imageProxyController;
