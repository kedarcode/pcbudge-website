const express = require('express');
const router=express.Router();
const mb= require("../modules/products_database");
const pro= require("../modules/products_database");
const gp= require("../modules/products_database");
const ram= require("../modules/products_database");
const cases= require("../modules/products_database");
const se = require("../modules/products_database");
const op = require("../modules/products_database");
var mongojs = require("mongojs");
var url = "mongodb://localhost:27017/";
var databaseUrl = "PCBUDGE";
var collections = ["all_Products"];
var db = mongojs(databaseUrl, collections);

router.get("/product/details",async(req,res)=>{ 
    if (req.query.type=="motherboard"){
        const mb_var = await mb.mb_product_details(req.query.uid);
        uid = parseInt(req.query.uid)
        db.all_Products.find({_id:uid}, async function(error, found) {
            if (error) {
              console.log(error);
            }
            else {
                res.json({type:req.query.type,sql:mb_var,mongodb:await found})
            }
          });
    
}
    else if(req.query.type=="processor"){
        const prod_var = await pro.product_details(req.query.uid);
        uid = parseInt(req.query.uid)
        db.all_Products.find({_id:uid}, async function(error, found) {
            if (error) {
              console.log(error);
            }
            else {
                res.json({details:prod_var[0][0],compatible_motherboard:prod_var[1],mongodb:await found})

            }
          });
    }
    else if(req.query.type=="graphic_card"){
        const prod_var = await gp.gp_product_details(req.query.uid);
        uid = parseInt(req.query.uid)
        db.all_Products.find({_id:uid}, async function(error, found) {
            if (error) {
              console.log(error);
            }
            else {
                res.json({type:req.query.type,sql:prod_var,mongodb:await found})

            }
          });
    }
    else if(req.query.type=="ram"){
        const prod_var = await ram.ram_product_details(req.query.uid);
        uid = parseInt(req.query.uid)
        db.all_Products.find({_id:uid}, async function(error, found) {
            if (error) {
              console.log(error);
            }
            else {
                res.json({type:req.query.type,sql:prod_var,mongodb:await found})

            }
          });
    }
    else if(req.query.type=="cases"){
        const prod_var = await ram.case_product_details(req.query.uid);
        uid = parseInt(req.query.uid)
        db.all_Products.find({_id:uid}, async function(error, found) {
            if (error) {
              console.log(error);
            }
            else {
                res.json({type:req.query.type,sql:prod_var,mongodb:await found})

            }
          });
    }

});

module.exports = router;
