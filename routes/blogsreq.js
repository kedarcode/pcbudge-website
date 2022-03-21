var hoja = require("../database");
const db = hoja.db;

const express = require("express");
const router = express.Router();

// send blogs in our database
router.get("/getblogs", async (req, res) => {
  res.json({
    blogs: await db.query("select * from blogs ORDER BY id DESC;", 0, (error, result) => {
      if (error) {
        return 502;
      } else {
        return result;
      }
    }),
  });
});
// render homepage
router.get("/", (req, res) => {
  res.render("blogs/blog");
});

//render create blog pagae
router.get("/createblog", (req, res) => {
  res.render("blogs/createblog");
});
// upload blog in our database
router.post("/uploadblog", async (req, res) => {
  res.json({ status: 200 });
  db.query(
    "INSERT INTO blogs (date,title, blog) VALUES (?, ?,?)",
    [req.body.create_date, req.body.title, req.body.content],
    (error, result) => {
      if (error) {
        res.json({ status: 502 });
      } else {
        res.json({ status: 200 });
      }
    }
  );
});

//update blog 
router.patch("/updateblog", async (req, res) => {
  res.json({ status: 200 });
  db.query(
    "UPDATE blogs SET title=?,blog=?,date=? WHERE id=?;",
    [ req.body.title, req.body.content, req.body.create_date,req.body.id],
    (error, result) => {
      if (error) {
        res.json({ status: 502 });
      } else {
        res.json({ status: 200 });
      }
    }
  );
});
//delete blog from database
router.delete("/deleteblog", (req, res) => {
  db.query("DELETE FROM blogs WHERE id=?;", [req.body.id], (error, result) => {
    if (error) {
      res.json({ status: 502 });
    } else {
      res.json({ status: 200 });
    }
  });
  res.json({ status: 200 });
});
//rende open blog page
router.get("/openblog", (req, res) => {
  res.render("blogs/openblog", { dat: req.query.id });
});
//send data of blog
router.get("/sing_blog", async (req, res) => {
  res.json({
    blogs: await db.query("select * from blogs where id=?", req.query.id, (error, result) => {
      if (error) {
        return 502;
      } else {
        return result;
      }
    }),
  });
});
module.exports = router;
