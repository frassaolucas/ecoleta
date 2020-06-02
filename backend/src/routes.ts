import express, { response } from "express";

import LocationsController from "./controllers/locationsController";
import ItemsController from "./controllers/itemsController";

const routes = express.Router();
const locationsController = new LocationsController();
const itemsController = new ItemsController();

routes.get("/items", itemsController.index);

routes.post("/locations", locationsController.create);
routes.get("/locations", locationsController.index);
routes.get("/locations/:id", locationsController.show);

export default routes;
