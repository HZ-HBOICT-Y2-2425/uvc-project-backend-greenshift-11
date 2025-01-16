import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
const router = express.Router();

// create a proxy for each microservice
const microserviceProxy = createProxyMiddleware({
  target: 'http://localhost:3011',
  changeOrigin: true
});
const applianceProxy = createProxyMiddleware({
  target: 'http://localhost:3012',
  changeOrigin: true
});

router.use('/microservice', cors(), microserviceProxy);
router.use('/appliance', cors(), applianceProxy);

export default router;
