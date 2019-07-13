var http = require("http")
var fs = require('fs')

//callback receives (error, albums_list)
function load_album_list(callback){
	fs.readdir("albums", (err, files) => {
		if (err){
			callback(err);
		}
		else{
			var only_dirs = [];
      var iterator = (index) => {
        if (index == files.length){
          callback(null, only_dirs);
        }
        else{
          fs.stat("albums/" + files[index], (err, stats)=>{
          if (stats.isDirectory()){
            only_dirs.push(files[index]);
          }
          iterator(index + 1)
        })
        }
      }
      /* bad
			for(i=0; i < files.length; i++){

				fs.stat("albums/" + files[i], (err, stats)=>{
					if (stats.isDirectory()){
						only_dirs.push(files[i]);
					}
				})
			}
      callback(null, only_dirs);
      */
			iterator(0);
		}
	});
}

function handle_incoming_request(req, res) {
	console.log("INCOMING REQUEST: "+req.method+", URL: "+req.url)

  load_album_list((err, album_list) => {
    if(err){
      res.writeHead(500, {'Content-Type' : 'application/json'});
      res.end(JSON.stringify({code: "cant_load_albums", message: err.message}))
    }
    else{
      var output = {error: null, data: {albums: album_list}};
      res.writeHead(500, {'Content-Type' : 'application/json'});
      res.end(JSON.stringify(output) + "\n")
    }
  })
}

var s = http.createServer(handle_incoming_request)
s.listen(8080)