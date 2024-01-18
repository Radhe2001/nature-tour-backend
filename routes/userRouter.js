const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const UserModel = require("../db/models/user");
const CountryModel = require("../db/models/country");
const BlogModel = require("../db/models/blog");
const DestinationModel = require("../db/models/destination");
const ContactModel = require("../db/models/contact");
require("../db/config");

const router = express.Router();

router.get("/home", (req, res) => {
  CountryModel.aggregate([{ $sample: { size: 6 } }])
    .then((country) => {
      DestinationModel.aggregate([{ $sample: { size: 3 } }])
        .then((destination) => {
          res.status(200).json({ country: country, destination: destination });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/destination", (req, res) => {
  DestinationModel.find()
    .then((response) => res.json(response))
    .catch((err) => console.log(err));
});

router.post("/contact", (req, res) => {
  const contact = new ContactModel({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    queryDetail: req.body.queryDetail,
  });

  contact
    .save()
    .then((response) => res.status(200).json(response))
    .catch((err) => console.log(err));
});

router.get("/count/dest/:id", (req, res) => {
  CountryModel.findOne({ _id: req.params.id })
    .then((country) => {
      DestinationModel.find({ country: country.name })
        .then((destination) => {
          res.status(200).json(destination);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.get("/dest/:id", (req, res) => {
  DestinationModel.findOne({ _id: req.params.id })
    .then((dest) => {
      BlogModel.findOne({ destination: dest.name })
        .then((blog) => {
          UserModel.findOne({ _id: blog.user })
            .then((user) =>
              res
                .status(200)
                .json({ destination: dest, blog: blog, user: user })
            )
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.error(err));
});

router.get("/blog/get/:page", async (req, res) => {
  BlogModel.countDocuments({}).then((num) => {
    BlogModel.paginate(
      {},
      {
        page: Math.floor(num / 3) + 1 - req.params.page,
        limit: 3,
        populate: "user",
      }
    )
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => console.log(err));
  });
});

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
        user: req.body.id,
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
module.exports = router;
