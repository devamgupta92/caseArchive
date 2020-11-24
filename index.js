const express = require("express");
const app = express();
let port = process.env.PORT || 3000;
/*JS Force starts*/
var records = [];
const jsforce = require('jsforce');
const conn = new jsforce.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env.
  loginUrl : 'https://test.salesforce.com'
});
const { SF_USERNAME, SF_PWD_TOKEN } = process.env;
conn.login(SF_USERNAME,SF_PWD_TOKEN, function(err) {
    if (err) { return console.error(err); }
    conn.query("SELECT Id,casenumber FROM Case", function(err, result) {
        if (err) { 
            return console.error(err); 
        }
        records = result.records;
        console.log("total : " + result.totalSize);
        console.log("fetched : " + result.records.length);
    });
});

/*JS Force ends*/

app.get("/",(req,res)=>{

    res.send(JSON.stringify(records));
});

app.listen(port,()=>{
    console.log('Example app is listening');
})