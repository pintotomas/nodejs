/*try {
  setTimeout(() => {
    throw new Error("OH NOES!");
  }, 4000);

}
catch (e){
	console.log("I catched the error: " + e.message);
}
*/
/* Esto no funciona porque try catch solo esta chequeando que la funcion setTimeout se este
 llamando correctamente, despues la funcion anonima queda en el stack y una vez que es llamada no
 se conoce el catch, se esta en otro contexto
*/

//---------------------------------------------------------------------------------------------
// Manejando errores mediante callbacks 

var validateObject = function (obj, callback) {
    if (typeof obj !== 'object') {
        return callback(new Error('Invalid object'));
    }
    return callback();
};

validateObject('123', function (err) {
    console.log('Callback: ' + err.message);
});

//---------------------------------------------------------------------------------------------
// Manejando errores mediante Error emitting

var Events = require('events');
var emitter = new Events.EventEmitter();

var validateObject = function (a) {
    if (typeof a !== 'object') {
        emitter.emit('error', new Error('Invalid object - Error emitting'));
    }
};

emitter.on('error', function (err) {
    console.log('Emitted: ' + err.message);
});

validateObject('123');
//---------------------------------------------------------------------------------------------

/* Manejar errores con promesas:

doWork()
.then(doWork)
.then(doError)
.then(doWork)
.catch(errorHandler)
.then(verify);

*/


//---------------------------------------------------------------------------------------------

const fetch = require('node-fetch')
/*
ES7 Async/await allows us as developers to write asynchronous JS code that look synchronous.
*/

async function f() {

  try {
    let response = await fetch('http://no-such-url');
  } catch(err) {
    console.log("Error: "+ err.message); // TypeError: failed to fetch
  }
}

f();

//---------------------------------------------------------------------------------------------
/*The variation on async/await without try-catch blocks in Javascript. Consider:
const to = require('await-to-js').default;

async function main(callback) {
    const [err,quote] = await to(getQuote());
    if(err || !quote) return callback(new Error('No Quote found'));
    callback(null,quote);
}

*/