prod_id = document.getElementsByClassName("uid")[0].id;
let col_flag=0;
let product_name=document.getElementsByClassName("uid")[0].getAttribute("name");
var lastScrollTop = 0;

 async function getDetails(){
    prod_id = document.getElementsByClassName("uid")[0].id;
     fetch("http://localhost:3001/request_data/product/details?"+"uid="+prod_id+"&type="+product_name).then(response=> response.json()).then(data=>loadProductDetails(data)); 
 }

 removeElement('filter_button');


function compatible_componensts(componenet_data,idy) {  
    if(componenet_data.length == 0){
        document.getElementById(idy).parentNode.remove();
    }
    else{
        proc_ul= document.createElement("ul");
    for(let x=0 ;x<componenet_data.length ;x++){
        let proc_li=document.createElement("li");
        let a =document.createElement("a");
        if(idy=='Compatible_Processor'){
        a.innerText=componenet_data[x].processor_name;
        proc_li.id=componenet_data[x].uniqid;
        proc_li.setAttribute("onclick","openProduct(this.id,'processor')");
        }
        else {
            a.innerText=componenet_data[x].prod_name;
           proc_li.id=componenet_data[x].uid;
           proc_li.setAttribute("onclick","openProduct(this.id,"+idy.split('_')[1]+")");
   
           }
        proc_li.append(a);
        proc_li.setAttribute("class","comp_li comp_scroll");
       
            proc_ul.append(proc_li);
    }
    proc_ul.setAttribute("class","comp_ul");
    proc_ul.setAttribute("id","comp_ul"+idy);
    document.getElementById(idy).append(proc_ul);
    }   
    
    
}

function loadProductDetails(data){
    let parent_det_tab= document.getElementById('detail_tab');
    for (db_attr in data.sql.details){
        if (db_attr=='uid' || db_attr=='prod_name' || db_attr=='images' || db_attr=='spec_link'){
            continue
        }
        let tab_tr =build_element('tr');
        let tab_td = build_element('td',db_attr+'_lab','label',db_attr);
        let tab_td2=build_element('td',db_attr,'info',data.sql.details[db_attr]);
        tab_tr.append(tab_td,tab_td2);
        parent_det_tab.append(tab_tr);
        console.log(db_attr)
    }
    if (data.mongodb.length>0){

        spec_li = document.createElement('li')
        spec_foc_but=document.createElement('select')
         spec_foc_but.setAttribute('class','spec_select btner sa_scroll')
        spec_li.append(spec_foc_but)
        spec_option = document.createElement('option')
        spec_option.innerText='Specification'
        spec_option.setAttribute('class','dp')
        spec_foc_but.append(spec_option)
        document.getElementById('ulpar').append(spec_li)
        for (iter in data.mongodb[0]){
            
            if(document.getElementsByClassName('whole_c').length % 5 ==0 && col_flag >0){
                if( c1.offsetHeight > c0.offsetHeight && !iter.includes('||')){
                add_google_ad('c0')
                }
                else if(c0.offsetHeight > c1.offsetHeight && !iter.includes('||')){
                    add_google_ad('c1')
                }
                else if( c1.offsetHeight > c0.offsetHeight && !iter.includes('||')){
                    add_google_ad('c0',1)
                    }
                    else if(c0.offsetHeight > c1.offsetHeight && !iter.includes('||')){
                        add_google_ad('c1',0)
                    }
            }
         create_card(iter,data.mongodb[0][iter]);       
         
        }
    }
    else{
        document.getElementsByClassName('specification')[0].remove()
    }
   
    document.title=data.sql.details.prod_name.split("(")[0];
            document.getElementById('prod_name').innerText=data.sql.details.prod_name.split("(")[0];
    document.getElementById("product_page").addEventListener("click",()=>{window.location=data.sql.details.spec_link})

    let images= data.sql.details.images.split(",");
    images_length = images.length;
    document.getElementById("slide_show").setAttribute("onerror",'image_error(this.id,"'+data.sql.details['Brand']+'","'+process_image(images,data.sql.details['Brand'],200,data.type)+'")');

    document.getElementById("slide_show").setAttribute("src",'http://localhost:3001/static?'+'uid='+data.sql.details.uid+'&cnt=0&purpose=thumb&brand='+data.sql.details['Brand']+'&prod_type='+data.type);
    document.getElementById("body_full").style.backgroundImage="url('"+process_image(images[0].replaceAll("'",""),data.sql.details['Brand'],800)+"')"
    image_pad = document.querySelector(".img_list");
    let html="";
    for(let i=0;i < images_length; i++)
    {  if(i==6){
        break
    }
         if(i==0)
        {
            html +="<img onerror='removeElement(this.id);' id='img"+i+"' class='slide_show_img active' src='"+ process_image(images[i].replaceAll("'",""),data.sql.details.brand,150)+"' onclick='view_product(this.src,this.id,\""+data.sql.details.brand+"\")'>";

        }
        else{
        html +="<img  onerror='removeElement(this.id);' id='img"+i+"' class='slide_show_img' src='"+ process_image(images[i].replaceAll("'",""),data.sql.details.brand,150)+"' onclick='view_product(this.src,\"img"+i+"\",\""+data.sql.details.brand+"\")'>";
    }
    }
    image_pad.insertAdjacentHTML("beforeend",html);
   
    let comp_parent = document.getElementById('comp_parent');
    for( comp in data.sql.compatible){
        let p1 = build_element('div','none','col-lg-5 col-md-5 comp');
        let h1_div = build_element('div','none','comp_name');
        let h1_comp = build_element('h1','comp_pro');
        h1_comp.innerText=comp+' with '+ data.sql.details.prod_name.split("(")[0];
        let comp_lis=build_element('div',comp.replaceAll(' ','_'),'compatible comp_scroll');
        let comp_ip = build_element('input','myInput_pro','myInput');
        comp_ip.setAttribute('type','text');
        comp_ip.setAttribute('onkeyup','myFunction(this.id)');
        comp_ip.setAttribute('placeholder','Search for names..');
        comp_ip.setAttribute('title','Type in a name');
        comp_lis.append(comp_ip);
        h1_div.append(h1_comp);
        p1.append(h1_div,comp_lis);

        h1_comp.innerText=comp;
        comp_parent.append(p1)
        console.log(data.sql.compatible[comp])
        compatible_componensts(data.sql.compatible[comp],comp.replaceAll(' ','_'));

    }

    removestyle()
    console.log(data)
}


getDetails();


