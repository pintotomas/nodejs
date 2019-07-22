/* to do:
clean code
only support requests album.js and /album/name.js
*/

var http = require("http")
var fs = require('fs')
var url = require('url'); 
//callback receives (error, albums_list)

//type can be files or folders
function get_from_file_system(directory, type,folder, callback, start, final){
  start = start || 0 
  final = final || folder.length
  if (start >= final ||  final > folder.length || 0 > start ){
    callback(make_error("EOF", "End of file/folder"), null)
    return;
  }
  var matches = [];
  var iterator = (index) => {
    if (index == final){
      callback(null, matches);
    }
    else{
      fs.stat(directory + '/' + folder[index], (err, stats)=>{
        if (type == 'folder' && stats.isDirectory()){
          matches.push(folder[index]);
        }
        else if (type == 'files' && stats.isFile()){
          matches.push(folder[index])
        }
        iterator(index + 1)
      })
    }
  }
  iterator(start);
}

function load_album_list(callback){
	fs.readdir("albums", (err, folder) => {
		if (err){
			if(err.code = "ENOENT"){
        callback(make_error("no_such_dir", "That directory does not exist"));
      }
      else{
        callback(make_error("cant_load_albums", "The server is broken"))
      }
		}
		else{
      get_from_file_system('albums', 'folder', folder, (err, list_of_matches)=>{
        if (err){
          callback(err, null)
        }
        callback(null, list_of_matches)
      })
		}
	});
}

//calback receies (error, photo_list)
function load_photo_list(album_name, query, callback){
  fs.readdir('albums/'+album_name, (err, folder) => {
    if (err){
      if(err.code = "ENOENT"){
        callback(make_error("no_such_album", "That album does not exist"));
      }
      else{
        callback(make_error("cant_load_photos", "The server is broken"))
      }
    }
    else{
      get_from_file_system('albums/'+album_name, 'files', folder, (err, list_of_matches)=>{
        if (err){
          callback(err, null)
        }
        callback(null, list_of_matches)
      }, parseInt(query.page_number) - 1, parseInt(query.page_size) + parseInt(query.page_number) - 1)
    }
  })
}
//callback receives error
function rename_file(path, old_name, new_name, callback){
  fs.rename(path+'/'+old_name, path+'/'+new_name, (err, folder) => {
    if ( err ) {
      callback(make_error("cant_rename", err.message))
    }
    else{
      callback(null)
    }
  } )
}
function handle_incoming_request(req, res) {
	console.log("INCOMING REQUEST: "+req.method+", URL: "+req.url)

  if (req.method == "POST" && req.url == "/rename"){
    handle_rename_file_request(req, res)

  }
  else if (req.url == '/albums'){
    handle_get_albums_request(res, req)
  }
  else if(req.url.split('/').length == 3 && req.url.split('/')[1] === 'albums'){
    handle_get_photos_request(res, req)
  }
  else{
    send_failure(res, make_error('unknown_url', 'URL does not exist'))
  }
}


function handle_rename_file_request(req, res){
    let json = '';
    req.on('data', chunk => {
        json += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        obj = JSON.parse(json)
        if (!("album_name" in obj) || !("old_photo_name" in obj) || !("new_photo_name" in obj)){
          send_failure(res, make_error("invalid_parameters", "Invalid post request params for rename"))
    }
        else {
          album_name = obj["album_name"]
          old_photo_name = obj["old_photo_name"]
          new_photo_name = obj["new_photo_name"]
          rename_file('albums/'+album_name, old_photo_name, new_photo_name, (err) =>
          {
            if (err){
              send_failure(res, make_error('cant_rename', err.message));
            }
            else{
              send_success(res, {error:null, "rename":"ok"})
            }
          })
        }
    });
    
    //var obj = JSON.parse(json)
    //console.log(obj)

}

function handle_get_photos_request(res, req){
    
    var parsed_url = url.parse(req.url, true);
    var album = parsed_url.pathname.split('/')[2]
    load_photo_list(album, parsed_url.query, (err, photo_list) => {
        if(err){
          send_failure(res, make_error('cant_load_photos', err.message))
        }
        else{
          var output = {error: null, data: {photos: photo_list}};
          send_success(res, output)
        }
      })
}

function handle_get_albums_request(res, req){
  load_album_list((err, album_list) => {
        if(err){
          send_failure(res, make_error('cant_load_albums', err.message))
        }
        else{
          var output = {error: null, data: {albums: album_list}};
          send_success(res, output)
        }
      })
}

function make_error(code, message){
  var e = new Error(message);
  e.code = code;
  return e;
}

function send_success(res, data){
  res.writeHead(200, {'Content-Type' : 'application/json'});
  res.end(JSON.stringify(data))
}

function send_failure(res, error){
  res.writeHead(500, {'Content-Type' : 'application/json'});
  res.end(JSON.stringify({code: error.code, message: error.message}))
}

var s = http.createServer(handle_incoming_request)
s.listen(8080)