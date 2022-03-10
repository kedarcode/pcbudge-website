const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});


const pool  = mysql.createConnection(
    {
        host:process.env.DATABASE_HOST,
        user:process.env.DATABASE_USER,
        password:process.env.DATABASE_PASSWORD,
        database:process.env.DATABASE,
        port:3307
    });
    pool.connect((error)=>{
        if (error)
        {
            console.log(error)
        }
    else{
 console.log("connected database......")
}
  });  
 exports.pool  = mysql.createConnection(
    {
        host:process.env.DATABASE_HOST,
        user:process.env.DATABASE_USER,
        password:process.env.DATABASE_PASSWORD,
        database:process.env.DATABASE,
        port:3307
    });   
  class Database {
    constructor( ) {
        this.connection = mysql.createConnection( {host:process.env.DATABASE_HOST,
          user:process.env.DATABASE_USER,
          password:process.env.DATABASE_PASSWORD,
          database:process.env.DATABASE,
          port:3307} );
    }
    query( sql, args ) {
        if(!args){
            args=0;
        }
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err ){
                    return reject( err );
                }
                else{
                resolve( rows );}
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}
  exports.db = new Database();

