import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const target = process.env.SERVER_URL;
const changeOrigin = true;

const eventsProxyController = Router();

const events = createProxyMiddleware({ target, changeOrigin });

eventsProxyController.get('/events', events);
eventsProxyController.get('/events/:id', events);
eventsProxyController.get('/events/range', events);
eventsProxyController.post('/events', events);
eventsProxyController.put('/events/:id', events);
eventsProxyController.delete('/events/:id', events);

export default eventsProxyController;
