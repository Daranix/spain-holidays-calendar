
import { MemoryCacheStorage } from '../infrastructure/cache-manager';
import { findFestivosProvincia, getBlogPost, getBlogPosts, getProvincias, getYears } from '../infrastructure/operations';
import express from 'express';
import { HttpError, stringToMilliseconds } from '../utils';

const router = express.Router();

function normalizeProvinceParam(param: string): string {
  // Strip legacy .htm or URL prefixes if present, keeping canonic slug
  return param
    .replace(/^\//, '')
    .replace(/^.*provincia-de-/, '')
    .replace(/^calendario-laboral-/, '')
    .replace(/(-20\d{2})?\.htm$/, '')
    .toLowerCase();
}

router.get('/festivos/:provincia/:year', (req, res, next) => {
  const { year, provincia } = req.params;
  const canonicalProvincia = normalizeProvinceParam(provincia);
  const key = `festivos_v3_${canonicalProvincia}_${year}`;
  MemoryCacheStorage.register(key, () => findFestivosProvincia(canonicalProvincia, Number.parseInt(year)), stringToMilliseconds('10d'))
    .then(festivos => res.json(festivos))
    .catch((ex) => {
      const err = ex as HttpError;
      res.status(err.statusCode || 500).json({ message: `Error when trying to get the data: ${err.message}` });
    });
});

router.get('/years', (req, res, next) => {
  MemoryCacheStorage.register('years_v3', () => getYears(), stringToMilliseconds('10d'))
    .then(years => res.json(years))
    .catch(next);
});

router.get('/provincias', (req, res, next) => {
  MemoryCacheStorage.register('provincias_v2', () => getProvincias(), stringToMilliseconds('10d'))
    .then(provincias => res.json(provincias))
    .catch(next);
});

router.get('/blog', (req, res, next) => {
  MemoryCacheStorage.register('blog_posts', () => getBlogPosts(), stringToMilliseconds('1h'))
    .then(posts => res.json(posts))
    .catch(next);
});

router.get('/blog/:slug', (req, res, next) => {
  const { slug } = req.params;
  MemoryCacheStorage.register(`blog_post_${slug}`, () => getBlogPost(slug), stringToMilliseconds('1h'))
    .then(post => res.send(post))
    .catch(next);
});

router.get('/ping', (req, res) => {
  res.json({ message: 'pong pong' });
});

export { router };