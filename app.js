const express = require("express");
const buildTrack = require("./trackService");

const app = express();
const port = 3000;

app.use(express.json());

app.post("/buildTrack", (req, res) => {
  const { route, locations, numberOfLocations } = req.body;

  try {
    const result = buildTrack(route, locations, numberOfLocations).then(_res => {
        console.log(_res);
        res.json(_res);
    });
    
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
