import { Request, Response } from "express";
import knex from "../database/connection";

class LocationsController {
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
