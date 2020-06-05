import express, { response } from "express";

import multer from "multer";
import multerConfig from "./config/multer";

import LocationsController from "./controllers/locationsController";
import ItemsController from "./controllers/itemsController";

const routes = express.Router();
const upload = multer(multerConfig);

const locationsController = new LocationsController();
const itemsController = new ItemsController();

routes.get("/items", itemsController.index);

routes.post("/locations", upload.single("image"), locationsController.create);
routes.get("/locations", locationsController.index);
routes.get("/locations/:id", locationsController.show);

export default routes;
