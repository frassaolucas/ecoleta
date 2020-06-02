import express, { response } from "express";
import knex from "./database/connection";

import LocationsController from "./controllers/locationsController";

const routes = express.Router();
const locationsController = new LocationsController();

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

routes.post("/locations", locationsController.create);

export default routes;
