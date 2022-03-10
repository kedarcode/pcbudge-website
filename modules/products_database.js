var hoja = require("../database");
const db = hoja.db;

async function  prod_count(prod_type){
    mb_count = 0;
     let cnt =await db.query("select * from ??",prod_type,(error,result)=>{
         if (result.length>0){
         return result.length;}               
     });
     return cnt.length;
 };
 
 class Operation{
    generate_query(filter_conditions,offset,tp){
        
        let query_gen=tp;
        for(let i in filter_conditions){
                let spli_i = String(i).split("-");
                if(spli_i[0]=="chipset"){           
                        if(spli_i[1]=="dp"){
                            query_gen = query_gen+" and replace(chipset,' ','')='"+filter_conditions[i]+"'";
                        }
                        else if(spli_i[1] == "nbdp"){

                            query_gen = query_gen+" and (replace(chipset,' ','') like '%"+filter_conditions[i]+"%')";
                            
                        }
                        else if(spli_i[1] == "sbdp"){
                            query_gen =query_gen+" and (replace(chipset,' ','') like '%"+filter_conditions[i]+"')";

                        }
                        else{
                            query_gen=""
                        }
                   
            }
                else if(spli_i[1].includes("range")){
                    query_gen= query_gen + " and("+ spli_i[0] +" BETWEEN " +filter_conditions[i][0] + " AND " + filter_conditions[i][1]+")";
                    
                }
                else if(spli_i[0]=="memory_type"){
                    query_gen= query_gen + " and ("+spli_i[0]+" like '%"+filter_conditions[i]+"%'"+ "or "+spli_i[0]+" like '"+filter_conditions[i]+"%'"+ " or "+spli_i[0]+" like '%"+filter_conditions[i]+"'"+" or "+spli_i[0]+" like '"+filter_conditions[i]+"')"
                }
                else if (spli_i[1].includes("dpin")){
                    query_gen= query_gen + " and ("+ spli_i[0] +" like '%" +filter_conditions[i] + "%' or "+ spli_i[0] +" like '%" +filter_conditions[i] +"' or "+ spli_i[0] +" like '" +filter_conditions[i]+"%'" +" or replace("+ spli_i[0] +",' ','')= '"+filter_conditions[i]+"' )";
                }
                else if (spli_i[1].includes("dpbool")){
                    if(filter_conditions[i]=='Yes' || filter_conditions[i]=='1'){
                    query_gen= query_gen + " and ("+ spli_i[0] +" not like '%no%' and "+ spli_i[0] +" not like '%no' and "+ spli_i[0] +" not like 'no%' and "+ spli_i[0] +" not like '%not%'  and "+ spli_i[0] +" not like '%not' and "+ spli_i[0] +" not like 'not%' and "+ spli_i[0] +" !='NA' )" ;
                    }
                    else{
                        query_gen= query_gen + " and ("+ spli_i[0] +" like '%no%' or "+ spli_i[0] +" like '%no' or "+ spli_i[0] +" like 'no%' or "+ spli_i[0] +" like '%not%'  or "+ spli_i[0] +" like '%not' or "+ spli_i[0] +" like 'not%' or "+ spli_i[0] +" ='NA' ) " ;

                    }
                }    
                else{
                        query_gen=query_gen+" and replace("+spli_i[0]+",' ','')='"+filter_conditions[i]+"'";       
                    
                }
                
            }  
            let query_gen_count=query_gen.replace("brand","count(*) as count");
        return [query_gen+"order by rand() limit 10 offset "+offset,query_gen_count];
    }

    async process_comp_gc(uid){
        let pci_count=await db.query("select pci_slot_count from all_motherboard where uid=?",uid,(error,result)=>{
            if (error){
                return error;
            }   
            else{
               result;
            }            
        });
        if(!isNaN(pci_count[0]['pci_slot_count'])){
            return '( size_comp <='+pci_count[0]['pci_slot_count']+' and  slot != "NA")'
            }
         else return '( slot != "NA")'
    }
    async select_data(data){
    let query_sel= 'select '+data.field+' from '+data.table+' where uid='+data.uid ;
    const prods = await db.query(query_sel,0,(error,result)=>{
        if (error){return error;}
        else{
            return result;   
        }            
    });
    return prods[0].ms_form;
    }
    async compare_data(keys,obj_data){
        let fetched_data ={};
        for (let pt in keys){
            let ptype_comp= keys[pt];
            let ids_c=String(obj_data[keys[pt]]).replace('[','').replace(']','');
        if (ids_c !='' && keys[pt]!='processors'){
        
           fetched_data[ptype_comp]=await db.query('select * from all_'+keys[pt]+' where uid in ('+ids_c+')',0,(error,result)=>{
                if (error){return error;}
                else{
                    console.log(result)
                    return result;      
                }            
            })
        }
        else if (ids_c !='' && keys[pt]=='processors'){
        
            fetched_data[ptype_comp]=await db.query('select * from all_'+keys[pt]+' where uniqid in ('+ids_c+')',0,(error,result)=>{
                 if (error){return error;}
                 else{
                     console.log(result)
                     return result;      
                 }            
             })
         }
        }
        return [fetched_data];
    }
 }
class Motherboard extends Operation{
    async motherboard_list(offset,filter_conditions){
        
        if(!offset)
        {offset=0;}
        if(!filter_conditions){
        let magic_query ='select brand,prod_name,socket,images,uid,chipset,RAM_DDR,RAM_slots,RAM_max,M2_slots,SATA_count,PCIE_slots,mb_size,wifi,bluetooth from all_motherboard where (status in (26,27,28) or status>36) and images!="NA" order by rand() limit 12  offset '+offset;
        let query_count = 'select count(*) as count from all_motherboard where (status in (26,27,28) or status>36) and  images!="NA"';
        const prodname = await db.query(magic_query,0,(error,result)=>{
            if (error){return error;}
            else{
                return result;
                
            }            
        });
        const prodcount= await db.query(query_count,0,(error,count)=>{
            if (error){return error;}
            else{
                return count;
                
            }            
        });
        return  [prodname,prodcount[0]];
    }   
    else if(filter_conditions){
        let def_query='select  brand,prod_name,socket,images,uid,chipset,RAM_DDR,RAM_slots,RAM_max,M2_slots,SATA_count,PCIE_slots,mb_size,wifi,bluetooth from all_motherboard where (status in (26,27,28) or status>36) and images!="NA" '; 
        const prodname = await db.query(this.generate_query(filter_conditions,offset,def_query)[0],0,(error,result)=>{
            if (error){return error;}
            else{
                return result;            
            }            
        });
        const prodcount= await db.query(this.generate_query(filter_conditions,offset,def_query)[1],0,(error,count)=>{
            if (error){return error;}
            else{
                return count;           
            }            
        });
        return  [prodname,prodcount[0]];
    }
  
        
    }
    async single_product(uid){
    const prod_details = await db.query('select * from all_motherboard as details where uid= ?',[parseInt(uid)],(error,result)=>{
            if (error){return error;}
            else{
                return result;   
            }            
        });       
    const compatible_processor=await db.query('SELECT processor_name,uniqid from all_processors where ((platform="desktop" or platform="Boxed Processor") and processor_name !="NA") and  (sm_id=(select sm_id from all_motherboard where uid='+uid+')) and memory_type like concat("%DDR",(select RAM_DDR from all_motherboard where uid = '+parseInt(uid)+' ),"%") ' ,parseInt(uid),(error,result)=>{
            if (error){return error;}
            else{     
                return result;  
            }            
        });       
    const compatible_graphic_card= await db.query('select prod_name,uid from all_graphic_card where (bus_standard like  concat("%",(select gc_bus_standard from all_motherboard where uid='+uid+'),"%") and bus_standard not like "NA") and '+await this.process_comp_gc(uid),0,(error,result)=>{
    if (error){return error;}
    else{     
        return result;  
    } 
        });
    const compatible_ram=await db.query('SELECT prod_name,uid from all_ram where (sticks_count <=(select RAM_slots from all_motherboard where uid ='+uid+')) and (total_size <= (select RAM_max from all_motherboard where uid ='+uid+')) and ( ram_memory_type like concat("%",(select RAM_DDR from all_motherboard where uid='+uid+'))) and memory_format="DIMM"' ,parseInt(uid),(error,result)=>{
        if (error){return error;}
        else{     
            return result;  
        }            
    });   
    console.log('select prod_name,uid from all_chassies where ms_form like concat("%",(select mb_size from all_motherboard where uid='+uid+'),"%") and ms_form !="NA" ')
    const compatible_case= await db.query('select prod_name,uid from all_chassies where ms_form like concat("%",(select mb_size from all_motherboard where uid='+uid+'),"%") and ms_form !="NA" ',0,(error,result)=>{
        if (error){return error;}
        else{     
            return result;  
        } 
            });
    return await {details:{'uid':prod_details[0].uid,'Brand':prod_details[0].brand,'Socket':prod_details[0].socket,'Chipset':prod_details[0].chipset,'DIMM slots':prod_details[0].RAM_slots,
    'Max RAM':prod_details[0].RAM_max+'GB','RAM DDR':'DDR'+prod_details[0].RAM_DDR,'Form Factor':prod_details[0].mb_size,'Bluetooth':prod_details[0].bluetooth,'WI-FI':prod_details[0].wifi,
    'M2 slots':prod_details[0].M2_slots+ ' slots','SATA connectors':prod_details[0].SATA_count+' connectors','PCI/PCI-E':prod_details[0].PCIE_slots,prod_name:prod_details[0].prod_name,
images:prod_details[0].images,'spec_link':prod_details[0].specLink},compatible:{'Compatible Processor':compatible_processor,'Compatible Graphic card':compatible_graphic_card,
        'Compatible Ram': compatible_ram,'Compatible case':compatible_case}};
    }
     async filter(){
       const filter_sockety = await db.query('select distinct socket from all_motherboard where (status in (26,27,28) or status>36) and (socket not like "%processor%core%") and (socket not like"%core%processor%")and(socket not like"%processor%")and(socket not like"%APU")and(socket not like"%core%")',0, async(error,sockets_filth)=>{
            if (error){return error;}
            else{
                  return sockets_filth.socket;            
                
            }            
        });
       const filter_chipset = await db.query('select distinct chipset from all_motherboard where (status in (26,27,28) or status>36) and (chipset not like "%northbridge%") and (chipset not like"northbridge%")and(chipset not like"%southbridge%")and(chipset not like"southbridge%")',0,(error,result)=>{
            if (error){return error;}
            else{
                return result;
                
            }            
        });
        const filter_inbuild_processor = await db.query('select distinct socket from all_motherboard where socket  like "%processor%" or socket like "%APU" or socket like "%core%"',0,(error,result)=>{
            if (error){return error;}
            else{
                return result;
                
            }            
        });
        const northbridge = await db.query('select distinct chipset from all_motherboard where chipset  like "%northbridge%" or socket like "%northbridge" or socket like "northbridge%"',0,(error,result)=>{
            if (error){return error;}
            else{
                return result;
                
            }            
        });
        const sounthbridge = await db.query('select distinct chipset from all_motherboard where chipset  like "%southbridge%" or socket like "%southbridge" or socket like "southbridge%"',0,(error,result)=>{
            if (error){return error;}
            else{
                return result;
                
            }            
        });
        const mb_size = await db.query('select distinct mb_size from all_motherboard',0,(error,result)=>{
            if (error){return error;}
            else{
                return result;
                
            }            
        });

        const brand = await db.query('select distinct brand from all_motherboard',0,(error,result)=>{
            if (error){return error;}
            else{
                return result;
                
            }            
        });
        return [filter_sockety,filter_chipset,filter_inbuild_processor,northbridge,sounthbridge,mb_size,brand];
    }
}
class Processors extends Operation{
    async processor_list(offset,filter_conditions){
        
        if(!offset)
        {offset=0;}
        if(!filter_conditions){
        let magic_query ='select uniqid,brand,family,processor_name,collection,platform,launch_date,CMOS,cores,thread,base_frequency,max_frequency,cache,max_memory,memory_type,pci_version,socket,max_temperature,tdp,gpu_core from all_processors order by rand() limit 12  offset '+offset;
        let query_count = 'select count(*) as count from all_processors ';
        const prodname = await db.query(magic_query,0,(error,result)=>{
            if (error){return error;}
            else{
                return result;
                
            }            
        });
        const prodcount= await db.query(query_count,0,(error,count)=>{
            if (error){return error;}
            else{
                return count;
                
            }            
        });
        return  [prodname,prodcount[0]];
    }   
    else if(filter_conditions){
        let def_que='select uniqid,brand,family,processor_name,collection,platform,launch_date,CMOS,cores,thread,base_frequency,max_frequency,cache,max_memory,memory_type,pci_version,socket,max_temperature,tdp,gpu_core from all_processors where processor_name !="NA"';  
        const prodname = await db.query(this.generate_query(filter_conditions,offset,def_que)[0],0,(error,result)=>{
            if (error){return error;}
            else{
                return result;            
            }            
        });
        const prodcount= await db.query(this.generate_query(filter_conditions,offset,def_que)[1],0,(error,count)=>{
            if (error){return error;}
            else{
                return count;           
            }            
        });
        return  [prodname,prodcount[0]];
    }
  
        
    }
    async single_product(uid){
        const prod_details = await db.query('select * from all_processors as details where uniqid= ?',[parseInt(uid)],(error,result)=>{
            if (error){return error;}
            else{
                return result;
                
            }            
        });       
        const compatible_motherboard=await db.query("SELECT prod_name,uid from all_motherboard where prod_name !='NA' and sm_id = (select sm_id from all_processors where uniqid=?) " ,parseInt(uid),(error,result)=>{
            if (error){return error;}
            else{
                
                return result;

                
            }            
        });     

        return  [prod_details,compatible_motherboard];
    }
    
    async filter(){
       const filter_brand = await db.query('select distinct brand from all_processors where brand != "" ',0, async(error,brand)=>{
            if (error){return error;}
            else{
                  return brand;                  
            }            
        });
       const filter_family = await db.query('select distinct family from all_processors',0,(error,result)=>{
            if (error){return error;}
            else{
                return result;         
            }            
        });
        const filter_collection = await db.query('select distinct collection from all_processors',0,(error,result)=>{
            if (error){return error;}
            else{
                return result;           
            }            
        });
        const filter_platform = await db.query('select distinct platform from all_processors',0,(error,result)=>{
            if (error){return error;}
            else{
                return result;
            
            }            
        });
        return [filter_brand,filter_family,filter_collection,filter_platform];
    }
    
}
class GraphicCard extends Operation{
    async graphic_card_list(offset,filter_conditions){
        
        if(!offset)
        {offset=0;}
        if(!filter_conditions){
        let magic_query ='select uid,prod_name,brand,graphic_engine,bus_standard,video_memory,video_memory_gb,engine_clock,core,memory_speed,memory_interface,resolution,display_support,crossfire,PSU,connectors,slot,images from all_graphic_card where graphic_engine != "NA" and images!="NA" and use_stat ="ok" order by rand() limit 12  offset ?';
        let query_count = 'select count(*) as count from all_graphic_card where graphic_engine != "NA" and images!="NA" and use_stat ="ok"';
        const prodname = await db.query(magic_query,0,(error,result)=>{
            if (error){return error;}
            else{
                console.log(result)
                return result;
                
            }            
        });
        const prodcount= await db.query(query_count,0,(error,count)=>{
            if (error){return error;}
            else{
                return count;
                
            }            
        });
        return  [prodname,prodcount[0]];
    }   
    else if(filter_conditions){
        let def_que='select uid,prod_name,brand,graphic_engine,bus_standard,video_memory,video_memory_gb,engine_clock,core,memory_speed,memory_interface,resolution,display_support,crossfire,PSU,connectors,slot,images from all_graphic_card where graphic_engine != "NA" and images!="NA" and use_stat ="ok"';    
        const prodname = await db.query(this.generate_query(filter_conditions,offset,def_que)[0],0,(error,result)=>{
            if (error){return error;}
            else{
                return result;            
            }            
        });
        const prodcount= await db.query(this.generate_query(filter_conditions,offset,def_que)[1],0,(error,count)=>{
            if (error){return error;}
            else{
                return count;           
            }            
        });
        return  [prodname,prodcount[0]];
    }
  
        
    }
    async single_product(uid){
        const prod_details = await db.query('select * from all_graphic_card as details where uid= ?',[parseInt(uid)],(error,result)=>{
            if (error){return error;}
            else{
                return result;                
            }            
        });  

        const compatible_motherboard=await db.query("SELECT prod_name,uid from all_motherboard where prod_name !='NA' and gc_bus_standard = (select pcie_vers from all_graphic_card where uid=?) and pci_slot_count >= (select size_comp from all_graphic_card where uid="+parseInt(uid)+") " ,parseInt(uid),(error,result)=>{
            if (error){return error;}
            else{
                
                return result;

                
            }            
        });      
        //console.log(prod_details);
        return await {details:{'uid':prod_details[0].uid,'Brand':prod_details[0].brand,'Graphic Engine':prod_details[0].graphic_engine,'Bus Standard':prod_details[0].bus_standard,'Video Memory':prod_details[0].video_memory+'GB',
    'Engine Clock':prod_details[0].engine_clock,'Core':prod_details[0].core,'Memory Speed':prod_details[0].memory_speed,'Memory Interface':prod_details[0].memory_interface+'bits','Resolution':prod_details[0].resolution,
    'Display Support':prod_details[0].display_support,'Crossfire':prod_details[0].crossfire,'PSU':prod_details[0].psu,'connectors':prod_details[0].connectors,'Slots':prod_details[0].slots,prod_name:prod_details[0].prod_name,
images:prod_details[0].images,'spec_link':prod_details[0].spec_link},compatible:{compatible_motherboard:compatible_motherboard}};
    }
    async filter(){
       const gp_brand = await db.query('select distinct brand from all_graphic_card',0, async(error,result)=>{
            if (error){return error;}
            else{
                    console.log(result)
                  return result;     
                
            }            
        });
        
    const gp_interface= await db.query('select distinct replace(memory_interface," ","") as memory_interface from all_graphic_card',0, async(error,result)=>{
            if (error){return error;}
            else{
                    console.log(result)
                  return result;     
                
            }            
        });

        return [gp_brand,gp_interface];
    }
}
class Ram extends Operation{
    async ram_list(offset,filter_conditions){
        
        if(!offset)
        {offset=0;}
        if(!filter_conditions){
        let magic_query ='select uid,prod_name,brand,series,ram_memory_type,tested_speed,memory_size,lights,memory_format,images,sticks_count,stick_size,total_size from all_ram where memory_size !="NA" and memory_size !="" order by rand() limit 12  offset ?';
        let query_count = 'select count(*) as count from all_ram where memory_size !="NA" and memory_size !=""';
        const prodname = await db.query(magic_query,0,(error,result)=>{
            if (error){return error;}
            else{
                console.log(result)
                return result;
                
            }            
        });
        const prodcount= await db.query(query_count,0,(error,count)=>{
            if (error){return error;}
            else{
                return count;
                
            }            
        });
        return  [prodname,prodcount[0]];
    }   
    else if(filter_conditions){     
        let def_que='select uid,prod_name,brand,series,ram_memory_type,tested_speed,memory_size,lights,memory_format,images,sticks_count,stick_size,total_size from all_ram where (memory_size !="NA" and memory_size !="") ';    
        const prodname = await db.query(this.generate_query(filter_conditions,offset,def_que)[0],0,(error,result)=>{
            if (error){return error;}
            else{
                return result;            
            }            
        });
        const prodcount= await db.query(this.generate_query(filter_conditions,offset,def_que)[1],0,(error,count)=>{
            if (error){return error;}
            else{
                return count;           
            }            
        });
        return  [prodname,prodcount[0]];
    }    
    }
    async single_product(uid){
        const prod_details = await db.query('select * from all_ram as details where uid= ?',[parseInt(uid)],(error,result)=>{
            if (error){return error;}
            else{
                return result;
                
            }            
        });       
        const compatible_motherboard=await db.query("SELECT prod_name,uid from all_motherboard where prod_name !='NA' and RAM_DDR = (select ddr_vers from all_ram where uid=?) and RAM_max <= (select total_size from all_ram where uid="+parseInt(uid)+")" ,parseInt(uid),(error,result)=>{
            if (error){return error;}
            else{           
                return result;              
            }            
        });           
        return await {details:{'uid':prod_details[0].uid,'Brand':prod_details[0].brand,'Series':prod_details[0].series,'Memory Type':prod_details[0].memory_type,'Memory Speed':prod_details[0].memory_speed+'MHz',
    'Lighting':prod_details[0].lights,'Memory Format':prod_details[0].memory_format,'Ram Stick count':prod_details[0].sticks_count,'Single Ram stick size':prod_details[0].stick_size,'Memory Size':prod_details[0].memory_size
    ,prod_name:prod_details[0].prod_name,'spec_link':prod_details[0].link,
images:prod_details[0].images},compatible:{compatible_motherboard:compatible_motherboard}};
    }
    async filter(){
       const brand = await db.query('select distinct brand from all_ram',0, async(error,result)=>{
            if (error){return error;}
            else{
                    console.log(result)
                  return result;     
                
            }            
        });
        
    const series= await db.query('select distinct series from all_ram where series!="NA" and series !=""',0, async(error,result)=>{
            if (error){return error;}
            else{
                    console.log(result)
                  return result;     
                
            }            
        });
    const memory_type= await db.query('select distinct ram_memory_type from all_ram where ram_memory_type!="NA" and ram_memory_type !=""',0, async(error,result)=>{
            if (error){return error;}
            else{
                    console.log(result)
                  return result;     
                
            }            
        });
     const memory_format= await db.query('select distinct memory_format from all_ram where memory_format!="NA" and memory_format !=""',0, async(error,result)=>{
            if (error){return error;}
            else{
                    console.log(result)
                  return result;               
            }    
        });

        return [brand,series,memory_type,memory_format];
    }
}
class Cases extends Operation{
    async case_list(offset,filter_conditions){
        
        if(!offset)
        {offset=0;}
        if(!filter_conditions){
        let magic_query ='select uid,prod_name,brand,form_factor,mb_support,psu_support,lim_cpu,lim_gpu,lim_psu,expansion_slot,model,dimensions,images from all_chassies where prod_name !="NA" and prod_name !="" order by rand() limit 12  offset ?';
        let query_count = 'select count(*) as count from all_chassies where prod_name !="NA" and prod_name !="" ';
        const prodname = await db.query(magic_query,0,(error,result)=>{
            if (error){return error;}
            else{
                console.log(result)
                return result;
                
            }            
        });
        const prodcount= await db.query(query_count,0,(error,count)=>{
            if (error){return error;}
            else{
                return count;
                
            }            
        });
        return  [prodname,prodcount[0]];
    }   
    else if(filter_conditions){     
        let def_que='select uid,prod_name,brand,form_factor,mb_support,dim,psu_support,lim_cpu,lim_gpu,lim_psu,expansion_slot,model,dimensions,images from all_chassies  where (prod_name !="NA" and prod_name !="" ) ';    
        const prodname = await db.query(this.generate_query(filter_conditions,offset,def_que)[0],0,(error,result)=>{
            if (error){return error;}
            else{
                return result;            
            }            
        });
        const prodcount= await db.query(this.generate_query(filter_conditions,offset,def_que)[1],0,(error,count)=>{
            if (error){return error;}
            else{
                return count;           
            }            
        });
        return  [prodname,prodcount[0]];
    }    
    }
    async single_product(uid){
        const prod_details = await db.query('select * from all_chassies as details where uid= ?',[parseInt(uid)],(error,result)=>{
            if (error){return error;}
            else{
                return result;
            }            
        });             
        const compatible_motherboard=await db.query('select uid,prod_name from all_motherboard where INSTR("'+await this.select_data({table:'all_chassies',field:'ms_form',uid:String(uid)})+'" ,mb_size) >0' ,parseInt(uid),(error,result)=>{
            if (error){return error;}
            else{           
          return result;              
            }            
        });  
        return await {details:{'uid':prod_details[0].uid,'Brand':prod_details[0].brand,'Material':prod_details[0].material,'Model':prod_details[0].model,'Motherboard Support':prod_details[0].memory_speed,
        'Power Supply Support':prod_details[0].psu_support,'CPU Limit':prod_details[0].lim_cpu,'Graphic Card Limit':prod_details[0].lim_gpu,'Power Supply Limit':prod_details[0].lim_psu,'Expansion Slots':prod_details[0].expansion_slot
        ,prod_name:prod_details[0].prod_name,
    images:prod_details[0].images},comatible:{compatible_motherboard:compatible_motherboard}};
    }
    async filter(){
       const brand = await db.query('select distinct brand from all_chassies',0, async(error,result)=>{
            if (error){return error;}
            else{
                    console.log(result)
                  return result;     
                
            }            
        }); 

        return [brand];
    }
}
class SearchEngine{
    async search_recon(search_str){

            const recom_res= await db.query(this.search_query(search_str),0,(error,result)=>{
                if (error){return error;}
                else{
                    return result;            
                }            
            });
            return recom_res;
    }
    async fetch_result(query,offset){
        let srch_res_sender=[];
        let stats=[];
        if(!query) return;
            for(let tab_res=0;tab_res<query.length;tab_res++){
            if(query[tab_res]!=""){
                let for_table=query[tab_res].split("/");
                srch_res_sender[tab_res] = await db.query(await for_table[0]+'limit 12 offset ?',parseInt(offset),(error,result)=>{
                    if(error){ return error; }
                    else{return [result];
                     } })   
               
                 stats[tab_res]=(await db.query(await for_table[0].replace('*','count(*)')+'limit 12 offset ?',parseInt(offset),(error,result)=>{
                        if(error){ return error; }
                        else{return result;
                         } })  )
                         stats[tab_res].push(for_table[1]);
                }                
            }
        return await [srch_res_sender,stats];
    }
    async search_result(search_string,offset){
        if(!offset){
            let offset=0;
        }
        if (search_string.includes(' ')){
            let withou_spa= await db.query("select distinct about,tab_name from tags where replace(tag,'™','') like '"+search_string+"' or replace(tag,'™','') like '%"+search_string+"%' or replace(tag,'™','') like '%"+search_string+"'or replace(tag,'™','') like '"+search_string+"%'",0,(error,sresult)=>{
                if(error){
                    return error;
                }
                else{
                    return sresult;
                }
            })
            if(withou_spa.length ==1){
                let emma_target=[];
                emma_target.push(withou_spa,search_string);
                let emma=await this.gen_query([emma_target]); 
                return this.fetch_result(emma,offset);
            }
            else{
            let ben=await this.srch_core(search_string);        
            return this.fetch_result(ben,offset)
        }
    }
        else {
            let target=[];
            let sing_tag= await db.query("select distinct about,tab_name from tags where tag  like '"+search_string+"' or tag like '%"+search_string+"%'or tag like '%"+search_string+"'or tag like '"+search_string+"%'",0,(error,sresult)=>{
                if(error){
                    return error;
                }
                else{
                    return sresult;
                }
            })
            target.push(sing_tag,search_string);
            let bunny =await this.gen_query([target]);  
            return this.fetch_result(bunny,offset);          
        }
    }
     search_query(str) {
       
        let  ret_str_pro = "select tag as processor_name from tags where replace(tag,'™','') like '"+str+"' or replace(tag,'™','') like '%"+str+"%'or replace(tag,'™','') like '%"+str+"'or replace(tag,'™','') like '"+str+"%'"  ; 
        return ret_str_pro+"order by rand() limit 5";
    }
    async srch_core(srch_target,ofs){
            let arr=[];    
            let toks=srch_target.split(" ");
                for(let i=0;i<toks.length;i++){
                    if(toks[i].length>2){
                    let res_tag= await db.query("select distinct about,tab_name from tags where replace(tag,'™','') like '"+toks[i]+"' or replace(tag,'™','') like '%"+toks[i]+"%'or replace(tag,'™','') like '%"+toks[i]+"'or replace(tag,'™','') like '"+toks[i]+"%'",0,(error,sresult)=>{
                        if(error){
                            return error;
                        }
                        else{
                            return sresult;
                        }
                    })
    
                   arr.push([await res_tag,toks[i]]);
                }}   
 
               return await this.gen_query(arr);   

            
            }


   gen_query(spic){
       let tabs=[];
       for(let y=0 ;y<spic.length;y++){
           for(let x=0; x <spic[y][0].length; x++){
               if(tabs[spic[y][0][x].tab_name]){
                tabs[spic[y][0][x].tab_name]=tabs[spic[y][0][x].tab_name] +"|||"+ spic[y][0][x].about;  
            }
                else{
                    tabs[spic[y][0][x].tab_name]=spic[y][1];
                    tabs[spic[y][0][x].tab_name]=tabs[spic[y][0][x].tab_name] +"|||"+ spic[y][0][x].about;  

                }       
           }}
        let que_stings= []
       let table_names=['all_processors',"all_motherboard","all_graphic_card"]
        for(let i=0;i<table_names.length;i++){
        if (tabs[table_names[i]]){
            let spi=tabs[table_names[i]].split('|||');
            for (let len=1; len<spi.length;len++){
                    if (que_stings[i]){
                        que_stings[i]=que_stings[i]+" and "+ spi[len]+ " like '%"+spi[0]+"%'" +" or "+ spi[len]+ " like '"+spi[0]+"%'"+" or "+ spi[len]+ " like '%"+spi[0]+"'";
                    }
                    else{
                        if(table_names[i] == 'all_processors'){
                        que_stings[i]="select * from "+table_names[i]+" where uniqid not like 'NA' "+ " and "+ spi[len]+ " like '%"+spi[0]+"%'" +" or "+ spi[len]+ " like '"+spi[0]+"%'"+" or "+ spi[len]+ " like '%"+spi[0]+"'";
                        }
                        else{
                            que_stings[i]="select * from "+table_names[i]+" where uid not like 'NA' "+ " and "+ spi[len]+ " like '%"+spi[0]+"%'" +" or "+ spi[len]+ " like '"+spi[0]+"%'"+" or "+ spi[len]+ " like '%"+spi[0]+"'";

                        }
                    }
                }
        } 
       }
      
        let res_to_return=[];
        for(let ret =0 ; ret < table_names.length;ret++){
            if(que_stings[ret] !=undefined){
                    res_to_return.push(que_stings[ret]+'/'+table_names[ret].replace('all_',''));
            }
        }

            if (res_to_return.length >0) return res_to_return;
         
            else{
                return;
            }
        
    }
 }
async function run(){
      
    exports.counter= async (prod_type) =>  await prod_count(prod_type); 
    let mb = new Motherboard(); 
    exports.mblist = async(offset,filter_conditions) =>await mb.motherboard_list(offset,filter_conditions);  
    exports.mb_product_details = async(uid) =>await mb.single_product(uid);  
    exports.mb_motherboard_filter = async() =>await mb.filter();  

    let pro = new Processors(); 
    exports.prolist = async(offset,filter_conditions) =>await pro.processor_list(offset,filter_conditions);  
    exports.product_details = async(uid) =>await pro.single_product(uid);  
    exports.processor_filter = async() =>await pro.filter();  

    let gp = new GraphicCard(); 
    exports.gplist = async(offset,filter_conditions) =>await gp.graphic_card_list(offset,filter_conditions);  
    exports.gp_product_details = async(uid) =>await gp.single_product(uid);  
    exports.gp_filter = async() =>await gp.filter();  

    let ram = new Ram(); 
    exports.ramlist = async(offset,filter_conditions) =>await ram.ram_list(offset,filter_conditions);  
    exports.ram_product_details = async(uid) =>await ram.single_product(uid);  
    exports.ram_filter = async() =>await ram.filter();  

    let cases = new Cases(); 
    exports.caselist = async(offset,filter_conditions) =>await cases.case_list(offset,filter_conditions);  
    exports.case_product_details = async(uid) =>await cases.single_product(uid);  
    exports.case_filter = async() =>await cases.filter();  

    let se = new SearchEngine();
    exports.search_recon = async(str)=> await se.search_recon(str);
    exports.search_result= async(fin_str,offset)=>await se.search_result(fin_str,offset);

    let op = new Operation();
    exports.opr = async(keys,obj_data)=> await op.compare_data(keys,obj_data);
};
run();
