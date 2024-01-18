const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const nodemailer = require("nodemailer");
const UserModel = require("../db/models/user");
const CountryModel = require("../db/models/country");
const BlogModel = require("../db/models/blog");
const DestinationModel = require("../db/models/destination");
require("../db/config");

const router = express.Router();

//routes for user

router.post("/adminlogin", (req, res) => {
  if (
    req.body.email == process.env.ADMIN &&
    req.body.password == process.env.pass
  ) {
    res.status(200).json("success");
  } else {
    res.status(201).json("Invalid Access");
  }
});
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/Images");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

// route for user registration
router.post("/user/register", upload.single("file"), (req, res) => {
  const { file } = req;
  sharp(file.path)
    .resize({ width: 400, height: 400, fit: "fill" })
    .toFile(`public/ProfilePic/${file.filename}`, (err, info) => {
      if (err) {
        return res.status(500).json({ error: `${err}` });
      }
      const user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        mobile: req.body.mobile,
        profile_pic: file.filename,
      });

      user
        .save()
        .then((response) => {
          res.status(201).json(response);
        })
        .catch((error) => console.log(err));
    });
});

router.get("/users", (req, res) => {
  UserModel.find()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/login", (req, res) => {
  UserModel.findOne({ email: req.body.email, password: req.body.password })
    .then((user) => res.json(user))
    .catch((err) => console.log(err));
});
router.delete("/users/delete/:id", (req, res) => {
  UserModel.deleteOne({ _id: req.params.id })
    .then((response) => res.status(200).json(response))
    .catch((error) => console.log(error));
});

//routes for Country

const storageCountry = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/Country");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadCountry = multer({
  storage: storageCountry,
});
router.post("/country/register", uploadCountry.single("file"), (req, res) => {
  const country = new CountryModel({
    name: req.body.name,shortDescription:req.body.shortDescription,
    description: req.body.description,
    image: req.file.filename,
  });

  country
    .save()
    .then((response) => res.send(response))
    .catch((err) => console.log(err));
});

router.get("/country/get", (req, res) => {
  CountryModel.find()
    .then((response) => res.send(response))
    .catch((err) => console.log(err));
});

router.delete("/country/delete/:id", (req, res) => {
  CountryModel.deleteOne({ _id: req.params.id })
    .then((response) => res.status(200).json(response))
    .catch((error) => console.log(error));
});

// routes for destinations

const storageDestination = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/Destination");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadDestination = multer({
  storage: storageDestination,
});

router.post(
  "/destinations/register",
  uploadDestination.single("file"),
  (req, res) => {
    const { file } = req;
    const destination = new DestinationModel({
      name: req.body.name,
      country: req.body.country,
      shortDescription: req.body.shortDescription,
      longDescription: req.body.longDescription,
      rating: req.body.rating,
      cost: req.body.cost,
      duration: req.body.duration,
      image: file.filename,
    });

    destination
      .save()
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    // console.log(req.body)
  }
);

router.get("/destinations", (req, res) => {
  DestinationModel.find()
    .then((response) => res.send(response))
    .catch((err) => console.log(err));
});

router.delete("destinations/delete/:id", (req, res) => {
  DestinationModel.deleteOne({ _id: req.params.id })
    .then((response) => res.status(200).json(response))
    .catch((error) => console.log(error));
});

// routes for blog

const storageBlog = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/Images");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadBlog = multer({
  storage: storageBlog,
});

router.post("/blog/register", uploadBlog.single("file"), (req, res) => {
  const { file } = req;
  sharp(file.path)
    .resize({ width: 800, height: 400, fit: "fill" })
    .toFile(`public/Blog/${file.filename}`, (err, info) => {
      if (err) {
        return res.status(500).json({ error: `${err}` });
      }
      const blog = new BlogModel({
        user: process.env.ADMIN_ID,
        country: req.body.country,
        destination: req.body.destination,
        blogTitle: req.body.title,
        blogDescription: req.body.description,
        image: file.filename,
      });

      blog
        .save()
        .then((response) => {
          res.status(201).json(response);
        })
        .catch((error) => console.log(err));
    });
});

router.get("/blogs", (req, res) => {
  BlogModel.find()
    .then((response) => res.status(200).send(response))
    .catch((err) => console.log(err));
});

router.delete("/blog/delete/:id", (req, res) => {
  BlogModel.deleteOne({ _id: req.params.id })
    .then((response) => res.send(response))
    .catch((err) => console.log(err));
});

router.post("/otp/:email", (req, res) => {
  let otp = Math.floor(Math.random() * 10000);

  if (otp < 2000) {
    otp += 1000;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: req.params.email,
    subject: "OTP for forgot password",
    text: `Hii , this is from NatureTour \nYour Otp is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json("Error:", error);
    }
    res.status(200).json(otp);
  });
});

router.post("/reset/:email", (req, res) => {
  UserModel.updateOne(
    { email: req.params.email },
    { $set: { password: req.body.password } }
  )
    .exec()
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(500));
});

module.exports = router;
