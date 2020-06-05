import { Request, Response, response } from "express";
import knex from "../database/connection";

class LocationsController {
  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;

    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const locations = await knex("locations")
      .join(
        "locations_items",
        "locations.id",
        "=",
        "locations_items.location_id"
      )
      .whereIn("locations_items.item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("locations.*");

    const serializedLocations = locations.map((location) => {
      return {
        ...location,
        image_url: `http://192.168.0.5:3333/uploads/${location.image}`,
      };
    });

    return res.json(serializedLocations);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const location = await knex("locations").where("id", id).first();

    if (!location) {
      return response.status(400).json({ message: "Location not found." });
    }

    const serializedLocation = {
      ...location,
      image_url: `http://192.168.0.5:3333/uploads/${location.image}`,
    };

    const items = await knex("items")
      .join("locations_items", "items.id", "=", "locations_items.item_id")
      .where("locations_items.location_id", id)
      .select("items.title");

    return res.json({ location: serializedLocation, items });
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
      image: req.file.filename,
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

    const locationItems = items
      .split(",")
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
        return {
          item_id,
          location_id,
        };
      });

    await trx("locations_items").insert(locationItems);

    await trx.commit();

    return res.json({
      id: location_id,
      ...location,
    });
  }
}

export default LocationsController;
