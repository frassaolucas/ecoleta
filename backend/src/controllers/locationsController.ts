import { Request, Response, response } from "express";
import knex from "../database/connection";

class LocationsController {
  async show(req: Request, res: Response) {
    const { id } = req.params;

    const location = await knex("locations").where("id", id).first();

    if (!location) {
      return response.status(400).json({ message: "Location not found." });
    }

    const items = await knex("items")
      .join("locations_items", "items.id", "=", "locations_items.item_id")
      .where("locations_items.location_id", id)
      .select("items.title");

    return res.json({ location, items });
  }

  async create(req: Request, res: Response) {
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

    const trx = await knex.transaction();

    const location = {
      image: "image-fake",
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const insertedIds = await trx("locations").insert(location);

    const location_id = insertedIds[0];

    const locationItems = items.map((item_id: number) => {
      return {
        item_id,
        location_id,
      };
    });

    await trx("locations_items").insert(locationItems);

    return res.json({
      id: location_id,
      ...location,
    });
  }
}

export default LocationsController;
