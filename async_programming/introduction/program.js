
var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
  var file;
  var buf = new Buffer(100000);
  fs.open('demofile1.html', (err, handle) => {
  file = handle;
});

  fs.read(file, buf, 0, 100000, null, (err, length) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(file);
    res.end();
  });
}).listen(8080);


//correcto
/*
var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {
  fs.readFile('demofile1.html', (err, handle) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(handle);
    res.end();
  });
}).listen(8080);

Finaliza cuando el stack de eventos ya no tiene eventos por procesar, y al ser un server lo primero que hay
en la pila es la escucha de requests por lo que el stack no quedara vacio y no termina el programa.

*/