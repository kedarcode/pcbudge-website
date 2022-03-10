function build_element(type,id,c_name,text_input){
    let build = document.createElement(type);
    if(id && id !='none') build.id=id;
    if (c_name?build.setAttribute('class',c_name): null);
    if(text_input? build.innerText=text_input :null);
    
   return build;
}

function build_double_table(tab_name,headers,fnl){
        let mft=build_element('div','tab1_c','col-md-6 cont_'+tab_name);
        let mff=build_element('div','tab2_c','col-md-6 cont_'+tab_name);

        let mft_tab=build_element('table','mft_tab ','table '+ tab_name+'_true');
        let mff_tab=build_element('table','mff_tab ','table '+ tab_name+'_false');

        let th_t=build_element('thead','tht_'+tab_name);
        let th_f=build_element('thead','thf_'+tab_name);
        //console.log(headers);

        let head_row_t=build_element('tr');
         let head_row_f=build_element('tr');
        keys=Object.keys(headers);
        keys.forEach(key => {
            let headert=build_element('th',key+'_header_true',key+'_tab_mf',headers[key]);
            let headerf=build_element('th',key+'_header_false',key+'_tab_mf',headers[key]);
            
            head_row_t.append(headert);
            head_row_f.append(headerf);
            
            headerf.setAttribute('scope','col');
            headert.setAttribute('scope','col');

           th_t.append(head_row_t);
            th_f.append(head_row_f);    
        });
        mft_tab.append(th_t);
        mff_tab.append(th_f);

        mft.append(mft_tab);
        mff.append(mff_tab);
        let col_flag=true;
        let cnt=0;
        fnl.forEach(e=>{
            let k=Object.keys(e);
            let tr=build_element('tr','tr'+cnt,'c'+cnt);
            k.forEach(ek=>{
                let td=build_element('td','none',ek+'_class',e[ek]);
                tr.append(td);
                //console.log(td);
            })
            if (col_flag==true) mft_tab.append(tr);
             else mff_tab.append(tr);
            cnt+=1;
            col_flag = !col_flag;
        })
        
        return [mft,mff];

}

function build_graph(meta_data){    

    let header_container=build_element('div',meta_data.header+'_header col-11','header');
    let ds_header=build_element('h1',meta_data.header+'_h1',meta_data.header+'_header_text',meta_data.header_text);
    header_container.append(ds_header);

    let ds = document.createElement('canvas');
    ds.style='min-width:100%;min-height:'+meta_data.height;
    ds.id=meta_data.header;
    ds.class='gp';

    let canvas_container = document.createElement('div');
    canvas_container.setAttribute('class','col-md-12 canvas_contaier');
    canvas_container.append(ds);
    console.log(meta_data.data)
    graph(ds,meta_data.pn,'bar',meta_data.y_axis,meta_data.data,meta_data.header_text,0,Math.max.apply(Math,meta_data.data),1);

    return [header_container,canvas_container]

}