
import { MemoryCacheStorage } from '../infrastructure/cache-manager';
import { findFestivosProvincia, getProvincias, getYears } from '../infrastructure/operations';
import express from 'express';
import { HttpError, stringToMilliseconds } from '../utils';

const router = express.Router();

router.get('/festivos/:provincia/:year', (req, res, next) => {
  const { year, provincia } = req.params;
  const key = `${provincia}-${year}-festivos`;
  MemoryCacheStorage.register(key, () => findFestivosProvincia(provincia, Number.parseInt(year)), stringToMilliseconds('10d'))
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
  MemoryCacheStorage.register('provincias', () => getProvincias(), stringToMilliseconds('10d'))
    .then(provincias => res.json(provincias))
    .catch(next);
});
router.get('/ping', (req, res) => {
  res.json({ message: 'pong pong' });
});

export { router };