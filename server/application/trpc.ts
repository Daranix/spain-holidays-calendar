import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { wrap } from '@typeschema/valibot';
import { number, object, string } from 'valibot';
import { findFestivosProvincia, getProvincias, getYears } from '../infrastructure/operations';
// created for each request
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<Context>().create();
const appRouter = t.router({
  findFestivosProvincia: t.procedure.input(wrap(object({ provincia: string(), year: number() }))).query(async (opts) => {
    const { provincia, year } = opts.input; // string
    return await findFestivosProvincia(provincia, year);
  }),
  getYears: t.procedure.query(async (opts) => {
    return await getYears();
  }),
  getProvincias: t.procedure.query(async (opts) => {
    return await getProvincias();
  }),
});

type AppRouter = typeof appRouter;

export { createContext, appRouter, type AppRouter }