
prod_id = document.getElementsByClassName("uid")[0].id;
let col_flag=0;

let prod_name=document.getElementsByClassName("uid")[0].getAttribute("name");
 async function getDetails(){
    prod_id = document.getElementsByClassName("uid")[0].id;
     fetch("http://localhost:3001/request_data/product/details?"+"uid="+prod_id+"&type="+prod_name).then(response=> response.json()).then(data=>loadProductDetails(data)); 
 }
removeElement('filter_button');
function loadProductDetails(data){
    
    console.log(data)
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
                else if( c1.offsetHeight > c0.offsetHeight && iter.includes('||')){
                    add_google_ad('c0',1)
                    }
                    else if(c0.offsetHeight > c1.offsetHeight && iter.includes('||')){
                        add_google_ad('c1',0)
                    }
            }
         create_card(iter,data.mongodb[0][iter]);       
         
        }
    }
    else{
        document.getElementsByClassName('specification')[0].remove()
    }
    document.title=data.details.processor_name.split("(")[0];
    document.getElementById("prod_name").innerText=data.details.processor_name.split("(")[0];
    document.getElementById("brand").innerText=data.details.brand;
    document.getElementById("family").innerText=data.details.family;
    document.getElementById("collection").innerText=data.details.collection;
    document.getElementById("platform").innerText=data.details.platform;
    document.getElementById("launch_date").innerText=data.details.launch_date;
    document.getElementById("CMOS").innerText=data.details.CMOS;
    document.getElementById("cores").innerText=data.details.cores;
    document.getElementById("thread").innerText=data.details.thread;
    document.getElementById("base_frequency").innerText=data.details.base_frequency+"GHz";
    document.getElementById("max_frequency").innerText=data.details.max_frequency+"GHz";
    document.getElementById("cache").innerText=data.details.cache+"MB";
    document.getElementById("max_memory").innerText=data.details.max_memory;
    document.getElementById("memory_type").innerText=data.details.memory_type;
    document.getElementById("memory_channel").innerText=data.details.memory_channel;
    document.getElementById("pci_version").innerText=data.details.pci_version;
    document.getElementById("pci_lanes").innerText=data.details.pci_lanes;
    document.getElementById("socket").innerText=data.details.socket;
    document.getElementById("max_temperature").innerText=data.details.max_temperature;
    document.getElementById("graphic_frequency").innerText=data.details.graphic_frequency;
    document.getElementById("pci_configuration").innerText=data.details.pci_configuration;
    document.getElementById("tdp").innerText=data.details.tdp;
    document.getElementById("memory_spped").innerText=data.details.memory_spped;
    document.getElementById("gpu_core").innerText=data.details.gpu_core;
    redefine();

    document.getElementById("product_page").addEventListener("click",()=>{window.location=data.details.processor_link})
    proc_ul= document.createElement("ul");

    for(let x=0 ;x<data.compatible_motherboard.length ;x++){
        let proc_li=document.createElement("li");
        let a =document.createElement("a");
        a.innerText=data.compatible_motherboard[x].prod_name;
        proc_li.append(a);
        proc_li.id=data.compatible_motherboard[x].uid;
        proc_li.setAttribute("class","comp_li comp_scroll");
        proc_li.setAttribute("onclick","openProduct(this.id)");
        proc_ul.append(proc_li);
    }
    proc_ul.setAttribute("class","comp_ul");
    proc_ul.setAttribute("id","comp_ul");

    document.getElementById("compatible_motherboard").append(proc_ul);
}
function redefine(){
    infos=document.getElementsByClassName("info");
    for(let y=0 ;y<infos.length;y++){
        if(infos[y].innerText.replace(/[^0-9]/g,'')=='0'){
            infos[y].innerText='NA';
        }
        else{
            continue
        }

    }
}
function myFunction() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("comp_ul");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function openProduct(id){

    window.location='http://localhost:3001/product?'+'product_id='+id+"&prod_type=motherboard";

}
function removeElement(uid){
        document.getElementById(uid).remove();
      }
getDetails();