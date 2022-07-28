const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  logging: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.disLikePost = require("./dislike.js")(sequelize, Sequelize);
db.likePost = require("./like.js")(sequelize, Sequelize);
db.userOnline = require("./userOnline.js")(sequelize, Sequelize);
db.posts = require("./post.js")(sequelize, Sequelize); // ont recupere les models
db.users = require("./user.js")(sequelize, Sequelize);
db.comments = require("./comment.js")(sequelize, Sequelize);

db.users.hasMany(db.posts, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "posts",
}); // Nous utilisons hasMany pour que l'user puisssent avoir plusieur posts
db.posts.belongsTo(db.users, {
  // Nous utilisons belongsTo pour que le post n'est que un user
  foreignKey: "userId",

  as: "user",
});

db.posts.hasMany(db.comments, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "comments",
}); // un poste peut avoir plusieurs commentaire
db.comments.belongsTo(db.posts, {
  // Le commentaire ne peut avoir que un seul post
  foreignKey: "postId",
  as: "post",
});
/*
db.likePost.belongsTo(db.users, { onDelete: "CASCADE", onUpdate: "CASCADE", as: "user", foreignKey: "userId"});
db.users.hasMany(db.likePost, { onDelete: "CASCADE", onUpdate: "CASCADE", as: "like"});*/

db.users.hasMany(db.comments, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "comments",
}); // un user peut avoir plusieur commentaire
db.comments.belongsTo(db.users, {
  // un commentaire peut avoir que un seul user
  foreignKey: "userId",
  as: "user",
});

db.users.hasMany(db.comments);
db.comments.belongsTo(db.users);

db.sequelize.sync({ alter: true });

module.exports = db;
