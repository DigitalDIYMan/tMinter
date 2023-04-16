const express = require('express');
const app = express();

const PORT = 8080;

app.get('/', function(req, res)
{
    res.send("<H1> This site is currently under maintenance! </H1>");
});

app.get('/on', function(req, res)
{
    res.send("<H1> This server is running! </H1>");
});

app.listen(PORT, function()
{
    console.log('Server Listening : ' + PORT + ' PORT');
});
