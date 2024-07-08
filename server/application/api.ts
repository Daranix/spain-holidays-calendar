
import { MemoryCacheStorage } from '../infrastructure/cache-manager';
import { findFestivosProvincia, getProvincias, getYears } from '../infrastructure/operations';
import express from 'express';
import { HttpError, stringToMilliseconds } from '../utils';

const router = express();

router.get('/festivos/:provincia/:year', async (req, res) => {
  const { year, provincia } = req.params;
  const key = `${provincia}-${year}-festivos`;
  try {
    const festivos = await MemoryCacheStorage.register(key, () => findFestivosProvincia(provincia, Number.parseInt(year)), stringToMilliseconds('10d'));
    res.json(festivos);
  } catch(ex) {
    const err = ex as HttpError;
    res.status(err.statusCode).json({ message: `Error when trying to get the data: ${err.message}` });
  }

});

router.get('/years', async (req, res) => {
  const years = await MemoryCacheStorage.register('years', () => getYears(), stringToMilliseconds('10d'))
  res.json(years);
});

router.get('/provincias', async (req, res) => {
  const provincias = await MemoryCacheStorage.register('provincias', () => getProvincias(), stringToMilliseconds('10d'));
  res.json(provincias);
});

export { router };