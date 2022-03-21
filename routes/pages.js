const express = require("express");
const mb= require("../modules/products_database");
const pro= require("../modules/products_database");
const gp= require("../modules/products_database");
const ram= require("../modules/products_database");
const cases= require("../modules/products_database");
const se = require("../modules/products_database");
const op = require("../modules/products_database");
const sharp=require('sharp');

const router = express.Router();
const product_list=['motherboard','processor','graphic_card','ram']
var mongojs = require("mongojs");
var url = "mongodb://localhost:27017/";
var databaseUrl = "PCBUDGE";
var collections = ["all_Products"];
var db = mongojs(databaseUrl, collections);

db.on("error", function(error) {
    console.log("Database Error:", error);
  });

router.get("/",async (req,res)=>{

    await res.render('homepage',{
        cards:[{
            head:'Motherboard',
            req_type:'Motherboard',
            logo:'/homepage Logos/Motherboard-PNG/MOTHERBOARD-PNG/Motherboard-PNG_00000_00000.png',
            count:await mb.counter('all_motherboard')
        },{
            head:'Processor',
            req_type:'Processor',
            logo:'/homepage Logos/processor1.png',
            count:await mb.counter('all_processors')
        },{
            head:'Graphic Card',
            req_type:'graphic_card',
            logo:'/homepage Logos/graphiccard1.png',
            count:await mb.counter('all_graphic_card')
        },{
            head:'RAM',
            req_type:'ram',
            logo:'/homepage Logos/RAMF1.png',
            count:await mb.counter('all_ram')
        },{
            head:'Cases',
            req_type:'cases',
            logo:'/homepage Logos/cabinet1.png',
            count:await mb.counter('all_chassies')
        }]
    });
    
}    
);

router.get("/list",async (req,res)=>{
    if(req.query.product_type=="motherboard"){
     if((req.query.filter_send).length >2){
        filter_get_attributes = JSON.parse((req.query.filter_send).replace("\\n",""));
        const mb_var = await mb.mblist(req.query.offset,filter_get_attributes); 
        res.json({list:mb_var[0],count:mb_var[1]});
        
     }
     else{
            const mb_var = await mb.mblist(req.query.offset); 
            const filter_attributes=await mb.mb_motherboard_filter();
            res.json({list: mb_var[0],count:mb_var[1],socket:filter_attributes[0],chipset:filter_attributes[1],in_processor:filter_attributes[2],
            northbridge:filter_attributes[3] ,southbridge:filter_attributes[4],mbsizes:filter_attributes[5],brand:filter_attributes[6]})}
}
    else if(req.query.product_type=="processor"){
        if((req.query.filter_send).length>2){
            filter_get_attributes = JSON.parse((req.query.filter_send).replace("\\n",""));
            console.log(JSON.parse((req.query.filter_send).replace("\\n","")))

        const pro_var = await pro.prolist(req.query.offset,filter_get_attributes); 
        res.json({list:pro_var[0],count:pro_var[1]});
        }
        else{
            const pro_var = await pro.prolist(req.query.offset); 
            const filter_attributes=await mb.processor_filter();
            res.json({list: pro_var[0],count:pro_var[1],brand:filter_attributes[0],family:filter_attributes[1],collection:filter_attributes[2],
                platform:filter_attributes[3]})
            }       
    }
    else if(req.query.product_type=="graphic_card"){
        if((req.query.filter_send).length>2){
            filter_get_attributes = JSON.parse((req.query.filter_send).replace("\\n",""));
            console.log(filter_get_attributes)

        const gp_var = await gp.gplist(req.query.offset,filter_get_attributes); 
        res.json({list:gp_var[0],count:gp_var[1]});
        }
        else{
            const gp_var = await gp.gplist(req.query.offset); 
            const filter_attributes=await gp.gp_filter();
            res.json({list: gp_var[0],count:gp_var[1],brand:filter_attributes[0],memory_interface:filter_attributes[1]})
            }       
    }
    else if(req.query.product_type=="ram"){
        if((req.query.filter_send).length>2){
            filter_get_attributes = JSON.parse((req.query.filter_send).replace("\\n",""));

        const ram_var = await ram.ramlist(req.query.offset,filter_get_attributes); 
        res.json({list:ram_var[0],count:ram_var[1]});
        }
        else{
            const ram_var = await ram.ramlist(req.query.offset); 
            const filter_attributes=await ram.ram_filter();
            res.json({list: ram_var[0],count:ram_var[1],brand:filter_attributes[0],series:filter_attributes[1],ram_memory_type:filter_attributes[2]
            ,memory_format:filter_attributes[3]})
            }       
    }
    else if(req.query.product_type=="cases"){
        if((req.query.filter_send).length>2){
            filter_get_attributes = JSON.parse((req.query.filter_send).replace("\\n",""));

        const cas_var = await cases.caselist(req.query.offset,filter_get_attributes); 
        res.json({list:cas_var[0],count:cas_var[1]});
        }
        else{
            const cas_var = await cases.caselist(req.query.offset); 
            const filter_attributes=await cases.case_filter();
            res.json({list: cas_var[0],count:cas_var[1],brand:filter_attributes[0]})
            }       
    }
    
});

router.get("/product",async(req,res)=>{ 
   
     if(req.query.prod_type=="processor"){
        res.render('single_product/processor_single',{prod_uid:req.query.product_id,product_type:req.query.prod_type});
    }
    else{   
        res.render('single_product/motherboard_single',{prod_uid:req.query.product_id,product_type:req.query.prod_type});
        }
   
});

router.get("/signup",(req,res)=>{
    res.render('signup');
});

router.get("/signin",(req,res)=>{
    res.render('signin');
});

router.get("/search/recom",async (req,res)=>{
    const sres= await se.search_recon(req.query.string);
    res.json({data:sres});
});

router.get("/productlist",async(req,res)=>{
    if(req.query.prod_type=='motherboard'){
        res.render('hbs_product_list/product_list',{product_type:req.query.prod_type});
    }
    else if(req.query.prod_type=='processor'){
        res.render('hbs_product_list/processors_list',{product_type:req.query.prod_type});
        }
    else if(req.query.prod_type=='graphic_card'){
        res.render('hbs_product_list/graphic_card_list',{product_type:req.query.prod_type});
         }
    else if(req.query.prod_type=='ram'){
        res.render('hbs_product_list/ram_list',{product_type:req.query.prod_type});
         }
    else if(req.query.prod_type=='cases'){
        res.render('hbs_product_list/cases_list',{product_type:req.query.prod_type});
         }
});

router.get("/search_result",async(req,res)=>{
    console.log(req.query.search)
    res.render('search_result',{search_string:req.query.search})
})

router.get("/get_srch_result",async(req,res)=>{
    const se_ret=await se.search_result(req.query.srch_string,req.query.offset);
    if (se_ret==undefined){
        res.json({data:"no result found"});
    }
    else{
    res.json({data:se_ret[0],stats:se_ret[1]});
    }
})

router.get('/compare',async(req,res)=>{
    res.render('compare');
});
router.get('/compare/data',async(req,res)=>{
    compare_data= JSON.parse(req.query.data_id);
    prod_types_for_compare=Object.keys(compare_data);
    const data_for_comp = await op.opr(prod_types_for_compare,compare_data);
    res.json({data:data_for_comp})
});

router.get('/static',async(req,res)=>{

    let uid=req.query.uid;
    let cnt=req.query.cnt;
    let brand= req.query.brand;
    let purpose=req.query.purpose;
    let product_type = req.query.prod_type;
    if(purpose=='thumb'){
      sharp('./public/static/'+product_type+'/'+uid+'/'+uid+cnt+'.png').resize({fit: sharp.fit.contain,height:300})
      .toBuffer()
      .then((data) => {
            res.send(data);
      }).catch((err)=>{
            sharp('./public/static/'+product_type+'/'+uid+'/'+cnt+'.png').resize({fit: sharp.fit.contain,height:300})
            .toBuffer() .then((data) => {
                res.send(data);
            }).catch((err)=>{
                res.status(404).send('not Found');
            })
      })
    }
    else if(purpose=='error'){

        sharp('./public/static/'+product_type+'/'+brand+'/1.png').resize({fit: sharp.fit.contain,height:300})
        .toBuffer()
        .then((data) => {
              res.send(data);
        }).catch((err)=>{
            console.log(error)
        })
      }
})

module.exports = router;