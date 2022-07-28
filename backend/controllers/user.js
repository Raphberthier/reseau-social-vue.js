const bcrypt = require("bcrypt");
var passwordValidator = require("password-validator");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.users;
const UserOnline = db.userOnline;
const fs = require("fs");

var schema = new passwordValidator();
schema
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(2)
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]);

// ENREGISTREMENT D'UN USER
exports.signup = (req, res) => {
  let password = req.body.password;
  if (
    req.body.email == null ||
    req.body.lastName == null ||
    req.body.firstName == null ||
    password == null
  ) {
    res.status(400).json({ error: "Tous les champs sont obligatoires" });
  }

  User.findOne({
    //Ont verifie si l'email existe deja dans la DB

    attributes: ["email"],
    where: { email: req.body.email },
  }).then((user) => {
    if (!user) {
      // si il n'existe pas ont cree l'utilisateur
      bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
          User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            admin: false,
            image:
              " http://localhost:3000/images/james-webb-et-voici-les-premieres-images-1.webp",
            password: hash,
          }).then((users) =>
            res.status(200).json({
              admin: users.admin,
              userId: users.id,
              token: jwt.sign(
                { userId: users.id, admin: users.admin },
                process.env.JWT_KEY,
                { expiresIn: "24h" }
              ),
            })
          );
        })
        .catch((error) => res.status(500).json({ error }));
    } else {
      //si l'email est deja inscrit dans la DB ont affiche un message d'erreur
      res.status(400).json({ error: "Cet utilisateur existe déjà" });
    }
  });
};

// CONNEXION DE L'USER
exports.login = (req, res, next) => {
  User.findOne({
    where: { email: req.body.email },
  }).then((users) => {
    if (!users) {
      return res.status(401).json({ error: "Utilisateur non trouvé !" });
    }
    bcrypt
      .compare(req.body.password, users.password)
      .then((valid) => {
        if (!valid) {
          return res.status(401).json({ error: "Mot de passe incorrect !" });
        }
        res.status(200).json({
          admin: users.admin,
          userId: users.id,
          image: users.image,
          token: jwt.sign(
            { userId: users.id, admin: users.admin },
            process.env.JWT_KEY,
            { expiresIn: "24h" }
          ),
        });
      })
      .catch((error) => res.status(500).json({ error }));
  });
};

// RECUPERATION D'UN USER
exports.getOneUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })

    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(404).json({ error }));
};

// RECUPERATION DE TOUT LES USERS
exports.getAllUsers = (req, res, next) => {
  User.findAll({
    attributes: ["id", "email", "firstName", "lastName", "admin", "image"],
  })
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(400).json({ error }));
};

//ajout ou modification de l'image de profil

/*exports.updateImage = (req, res, next) => {
  User.findOne({ where: { id: req.params.id} }).then((user) => {
    let userId = user.id;
    if (req.token === userId || req.admin === true ) {
      if(req.file && user.imageUrl){
      
        User.update(
          {
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
          }
          
        )
      }
    
    }
  })
}*/

//MODIFICATION DE L'USER
exports.updateUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } }).then((user) => {
    let userId = user.id;
    if (req.token === userId || req.admin === true) {
      try {
        User.update(
          {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            image: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
            admin: req.body.admin,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        );

        return res.status(200).send({
          message: "Compte modifiée",
        });
      } catch (err) {
        return res.status(506).json(err);
      }
    } else {
      res.status(400).json({ error: "Vous n'avait pas la permission" });
    }
  });
};
/*
exports.updateUser = (req, res, next) => {
  // modifier le profil
  const id = req.params.id;
  try {
    const userId = token.getUserId(req);
    let newPhoto;
    let user =  db.User.findOne({ where: { id: id } }); // on trouve le user
    if (userId === user.id) {
      if (req.file && user.imageUrl) {
        newPhoto = `${req.protocol}://${req.get("host")}/api/upload/${
          req.file.filename
        }`;
        const filename = user.imageUrl.split("/upload")[1];
        fs.unlink(`upload/${filename}`, (err) => {
          // s'il y avait déjà une photo on la supprime
          if (err) console.log(err);
          else {
            console.log(`Deleted file: upload/${filename}`);
          }
        });
      } else if (req.file) {
        newPhoto = `${req.protocol}://${req.get("host")}/api/upload/${
          req.file.filename
        }`;
      }
      if (newPhoto) {
        user.imageUrl = newPhoto;
      }
      if (req.body.lastName) {
        user.lastName = req.body.lastName;
      }
      if (req.body.firstName) {
        user.firstName = req.body.firstName;
      }
      const newUser =  user.save({ fields: ["fisrtName", "lastName", "imageUrl"] }); // on sauvegarde les changements dans la bdd
      res.status(200).json({
        user: newUser,
        messageRetour: "Votre profil a bien été modifié",
      });
    } else {
      res
        .status(400)
        .json({ messageRetour: "Vous n'avez pas les droits requis" });
    }
  } catch (err) {
    return res.status(500).send({ err });
  }
};*/
// SUPPRESSION DE L'USER
exports.deleteUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } }).then((user) => {
    const delUserId = user.id;
    if (req.token === delUserId || req.admin === true) {
      const pathImage =
        " http://localhost:3000/images/james-webb-et-voici-les-premieres-images-1.webp";
      //si l'image de profil part defaut na pas etait modifier ont supprime juste l'user et pas l'image
      if (user.image == pathImage) {
        User.destroy({ where: { id: req.params.id } })
          .then(() => res.status(200).json({ message: "Compte supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        const filename = user.image.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          User.destroy({ where: { id: req.params.id } })
            .then(() => res.status(200).json({ message: "Compte supprimé !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    } else {
      res.status(400).json({ error: "Vous n'avait pas la permission" });
    }
  });
};
///////////////////////////
//////////////////////////
/////////////////////////
//Gestion de la table userOnlines
/////////////////////////
//////////////////////////
///////////////////////////
exports.userOff = (req, res) => {
  UserOnline.findOne({
    attributes: ["userOnline", "id"],
    where: { userOnline: req.token },
  }).then(() => {
    UserOnline.destroy({
      where: { userOnline: req.token },
    })
      .then(() => res.status(200).json({ message: "id supprimé !" }))
      .catch((error) => res.status(400).json({ error }));
  });
};

exports.getAllUserOn = (req, res) => {
  UserOnline.findAll({})
    .then((userOnlines) => res.status(200).json(userOnlines))
    .catch((error) => res.status(400).json({ error }));
};

exports.userOn = (req, res) => {
  UserOnline.findOne({
    attributes: ["id", "userOnline"],
    where: { userOnline: req.body.userOnline },
  }).then((userOnline) => {
    UserOnline.create({
      userOnline: req.body.userOnline,
    })
      .then((response) => {
        res.status(200).send({
          message: "c'est ok l'id",
        });
        console.log(response);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });
};
