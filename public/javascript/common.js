var bool = false;       
let attr_flag = true;
var lastScrollTop = 0;

const controller = new AbortController();
const {signal} = controller;                                          
let grid = document.querySelector('.grid_layout');
let container_cont = document.querySelector(".container");
let content = document.querySelector('.content');
let full_scr = document.getElementById("page_loader");
let card_limit=0;
var filt_send = {};
var compare_limit=5;
//pageLoader();
var layout="grid";

//make request to server for list of products with offset of 12
async function getcount(offset){
    createLoading();
    if(!offset){
      offset=0;
    }
    let product_type = document.getElementById('product_type').innerText;
    fetch('http://localhost:3001/list?'+'offset='+offset+'&product_type='+product_type+'&filter_send='+JSON.stringify(filt_send),{signal}).then(response=> response.json()).then((data)=>{loadProducts(data,product_type);}).catch(e=>{console.log("terminated")});  
  }
 function image_error(uid,brand,link){
  let obj =  document.getElementById(uid).parentNode;
  document.getElementById(uid).remove();
  let prod_img = document.createElement("img");
    prod_img.id='img_2'+uid ;
    prod_img.setAttribute("onload",'fadeIn(this)')
    prod_img.setAttribute("onerror",'image_error_2('+brand+')');
    prod_img.src=link;
    obj.append(prod_img);

}
function image_error_2(uid,brand){
  document.getElementById(uid).src='http://localhost:3001/static?'+'purpose=error&brand='+brand;
}
//add and remove in compare cart and in sessionStorage
function add_mb(idm){
     var id=idm.split('-');
     cb=document.getElementById(idm);
    if(cb.checked==true){

      if(sessionStorage.getItem(id[1])){
        var prev_data = JSON.parse(sessionStorage.getItem(id[1]));

         if (!prev_data.includes(parseInt(id[0])) && prev_data.length<compare_limit){
            prev_data.push(parseInt(id[0]))
            document.getElementById(id[0]).getElementsByClassName('comp_cont')[0].style='background-color:var(--g1);';
            document.getElementById(id[0]).getElementsByClassName('comp_lab')[0].style='color:black';
            sessionStorage.setItem(id[1],JSON.stringify(prev_data))
          }
          else if(prev_data.length>compare_limit){
            cb.checked = false;
            alert('compare box is full.')
          }
       }
      else{
        var product_compare=[]
        product_compare[0]=parseInt(id[0]);
        document.getElementById(id[0]).getElementsByClassName('comp_cont')[0].style='background-color:var(--g1);';
        document.getElementById(id[0]).getElementsByClassName('comp_lab')[0].style='color:black';
        sessionStorage.setItem(id[1],JSON.stringify(product_compare))
      }

    }
    else if(cb.checked==false && sessionStorage.getItem(id[1])){
      document.getElementById(id[0]).getElementsByClassName('comp_cont')[0].removeAttribute('style');
      document.getElementById(id[0]).getElementsByClassName('comp_lab')[0].removeAttribute('style');

      var prev_data = JSON.parse(sessionStorage.getItem(id[1]));
      if (prev_data.includes(parseInt(id[0]))){
        prev_data=removeAllInstances(prev_data,parseInt(id[0]))
      }
      if (prev_data.length >0){
      sessionStorage.setItem(id[1],JSON.stringify(prev_data))
      }
      else{
        sessionStorage.removeItem(id[1]);
      }
    }
    compare_ping();
  }
  function trigger_add_mb(ipar){
    var id= ipar.getElementsByClassName('comp_cb')[0].id;
    id.checked =!id.checked;
  }
//wait for range track
function checkFlag() {
    if(bool == true) {
      window.setTimeout(checkFlag, 100); 
    } 
    else {
      getcount();
    }
  }
  function removeAllInstances(arr, item) {
    for (var i = arr.length; i--;) {
      if (arr[i] === item) arr.splice(i, 1);
      if (i==0) return arr;
    }
 }
//adjust fliter object to send to server except range
function filterA(id){
    document.querySelectorAll(".prods").forEach(function(card_elem){
      card_elem.remove();
    })
    if(document.querySelector('.loading-elem')){
      document.querySelector('.loading-elem').remove();
    }
    if (document.getElementById(id).value != "---all---"){
        if(id == 'memory_interface-dpin'){
          filt_send[id]=document.getElementById(id).value.replace('bits','').replace(' ','');
        }
        else{
          filt_send[id]=document.getElementById(id).value.replaceAll(' ','')
        } 
    }
      
    else if(document.getElementById(id).value == "---all---")
    {
      if(id == "socket-procdp"){   
        delete filt_send["socket-dp"];
    }
     delete filt_send[id];
    }
    if(document.getElementById("filter_check").checked==true){
      removeNavFilter();
    }
    limitFilter();
    checkFlag();
  }
  
//adjust fliter object only for range
function filterB(range_id_left,range_id_right){ 
    let min_val=document.getElementById(range_id_left).value;
    let max_val=document.getElementById(range_id_right).value;
    let condition_name=document.getElementById(range_id_left).parentElement.id;
    document.querySelectorAll(".prods").forEach(function(card_elem){
      card_elem.remove();
    })
    if(document.querySelector('.loading-elem')){
      document.querySelector('.loading-elem').remove();
    }
    if (attr_flag==false){
      let ranger =[];
      ranger[0]= min_val;
      ranger[1]=max_val;
      if(min_val == document.getElementById(range_id_left).getAttribute('min') && max_val == document.getElementById(range_id_right).getAttribute('max')) 
      {
        delete filt_send[condition_name];
      }
      else{
      filt_send[condition_name]=ranger;
      }
    }
   if(document.getElementById("filter_check").checked==true){
    removeNavFilter();
    }
    limitFilter(); 
    checkFlag();
  }
  
//range track filter left and right
function give_id_forfilter(id_left,id_right){
    document.getElementById(id_left).setAttribute("onchange","filterB(this.id,'"+id_right+"')");
    document.getElementById(id_right).setAttribute("onchange","filterB('"+id_left+"',this.id)");
  
  }
  
//adjust elements based on size of window
window.addEventListener("resize",()=>{
  if(document.getElementById("product_type")){
  if($(window).width()<972){
    
    if(document.getElementById("filter_check").checked == false){
    document.getElementById('filter_attr').style.left="-10rem";}
    document.getElementById('content').classList.remove('col-10');
    document.getElementById('content').classList.add('col-12');
    }
  if($(window).width()>972){
    document.getElementById('filter_attr').style.left=0;
  
    if(document.getElementById("filter_check").checked==true){
      document.getElementById("filter_check").checked=false;
      removeNavFilter();
      document.getElementById('filter_attr').style.left=0;
    }
    document.getElementById('content').classList.remove('col-12');
    document.getElementById('content').classList.add('col-10');
   
   }
  }
});


 //add page loader 
function pageLoader(){
     let page_loader = document.createElement("img");
      page_loader.setAttribute("src","/images/loader/page.gif");
      page_loader.setAttribute("id","page_loader_gif");
      page_loader.style="height:100%;width:100%;";
      full_scr.append(page_loader);
  }
  
//toggle filter with button when window size is small
function filter_toggle(id_filter){
    fil_che=document.getElementById(id_filter);
    if(fil_che.checked){
          document.getElementById('filter').classList.remove('col-2');
          document.getElementById('filter').classList.add('nav_filter');
          document.getElementById('filter_attr').classList.remove('col-2');
          document.getElementById('filter_attr').style.left=0;        
          document.getElementById('filter_attr').style.height="100%";        
          let overlay = document.createElement("div");
          overlay.setAttribute("id","filter_overlay");
          container_cont.insertAdjacentElement("beforebegin",overlay);   
          overlay.addEventListener("click",()=>{
          removeNavFilter();
          document.getElementById('filter_attr').style="left:-10rem;";
  
      });
      
    }
    else if(fil_che.checked == false){   
      removeNavFilter();
      document.getElementById('filter_attr').style="left:-10rem;";
    }
}

//remove filter toggle button when screen is big 
function removeNavFilter(){
    document.getElementById("filter_check").checked=false;
    document.getElementById('filter').classList.remove('nav_filter');
    document.getElementById('filter').classList.add('col-2');
    document.getElementById("filter_overlay").remove();
  }
  
//change layout to [list,grid,table]
function changelayout(elem){
    document.querySelector(".active_layout").classList.remove("active_layout");
    elem.classList.add("active_layout");
    layout=elem.innerHTML;
    document.querySelectorAll(".prods").forEach(function(elem){elem.remove();})
    getcount();
  }
  
//adjust elements when reloaded in different size of window
window.addEventListener("load",()=>{
 
    if($(window).width()<991){
     document.getElementById('content').classList.remove('col-10');
     document.getElementById('content').classList.add('col-12');
    
    }
    if($(window).width()>991){
      document.getElementById('content').classList.remove('col-12');
      document.getElementById('content').classList.add('col-10');
     }
     
  });
//add buttons to change layout of data
function create_tablelayout_button(){
      pli=document.createElement("li");
      ul_par=document.getElementById("ulpar");
      bgrp = document.createElement("div");
      bgrp.classList.add("btn-group");
      but_1 =document.createElement("button");
      but_1.classList.add("btner");
      but_1.innerHTML="list";
      but_2 =document.createElement("button");
      but_2.classList.add("btner","active_layout");
      but_2.innerHTML="grid";
      but_3 =document.createElement("button");
      but_3.classList.add("btner");
      but_3.innerHTML="table";
      bgrp.append(but_1,but_2,but_3);
      but_1.setAttribute("onclick","changelayout(this)");
      but_2.setAttribute("onclick","changelayout(this)");
      but_3.setAttribute("onclick","changelayout(this)");
   
      pli.append(bgrp);
      ul_par.append(pli);
      return pli;
  }
  
//recieve options for filter attributes from server and append to filter
function getfilterAttributes(prod_array,product_type){
  
    if(product_type=="graphic_card"){
      console.log(prod_array)
      brand_len = prod_array.brand.length;
      let dp_brand = document.getElementById("brand-dp");
      for(i=0;i<brand_len;i++){
        var brand_menu_item = document.createElement("option");
        if (!brand_menu_item.innerHTML.includes(prod_array.brand[i].brand)){
          brand_menu_item.value=prod_array.brand[i].brand;
        brand_menu_item.innerHTML=prod_array.brand[i].brand;
        dp_brand.append(brand_menu_item); 
          }
      
      }
  
      mi = prod_array.memory_interface.length;
      let dp_mi = document.getElementById("memory_interface-dpin");
      for(i=0;i<mi;i++){
        var mi_menu_item = document.createElement("option");
        if (!mi_menu_item.innerHTML.includes(prod_array.memory_interface[i].memory_interface)){
          mi_menu_item.value=prod_array.memory_interface[i].memory_interface +' bits';
        mi_menu_item.innerHTML=prod_array.memory_interface[i].memory_interface+' bits';
        dp_mi.append(mi_menu_item); 
          }
      
      }
  
    }
    else if(product_type=="processor"){
        brand_len = prod_array.brand.length;
        let dp_brand= document.getElementById("brand-dp");
        for(i=0;i<brand_len;i++){
          var menu_item = document.createElement("option");
          menu_item.value=prod_array.brand[i].brand;
          menu_item.innerHTML=prod_array.brand[i].brand;
          dp_brand.append(menu_item);  
        }
    
        family_len = prod_array.family.length;
        let dp_family = document.getElementById("family-dp");
        for(i=0;i<family_len;i++){
          var family_menu_item = document.createElement("option");
          if (!family_menu_item.innerHTML.includes(prod_array.family[i].family)){
          family_menu_item.value=prod_array.family[i].family;
          family_menu_item.innerHTML=prod_array.family[i].family;
          dp_family.append(family_menu_item);     }
        }
    
        collection_len = prod_array.collection.length;
        let dp_collection = document.getElementById("collection-dp");
        for(i=0;i<collection_len;i++){
          var collection_menu_item = document.createElement("option");
          if (!collection_menu_item.innerHTML.includes(prod_array.collection[i].collection)){
            collection_menu_item.value=prod_array.collection[i].collection;
            collection_menu_item.innerHTML=prod_array.collection[i].collection;
          dp_collection.append(collection_menu_item);     }
        }
    
        platform_len = prod_array.platform.length;
        let dp_platform = document.getElementById("platform-dp");
        for(i=0;i<platform_len;i++){
          var platform_menu_item = document.createElement("option");
          platform_menu_item.value=prod_array.platform[i].platform;
          platform_menu_item.innerHTML=prod_array.platform[i].platform;
          dp_platform.append(platform_menu_item);     
        }
      }
    else if(product_type=="motherboard"){
        sockets_len = prod_array.socket.length;
        let dp_socket = document.getElementById("socket-dp");
        for(i=0;i<sockets_len;i++){
          var menu_item = document.createElement("option");
          menu_item.value=prod_array.socket[i].socket;
          menu_item.innerHTML=prod_array.socket[i].socket;
          dp_socket.append(menu_item);  
        }
    
        chipset_len = prod_array.chipset.length;
        let dp_chipset = document.getElementById("chipset-dp");
        for(i=0;i<chipset_len;i++){
          var chipset_menu_item = document.createElement("option");
          if (!chipset_menu_item.innerHTML.includes(prod_array.chipset[i].chipset)){
          chipset_menu_item.value=prod_array.chipset[i].chipset;
          chipset_menu_item.innerHTML=prod_array.chipset[i].chipset;
          dp_chipset.append(chipset_menu_item);     }
        }
    
        brand_len = prod_array.brand.length;
        let dp_brand = document.getElementById("brand-dp");
        for(i=0;i<brand_len;i++){
          var brand_menu_item = document.createElement("option");
          if (!brand_menu_item.innerHTML.includes(prod_array.brand[i].brand)){
            brand_menu_item.value=prod_array.brand[i].brand;
          brand_menu_item.innerHTML=prod_array.brand[i].brand;
          dp_brand.append(brand_menu_item);     }
        }
    
        proc_len = prod_array.in_processor.length;
        let dp_proc = document.getElementById("socket-procdp");
        for(i=0;i<proc_len;i++){
          var proc_menu_item = document.createElement("option");
          proc_menu_item.value=prod_array.in_processor[i].socket;
          proc_menu_item.innerHTML=prod_array.in_processor[i].socket;
          dp_proc.append(proc_menu_item);     
        }
        
        northbridge_len = prod_array.northbridge.length;
        let dp_nb = document.getElementById("chipset-nbdp");
        for(i=0;i<northbridge_len;i++){
          var proc_menu_item = document.createElement("option");
          nb_cut = (prod_array.northbridge[i].chipset).split(",");
          if(nb_cut[0] != undefined && nb_cut[0].includes("northbridge") && !(dp_nb.innerHTML).includes(nb_cut[0])){
          proc_menu_item.value=nb_cut[0];
          proc_menu_item.innerHTML=nb_cut[0].replace("northbridge:","");
          dp_nb.append(proc_menu_item);    
       } }  
    
        southbridge_len = prod_array.southbridge.length;
        let dp_sb = document.getElementById("chipset-sbdp");
        for(i=0;i<southbridge_len;i++){
          var proc_menu_item = document.createElement("option");
          sb_cut = (prod_array.southbridge[i].chipset).split(",");
      if(sb_cut[1] != undefined && sb_cut[1].includes("southbridge") && !(dp_sb.innerHTML).includes(sb_cut[1])){
          proc_menu_item.value=sb_cut[1];
          proc_menu_item.innerHTML=sb_cut[1].replace("southbridge:","");
          dp_sb.append(proc_menu_item);     
        }}
    
        mb_size_len = prod_array.mbsizes.length;
        let dp_mbsize = document.getElementById("mb_size-dp");
        for(i=0;i<mb_size_len;i++){
          var mb_size_menu_item = document.createElement("option");
          mb_size_menu_item.value=prod_array.mbsizes[i].mb_size;
          mb_size_menu_item.innerHTML=prod_array.mbsizes[i].mb_size;
          dp_mbsize.append(mb_size_menu_item);     
        }
      }
      else if(product_type=="ram"){
        console.log(prod_array)
        series_len = prod_array.series.length;
        let dp_series = document.getElementById("series-dp");
        for(i=0;i<series_len;i++){
          var menu_item = document.createElement("option");
          menu_item.value=prod_array.series[i].series;
          menu_item.innerHTML=prod_array.series[i].series;
          dp_series.append(menu_item);  
        }
    
        memory_type_len = prod_array.ram_memory_type.length;
        let dp_memory_type = document.getElementById("ram_memory_type-dp");
        for(i=0;i<memory_type_len;i++){
          var memory_type_menu_item = document.createElement("option");
          if (!memory_type_menu_item.innerHTML.includes(prod_array.ram_memory_type[i].ram_memory_type)){
            memory_type_menu_item.value=prod_array.ram_memory_type[i].ram_memory_type;
            memory_type_menu_item.innerHTML=prod_array.ram_memory_type[i].ram_memory_type;
          dp_memory_type.append(memory_type_menu_item);     }
        }
    
        brand_len = prod_array.brand.length;
        let dp_brand = document.getElementById("brand-dp");
        for(i=0;i<brand_len;i++){
          var brand_menu_item = document.createElement("option");
          if (!brand_menu_item.innerHTML.includes(prod_array.brand[i].brand)){
            brand_menu_item.value=prod_array.brand[i].brand;
          brand_menu_item.innerHTML=prod_array.brand[i].brand;
          dp_brand.append(brand_menu_item);     }
        }
    
        memory_format_len = prod_array.memory_format.length;
        let dp_memory_format = document.getElementById("memory_format-dp");
        for(i=0;i<memory_format_len;i++){
          var memory_format_menu_item = document.createElement("option");
          memory_format_menu_item.value=prod_array.memory_format[i].memory_format;
          memory_format_menu_item.innerHTML=prod_array.memory_format[i].memory_format;
          dp_memory_format.append(memory_format_menu_item);     
        }
      }
      else if(product_type=="cases"){
        brand_len = prod_array.brand.length;
        let dp_brand = document.getElementById("brand-dp");
        for(i=0;i<brand_len;i++){
          var brand_menu_item = document.createElement("option");
          if (!brand_menu_item.innerHTML.includes(prod_array.brand[i].brand)){
            brand_menu_item.value=prod_array.brand[i].brand;
          brand_menu_item.innerHTML=prod_array.brand[i].brand;
          dp_brand.append(brand_menu_item);     }
        }
      }

  }

//limit size of filter
function limitFilter(){
  let limit = this.innerHeight + this.pageYOffset;
  if(limit >= document.body.scrollHeight-300){
    document.querySelector(".filter-attr").style="height:18rem";
  }
  else{
    
    document.querySelector(".filter-attr").style="height:28rem";
  }
}

//hide filter when scrolled in small window if toggles
window.onscroll=()=>{
  let limit = this.innerHeight + this.pageYOffset;
  
  if(document.getElementById("filter_check") && document.getElementById("filter_check").checked==true){
    removeNavFilter();
  }
  if(document.getElementById("filter_check"))
  {
  limitFilter();
  }
  if (bool) return;
      
      if(limit >= document.body.scrollHeight-2200 && document.querySelectorAll(".prods").length<card_limit){
        bool = true;
        let offset=document.querySelectorAll(".prods").length;
          getcount(offset);
  } 
}

//process image to change size
function process_image(img_link,brand,size,pt){
    if(pt=='cases'){
      if (brand=='Gigabyte'){
        return img_link[0].replaceAll("'","").replaceAll('[','').replaceAll(']','') +img_link[1].replaceAll("'","").replaceAll('[','').replaceAll(']','');
      }
    }
      if(brand=="Asus"){
          if(img_link.includes("_end_")){
              spli=img_link.split("_end_").pop();
              img_linke=img_link.replace("_end_"+spli,"_end_"+size+".png");
              return img_linke[0].replaceAll("'","").replaceAll('[','').replaceAll(']','');
          }
    
          else if(img_link.includes("/w")){
              spli=img_link.split("/w").pop();
              img_linke=img_link.replace("/w"+spli,"/w"+size);
              return img_linke[0].replaceAll("'","").replaceAll('[','').replaceAll(']','');
          
          }
          else{
            return img_link[0].replaceAll("'","").replaceAll('[','').replaceAll(']','');
          }
      }
      else{
        return img_link[0].replaceAll("'","").replaceAll('[','').replaceAll(']','');
      }

    }
  
//add loading animation while srolling down  
function createLoading(){
  destroyElement();
      remvoe_elem_class_name("loading-elem");
      let loader_card = document.createElement("img");
      loader_card.setAttribute("src","/images/loader/yellow.gif");
      loader_card.classList.add("loading-elem");
      loader_card.style="height:5rem;margin:auto;margin-bottom:100vh;";
      content.append(loader_card);
      }
      
//remove loading element
function destroyElement(){
  if( document.querySelector('#page_loader')){
        document.querySelector('#page_loader').remove();}
      }
//remove any element if have id
function removeElement(uid){
  if (document.getElementById(uid)){
      document.getElementById(uid).remove();
  }
    }
function remvoe_elem_class_name(cname){
  if(document.getElementsByClassName(cname)[0]){
    document.getElementsByClassName(cname)[0].remove();
  }
}
//images fade in animation
window.fadeIn = function(obj) {
      $(obj).fadeIn(1000);
    }

//default call on load
if(!document.getElementById('srch_string'))
{
  create_tablelayout_button();

  getcount();
  }
//hide and show sec_navbar on scrolled up and down
window.addEventListener("scroll", function(){
      var st = window.pageYOffset || document.documentElement.scrollTop; 
      if (st > lastScrollTop){
          document.getElementById('sec_nav').style='margin-top:0rem';
         // downscroll code
      } else {
          document.getElementById('sec_nav').style='margin-top:4rem';
  
         // upscroll code
      }
       lastScrollTop= st <= 0 ? 0 : st; // For Mobile or negative scrolling
}, false);

//remove layout funtictions
function remove_grid_cards(){
  if(document.querySelector(".grid_layout")){
document.querySelector(".prod_show").classList.remove("grid_layout");
}

}
function remove_table(){
if(document.querySelector("#product_table")){
document.querySelector("#product_table").remove();
document.querySelector(".prod_show").classList.remove("table_layout");
}
}
function remove_list(){
if(document.querySelector(".lis_pro")){
  document.querySelector(".prod_show").classList.remove("lis_pro","container");}
}
//compare operation 
function openlink(link){
  window.open(link);

}