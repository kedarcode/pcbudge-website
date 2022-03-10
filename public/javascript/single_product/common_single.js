function create_card(col_name, col_data) {
    spec_foc_but = document.getElementsByClassName("spec_select")[0];
    spec_foc_but.setAttribute("onchange", "focus_elem(this.value)");

    if (
        col_name != "_id" &&
        !col_name.includes("||") &&
        col_name != "product_type"
    ) {
        c1 = document.getElementsByClassName("c1")[0];
        c0 = document.getElementsByClassName("c0")[0];
        spec_option = document.createElement("option");
        spec_option.innerText = col_name;
        spec_option.setAttribute("class", "dp");
        spec_option.setAttribute("id", col_name.replaceAll(" ", "") + "_but");
        spec_foc_but.append(spec_option);

        main_card = document.createElement("div");
        main_card.setAttribute("id", col_name + "_card");
        main_card.setAttribute("class", "card whole_c");
        header = document.createElement("div");
        header.setAttribute("class", "hed head_c");
        header.innerHTML = col_name;
        data = document.createElement("div");
        data.setAttribute("class", "card-body body_c comp_scroll");
        data.setAttribute("id", iter.replaceAll(" ", "") + "_data");
        data.innerHTML = col_data;
        main_card.append(header, data);

        if (
            (col_flag == 0 || c1.offsetHeight > c0.offsetHeight) &&
            col_data != ""
        ) {
            c0.append(main_card);
            col_flag += 1;
        } else if (
            (col_flag >= 1 || c0.offsetHeight > c1.offsetHeight) &&
            col_data != ""
        ) {
            c1.append(main_card);
            col_flag += 1;
        }
    } else if (col_name.includes("||")) {
        let temp_split = col_name.split("||");
        if (!document.getElementById(temp_split[1].replaceAll(" ", "_") + "_par_but")) {
            let par_div = document.createElement("optgroup");
            par_div.setAttribute("label", temp_split[1]);
            par_div.id = temp_split[1].replaceAll(" ", "_") + "_par_but";
            spec_foc_but.append(par_div);
            parent_card = document
                .getElementsByClassName("parent_container")[0]
                .cloneNode(true);
            parent_card.id = temp_split[1] + "_par_card";
            parent_card.setAttribute("class", "parent_card whole_c row");
            header = document.createElement("div");
            header.setAttribute("class", "hed head_p col-12");
            header.innerHTML = temp_split[1];
            parent_card.prepend(header);
            document.getElementsByClassName("specification")[0].append(parent_card);
            create_card_proc2(
                temp_split[0],
                col_data,
                temp_split[1].replaceAll(" ", "_"),
                parent_card
            );
        } else if (
            document.getElementById(temp_split[1].replaceAll(" ", "_") + "_par_but")
        ) {
            parent_card = document.getElementById(temp_split[1] + "_par_card");
            create_card_proc2(
                temp_split[0],
                col_data,
                temp_split[1].replaceAll(" ", "_"),
                parent_card
            );
        }
    }
}

function create_card_proc2(col_name, col_data, par_col, parent_card) {
    c1 = parent_card.getElementsByClassName("c1")[0];
    c0 = parent_card.getElementsByClassName("c0")[0];

    let par_div = document.getElementById(par_col + "_par_but");
    spec_option = document.createElement("option");
    spec_option.innerText = col_name;
    spec_option.setAttribute("class", "dp");
    spec_option.setAttribute("id", col_name.replaceAll(" ", "") + "_but");
    par_div.append(spec_option);

    main_card = document.createElement("div");
    main_card.setAttribute("id", col_name + "_card");
    main_card.setAttribute("class", "card whole_c");
    header = document.createElement("div");
    header.setAttribute("class", "hed head_c");
    header.innerHTML = col_name;
    data = document.createElement("div");
    data.setAttribute("class", "card-body body_c comp_scroll");
    data.setAttribute("id", col_name.replaceAll(" ", "") + "_data");
    data.innerHTML = col_data;
    main_card.append(header, data);
    if (
        (c1.offsetHeight > c0.offsetHeight && col_data != "") ||
        parent_card.getElementsByClassName("whole_c").length == 0
    ) {
        c0.append(main_card);
    } else if (c0.offsetHeight > c1.offsetHeight && col_data != "") {
        c1.append(main_card);
    } else {
        c0.append(main_card);
    }
}

function add_google_ad(col) {
    main_card = document.createElement("div");
    main_card.setAttribute("class", "whole_c google_ad banner2");
    main_card.innerHTML =
        '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4543680276633818" crossorigin="anonymous"></script><!-- square_banner2 -->\
   <ins class="adsbygoogle"\
        style="display:block"\
        data-ad-client="ca-pub-4543680276633818"\
        data-ad-slot="9554723179"\
        data-ad-format="auto"\
        data-adtest="on"\
        data-full-width-responsive="true"></ins>\
   <script>\
        (adsbygoogle = window.adsbygoogle || []).push({});\
   </script>';
    document.getElementsByClassName(col)[0].append(main_card);
}
let prev = "Specification";

function focus_elem(elem) {
    if (prev == "Specification") {
        let elemid = elem.replaceAll(" ", "").split("_")[0] + "_data";
        console.log(elemid);
        document
            .getElementById(elemid)
            .scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
            });
        document.getElementById(elemid).style =
            "background-color:var(--c1);color:white;border:0.15rem var(--g1) solid;";

        prev = elem;
        setTimeout(function() {
            document.getElementById(elemid).style =
                "background-color:var(--g2);color:black;border:0rem;";
            document.getElementsByClassName("spec_select")[0].value = "Specification";
            prev = "Specification";
        }, 1000);
    } else {
        setTimeout(focus_elem(elem), 1000);
    }
}

function myFunction(id_i) {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById(id_i);
    filter = input.value.toUpperCase();
    ul = document.getElementById(id_i).nextElementSibling;
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

function removestyle() {
    $(".specification").find("*").removeAttr("style");
}

function view_product(src, p_id, brandy) {
    document.getElementById("slide_show").src = "/images/fi.gif";
    setTimeout(2000);
    document.getElementById("image_detail").scrollIntoView();
    document.getElementById("slide_show").src = process_image(src, brandy, 500);
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    document.getElementById(p_id).className += " active";
}

function openProduct(id, pt) {
    window.location =
        "http://localhost:3001/product?" + "product_id=" + id + "&prod_type=" + pt;
}

function process_image(img_link, brand, size) {
    if (brand == "Asus") {
        if (img_link.includes("_end_")) {
            spli = img_link.split("_end_").pop();
            img_linke = img_link.replace("_end_" + spli, "_end_" + size + ".png");
            return img_linke;
        } else if (img_link.includes("/w")) {
            spli = img_link.split("/w").pop();

            img_linke = img_link.replace("/w" + spli, "/w" + size);
            return img_linke;
        } else {
            return img_link;
        }
    } else if (brand == "Gigabyte") {
        if (
            img_link.includes("pre888") ||
            img_link.includes("next888") ||
            img_link.includes("Awards")
        ) {
            return;
        } else {
            return img_link;
        }
    } else {
        return img_link;
    }
}

function removeElement(uid) {
    document.getElementById(uid).remove();
}