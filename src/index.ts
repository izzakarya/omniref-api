import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCountries, getStatesOfCountry, getCitiesOfState } from '@countrystatecity/countries';
import dataIcdDental from './data/icd-dental.json'

const app = new Hono()

// Nyalakan CORS
app.use('/api/*', cors())

// Endpoint Utama
app.get('/', (c) => c.text('Lexicon API is running! 🚀'))

// Endpoint Negara
app.get("/api/countries", (c) => {
  /*const countries = getCountries().map((country) => ({
    code: country.isoCode,
    name: country.name,
    country.
  }));*/
  const countries = await getCountries();
  return c.json(countries);
});

// Endpoint Dropdown Kota
app.get('/api/cities', (c) => {
  const regencies = await getRegencies({ transform: true });
  return c.json(regencies)
})

// Endpoint Dropdown ICD (Plus Fitur Search/Filter lewat Query)
// Contoh: /api/icd-dental?search=cholera
app.get('/api/icd-dental', (c) => {
  const search = c.req.query('search')?.toLowerCase()

  if (search) {
    const filtered = dataIcdDental.filter(
      (item) =>
        item.code.toLowerCase().includes(search) ||
        item.name.toLowerCase().includes(search)
    )
    return c.json(filtered)
  }

  return c.json(dataIcdDental)
})

export default app