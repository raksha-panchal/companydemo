const express = require('express');
const mongoose = require('mongoose');
var app = express();
var useraction = require('./useraction')
var config = require('./config.js')
var bodyParser = require('body-parser');
app.use(bodyParser.json())
mongoose.connect(config.URL)



app.post('/register', (req, res) => {
    useraction.register(req, res)
})

app.post('/createEmployee/:id', (req, res) => {
   useraction.createEmployee(req, res)
})


app.post('/requestFood/:id', (req, res) => {
    useraction.requestFood(req, res)
})


app.get('/assignTo/:id/:aid', (req, res) => {
    useraction.assignTo(req, res)
})

app.get('/completedOrder/:id/:cid', (req, res) => {
    useraction.completedOrder(req, res)
})

app.get('/pendingOrder/:id', (req, res) => {
    useraction.pendingOrder(req, res)
})

app.get('/getEmployeeList/:id', (req, res) => {
   useraction.getEmployeeList(req, res)
})


app.get('/getInventoryList/:id', (req, res) => {
   useraction.getInventoryList(req, res)
})


app.get('/processingOrder', (req, res) => {
    useraction.processingOrder(req, res)
})


app.get('/countEmployee', (req, res) => {
    useraction.countEmployee(req, res)
})

app.get('/countInventory', (req, res) => {
    useraction.countInventory(req, res)
})


app.listen(config.port, () => {
    console.log(`server start ${config.port}`)
}
)