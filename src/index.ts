import express from "express";

//initiate app
const app = express();
const Port = process.env.PORT || 8080;

app.listen(Port, () => {
  console.log(`Server listening on http://localhost:${Port}/`);
});
