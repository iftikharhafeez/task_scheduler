import { handler } from "./dist/index.js";
import fs from "fs";

// Read and parse JSON file
const data = JSON.parse(fs.readFileSync("./events/test.json"));
const event = {
  ...data,
  body: JSON.stringify(data.body),
};

const context = {};

const callback = (response) => {
  console.log(response, "Callback triggered");
};

handler(event, context, callback)
  .then((response) => console.log({ response }, "All done"))
  .catch((err) => console.log(err, "Something went wrong"));
