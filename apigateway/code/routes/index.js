import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
const router = express.Router();

// create a proxy for each microservice
const applianceProxy = createProxyMiddleware({
  target: 'http://appliances:3011',
  changeOrigin: true
});

router.use('/appliances', cors(), appliancesProxy);

export default router;
