//-------------------------------------------------

async function loadProducts(prod_array, prod_type) {
  card_limit_and_count(prod_array);
  if (attr_flag == true) {
    getfilterAttributes(prod_array, prod_type);
  }
  attr_flag = false;
  if (prod_type == "motherboard") {
    motherboard_table_head = [
      "brand",
      "product name",
      "Socket",
      "chipset",
      "DIMM slots",
      "max RAM",
      "DDR ver.",
      "M.2 sots",
      "SATA connectors",
      "Form Factor",
    ];
    document.getElementById("product_count").innerHTML =
      prod_array.count.count + " Motherboard";

    if (
      prod_array.count.count > document.getElementsByClassName("prods").length
    ) {
      removeElement("result_no");

      if (layout == "grid") {
        remove_table();
        remove_list();
        document.querySelector(".prod_show").classList.add("grid_layout");

        prod_array.list.forEach(function (product) {
          console.log(product);
          var session_store = Object(sessionStorage);
          if (
            session_store[prod_type] &&
            session_store[prod_type].includes(product.uid)
          ) {
            create_grid(
              product.brand,
              product.prod_name,
              product.socket,
              product.images,
              product.uid,
              prod_type,
              1
            );
          } else {
            create_grid(
              product.brand,
              product.prod_name,
              product.socket,
              product.images,
              product.uid,
              prod_type,
              0
            ); // ADD CARDS IN GRID
          }
        });
      } else if (layout == "table") {
        remove_list();
        remove_grid_cards();
        document.querySelector(".prod_show").classList.add("table_layout");
        prod_array.list.forEach(function (row) {
          let data_vals = [
            row.brand,
            row.prod_name,
            row.socket,
            row.chipset,
            row.RAM_slots,
            row.RAM_max,
            row.RAM_DDR,
            row.M2_slots,
            row.SATA_count,
            row.mb_size,
          ];
          add_tabledata(data_vals, row.uid, motherboard_table_head);
        });
      } else if (layout == "list") {
        remove_grid_cards();
        remove_table();
        document
          .querySelector(".prod_show")
          .classList.add("container", "lis_pro");
        prod_array.list.forEach(function (product) {
          add_products_to_list(
            document.querySelector(".prod_show"),
            product.images,
            product.uid,
            product.brand,
            product.prod_name,
            product.socket,
            product.chipset,
            product.mb_size + " Form Factor",
            "DDR" + product.RAM_DDR,
            product.SATA_count + " SATA connectors",
            product.RAM_slots + " DIMM slots",
            "max RAM " + product.RAM_max + "GB",
            "motherboard"
          );
        });
      }
    }
    removeElement("page_loader");
  } else if (prod_type == "graphic_card") {
    let graphic_card_headers = [
      "brand",
      "product name",
      "Graphic Engine",
      "Bus Standard",
      "Video Memory",
      "Engine Clock",
      "Core",
      "Memory Speed",
      "Memory Inteface",
      "Resolution",
      "Display Support",
      "Connectors",
      "slot",
    ];

    document.getElementById("product_count").innerHTML =
      prod_array.count.count + " Graphiic Card ";

    if (
      prod_array.count.count > document.getElementsByClassName("prods").length
    ) {
      if (document.getElementById("result_no")) {
        removeElement("result_no");
      }

      if (layout == "grid") {
        remove_table();
        remove_list();

        document.querySelector(".prod_show").classList.add("grid_layout");

        prod_array.list.forEach(function (product) {
          var session_store = Object(sessionStorage);
          if (
            session_store[prod_type] &&
            session_store[prod_type].includes(product.uid)
          ) {
            create_grid(
              product.brand,
              product.prod_name.split(",")[0],
              product.resolution,
              product.images,
              product.uid,
              prod_type,
              1
            );
          } else {
            create_grid(
              product.brand,
              product.prod_name.split(",")[0],
              product.resolution,
              product.images,
              product.uid,
              prod_type,
              0
            );
          }
        });
      } else if (layout == "table") {
        remove_list();
        remove_grid_cards();
        document.querySelector(".prod_show").classList.add("table_layout");
        prod_array.list.forEach(function (row) {
          let data_vals = [
            row.brand,
            row.prod_name.split(",")[0],
            row.graphic_engine,
            row.bus_standard,
            row.video_memory,
            row.engine_clock,
            row.core,
            row.memory_speed,
            row.memory_interface + "bits",
            row.resolution,
            row.display_support,
            row.connectors,
            row.slot,
          ];
          add_tabledata(data_vals, row.uid, graphic_card_headers);
        });
      } else if (layout == "list") {
        remove_grid_cards();
        remove_table();
        document
          .querySelector(".prod_show")
          .classList.add("container", "lis_pro");
        prod_array.list.forEach(function (product) {
          add_products_to_list(
            document.querySelector(".prod_show"),
            product.images,
            product.uid,
            product.brand,
            product.prod_name,
            product.graphic_engine,
            product.bus_standard,
            product.core + " CUDA cores",
            "DDR" + product.engine_clock,
            product.display_support + " display support",
            product.memory_speed,
            "max RAM " + product.memory_interface + "bits"
          );
        });
      }
    }
    removeElement("page_loader");
  } else if (prod_type == "ram") {
    let ram_headers = [
      "brand",
      "product name",
      "Series",
      "memory type",
      "Tested Speed",
      "lighting",
      "Memory Format",
      "Memory Size",
    ];

    document.getElementById("product_count").innerHTML =
      prod_array.count.count + " Rams";

    if (
      prod_array.count.count > document.getElementsByClassName("prods").length
    ) {
      if (document.getElementById("result_no")) {
        document.getElementById("result_no").remove();
      }

      if (layout == "grid") {
        remove_table();
        remove_list();
        document.querySelector(".prod_show").classList.add("grid_layout");

        prod_array.list.forEach(function (product) {
          var session_store = Object(sessionStorage);
          if (
            session_store[prod_type] &&
            session_store[prod_type].includes(product.uid)
          ) {
            create_grid(
              product.brand,
              product.prod_name,
              product.series,
              product.images,
              product.uid,
              prod_type,
              1
            );
          } else {
            create_grid(
              product.brand,
              product.prod_name,
              product.series,
              product.images,
              product.uid,
              prod_type,
              0
            );
          }
        });
      } else if (layout == "table") {
        remove_list();
        remove_grid_cards();
        document.querySelector(".prod_show").classList.add("table_layout");
        prod_array.list.forEach(function (row) {
          let data_vals = [
            row.brand,
            row.prod_name,
            row.series,
            row.ram_memory_type,
            row.tested_speed,
            row.lights,
            row.memory_format,
            row.memory_size,
          ];
          add_tabledata(data_vals, row.uid, ram_headers);
        });
      } else if (layout == "list") {
        remove_grid_cards();
        remove_table();
        document
          .querySelector(".prod_show")
          .classList.add("container", "lis_pro");
        prod_array.list.forEach(function (product) {
          add_products_to_list(
            document.querySelector(".prod_show"),
            product.images,
            product.uid,
            product.brand,
            product.prod_name,
            product.series,
            product.ram_memory_type,
            product.tested_speed + "MHz",
            "lighting " + product.lights,
            product.total_size + "GB",
            product.sticks_count + " x" + product.stick_size + "GB"
          );
        });
      }
    }
    removeElement("page_loader");
  } else if (prod_type == "cases") {
    let ram_headers = [
      "brand",
      "product name",
      "Series",
      "Dimensions",
      "Expansion Slots",
      "Motherboard Support",
      "Power Supply Support",
    ];

    document.getElementById("product_count").innerHTML =
      prod_array.count.count + " Cases";

    if (
      prod_array.count.count > document.getElementsByClassName("prods").length
    ) {
      if (document.getElementById("result_no")) {
        document.getElementById("result_no").remove();
      }

      if (layout == "grid") {
        remove_table();
        remove_list();
        document.querySelector(".prod_show").classList.add("grid_layout");

        prod_array.list.forEach(function (product) {
          var session_store = Object(sessionStorage);
          if (
            session_store[prod_type] &&
            session_store[prod_type].includes(product.uid)
          ) {
            create_grid(
              product.brand,
              product.prod_name,
              null,
              product.images,
              product.uid,
              prod_type,
              1
            );
          } else {
            create_grid(
              product.brand,
              product.prod_name,
              null,
              product.images,
              product.uid,
              prod_type,
              0
            );
          }
        });
      } else if (layout == "table") {
        remove_list();
        remove_grid_cards();
        document.querySelector(".prod_show").classList.add("table_layout");
        prod_array.list.forEach(function (row) {
          let data_vals = [
            row.brand,
            row.prod_name,
            row.dimensions,
            row.expansion_slot,
            row.mb_support,
            row.psu_support,
          ];
          add_tabledata(data_vals, row.uid, ram_headers);
        });
      } else if (layout == "list") {
        remove_grid_cards();
        remove_table();
        document
          .querySelector(".prod_show")
          .classList.add("container", "lis_pro");
        prod_array.list.forEach(function (product) {
          add_products_to_list(
            document.querySelector(".prod_show"),
            product.images,
            product.uid,
            product.brand,
            product.prod_name,
            product.material,
            product.mb_support,
            product.psu_support,
            product.expansion_slot,
            "CPU limit:" + product.lim_cpu + "mm",
            "Graphic Card limit:" + product.lim_cpu + "mm",
            "PSU limit:" + product.lim_cpu + "mm"
          );
        });
      }
    }
    removeElement("page_loader");
  } else if (prod_type == "processor") {
    let processor_headers = [
      "Brand",
      "Name",
      "Family",
      "Platform",
      "cores",
      "Thread",
      "Base Frequency",
      "cache",
      "Memory Type",
      "PCIE version",
    ];

    document.getElementById("product_count").innerHTML =
      prod_array.count.count + " Processors";

    if (
      prod_array.count.count > document.getElementsByClassName("prods").length
    ) {
      if (document.getElementById("result_no")) {
        document.getElementById("result_no").remove();
      }
      if (layout == "grid") {
        remove_list();
        remove_table();
        document.querySelector(".prod_show").classList.add("grid_layout");

        prod_array.list.forEach(function (product) {
          no_image_grid(
            product.brand,
            product.processor_name,
            product.uniqid,
            product.cores + " CPU cores",
            product.base_frequency + " GHz",
            product.max_temperature + "°C",
            product.family,
            "processors"
          );
        });
      } else if (layout == "table") {
        remove_list();
        remove_grid_cards();
        document.querySelector(".prod_show").classList.add("table_layout");
        prod_array.list.forEach(function (row) {
          let data_vals = [
            row.brand,
            row.processor_name,
            row.family,
            row.platform,
            row.cores,
            row.thread,
            row.base_frequency,
            row.cache,
            row.memory_type,
            row.pci_version,
          ];
          add_tabledata(data_vals, row.uniqid, processor_headers);
        });
      } else if (layout == "list") {
        remove_grid_cards();
        remove_table();
        document
          .querySelector(".prod_show")
          .classList.add("container", "lis_pro");
        prod_array.list.forEach(function (product) {
          add_products_to_list(
            document.querySelector(".prod_show"),
            undefined,
            product.uniqid,
            product.brand,
            product.processor_name,
            product.family,
            product.platform,
            product.cores + " CPU cores",
            product.base_frequency + "GHz",
            product.memory_type,
            product.pci_version,
            product.max_temperature + "°C max temperature ",
            prod_type
          );
        });
      }
    }
    if (document.getElementById("page_loader_gif")) {
      document.getElementById("page_loader").remove();
    }
  }

  bool = false;
  destroyElement();
  removeElement("content_loader");
  remvoe_elem_class_name("loading-elem");

  $(".comp_cb").click(function (e) {
    add_mb(this.id);
  });
}

//------------------------------------------------

var animation = bodymovin.loadAnimation({
  container: document.getElementById("bm"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "http://localhost:3001/images/pcbudgelogo/loading_logo2.json",
});
function openProduct(clicked_id) {
  let idm = $(clicked_id).parent().attr("id");
  window.open(
    "http://localhost:3001/product?" +
      "product_id=" +
      idm +
      "&prod_type=" +
      document.getElementById("product_type").innerHTML
  );
}
console.log(document.getElementById("product_type").innerHTML);
