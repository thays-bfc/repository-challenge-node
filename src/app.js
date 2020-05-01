const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkRepositoryExists (request, response, next) {
  const { id } = request.params;
  var repository = repositories.find(r => r.id === id);
  if (!repository) {
    return response.status(400).json({ error: "Repository not found" });
  }
  request.repository=repository;

   return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository =
  {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", checkRepositoryExists,(request, response) => {

  const { title, url, techs } = request.body;

  request.repository.title = title;
  request.repository.url = url;
  request.repository.techs = techs;

  return response.status(200).json(request.repository);
});

app.delete("/repositories/:id", checkRepositoryExists, (request, response) => {
  
  const index = repositories.findIndex(r => r.id === request.repository.id);

  repositories.splice(index,1);

  return response.status(204).json(repositories);
});

app.post("/repositories/:id/like", checkRepositoryExists, (request, response) => {
  request.repository.likes +=1;
  return response.status(200).json(request.repository);
});

module.exports = app;
