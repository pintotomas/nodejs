/* to do:
clean code
only support requests album.js and /album/name.js
*/

var http = require("http")
var fs = require('fs')

//callback receives (error, albums_list)
function load_album_list(callback){
	fs.readdir("albums", (err, files) => {
		if (err){
			if(err.code = "ENOENT"){
        callback(make_error("no_such_album", "That album does not exist"));
      }
      else{
        callback(make_error("cant_load_photos", "The server is broken"))
      }
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
  if (req.url == '/albums'){
    handle_get_albums_request(res)
  }
  else{
    respond_failure(res, 'unknown_url', 'URL does not exist')
  }
}

function handle_get_albums_request(res){
  load_album_list((err, album_list) => {
        if(err){
          respond_failure(res, 'cant_load_albums', err.message)
        }
        else{
          var output = {error: null, data: {albums: album_list}};
          respond_success(res, 'albums_found', output)
        }
      })
}
function respond_success(res, code, message){
  res.writeHead(200, {'Content-Type' : 'application/json'});
  res.end(JSON.stringify({code: code, message: message}))
}

function respond_failure(res, code, message){
  res.writeHead(500, {'Content-Type' : 'application/json'});
  res.end(JSON.stringify({code: code, message: message}))
}

var s = http.createServer(handle_incoming_request)
s.listen(8080)