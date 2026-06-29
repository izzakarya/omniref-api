import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCountries, getStatesOfCountry, getCitiesOfState } from '@countrystatecity/countries';
import dataIcdDental from './data/icd-dental.json'

const app = new Hono()

// Nyalakan CORS
app.use('/api/*', cors())

// Endpoint Utama
app.get('/', (c) => c.text('Lexicon API is running! 🚀'))

// Endpoint Negara (Gunakan async)
app.get("/api/countries", async (c) => {
  // Karena ini Promise, kita tunggu (await) hasilnya terlebih dahulu
  const rawCountries = await getCountries();
  
  // Setelah data didapat, baru kita petakan (map) sesuai kebutuhan
  const countries = rawCountries.map((country) => ({
    code: country.isoCode,
    name: country.name,
    phonecode: country.phonecode,
    flag: country.flag
  }));
  
  return c.json(countries);
});

// Endpoint Dropdown Kota / Provinsi (Gunakan async)
app.get('/api/cities', async (c) => {
  const countryCode = c.req.query('country');
  const stateCode = c.req.query('state');

  if (!countryCode) {
    return c.json({ error: "Query parameter 'country' (ISO Code) diperlukan" }, 400);
  }

  // Jika ada parameter state, ambil kotanya. Jika tidak, ambil daftar provinsi/state.
  if (stateCode) {
    const cities = await getCitiesOfState(countryCode, stateCode);
    return c.json(cities);
  } else {
    const states = await getStatesOfCountry(countryCode);
    return c.json(states);
  }
});

// Endpoint Dropdown ICD (Tetap sync tidak apa-apa karena hanya baca file JSON lokal)
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