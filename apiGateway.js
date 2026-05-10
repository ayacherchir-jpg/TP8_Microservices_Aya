// apiGateway.js
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express4');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// Charger les fichiers proto pour les films et les séries TV
const movieProtoPath = 'movie.proto';
const tvShowProtoPath = 'tvShow.proto';
const resolvers = require('./resolvers');
const typeDefs = require('fs').readFileSync('./schema.gql', 'utf8');
// Créer une nouvelle application Express
const app = express();
app.use(express.json());
const movieProtoDefinition = protoLoader.loadSync(movieProtoPath, {
keepCase: true,
longs: String,
enums: String,
defaults: true,
oneofs: true,
});
const tvShowProtoDefinition = protoLoader.loadSync(tvShowProtoPath, {
keepCase: true,
longs: String,
enums: String,
defaults: true,
oneofs: true,
});
const movieProto = grpc.loadPackageDefinition(movieProtoDefinition).movie;
const tvShowProto = grpc.loadPackageDefinition(tvShowProtoDefinition).tvShow;
// Créer une instance ApolloServer avec le schéma et les résolveurs importés
const server = new ApolloServer({ typeDefs, resolvers });
// Appliquer le middleware ApolloServer à l'application Express
server.start().then(() => {
app.use('/graphql',
cors(),
express.json(),
expressMiddleware(server),
);
});
app.get('/movies', (req, res) => {
const client = new movieProto.MovieService('localhost:50051',
grpc.credentials.createInsecure());
client.searchMovies({}, (err, response) => {
if (err) {
res.status(500).send(err);
} else {
res.json(response.movies);
}
});
});
app.post("/movies", async (req, res) => {
  const movie = await movieService.createMovie(req.body);
  res.json(movie);
});
app.put("/movies/:id", async (req, res) => {
  const movie = await movieService.updateMovie(req.params.id, req.body);
  res.json(movie);
});
app.delete("/movies/:id", async (req, res) => {
  const result = await movieService.deleteMovie(req.params.id);
  res.json(result);
});
app.get('/movies/:id', (req, res) => {
const client = new movieProto.MovieService('localhost:50051',
grpc.credentials.createInsecure());
const id = req.params.id;
client.getMovie({ movie_id: id }, (err, response) => {
if (err) {
res.status(500).send(err);
} else {
res.json(response.movie);
}
});
});
app.get('/tvshows', (req, res) => {
const client = new tvShowProto.TVShowService('localhost:50052',
grpc.credentials.createInsecure());
client.searchTvshows({}, (err, response) => {
if (err) {
res.status(500).send(err);
} else {
res.json(response.tv_shows);
}
});
});
app.post("/tvshows", async (req, res) => {
  const tv = await tvService.createTvShow(req.body);
  res.json(tv);
});
app.put("/tvshows/:id", async (req, res) => {
  const tv = await tvService.updateTvShow(req.params.id, req.body);
  res.json(tv);
});
app.delete("/tvshows/:id", async (req, res) => {
  const result = await tvService.deleteTvShow(req.params.id);
  res.json(result);
});
app.get('/tvshows/:id', (req, res) => {
const client = new tvShowProto.TVShowService('localhost:50052',
grpc.credentials.createInsecure());
const id = req.params.id;
client.getTvshow({ tv_show_id: id }, (err, response) => {
if (err) {
res.status(500).send(err);
} else {
res.json(response.tv_show);
}
});
});
// Démarrer l'application Express
const port = 3000;
app.listen(port, () => {
console.log(`API Gateway en cours d'exécution sur le port ${port}`);
});