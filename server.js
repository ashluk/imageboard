const express = require("express");
const app = express();
const db = require("./db");
/*const hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");*/
app.use(express.static("public"));

const cities = [
    {
        id: 1,
        name: "Amsterdam",
        country: "holland",
    },
    {
        id: 2,
        name: "Berlin",
        country: "Germany",
    },
    {
        id: 3,
        name: "Venice",
        country: "Italy",
    },
];

app.get("/cities", (req, res) => {
    console.log("hit the get route");
    res.json(cities);
});
app.get("/images", (req, res) => {
    db.insertImages()
        .then(({ rows }) => {
            console.log("returned from get images rows", rows);
            res.render("images", {});
        })
        .catch((err) => {
            console.log("err in get images", err);
        });
});

app.listen(8080, () => console.log("imageboard server running"));
