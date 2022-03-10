
document.getElementById('searchinput').value=document.getElementById('srch_string').innerHTML;
async function srch(offset){
  createLoading();
  if(!offset){
    offset=0;
  }
  let srch_string = document.getElementById('srch_string').innerText;

  fetch('http://localhost:3001/get_srch_result?'+'offset='+offset+'&srch_string='+srch_string).then(response=>response.json()).then((data)=>{
    loadProducts(data);}).catch(e=>{console.log("terminated")});  
}
  pli=document.createElement("li");
  ul_par=document.getElementById("ulpar");
  bgrp = document.createElement("div");
  bgrp.classList.add("btn-group");
  pli.append(bgrp);
  ul_par.append(pli);

function changelayout(elem){
  document.querySelector(".active_layout").classList.remove("active_layout");
  elem.classList.add("active_layout");
  class_name=elem.id;
  console.log(class_name)
  if(class_name=='all_result'){
    document.querySelectorAll('.prods').forEach(function(prod){
      prod.style.display='block';

    })
  }
  else{
  document.querySelectorAll('.prod_type').forEach(function(prod){
    if(prod.id!==(class_name)){
      prod.parentNode.style.display='none';
    }
    else{
      prod.parentNode.style.display='block';
    }
  })  
   }
}
function create_tablelayout_button(result_table){
  if(!document.getElementById('all_result')){
  bgrp=document.getElementsByClassName("btn-group")[0];
  but_1 =document.createElement("button");
  but_1.innerHTML='All';
  but_1.classList.add("btner","active_layout");
  but_1.setAttribute('id',"all_result");
  but_1.setAttribute("onclick","changelayout(this)");

  bgrp.append(but_1);
}
  if(!document.getElementById(result_table[1])){
        bgrp=document.getElementsByClassName("btn-group")[0];
        but_1 =document.createElement("button");
        if(!document.getElementsByClassName('btner')[0]){
          but_1.classList.add("btner","active_layout");
        }
        else{
            but_1.classList.add("btner");
        }
        but_1.innerHTML=result_table[1];
        but_1.setAttribute('id',result_table[1]);
        bgrp.append(but_1);

        but_1.setAttribute("onclick","changelayout(this)");
}
}
document.getElementById('filter_button').remove();

//-------------------------------------------------
 async function  loadProducts(prod_array){

   if(prod_array.data=="no result found"){
    destroyElement();
    if(document.getElementById("result_no")){
      document.getElementById("result_no").remove();
    }
     No_result=document.createElement("div");
     No_result.setAttribute("id","result_no");
     no_result_label = document.createElement("label");
     no_result_label.innerHTML = "No Result found";
     No_result.style="height:100vh";
     No_result.append(no_result_label);
     content.append(No_result);
     return;
   }

    for (let i=0;i<prod_array.data.length;i++){    
    create_tablelayout_button(prod_array.stats[i]);
  if(prod_array.stats[i][0]["count(*)"]> document.getElementsByClassName("prods").length){
    if(document.getElementById("result_no")){
      document.getElementById("result_no").remove();
    }
  if(prod_array.stats[i][1]=="motherboard"){  

    prod_array.data[i].forEach(function(product){
      var session_store=Object(sessionStorage);

      if (session_store[prod_array.stats[i][1]] && session_store[prod_array.stats[i][1]].includes(product.uid)){
        create_grid(product.brand,product.prod_name,product.socket,product.images,product.uid,prod_array.stats[i][1],1);
      }
      else{
      create_grid(product.brand,product.prod_name,product.socket,product.images,product.uid,prod_array.stats[i][1],0); // ADD CARDS IN GRID
      }
    });
  }
  else if(prod_array.stats[i][1]=="processors"){
    prod_array.data[i].forEach(function(product){
    let card_out = document.createElement("div");
    card_out.setAttribute("class","pro_card pro_out processors_card prods");
   card_out.setAttribute("id",product.uniqid);
    card_out.setAttribute("onClick","pro_openProduct(this.id)");
    let prod_card = document.createElement("div");
    prod_card.setAttribute("class","pro_preview prod_type"); 
    prod_card.id='processors';
    let head_card = document.createElement("div");
    head_card.setAttribute("class","pro_brief head_pro");   
    let brief = document.createElement("div");
    brief.setAttribute("class","pro_brief");
    let prod_brand = document.createElement("h1");
    prod_brand.innerText=product.brand;
    let prod_name = document.createElement("h1")
    prod_name.style="color:white;";
    let cores=document.createElement("h1");
    cores.innerText=product.cores +" CPU cores";
    let bfreq=document.createElement("h1");
    bfreq.innerText=product.base_frequency +" GHz";
    let max_temp=document.createElement("h1");
    max_temp.innerText=product.max_temperature +"°C";
    if(product.processor_name.includes("(")){
      only_prod_name=product.processor_name.split("(");
      prod_name.innerText = only_prod_name[0];
    }
    else{
      prod_name.innerText = product.processor_name;
    }
    if(product.brand=="intel"){
      card_out.style="background-color:var(--intel);";
    }
    else {
      card_out.style="background-color:var(--amd);";
    }
    let prod_family = document.createElement("h1");
    prod_family.innerText = product.family;
    prod_family.style="color:white;";
    head_card.append(prod_brand);
    brief.append(prod_name,prod_family,cores,bfreq,max_temp);
    prod_card.append(head_card,brief);
    card_out.append(prod_card);
    grid.append(card_out);
        
       
    });
  }
  else if(prod_array.stats[i][1]=="graphic_card"){  
    prod_array.data[i].forEach(function(product){ 
      var session_store=Object(sessionStorage);
      if(session_store[prod_array.stats[i][1]] && session_store[prod_array.stats[i][1]].includes(product.uid)){
      create_grid(product.brand,product.prod_name.split(',')[0],product.resolution,product.images,product.uid,prod_array.stats[i][1],1);
      }
      else{
        create_grid(product.brand,product.prod_name.split(',')[0],product.resolution,product.images,product.uid,prod_array.stats[i][1],0);
      }     
      });
    }
  }
    if(document.getElementById("page_loader_gif")){
      document.getElementById("page_loader").remove();
    }
  bool = false; 
  destroyElement();
  if(document.getElementById("content_loader")){
    document.getElementById("content_loader").remove();}       
  }
  destroyElement();
  remvoe_elem_class_name('loading-elem');
  $('.comp_cb').click (function (e) {
    add_mb(this.id);
  })

}
//------------------------------------------------

function openProduct(clicked_id){
  let idm = $(clicked_id).parent().attr('id');
  let type = clicked_id.id;
  window.open('http://localhost:3001/product?'+'product_id='+idm+'&prod_type='+type);
}

function pro_openProduct(clicked_id){
  window.open('http://localhost:3001/product?'+'product_id='+clicked_id+"&prod_type=processor");
  }


srch();