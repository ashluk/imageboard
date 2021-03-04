const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
app.use(express.static("public"));
app.use(express.json());

//////////ADD IMAGES////////////////////

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("hit thie s3 route");
    const { title, username, description } = req.body;
    const { filename } = req.file;

    const fullUrl = "https://s3.amazonaws.com/indreamsimages/" + filename;
    //console.log("fullurl", fullUrl);
    const imgObject = {
        url: fullUrl,
        username: username,
        title: title,
        description: description,
    };
    console.log("imgObject in server", imgObject);

    db.addImages(fullUrl, username, title, description)
        .then(({ rows }) => {
            //console.log("rows.id", rows);
            let id = rows;
            console.log("id", id);
            res.json({
                imgObject: imgObject,
                id: id,
                success: true,
            });
            console.log("rows in s3upload", rows);
        })
        .catch((err) => {
            console.log("err in addImages", err);
        });
});
////////////////GET IMAGES///////////////////
app.get("/images", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            //console.log("returned from get images rows", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("err in get images", err);
        });
});
/////////////GET MORE IMAGES//////////////////
app.get("/more/:lowestId", (req, res) => {
    console.log("req.params in get more", req.params.lowestId);
    const lowestId = req.params.lowestId;
    db.getMoreImages(lowestId)
        .then(({ rows }) => {
            res.json(rows);
            console.log("rows in get more", rows);
        })
        .catch((err) => {
            console.log("err in get more images", err);
        });
});

//////////////////GET SELECTED IMAGE/////////////////
app.get("/images/:id", (req, res) => {
    db.getClickedImage(req.params.id)

        .then(({ rows }) => {
            //console.log("req.params", req.params);

            console.log("returned from get images/:id", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("err in get images", err);
        });
});
////////////////COMMENTS///////////////////////////

app.get("/get-comments/:id", (req, res) => {
    console.log("req.params in get comments", req.params);
    const { id } = req.params;
    console.log("the value of id", id);
    db.getComments(id)
        .then(({ rows }) => {
            console.log("getting comments", rows);
            res.json(rows);
        })

        .catch((err) => {
            console.log("err in getComments GET ROUTE", err);
        });
});
app.post("/comment", (req, res) => {
    console.log("req.body in get ", req.body);

    const { comment, username, id } = req.body;

    db.addComments(username, comment, id)
        .then(({ rows }) => {
            console.log("adding comments in server", rows);
            res.json({
                comment: comment,
                username: username,
            });
        })
        .catch((err) => {
            console.log("err in getComments POST ROUTE", err);
        });
});

app.listen(8080, () => console.log("imageboard server running"));

///////////////////////////ENCOUNTER//////////////////////////////////
/*const cities = [
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
app.post("/upload", uploader.single("file"), (req, res) => {
    console.log("hit the post route....");
    console.log("req.file: ", req.file);
    console.log("req.body: ", req.body);
    if (req.file) {
        res.json({
            success: true,
        });
    } else {
        res.json({
            success: false,
        });
    }
});*/
