import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCountries, getStatesOfCountry, getCitiesOfState } from '@countrystatecity/countries';
import dataIcdDental from './data/icd-dental.json'

const app = new Hono()

// Nyalakan CORS
app.use('/api/*', cors())

// Endpoint Utama
app.get('/', (c) => c.text('Lexicon API is running! 🚀'))

// Endpoint Negara (Ubah jadi sync, hapus async/await)
app.get("/api/countries", (c) => {
  const rawCountries = getCountries();
  
  if (!rawCountries) {
    return c.json({ error: "Gagal mengambil data negara" }, 500);
  }

  const countries = rawCountries.map((country) => ({
    code: country.isoCode,
    name: country.name,
    phonecode: country.phonecode,
    flag: country.flag
  }));
  
  return c.json(countries);
});

// Endpoint Dropdown Kota / Provinsi (Hapus juga async/await di sini)
app.get('/api/cities', (c) => {
  const countryCode = c.req.query('country');
  const stateCode = c.req.query('state');

  if (!countryCode) {
    return c.json({ error: "Query parameter 'country' (ISO Code) diperlukan" }, 400);
  }

  // HAPUS await di bawah ini
  if (stateCode) {
    const cities = getCitiesOfState(countryCode, stateCode);
    return c.json(cities);
  } else {
    const states = getStatesOfCountry(countryCode);
    return c.json(states);
  }
});

// Endpoint Dropdown ICD
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