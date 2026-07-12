import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  getCountries,
  getStatesOfCountry,
  getCitiesOfState,
  ICountry,
} from "@countrystatecity/countries";
import dataIcdDental from "./data/icd-dental.json";
import dataPaymentMethods from "./data/payment-methods.json";
import dataUOMs from "./data/unit-of-measures.json";
import dataProductCategories from "./data/product-categories.json";

const app = new Hono();

// Nyalakan CORS
app.use("/api/*", cors());

// Endpoint Utama
app.get("/", (c) => c.text("Service is running! 🚀"));

app.get("/api/countries", async (c) => {
  const rawCountries = await getCountries();

  if (!rawCountries) {
    return c.json({ error: "Gagal mengambil data negara" }, 500);
  }

  const countries = rawCountries.map((country: ICountry) => ({
    code: country.iso2,
    name: country.name,
    native: country.native,
    phonecode: country.phonecode,
    flag: country.emoji,
  }));

  return c.json(countries);
});

// Endpoint Dropdown Kota / Provinsi (Hapus juga async/await di sini)
app.get("/api/cities", (c) => {
  const countryCode = c.req.query("country");
  const stateCode = c.req.query("state");

  if (!countryCode) {
    return c.json(
      { error: "Query parameter 'country' (ISO Code) diperlukan" },
      400,
    );
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
app.get("/api/icd-dental", (c) => {
  const search = c.req.query("search")?.toLowerCase();

  if (search) {
    const filtered = dataIcdDental.filter(
      (item) =>
        item.code.toLowerCase().includes(search) ||
        item.name.toLowerCase().includes(search),
    );
    return c.json(filtered);
  }

  return c.json(dataIcdDental);
});

// Endpoint Dropdown Payment Method
app.get("/api/payment-method", (c) => {
  const search = c.req.query("search")?.toLowerCase();

  if (search) {
    const filtered = dataPaymentMethods.filter(
      (item) =>
        item.code.toLowerCase().includes(search) ||
        item.name.toLowerCase().includes(search),
    );
    return c.json(filtered);
  }

  return c.json(dataPaymentMethods);
});

// Endpoint Dropdown UOM
app.get("/api/uom", (c) => {
  const search = c.req.query("search")?.toLowerCase();

  if (search) {
    const filtered = dataUOMs.filter(
      (item) =>
        item.code.toLowerCase().includes(search) ||
        item.name.toLowerCase().includes(search),
    );
    return c.json(filtered);
  }

  return c.json(dataUOMs);
});

// Endpoint Dropdown Product Categories
app.get("/api/product-categories", (c) => {
  const search = c.req.query("search")?.toLowerCase();

  if (search) {
    const filtered = dataProductCategories.filter(
      (item) =>
        item.code.toLowerCase().includes(search) ||
        item.name.toLowerCase().includes(search),
    );
    return c.json(filtered);
  }

  return c.json(dataProductCategories);
});

export default app;
