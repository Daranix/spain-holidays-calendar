
import { findFestivosProvincia, getProvincias, getYears } from '../infrastructure/operations';
import express from 'express';

const router = express();

router.get('/festivos/:provincia/:year', async (req, res) => {
  const { year, provincia } = req.params;

  const festivos = await findFestivosProvincia(provincia, Number.parseInt(year));
  res.json(festivos);
});

router.get('/years', async (req, res) => {
  const years = await getYears();
  res.json(years);
});

router.get('/provincias', async (req, res) => {
  const provincias = await getProvincias();
  res.json(provincias);
});

export { router };