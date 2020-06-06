import express, { response } from "express";
import { celebrate, Joi } from "celebrate";

import multer from "multer";
import multerConfig from "./config/multer";

import LocationsController from "./controllers/locationsController";
import ItemsController from "./controllers/itemsController";

const routes = express.Router();
const upload = multer(multerConfig);

const locationsController = new LocationsController();
const itemsController = new ItemsController();

routes.get("/items", itemsController.index);

routes.post(
  "/locations",
  upload.single("image"),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  locationsController.create
);
routes.get("/locations", locationsController.index);
routes.get("/locations/:id", locationsController.show);

export default routes;
