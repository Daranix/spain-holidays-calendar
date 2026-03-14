import '@angular/compiler';

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { router as apiRouter } from './server/application/api';

// Configuración de seguridad para Angular 21 SSR
// Definimos los hosts permitidos a través de la variable de entorno que reconoce @angular/ssr
process.env['NG_ALLOWED_HOSTS'] = 'localhost,127.0.0.1,0.0.0.0,192.168.1.142';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();

// Pasamos explícitamente los hosts permitidos también al motor
const angularApp = new AngularNodeAppEngine({
  allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', '192.168.1.142']
} as any);

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * API Routes
 */
app.use('/api', apiRouter);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  // Evitamos bucles en rutas de API
  if (req.url.startsWith('/api')) {
    res.status(404).json({ error: 'API route not matched' });
    return;
  }

  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI or cloud providers.
 */
export const reqHandler = createNodeRequestHandler(app);