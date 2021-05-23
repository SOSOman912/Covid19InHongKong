const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'document')));

app.get('/Chart', function(req,res){
	res.redirect('/html/Chart.html');
})

app.get('/*', function(req,res){
	res.redirect('/html/homepage.html');
})

const server = http.createServer(app);
const port = 3000;
server.listen(port);