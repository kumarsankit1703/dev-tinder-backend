const express = require('express')
const PORT = 3000
const app = express()



app.get("/hello", (req, res) => {
    res.send("Hello you are on HELLO HELLO HELLO Page")
})
app.get(/.*fly$/, (req, res) => {
    res.send("Hello you are on fist name is")
})

// User ID with Query : test?id=101
app.post("/test", (req, res) => {
    console.log(req.query)
    res.send("Hello you are on TEST Page")
})
// USER Id with Params : test/101
app.post("/test/:id", (req, res) => {
    console.log(req.params)
    res.send("Hello you are on TEST Page")
})
app.get("/", (req, res) => {
    res.send("Hello you are on Home Page")
})
app.listen(PORT, ()=> console.log("Port is listing on PORT", PORT))