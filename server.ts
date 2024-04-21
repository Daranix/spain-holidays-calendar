import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { HOST_URL } from './shared/di/tokens';
import { router } from './server/application/api';
import { generateSiteMap } from './server/infrastructure/generator-sitemap';
import { MemoryCacheStorage } from './server/infrastructure/cache-manager';
import { stringToMilliseconds } from './server/utils';


// The Express app is exported so that it can be used by serverless Functions.
export async function app(): Promise<express.Express> {
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
    router
  );

  server.get('/sitemap.xml', async (req, res) => {
    const sitemapCacheTime = stringToMilliseconds('10d'); // 10d
    const sitemap = MemoryCacheStorage.register('', () => generateSiteMap(), sitemapCacheTime);
    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();
  })

  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: process.env['NODE_ENV'] === 'dev' ? 0 : '10d'
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

async function run() {
  
  try {
    process.loadEnvFile();
  } catch(ex) {
    console.warn('.env file not found');
  }
  
  // biome-ignore lint/complexity/useLiteralKeys: Environment variables has to be accessed this way
  const port = process.env['PORT'] || 3000;



  // Start up the Node server
  const server = await app();

  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
  

}

run();