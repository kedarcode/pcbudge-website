window.addEventListener("load", ()=>{
    const event = new Event('build');

    function setLeftValue(id,id_right) {
        if(this.id){
         var _this = document.getElementById(this.id);
         var id_right= "input-right"+ _this.id.charAt(_this.id.length-1);
           
        }
        else{
            var _this=document.getElementById(id);
     }
            
          var  min = parseInt(_this.min),
             max = parseInt(_this.max);            
             var th_left ="thumbleft"+ _this.id.charAt(_this.id.length-1);
            var rg_left = "range" +_this.id.charAt(_this.id.length-1);
             var lab_left = "something"+_this.id.charAt(_this.id.length-1);
             var lab=document.getElementById(lab_left);
            var  thumbLeft =document.getElementById(th_left);
            var  range = document.getElementById(rg_left);
            _this.value = Math.min(parseInt(_this.value), parseInt(document.getElementById(id_right).value) - 1);
 
        var percent = ((_this.value - min) / (max - min)) * 100;
 
         thumbLeft.style.left = percent + "%";
         range.style.left = percent + "%";
         lab.innerText=_this.value;
     }
     function setRightValue(ide,id_left_name) {
         if(this.id){
            var _this_lef = document.getElementById(this.id);
            var id_left_name= "input-left"+ _this_lef.id.charAt(_this_lef.id.length-1);
              
           }
           else{
               var _this_lef=document.getElementById(ide);
        }
            var min_lef = parseInt(_this_lef.min),
              max_lef = parseInt(_this_lef.max);
             var th_right_lef ="thumbright"+ _this_lef.id.charAt(_this_lef.id.length-1);
             var rg_right_lef = "range" +_this_lef.id.charAt(_this_lef.id.length-1);
            var  lab_right_lef = "something2"+_this_lef.id.charAt(_this_lef.id.length-1);
             var lab2_lef=document.getElementById(lab_right_lef);
             var thumbRight_lef =document.getElementById(th_right_lef);
             var range_lef = document.getElementById(rg_right_lef);
        _this_lef.value = Math.max(parseInt(_this_lef.value), parseInt(document.getElementById(id_left_name).value) + 1);
 
         var percent = ((_this_lef.value - min_lef) / (max_lef - min_lef)) * 100;
         thumbRight_lef.style.right = (100 - percent) + "%";
         range_lef.style.right = (100 - percent) + "%";
         lab2_lef.innerText=_this_lef.value;
     }
     function sendLeftValue(){
        if(this.id){
            var _this = document.getElementById(this.id);
            var id_right= "input-right"+ _this.id.charAt(_this.id.length-1);
              
           }
           else{
               var _this=document.getElementById(id);
        }
        _this.value = Math.min(parseInt(_this.value), parseInt(document.getElementById(id_right).value) - 1);
        give_id_forfilter(_this.id,id_right);
     }
     function sendRightValue(ide,id_left_name){
        if(this.id){
            var _this_lef = document.getElementById(this.id);
            var id_left_name= "input-left"+ _this_lef.id.charAt(_this_lef.id.length-1);
              
           }
           else{
               var _this_lef=document.getElementById(ide);
        }
        _this_lef.value = Math.max(parseInt(_this_lef.value), parseInt(document.getElementById(id_left_name).value) + 1);
        give_id_forfilter(id_left_name,_this_lef.id);
     }
     function changecolor(){
         
         var thumb_color_change = "thumbleft"+ this.id.charAt(this.id.length-1);
         document.getElementById(thumb_color_change).style.backgroundColor="var(--g1)";
     }
     function returncolor(){
        var thumb_color_back = "thumbleft"+ this.id.charAt(this.id.length-1);
        document.getElementById(thumb_color_back).style.backgroundColor="rgb(20,20,20)";
     }
     function changecolorR(){
         
        var thumb_color_change = "thumbright"+ this.id.charAt(this.id.length-1);
        document.getElementById(thumb_color_change).style.backgroundColor="var(--g2)";
    }
    function returncolorR(){
       var thumb_color_back = "thumbright"+ this.id.charAt(this.id.length-1);
       document.getElementById(thumb_color_back).style.backgroundColor="rgb(20,20,20)";
    }
    function create(){
    if($("div.multi-slider").length){
    baap = document.getElementsByClassName("multi-slider");
    var lab=[];
    var lab2=[];
   for(i=0;i<baap.length;i++) {
       var min=baap[i].getAttribute("min")
        var max =baap[i].getAttribute("max")
    var inputLeft = document.createElement("input");
    inputLeft.setAttribute("id","input-left"+[i]);
    inputLeft.setAttribute("class","ip-sl");
    inputLeft.setAttribute("min",min);
    inputLeft.setAttribute("max",max);
    inputLeft.setAttribute("value",min);

    inputLeft.setAttribute("type","range");
    baap[i].append(inputLeft);

    var inputRight = document.createElement("input");
    inputRight.setAttribute("id","input-right"+[i]);
    inputRight.setAttribute("min",min);
    inputRight.setAttribute("max",max);    
    inputRight.setAttribute("value",max);    

    inputRight.setAttribute("class","ip-sl");
    inputRight.setAttribute("type","range");
    baap[i].append(inputRight);  

    var sliname="";
    sliname = 'slider'+String([i]);
    
    var slider_var = document.getElementById(sliname);
    var track = document.createElement("div");
    track.setAttribute("class","track");
    track.setAttribute("id","track"+[i]);

    var range = document.createElement("div");
    range.setAttribute("class","range");
    range.setAttribute("id","range"+[[i]]);

    var thumbLeft = document.createElement("div");
    thumbLeft.setAttribute("class","thumb left");
    thumbLeft.setAttribute("id","thumbleft"+[i]);


    var thumbRight = document.createElement("div");
    thumbRight.setAttribute("class","thumb right");
    thumbRight.setAttribute("id","thumbright"+[i]);
    
    slider_var.append(track,range,thumbLeft,thumbRight);
    
     lab.push(document.getElementById("something"+[i]));
    lab2.push(document.getElementById("something2"+[i]));

    inputLeft.addEventListener("mouseover",changecolor);
    inputLeft.addEventListener("mouseout",returncolor);
    inputRight.addEventListener("mouseover",changecolorR);
    inputRight.addEventListener("mouseout",returncolorR);
    inputLeft.addEventListener("input", setLeftValue);
    inputRight.addEventListener("input", setRightValue);
    inputLeft.addEventListener("build", sendLeftValue);
    inputRight.addEventListener("build",sendRightValue);
    inputLeft.dispatchEvent(event);

}; 
    $("div.slider").css({
        "position":"relative",
	    "z-index": "2",
	    "height": "0.5rem",
	    "margin":" 0 1rem"
    })
    $("div.track").css({
        "position": "absolute",
	"z-index": "2",
	"left": "0",
	"right": "0",
	"top": "0",
	"bottom": "0",
	"border-radius": "5px",
	"background-color":" white"
    })
    $("div.range").css({
        "position": "absolute",
       "z-index": "3",
        "left":" 25%",
        "right": "25%",
        "top": "0",
        "bottom":"0",
        "border-radius":" 5px",
        "background-image":"linear-gradient(to right,var(--g1),var(--g2 ))"
    })
    $("div.thumb").css({
        "top":"0.4rem",
       "position": "absolute",
	"z-index": "4",
	"width": "1rem",
	"height": "1rem",
	"background-color": "#6200ee",
	"border-radius": "50%",
    })
    $("div.thumb.left").css({
        "background-color":"rgb(20,20,20)",
        "left": "20%",
	"transform": "translate(-10px, -10px)"
    })
    $("div.thumb.right").css({
        "background-color":"rgb(20,20,20)",

        "right": "25%",
	"transform": "translate(10px, -10px)"
    })
}
    
 }
 create();
 control();
 function control(){

    baap = document.getElementsByClassName("multi-slider");
    for(i=0;i<baap.length;i++) {
        setLeftValue("input-left"+[i],"input-right"+[i]);
        setRightValue("input-right"+[i],"input-left"+[i]);
    }
}
})


