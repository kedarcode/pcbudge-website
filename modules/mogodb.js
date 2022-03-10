var mongojs = require("mongojs");
var url = "mongodb://localhost:27017/";
var databaseUrl = "PCBUDGE";
var collections = ["all_motherboard"];
var db = mongojs(databaseUrl, collections);

db.on("error", function(error) {
    console.log("Database Error:", error);
  });
class MongoDatabase{
async  sso(uid) {
   db.all_motherboard.find({_id:uid}, async function(error, found) {
        if (error) {
          console.log(error);
        }
        else {
          dat(await found)
        }
      });
  var dat =  function okay(dat){
        return dat
    }
    console.log(dat)
}

}
async function runner(){
    var mb = new MongoDatabase();
    console.log(mb.sso(10010004))
}
runner();