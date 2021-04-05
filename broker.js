var mosca = require('mosca')
const Data = require('./model/data')
const mongo = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();
var port = normalizePort(process.env.PORT || '1883')

function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }

var broker = new mosca.Server(port)

broker.on('ready', () => {
    console.log("Broker is up")
});

var db_url = process.env.DB_URL
    var connect = mongo.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
    });

connect.then((db) => {
    console.log("Connection to MongoDB Success")
    },
    (err) => {
    console.log("Connection to MongoDB error; ", err)
    });

broker.on('published', (packet) => {
    message = packet.payload.toString();
    if(message.slice(0,1) != '{' && message.slice(0,4) == 'mqtt'){
        console.log(message)
    } else {
        payload = JSON.parse(packet.payload)
        console.log(payload)
        const data = new Data({
            data: payload.data,
            test: payload.test
        });
        data.save(function (err) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("data inserted")
            }
        })
    }
})



