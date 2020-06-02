import express, { response } from "express";

const app = express();

app.use(express.json());

const users = ["Diego", "Cleiton", "Robson"];

app.get("/users", (req, res) => {
  const search = String(req.query.search);

  const filteredUsers = search
    ? users.filter((user) => user.includes(search))
    : users;

  res.json(filteredUsers);
});

app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);

  const user = users[id];

  return res.json(user);
});

app.post("/users", (req, res) => {
  const data = req.body;

  const user = {
    name: data.name,
    email: data.email,
  };

  return res.json(user);
});

app.listen(3333);
