var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost:1883')
var topic = 'test'

const payload = {
    data: "test",
    v: "1"
}
var message = JSON.stringify(payload)

client.on('connect', ()=>{
    setInterval(()=>{
        client.publish(topic, message.toString())
        console.log('Message sent!', message)
    }, 5000)
})