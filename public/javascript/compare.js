pli=document.createElement("li");
ul_par=document.getElementById("ulpar");
bgrp = document.createElement("div");
bgrp.classList.add("btn-group");
pli.append(bgrp);
ul_par.append(pli);

function delete_product(this_){
  console.log(this_.id);
  id=this_.id.split('||');
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
      location.reload();
}
function removeAllInstances(arr, item) {
  for (var i = arr.length; i--;) {
    if (arr[i] === item) arr.splice(i, 1);
    if (i==0) return arr;
  }
}
function create_tablelayout_button(result_table){
    if(!document.getElementById(result_table)){
          bgrp=document.getElementsByClassName("btn-group")[0];
          but_1 =document.createElement("button");
          if(!document.getElementsByClassName('btner')[0]){
            but_1.classList.add("btner","active_layout");
          }
          else{
              but_1.classList.add("btner");
          }
          but_1.innerHTML=result_table;
          but_1.setAttribute('id',result_table);
          bgrp.append(but_1);
  
          but_1.setAttribute("onclick","change_prod_type(this)");
  }
  }

  function Loading_(){
    var animation = bodymovin.loadAnimation({
      container: document.getElementById('bm'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'https://www.pcbudge.com/images/pcbudgelogo/loading_logo2.json'
    })
  }
function remove_prev_data(pl){
    let px=document.getElementsByClassName('p_n');
 for (let p=0; p<pl;p++){
    px[0].remove();
 }
 get_data_for_compare();
}
document.getElementById('filter_button').remove();

async function get_data_for_compare(){
  Loading_();
    compare_data=Object(sessionStorage);
    console.log(JSON.stringify(compare_data));
    if (compare_data.length>0){
      if (compare_data.cases){
        delete compare_data.cases;
      }
      console.log(compare_data);
    fetch("http://localhost:3001/compare/data?data_id="+JSON.stringify(compare_data)).then(response=> response.json()).then(data=>load_data(data)); 
    }
    else{
      if(document.getElementById('yopage_loader')) document.getElementById('yopage_loader').remove();
     let emp =document.createElement('h1');
     emp.id='emp_id';
     emp.setAttribute('class','emp_class');
     emp.innerHTML='Compare cart is empty.';
     document.getElementsByClassName('compare_data')[0].append(emp);
   }
} 
function load_data(data) {
    for (let dat in data.data[0]){  
        let prod_names=[];
       create_tablelayout_button(dat);
        let al=document.getElementsByClassName('active_layout')[0].id;
        if(dat==al){
            var col_flag=true;
            var count=0;
            data.data[0][al].forEach(function(product){  
                if (dat=='processors'){
                prod_names.push(product.processor_name.substring(0,20));
              }
              else{
                prod_names.push(product.prod_name.substring(0,20));

              }
                let tab_cont=document.getElementById('pname_true');
                let tr=document.createElement('tr');
                tr.classList.add(al+'_prnames','p_n','c'+count);
                let td1= document.createElement('td');
                let td2= document.createElement('td');
                let td3= document.createElement('td');
                let del = document.createElement('img');
                del.setAttribute('src','http://localhost:3001/logos/delete2.svg');
                del.style='width:2rem;margin:auto;transition:0.5s;';
                td3.setAttribute('onClick','delete_product(this)');
                td3.setAttribute('class','delete_button');

                if (dat=='processors'){
                  td1.innerText=product.processor_name;
                  td3.id=product.uniqid+'||'+al;

                }
                else{
                  td1.innerText=product.prod_name;
                  td3.id=product.uid+'||'+al;

                }
                td2.innerText=product.brand;
               td3.append(del); 
                tr.append(td1,td2,td3);
                count+=1;
                tab_cont.append(tr);
                col_flag = !col_flag
                
            });
            process_data(al,data.data[0][al],prod_names);
        }      
        } 
        if(document.getElementsByTagName('td').length ==0){
          let emp = build_element('h1','emp_id','emp_class','Compare cart is empty.');
          console.log(emp);
          document.getElementsByClassName('compare_data')[0].append(emp);
        }
        if(document.getElementById('yopage_loader')) document.getElementById('yopage_loader').remove();
}
function process_data(al,product,prod_names){
     if (al =='ram'){

     let p_con =document.getElementsByClassName('compare_data')[0]; 
     
      //memory type
      let header_container=build_element('div','mt_header col-11','header');
       let mt_header=build_element('h1','mt_h1','mt_header_text','Memory Type');
        header_container.append(mt_header);

      let ms_header_container=build_element('div','ms_header col-11','header');
      let ms_header=build_element('h1','mt_h1','ms_header_text','Memory Speed');
       ms_header_container.append(ms_header);

      let sc_header_container=build_element('div','sc_header col-11','header');
      let sc_header=build_element('h1','mt_h1','sc_header_text','Memory Size Configuration');
      sc_header_container.append(sc_header);

        y_axis_memory_type={0:'NA',1:'DDR1',2:'DDR2',3:'DDR3',4:'DDR4',5:'DDR5'}
        y_axis_memory_speed={};
        y_axis_size_config={};

        let memory_type=[];
        let memory_speed=[];
        let format_n_light=[];
        let memory_size_config=[];
        let ram_size_obj=[];
        let mem_sizes=[];
        let bg_cols=['rgba(255, 58, 58, 1)','rgba(255, 140, 16, 1)','rgba(255, 58, 173, 1)','rgba(0, 135, 94, 1)','rgba(128, 138, 37, 1)',
        'rgba(146, 4, 58, 1)','rgba(79, 0, 0, 1)','rgba(0, 102, 255, 1)','rgba(0, 255, 251, 1)',' rgba(86, 67, 255, 1)'];
        let mt = document.createElement('canvas');
        mt.style='min-width:100%;min-height:20rem';

        let ms = document.createElement('canvas');
        ms.style='min-width:100%;min-height:40rem';

        let sc = document.createElement('canvas');
        sc.style='min-width:100%;min-height:40rem';
        product.forEach(function(p){
          //console.log(p.sticks_count,p.stick_size,p.total_size);
          let temp_size=[];
          for(let sc=0; sc<p.sticks_count;sc++){
                temp_size.push(p.stick_size);
          }
          memory_size_config.push(temp_size);
          mem_sizes.push(p.total_size);
          memory_speed.push(p.tested_speed);
          memory_type.push(p.ram_memory_type.replace( /^\D+/g, ''));
          format_n_light.push({'prod_name':p.prod_name.substring(0,20),'format':p.memory_format.substring(0,20),'lights':p.lights.substring(0,20)});

        });

      memory_size_config.forEach(lis=>{
        for(let tem=0;tem<8;tem++){
        if (ram_size_obj[tem]){
            ram_size_obj[tem].data.push(lis[tem]);
        }
        else{
          ram_size_obj[tem]={};
           ram_size_obj[tem].data=[lis[tem]];
          ram_size_obj[tem].label='stick'+tem;
          ram_size_obj[tem].backgroundColor=bg_cols[tem];
          ram_size_obj[tem].borderColor='black';
          ram_size_obj[tem].borderWidth=2;
        }
      }
      })
     // console.log(ram_size_obj)
        

        mt.id='mem_type';
        mt.class='gp';

        ms.id='mem_speed';
        ms.class='gp';

        sc.id='mem_speed';
        sc.class='gp';

        let canvas_container = document.createElement('div');
        canvas_container.setAttribute('class','col-md-12 canvas_contaier');
        canvas_container.append(mt);

        let ms_canvas_container = document.createElement('div');
        ms_canvas_container.setAttribute('class','col-md-12 canvas_contaier');
        ms_canvas_container.append(ms);

        let sc_canvas_container = document.createElement('div');
        sc_canvas_container.setAttribute('class','col-md-12 canvas_contaier');
        sc_canvas_container.append(sc);
        
        graph(mt,prod_names,'bar',y_axis_memory_type,memory_type,'Memory Type',0,5,1);
        graph(ms,prod_names,'bar',y_axis_memory_speed,memory_speed,'Memory Speed',300,Math.max.apply(Math,memory_speed),100);
        graph(sc,prod_names,'stacked_bar',y_axis_size_config,ram_size_obj,'Memory Size Configuration',0,Math.max.apply(Math,mem_sizes),2);


        //memory_format
        let header_container_mf=build_element('div','mf_header col-11','header')
        let mf_header=build_element('h1','mf_h1','mf_header_text','Memory Format and lighting');
        header_container_mf.append(mf_header);

        let mf_tabs=build_double_table('mfnl',{'prod_name':'Product Names','format':'Memory Format','lights':'Lights'},format_n_light);
        //console.log(memory_size_config);
        p_con.append(header_container,canvas_container,header_container_mf,mf_tabs[0],mf_tabs[1],ms_header_container,ms_canvas_container,
          sc_header_container,sc_canvas_container);
        
     }
     else if(al=='motherboard'){
      let p_con =document.getElementsByClassName('compare_data')[0]; 

      let header_container=build_element('div','mt_header col-11','header');
      let mt_header=build_element('h1','mt_h1','mt_header_text','Memory Type');
      header_container.append(mt_header);

      let ds_header_container=build_element('div','ds_header col-11','header');
      let ds_header=build_element('h1','mt_h1','ds_header_text','DIMM slots');
      ds_header_container.append(ds_header);

      let header_container_sc=build_element('div','scbw_header col-11','header')
      let sc_header=build_element('h1','mf_h1','scbw_header_text','Socket & Chipset');
      header_container_sc.append(sc_header);
      
      let header_container_m2=build_element('div','m2_header col-11','header')
      let m2_header=build_element('h1','mf_h1','m2_header_text','M2 NVMe slots');
      header_container_m2.append(m2_header);

      let header_container_msize=build_element('div','msize_header col-11','header')
      let msize_header=build_element('h1','mf_h1','msize_header_text','Max Ram Size');
      header_container_msize.append(msize_header);

      let header_container_bw=build_element('div','bw_header col-11','header')
      let bw_header=build_element('h1','mf_h1','bw_header_text','Bluetooth & Wifi');
      header_container_bw.append(bw_header);

      let header_container_sata=build_element('div','sata_header col-11','header')
      let sata_header=build_element('h1','mf_h1','sata_header_text','SATA Connectors');
      header_container_sata.append(sata_header);

      y_axis_memory_type={0:'NA',1:'DDR',2:'DDR2',3:'DDR3',4:'DDR4',5:'DDR5'};
      y_axis_DIMM_slots={};
      y_axis_m2_slots ={};
      y_axis_msize={};
      y_axis_sata={};

      let memory_type=[];
      let ram_slots=[];
      let sc=[];
      let bw=[];
      let m2_slots=[];
      let msize_max=[];
      let sata=[];

      let mt = document.createElement('canvas');
      mt.style='min-width:100%;min-height:20rem';

      let ds = document.createElement('canvas');
      ds.style='min-width:100%;min-height:20rem';

      let m2 = document.createElement('canvas');
      m2.style='min-width:100%;min-height:20rem';

      let msize = document.createElement('canvas');
      msize.style='min-width:100%;min-height:20rem';

      let sata_c = document.createElement('canvas');
      sata_c.style='min-width:100%;min-height:20rem';

      product.forEach(function(p){
        if(p.RAM_DDR >5 ?memory_type.push(1):memory_type.push(p.RAM_DDR));
        ram_slots.push(p.RAM_slots);
        sc.push({'prod_name':p.prod_name,'socket':p.socket,'chipset':p.chipset});
        bw.push({'prod_name':p.prod_name,'bluetooth':String(p.bluetooth),'wifi':String(p.wifi)});
        m2_slots.push(p.M2_slots);
        msize_max.push(p.RAM_max);
        sata.push(p.SATA_count);
      })
      console.log(sc);
      mt.id='mem_type';
      mt.class='gp';

      ds.id='dimm_slots';
      ds.class='gp';

      m2.id='m2_slots';
      m2.class='gp';

      msize.id='msize';
      msize.class='gp';

      sata.id='msize';
      sata.class='gp';
      
      console.log(bw);
      let sc_tab = build_double_table('mfnl',{'prod_name':'Product Names','socket':'Socket/Processor','chipset':'Chipset'},sc);
      let bw_tab = build_double_table('bw',{'prod_name':'Product Names','bluetooth':'Bluetooth','wifi':'Wifi'},bw);

      
      let canvas_container = document.createElement('div');
      canvas_container.setAttribute('class','col-md-12 canvas_contaier');
      canvas_container.append(mt);

      let ds_canvas_container = document.createElement('div');
      ds_canvas_container.setAttribute('class','col-md-12 canvas_contaier');
      ds_canvas_container.append(ds);

      let m2_canvas_container = document.createElement('div');
      m2_canvas_container.setAttribute('class','col-md-12 canvas_contaier');
      m2_canvas_container.append(m2);

      let msize_canvas_container = document.createElement('div');
      msize_canvas_container.setAttribute('class','col-md-12 canvas_contaier');
      msize_canvas_container.append(msize);

      let sata_canvas_container = document.createElement('div');
      sata_canvas_container.setAttribute('class','col-md-12 canvas_contaier');
      sata_canvas_container.append(sata_c);

      graph(mt,prod_names,'bar',y_axis_memory_type,memory_type,'Memory Type',0,Math.max.apply(Math,memory_type),1);
      graph(ds,prod_names,'bar',y_axis_DIMM_slots,ram_slots,'DIMM slots',0,Math.max.apply(Math,ram_slots),1);
      graph(m2,prod_names,'bar',y_axis_m2_slots,m2_slots,'M2 NVMe slots',0,Math.max.apply(Math,m2_slots),1);
      graph(msize,prod_names,'bar',y_axis_msize,msize_max,'Max Ram Size',0,Math.max.apply(Math,msize_max),1);
      graph(sata_c,prod_names,'bar',y_axis_sata,sata,'SATA Connectors',0,Math.max.apply(Math,sata),1);

      console.log(bw_tab[0],bw_tab[1])

      p_con.append(header_container,canvas_container,ds_header_container,ds_canvas_container,header_container_sc,sc_tab[0],sc_tab[1],
        header_container_m2,m2_canvas_container,header_container_msize,msize_canvas_container,header_container_bw,bw_tab[0],bw_tab[1],
        header_container_sata ,sata_canvas_container);
     }
     else if (al=='graphic_card'){
    let p_con =document.getElementsByClassName('compare_data')[0]; 
      
    let gencf_header_container=build_element('div','gencf_header col-11','header');
    let gencf_header=build_element('h1','gencf_h1','gencf_header_text','Graphic Engine & Crossfire');
    gencf_header_container.append(gencf_header);

    let bsr_header_container=build_element('div','bsr_header col-11','header');
    let bsr_header=build_element('h1','bsr_h1','bsr_header_text','Bus Standard & Resolution');
    bsr_header_container.append(bsr_header);
 
    y_axis_ds={};
    y_axis_core={};
    y_axis_bsr={};
    y_axis_vm={};

    let dis_sup=[];
    let gencf=[];
    let core=[];
    let bsr=[];
    let vm_gb=[];

    product.forEach(function(p){
      dis_sup.push(p.display_support);
      gencf.push({'prod_name':p.prod_name.substring(0,25),'ge':p.graphic_engine,'cf':p.crossfire})
      bsr.push({'prod_name':p.prod_name.substring(0,25),'bs':p.bus_standard,'r':p.resolution})
      core.push(p.core);
      vm_gb.push(p.video_memory_gb);
    })

    let gencf_tab=build_double_table('mfnl',{'prod_name':'Product Names','ge':'Graphic Engine','cf':'Crossfire'},gencf);
    let bsr_tab=build_double_table('mfnl',{'prod_name':'Product Names','bs':'Bus Standard','r':'Resolution'},bsr);



    let sup_dis=build_graph({header:'ds',header_text:'Display Support',data:dis_sup,height:'20rem',y_axis:y_axis_ds ,pn:prod_names})
    let call_core=build_graph({header:'co',header_text:'Core',data:core,height:'40rem',y_axis:y_axis_core ,pn:prod_names})
    let vm_call=build_graph({header:'vm',header_text:'Video Memory Size',data:vm_gb,height:'20rem',y_axis:y_axis_vm ,pn:prod_names})
    p_con.append(sup_dis[0],sup_dis[1],gencf_header_container,gencf_tab[0],gencf_tab[1],call_core[0],call_core[1]
      ,bsr_header_container,bsr_tab[0],bsr_tab[1],vm_call[0],vm_call[1]);
    }
    else if (al=='processors'){
      let p_con =document.getElementsByClassName('compare_data')[0]; 
      
      let platform_hc=build_element('div','platform_header col-11','header');
      let platform_h=build_element('h1','platform_h1','platform_header_text','Platform and Socket');
      platform_hc.append(platform_h);

      let y_axis_cores={}
      let y_thread={}
      let y_bf={}
      let y_mf={}
      let y_cache={}
      let y_memory_type={0:'NA',1:'DDR1',2:'DDR2',3:'DDR3',4:'DDR4',5:'DDR5'}
      let y_mem_channel={}


      let cores=[]
      let thread=[]
      let bf=[]
      let mf=[]
      let cache=[]
      let mt=[]
      let mc=[]
      let platform=[]

      product.forEach(function(p){
          cores.push(p.cores);
          thread.push(p.thread);
          bf.push(p.base_frequency);
          mf.push(p.max_frequency);
          cache.push(p.cache);
          mt.push(p.ddrv);
          mc.push(p.memory_channel);
          platform.push({'prod_name':p.processor_name.substring(0,25),'p':p.platform,'s':p.socket});
      })

      let platform_tab=build_double_table('platform',{'prod_name':'Product Names','p':'Platform','s':'Socket'},platform);

      let call_core=build_graph({header:'co',header_text:'Cores',data:cores,height:'20rem',y_axis:y_axis_cores ,pn:prod_names})
      let call_thread=build_graph({header:'th',header_text:'Threads',data:thread,height:'20rem',y_axis:y_thread ,pn:prod_names})
      let call_bf=build_graph({header:'bf',header_text:'CPU Base Frequency',data:bf,height:'20rem',y_axis:y_bf ,pn:prod_names})
      let call_mf=build_graph({header:'mf',header_text:'CPU Max Frequency',data:mf,height:'20rem',y_axis:y_mf ,pn:prod_names})

      let call_cache=build_graph({header:'ca',header_text:'Cache',data:cache,height:'20rem',y_axis:y_cache ,pn:prod_names})

      let call_mt=build_graph({header:'mt',header_text:'Memory Type ',data:mt,height:'20rem',y_axis:y_memory_type ,pn:prod_names})

      let call_mc=build_graph({header:'mc',header_text:'Memory Channel',data:mc,height:'20rem',y_axis:y_mem_channel ,pn:prod_names})


      p_con.append(call_core[0],call_core[1],call_thread[0],call_thread[1],call_bf[0],call_bf[1],call_mf[0],call_mf[1]
        ,platform_hc,platform_tab[0],platform_tab[1],call_cache[0],call_cache[1],
       call_mt[0],call_mt[1],call_mc[0],call_mc[1] )
    }
}

function change_prod_type(elem){
    let lis=String(elem.classList);
    let prod_names=document.getElementsByClassName('p_n');
    let pl=prod_names.length;
    if(!lis.includes('active_layout')){
        remove_prev_data(pl);
        if (document.getElementsByClassName('compare_data')[0]) document.getElementsByClassName('compare_data')[0].innerHTML="";
    }

    let buts= document.getElementsByClassName('btner');
   for (but in buts){
    if (buts[but].classList){
       buts[but].classList.remove('active_layout');
       }
    }
    elem.classList.add('active_layout');
}
let bar_color=['rgba(255, 58, 58,0.8)','rgba(255, 140, 16,0.8)','rgba(255, 58, 173,0.8)','rgba(0, 135, 94,0.8)','rgba(128, 138, 37,0.8)',
'rgba(146,4,58,0.8)']
let bar_border=['rgba(255, 58, 58, 1)','rgba(255, 140, 16, 1)','rgba(255, 58, 173, 1)','rgba(0, 135, 94, 1)','rgba(128, 138, 37, 1)',
'rgba(146, 4, 58, 1)','rgba(79, 0, 0, 1)','rgba(0, 102, 255, 1)','rgba(0, 255, 251, 1)',' rgba(86, 67, 255, 1)']


function graph(mt,rod_names,type,y_axis_label,data_x,title,min_y,max_y,sz){
  //console.log(max_y);
if(type=='bar'){
 // console.log(y_axis_label[0])
const ctx =mt.getContext('2d');
gradient1 = ctx.createLinearGradient(0, 0, 0, 450);gradient1.addColorStop(0, 'rgba(0,0,70,0.8)');gradient1.addColorStop(0.5, 'rgba(28,181,224,1)');
gradient2 = ctx.createLinearGradient(0, 0, 0, 450);gradient2.addColorStop(0, 'rgba(32,1,34,0.8)');gradient2.addColorStop(0.5, 'rgba(111,0,0,1)');
gradient3 = ctx.createLinearGradient(0, 0, 0, 450);gradient3.addColorStop(0, 'rgba(0,0,0,0.8)');gradient3.addColorStop(0.5, 'rgba(67,67,67,1)');
gradient4 = ctx.createLinearGradient(0, 0, 0, 450);gradient4.addColorStop(0, 'rgba(255,78,80,0.8)');gradient4.addColorStop(0.5, 'rgba(249,212,35,1)');
gradient5 = ctx.createLinearGradient(0, 0, 0, 450);gradient5.addColorStop(0, 'rgba(86,171,47,0.8)');gradient5.addColorStop(0.5, 'rgba(168,224,99,1)');


const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels:rod_names,
        
        datasets: [{
            data: data_x,
            backgroundColor:[gradient1,gradient2,gradient3,gradient4,gradient5],
            borderColor: 'black',
            borderWidth: 1,
            pointBorderColor: "black",
            borderRadius:10
           
        }]
    },options: {
        
      responsive: true,
      maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            position: 'bottom',
            labels: {
              fontColor: "black",
            }
          },
          title: {
            display: true,
            text: title,
            color:'black',
            fontSize: 56,
          }
        }, 
        scales: {    
          x: {   
            ticks: {
                font:{size:9},
              grid:{color:'black'},
              color: 'black',
            },beginAtZero: true,
            grid:{color:'black'}
          },
          y: {
            ticks: {     
              font:{size:9}, 
              color: 'black',
              stepSize: sz,
              callback: function(value, index, values) {
                
                if (y_axis_label[0]) return y_axis_label[value];
                else if (value==0) return 'NA';
                else if (title.includes('Speed')) return value+'MHz';
                else if ( title.includes('Frequency') && title.includes('CPU')) return value+'GHz';
                else if (title.includes('Size')) return value+'GB';
                else return value;
              }
            },
            min: min_y,
            max: max_y,
            grid:{
              color:'black'},
          }
        }
      },
});

}
if(type=='stacked_bar'){
  
  //console.log(data_x)
const ctx =mt.getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels:rod_names,
          datasets:data_x,  
        
    },options: {
        
      responsive: true,
      maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            position: 'bottom',
            labels: {
              fontColor: "black",
            }
          },
          title: {
            display: true,
            text: title,
            color:'black',
            fontSize: 56,
          }
        }, 
        scales: {    
          x: {   
            stacked:true,
            ticks: {
                font:{size:9},
              grid:{color:'black'},
              color: 'black',
            },beginAtZero: true,
            grid:{color:'black'}
          },
          y: {
            stacked:true,

            ticks: {     
              font:{size:9}, 
              color: 'black',
              stepSize: sz,
              callback: function(value, index, values) {
                
                if (y_axis_label[0]) return y_axis_label[value];
                else if (title.includes('Size')) return value+'GB';
                else value;
               
              }
            },
            min: min_y,
            max: max_y,
            grid:{
              color:'black'},
          }
        }
      },
});

}

}
get_data_for_compare()