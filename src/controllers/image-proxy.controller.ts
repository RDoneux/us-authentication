import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const target = process.env.IMAGE_SERVICE_URL;
const changeOrigin = true;

const imageProxyController = Router();

const images = createProxyMiddleware({ target, changeOrigin });

imageProxyController.get('/images/get/:id', images);
imageProxyController.get('/images/list', images);

export default imageProxyController;
