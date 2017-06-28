/**
 * Created by GAZ on 6/28/17.
 */
require('dotenv').config({path: __dirname+'/.env'});
var pm2 = require('pm2');
var pj = require('./package.json');
var os = require('os');

pm2.connect(function(err) {
    if (err) {
        console.error(err);
        process.exit(2);
    }
});

var options = {
    endpoint: process.env.NS_MONITOR_ENDPOINT,
    namespace: process.env.NS_MONITOR_NAMESPACE,
    meta: {
        node: 'ns-hive',
        version: pj.version,
        os:{
            hostname: os.hostname(),
            type: os.type(),
            platform: os.platform()
        },

    }
};

var client = require('@netshards/ns-monitor').client(options);
// client.on('list-cells',function(){
//     pm2.list(function(err,list){
//         socket.send('cells', {err:err,list:list});
//     })
// })

setInterval(function(){
    pm2.list(function(err,list){
        client.emit('host-data', {hostname:os.hostname(),processes:list});
    })
},10000);

//pm2.describe(process,errback)


