function card_limit_and_count(prod_array) {
  card_limit = prod_array.count.count;

  if (prod_array.count.count == 0) {
    remvoe_elem_class_name("loading-elem");

    if (document.getElementById("result_no")) {
      document.getElementById("result_no").remove();
    }
    No_result = document.createElement("div");
    No_result.setAttribute("id", "result_no");
    no_result_label = document.createElement("label");
    no_result_label.innerHTML = "No Result found";
    No_result.style = "height:100vh";
    No_result.append(no_result_label);
    content.append(No_result);
  }
}

async function create_grid(
  brand,
  prod_name_var,
  extra,
  images,
  uid,
  product_type,
  compare_box
) {
  compare_cont = document.createElement("div");
  compare_cont.classList.add("comp_cont", "form-check", "form-switch");
  compare_cont.setAttribute("onClick", "trigger_add_mb(this)");
  cb = document.createElement("input");
  cb_lab = document.createElement("label");
  cb_lab.setAttribute("for", uid + "-" + product_type);
  cb.setAttribute("type", "checkbox");
  if (compare_box == 1) {
    cb.checked = true;
    compare_cont.setAttribute("style", "background-color:var(--g1);");
    cb_lab.setAttribute("style", "color:black");
  } else {
    cb.checked = false;
  }

  cb.setAttribute("class", "form-check-input comp_cb");
  cb_lab.setAttribute("class", " comp_lab form-check-label");
  cb_lab.innerText = "compare";
  cb.id = uid + "-" + product_type;
  compare_cont.append(cb, cb_lab);

  img_arr = images.split(",");
  let card_out = document.createElement("div");
  card_out.setAttribute("class", "card out prods");
  card_out.setAttribute("id", uid);
  let prod_card = document.createElement("div");
  click_div = document.createElement("div");
  click_div.setAttribute("class", "prod_type");
  click_div.id = product_type;

  click_div.setAttribute("onClick", "openProduct(this)");
  prod_card.setAttribute("class", "preview");
  let img_cont = document.createElement("div");
  img_cont.setAttribute("class", "img_cont");
  let prod_img = document.createElement("img");
  prod_img.id = "img_" + uid;
  prod_img.setAttribute("onload", "fadeIn(this)");

  prod_img.setAttribute(
    "onerror",
    'image_error(this.id,"' +
      brand +
      '","' +
      process_image(img_arr, brand, 200, product_type) +
      '")'
  );
  prod_img.setAttribute(
    "src",
    "http://localhost:3001/static?" +
      "uid=" +
      uid +
      "&cnt=0&purpose=thumb&brand=" +
      brand +
      "&prod_type=" +
      product_type
  );
  // prod_img.setAttribute("class",'imges')
  let brief = document.createElement("ul");
  let brand_cont = document.createElement("div");
  brief.setAttribute("class", "brief");
  brand_cont.setAttribute("class", "brand_cont");
  let prod_brand = document.createElement("h1");
  prod_brand.innerText = brand;
  let prod_name = document.createElement("li");
  prod_name.style = "color:white;";
  prod_name.innerText = prod_name_var;
  let prod_socket = document.createElement("li");
  prod_socket.innerText = extra;
  prod_socket.style = "color:white;";
  brand_cont.append(prod_brand);
  brief.append(prod_name, prod_socket);
  prod_card.append(brief);
  img_cont.append(prod_img);
  click_div.append(img_cont, brand_cont, prod_card);
  card_out.append(compare_cont, click_div);
  grid.append(card_out);
  // await get_image(uid,0,'thumb',brand,process_image(img_arr,brand,200,product_type));
}

function no_image_grid(
  brand,
  prod_name,
  uid,
  e1,
  e2,
  e3,
  e4,
  product_type,
  compare_box
) {
  let wrap = build_element("div", uid, "wrap_ni prods");
  compare_cont = document.createElement("div");
  compare_cont.classList.add(
    "comp_cont",
    "form-check",
    "form-switch",
    "ni_compare"
  );
  compare_cont.setAttribute("onClick", "trigger_add_mb(this)");
  cb = document.createElement("input");
  cb_lab = document.createElement("label");
  cb_lab.setAttribute("for", uid + "-" + product_type);
  cb.setAttribute("type", "checkbox");
  if (compare_box == 1) {
    cb.checked = true;
    compare_cont.setAttribute("style", "background-color:var(--g1);");
    cb_lab.setAttribute("style", "color:black");
  } else {
    cb.checked = false;
  }

  cb.setAttribute("class", "form-check-input comp_cb");
  cb_lab.setAttribute("class", " comp_lab form-check-label");
  cb_lab.innerText = "compare";
  cb.id = uid + "-" + product_type;
  compare_cont.append(cb, cb_lab);

  let co = build_element("div", "none", "card_p out_p  no_image");
  co.setAttribute("onClick", "openProduct(this)");
  let pc = build_element("div", "none", "preview_p");
  let hc = build_element("div", "none", "brief_p head_pro");
  let b = build_element("ul", "none", "brief_p pv_down");
  let pb = build_element("h1", "none", "h_brand", brand);

  let pn = build_element("li", "l1", "l_c");
  let c = build_element("li", "l2", "l_c", e1);
  let bf = build_element("li", "l3", "l_c", e2);
  let mt = build_element("li", "l4", "l_c", e3);
  if (prod_name.includes("(")) {
    only_prod_name = prod_name.split("(");
    pn.innerText = only_prod_name[0];
  } else {
    pn.innerText = prod_name;
  }
  if (brand == "intel") {
    co.style = "background-color:var(--intel);";
  } else if (brand == "AMD") {
    co.style = "background-color:var(--amd);";
  }
  let pf = build_element("li", "l5", "l_c", e4);
  hc.append(pb);
  b.append(pn, pf, c, bf, mt);
  pc.append(hc, b);
  co.append(pc);
  wrap.append(compare_cont, co);
  grid.append(wrap);
}
function add_tabledata(data_vals, uid, head) {
  if (!document.getElementById("product_table")) {
    create_table(head);
  }
  let tab_pro = document.getElementById("product_table");
  ind = 0;
  let stack = document.createElement("tr");
  stack.setAttribute("class", " tab_out prods");
  stack.setAttribute("id", uid);

  stack.setAttribute("onClick", "openProduct(this.id)");
  data_vals.forEach(function (row_data) {
    let data_table = document.createElement("td");
    data_table.innerHTML = row_data;
    ind += 1;
    stack.append(data_table);
    tab_pro.append(stack);
  });
}
function add_products_to_list(
  list_container,
  images,
  uid,
  brand,
  prod_name,
  atr1,
  atr2,
  atr3,
  atr4,
  atr5,
  atr6,
  atr7,
  prod_type
) {
  let lis_row = document.createElement("div");
  lis_row.setAttribute("class", "row product_row prods");
  lis_row.setAttribute("id", uid);
  lis_row.setAttribute("onClick", "openProduct(this.id)");

  if (prod_type && brand == "intel") {
    lis_row.style = "background-color:var(--intel);";
  } else if (prod_type && brand == "AMD") {
    lis_row.style = "background-color:var(--amd);";
  } else {
    lis_row.style = "background-color:var(--c1);";
  }
  if (images) {
    img_arr = images.split(",");
    let img_col = document.createElement("div");
    img_col.setAttribute("class", "col-3 lis_image");
    let lis_img = document.createElement("img");
    lis_img.setAttribute("class", "list_image imges");
    lis_img.setAttribute(
      "onerror",
      'image_error(this.id,"' +
        brand +
        '","' +
        process_image(img_arr, brand, 200, prod_type) +
        '")'
    );
    lis_img.id = "img_" + uid;

    lis_img.setAttribute(
      "src",
      "http://localhost:3001/static?" +
        "uid=" +
        uid +
        "&cnt=0&purpose=thumb&brand=" +
        brand +
        "&prod_type=" +
        prod_type
    );
    lis_img.setAttribute("onload", "fadeIn(this)");
    lis_row.append(img_col);
    img_col.append(lis_img);
    lis_tables = document.createElement("div");
    lis_tables.setAttribute("class", "col-9 lis_tables");
    list_container.append(lis_row);
  } else {
    lis_tables = document.createElement("div");
    lis_tables.setAttribute("class", "col-12 lis_tables");
    list_container.append(lis_row);
  }
  lis_row.append(lis_tables);

  lis_prod_name = document.createElement("h1");
  lis_prod_name.setAttribute("class", "lis_prod_name");
  lis_prod_name.innerHTML = prod_name;
  lis_grid = document.createElement("div");
  tab_wrap = document.createElement("div");
  tab_wrap.setAttribute("class", "tab_wrap");
  lis_grid.setAttribute("class", "lis_grid");
  lis_tables.append(lis_prod_name);
  tab1 = document.createElement("span");
  tab1.setAttribute("class", "lis_tab_data");
  tab1_ul = document.createElement("ul");
  tab1_li1 = document.createElement("li");
  tab1_li1.innerHTML = atr1;
  tab1_li2 = document.createElement("li");
  tab1_li2.innerHTML = atr2;
  tab1_li3 = document.createElement("li");
  tab1_li3.innerHTML = atr3;
  tab1_li4 = document.createElement("li");
  tab1_li4.innerHTML = brand;
  tab1.append(tab1_li4, tab1_li1, tab1_li2, tab1_li3);
  tab_wrap.append(tab1);
  //-------
  tab2 = document.createElement("span");
  tab2.setAttribute("class", "lis_tab_data tab2");
  tab2_ul2 = document.createElement("ul");
  tab2_li1 = document.createElement("li");
  tab2_li1.innerHTML = atr4;
  tab2_li2 = document.createElement("li");
  tab2_li2.innerHTML = atr5;
  tab2_li3 = document.createElement("li");
  tab2_li3.innerHTML = atr6;
  tab2_li4 = document.createElement("li");
  tab2_li4.innerHTML = atr7;
  tab2.append(tab2_li4, tab2_li1, tab2_li2, tab2_li3);
  tab_wrap.append(tab2);
  lis_tables.append(tab_wrap);
}
function create_table(tab_headers) {
  let tab_pro = document.createElement("table");
  tab_pro.setAttribute("id", "product_table");
  let head_row = document.createElement("tr");
  head_row.setAttribute("id", "table_header");
  let headers = tab_headers;

  headers.forEach(function (head_name) {
    th = document.createElement("th");
    th.innerHTML = head_name;
    head_row.append(th);
  });
  tab_pro.append(head_row);
  grid.append(tab_pro);
}
