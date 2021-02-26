const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.insertImages = () => {
    const q = `SELECT * FROM images`;
    return db.query(q);
};
