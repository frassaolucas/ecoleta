import express, { response } from "express";
import knex from "./database/connection";

const routes = express.Router();

routes.get("/items", async (req, res) => {
  const items = await knex("items").select("*");

  const serializedItems = items.map((item) => {
    return {
      id: item.id,
      title: item.title,
      image_url: `http://localhost:3333/uploads/${item.image}`,
    };
  });

  return res.json(serializedItems);
});

routes.post("/locations", async (req, res) => {
  const {
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
    items,
  } = req.body;

  await knex("locations").insert({
    image: "image-fake",
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
  });

  return res.json({ success: true });
});

export default routes;
