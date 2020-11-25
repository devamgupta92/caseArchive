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
    conn.query("select id,name,payout_percent__c,sip_measure__c from sip_payout__c", function(err, result) {
        if (err) { return console.error(err); }
        console.log("total : " + result.totalSize);
        console.log("fetched : " + result.records.length);
        console.log("done ? : " + result.done);
        records = result.records;
        if(!result.done) {
            // you can use the locator to fetch next records set.
            // Connection#queryMore()
            var temp = [];
            conn.queryMore(result.nextRecordsUrl,function(err,res){
                if (err) { return console.error(err); }
                console.log("total : " + res.totalSize);
                console.log("fetched : " + res.records.length);
                console.log("done ? : " + res.done);
                temp = res.records;
                records = records.concat(temp);
                console.log('finalsize++'+records.length);
                //res.send(JSON.stringify(records));
            })
            console.log("next records URL : " + result.nextRecordsUrl);
        }
      });
      
});

/*JS Force ends*/

app.get("/",(req,res)=>{
    
    res.send(JSON.stringify(records));
});

app.listen(port,()=>{
    console.log('Example app is listening');
})
