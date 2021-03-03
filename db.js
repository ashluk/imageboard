const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = () => {
    const q = `SELECT * FROM images
    ORDER BY id DESC
    LIMIT 6`;
    return db.query(q);
};

module.exports.getClickedImage = (id) => {
    const q = `SELECT * FROM images WHERE id = $1`;
    const params = [id];
    return db.query(q, params);
};

module.exports.addImages = (url, username, title, description) => {
    const q = `
    INSERT INTO images (url, username, title, description)
    VALUES  ($1, $2, $3, $4)
    RETURNING id
      `;
    const params = [url, username, title, description];
    return db.query(q, params);
};
///////////MORE IMAGES///////////////////

module.exports.getMoreImages = (lastId) => {
    const q = `SELECT * FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 10`;
    const params = [lastId];
    return db.query(q, params);
};

/////////////COMMENTS////////////////////
module.exports.getComments = (id) => {
    const q = `SELECT * FROM comments WHERE imageid = $1`;
    const params = [id];
    return db.query(q, params);
};
module.exports.addComments = (comment, username, id) => {
    const q = `
    INSERT INTO comments (comment, username, id)
    VALUES  ($1, $2, $3)
    RETURNING id
      `;
    const params = [comment, username, id];
    return db.query(q, params);
};
