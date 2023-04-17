const express = require('express');
const path = require('path');
const app = express();

const PORT = 5050;

app.use(express.static(path.join(__dirname, "/client_react/build")));

app.get('/', (req, res) => 
{
    res.sendFile(path.join(__dirname, "/client_react/build/index.html"));
});

// app.get('/', function(req, res)
// {
//     res.send("<H1> Welcome to test world! </H1>");
// });

app.get('/on', function(req, res)
{
    res.send("<H1> This server is running! </H1>");
});

app.listen(PORT, function()
{
    console.log("Listening at : " + PORT + " PORT");
});

