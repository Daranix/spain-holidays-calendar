import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import express from 'express';
import { router as apiRouter } from '../server/application/api';

// Create an isolated Express application mounting the API router
const app = express();
app.use(express.json());
app.use('/api', apiRouter);

describe('API Integration Test Suite (Supertest)', () => {

  describe('GET /api/ping', () => {
    it('should return 200 and pong message', async () => {
      const res = await request(app).get('/api/ping');
      assert.strictEqual(res.status, 200);
      assert.deepStrictEqual(res.body, { message: 'pong pong' });
    });
  });

  describe('GET /api/provincias', () => {
    it('should return 200 with all 52 Spanish provinces without .htm in ids', async () => {
      const res = await request(app).get('/api/provincias');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body), 'Response should be an array');
      assert.strictEqual(res.body.length, 52, 'Should return exactly 52 provinces');

      // Verify each item structure and clean id
      for (const prov of res.body) {
        assert.ok(prov.id && typeof prov.id === 'string', 'Province id must be string');
        assert.ok(prov.label && typeof prov.label === 'string', 'Province label must be string');
        assert.ok(!prov.id.includes('.htm'), `Province id "${prov.id}" must not contain .htm`);
        assert.ok(!prov.id.includes('calendarios-laborales'), `Province id "${prov.id}" must not contain URL prefix`);
      }

      // Check notable provinces
      const madrid = res.body.find((p: { id: string }) => p.id === 'madrid');
      assert.ok(madrid, 'Madrid should be present');
      assert.strictEqual(madrid.label, 'Madrid');

      const alava = res.body.find((p: { id: string }) => p.id === 'alava');
      assert.ok(alava, 'Álava should be present');
      assert.strictEqual(alava.label, 'Álava');
    });
  });

  describe('GET /api/years', () => {
    it('should return 200 with grouped years list', async () => {
      const res = await request(app).get('/api/years');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body));
      assert.ok(res.body.length > 10, 'Should return a comprehensive list of years');

      const currentYear = new Date().getFullYear();
      const currentYearEntry = res.body.find((y: { year: number }) => y.year === currentYear);
      assert.ok(currentYearEntry, 'Current year must be in the list');
      assert.strictEqual(currentYearEntry.groupName, 'Año actual');
    });
  });

  describe('GET /api/festivos/:provincia/:year', () => {
    it('should return 200 and 12 months of holidays for Madrid', async () => {
      const res = await request(app).get('/api/festivos/madrid/2026');
      assert.strictEqual(res.status, 200);
      assert.ok(res.body && typeof res.body === 'object');

      const expectedMonths = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];

      for (const month of expectedMonths) {
        assert.ok(Array.isArray(res.body[month]), `Month ${month} should be an array`);
      }

      // January in Madrid has New Year and Epiphany
      const enero = res.body.enero;
      assert.ok(enero.length >= 2, 'January should have holidays');
      const newYear = enero.find((h: { dia: number }) => h.dia === 1);
      assert.ok(newYear, 'Jan 1 should be a holiday');
      assert.strictEqual(newYear.festividad, 'nacional');
    });

    it('should return 200 and correctly resolve mapped province capital (Álava -> Vitoria-Gasteiz)', async () => {
      const res = await request(app).get('/api/festivos/alava/2026');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.enero));
      assert.ok(res.body.enero.length > 0);
    });

    it('should return 200 and correctly resolve mapped province capital (Vizcaya -> Bilbao)', async () => {
      const res = await request(app).get('/api/festivos/vizcaya/2026');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.enero));
      assert.ok(res.body.enero.length > 0);
    });

    it('should return 200 and holidays for future supported years (e.g. 2027)', async () => {
      const res = await request(app).get('/api/festivos/madrid/2027');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.enero));
      assert.ok(res.body.enero.length > 0, '2027 should have January holidays');
    });

    it('should handle legacy uncleaned slug gracefully without returning 404', async () => {
      const res = await request(app).get('/api/festivos/calendarios-laborales-2026-provincia-de-madrid.htm/2026');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.enero));
      assert.ok(res.body.enero.length > 0);
    });

    it('should return local holidays (festividad: local) for provinces', async () => {
      const resMadrid = await request(app).get('/api/festivos/madrid/2026');
      assert.strictEqual(resMadrid.status, 200);
      const allMadrid = Object.values(resMadrid.body).flat() as Array<{ dia: number; nameFestividad: string; festividad: string }>;
      const localMadrid = allMadrid.filter(h => h.festividad === 'local');
      assert.strictEqual(localMadrid.length, 2, 'Madrid should have exactly 2 local holidays');
      assert.ok(localMadrid.some(h => h.nameFestividad.includes('San Isidro')), 'Madrid must include San Isidro');
      assert.ok(localMadrid.some(h => h.nameFestividad.includes('Almudena')), 'Madrid must include Almudena');

      const resBarcelona = await request(app).get('/api/festivos/barcelona/2026');
      assert.strictEqual(resBarcelona.status, 200);
      const allBarcelona = Object.values(resBarcelona.body).flat() as Array<{ dia: number; nameFestividad: string; festividad: string }>;
      const localBarcelona = allBarcelona.filter(h => h.festividad === 'local');
      assert.strictEqual(localBarcelona.length, 2, 'Barcelona should have exactly 2 local holidays');
      assert.ok(localBarcelona.some(h => h.nameFestividad.includes('Mercè')), 'Barcelona must include La Mercè');
    });

    it('should return 404 or 500 with descriptive error for non-existent province', async () => {
      const res = await request(app).get('/api/festivos/provincia-totalmente-falsa-xyz/2026');
      assert.ok(res.status >= 400, 'Status should be error code >= 400');
      assert.ok(res.body.message, 'Response should contain error message');
      assert.ok(res.body.message.includes('Error when trying to get the data'));
    });
  });

  describe('GET /api/blog', () => {
    it('should return 200 with list of blog posts', async () => {
      const res = await request(app).get('/api/blog');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body));
      if (res.body.length > 0) {
        const post = res.body[0];
        assert.ok(post.slug);
        assert.ok(post.title);
      }
    });
  });

});

