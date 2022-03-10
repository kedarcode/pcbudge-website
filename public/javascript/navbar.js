
let t_flag=false;

function send_request(srch_val){
    window.location.replace('http://localhost:3001/search_result?'+'search='+srch_val) ;
}
function loadSearchRes(data){
    remove_recom_opt();

    bro=document.getElementById("srch_recon");
    for(let i=0;i<Object.getOwnPropertyNames(data.data).length-1;i++){
        opt = document.createElement("li");
        opt.setAttribute('class','srch_recon');
        opt.setAttribute('id','recon_li'+i);

        opt.setAttribute("onclick","send_request(this.innerText)");
        if(data.data[i].processor_name.includes("(")){
        opt.innerText=data.data[i].processor_name.split('(')[0];
    }
        else{
            opt.innerText=data.data[i].processor_name;
        }
        bro.append(opt);

    }

}
function remove_recom_opt(){
    document.querySelectorAll('.srch_recon').forEach(e => e.remove());
}
document.getElementById("searchinput").addEventListener("input",recom);

document.getElementById("searchinput").addEventListener("keyup", function(event) {

    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("search_but").click();
    }
  });

function recom(){
    remove_recom_opt();
    t_flag=false;
    
    setTimeout(fetcher, 1000);
    
}
function fetcher(){
    if(t_flag==false){
        
        let search_str=document.getElementById('searchinput').value.replaceAll(' ','%').replace('™','');
        if(search_str.length>2){
        fetch("http://localhost:3001/search/recom?"+"string="+search_str).then(response=> response.json()).then(data=>loadSearchRes(data)); 
        }
}
    t_flag=true;
}
$(window).click(function() {
    if(document.getElementsByClassName("srch_recon")){
       remove_recom_opt();
    }
});
$('#searchinput').click(function(event){
    event.stopPropagation();
  });

document.getElementById("search_but").addEventListener('click',()=>{
    let motherboard_tags = ['mb','mother','board','motherboard','mn','circuitboard'];
    let processor_tags=['processor','micro','microchip','microprocessor','cpu','mainchip']
    if(motherboard_tags.some(motherboard_tags => document.getElementById('searchinput').value.toLowerCase().includes(motherboard_tags.toLowerCase()))){
        window.location='http://localhost:3001/productlist?'+'prod_type='+'motherboard';
    }
    else if(processor_tags.some(processor_tags => document.getElementById('searchinput').value.toLowerCase().includes(processor_tags.toLowerCase()))){
        window.location.href = 'http://localhost:3001/productlist?prod_type=processor';
    }
    else if(document.getElementById('searchinput').value!="" && document.getElementById('searchinput').value.length>3){
    send_request(document.getElementById('searchinput').value);   
}
else{
    return;
}
});

function compare_ping(){
   if(sessionStorage.length>0){
        document.getElementById('compare_ping').style.visibility='visible';
    }
    else{
        document.getElementById('compare_ping').style.visibility=' hidden';

    }
   
}
compare_ping();
document.getElementById("commparison_but").addEventListener('click',()=>{
    window.location.replace('http://localhost:3001/compare') ;

})
  