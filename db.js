const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = () => {
    const q = `SELECT * FROM images
    ORDER BY id DESC`;
    return db.query(q);
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
