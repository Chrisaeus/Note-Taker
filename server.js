const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile("db/db.json", "utf8", (err, data) =>
    err ? console.error(err) : res.json(JSON.parse(data))
  );
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuidv4()
    };

    fs.readFile("db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(newNote);
        fs.writeFile("db/db.json", JSON.stringify(parsedData, null, 4), (err) => 
          err ? console.error(err) : console.info("Note saved.")
        );
      };
    });

    res.json("Note saved.");
  } else {
    res.error("Error in adding note")
  };
});

app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const result = JSON.parse(data).filter((note) => note.id !== noteId);
      fs.writeFile("db/db.json", JSON.stringify(result, null, 4), (err) => 
        err ? console.error(err) : console.info("Note deleted.")
      );

      res.json("Note deleted.");
    };
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});