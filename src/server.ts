import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import https from 'https';
import http from 'http';

import { requestIntercepter } from './utils/requestIntercepter.js';
import siteRoutes from './routes/site.js'
import adminRoutes from './routes/admin.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(requestIntercepter);
app.use('/admin', adminRoutes);
app.use('/', siteRoutes);

const runServer = (port: number, server: http.Server) => {
  server.listen(port, () => {
    console.log(`🚀 Running at PORT ${port}`)
  })
} 

const regularServer = http.createServer(app);
if (process.env.NODE_ENV === 'production') {
  // TODO - CONFIG SSL
  // TODO - RODAR SERVER NA 80 E NA 443
}
else {
  const serverPort: number = process.env.PORT ? parseInt(process.env.PORT) : 9000;
  runServer(serverPort, regularServer);
}