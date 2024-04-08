import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import * as trpcExpress from '@trpc/server/adapters/express';
import bootstrap from './src/main.server';
import { appRouter, createContext } from '@/server/application/trpc';
import { HOST_URL } from './shared/di/tokens';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);
  // Example Express Rest API endpoints
  server.use(
    '/api',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );

  server.get('/api2/test', (req, res) => {
    res.json({ user: 'Mercadona' })
  });
  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: 0
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    const url = `${protocol}://${headers.host}${originalUrl}`;
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url,
        publicPath: browserDistFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          { provide: HOST_URL, useValue: url }
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  // biome-ignore lint/complexity/useLiteralKeys: Environment variables has to be accessed this way
  const port = process.env['PORT'] || 3000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();