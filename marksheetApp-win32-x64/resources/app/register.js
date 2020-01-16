//const bcrypt = require('bcrypt');
const $ = require('jquery');
const passwordHash = require('password-hash');
//var springedge = require('springedge');
//const sendOtp = new otp('AnPUIZKAJipTOLA7VnUVLC5ENwDD2qkR');
let session = window.sessionStorage;
let dbPromise;


$(document).ready(function(){
  $('#user-name').html(session.getItem("name"));
});


(function(){
	if (!('indexedDB' in window)) {
    	console.log('This browser doesn\'t support IndexedDB');
  	}

  	var idb = window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB, db;

 	dbPromise = idb.open('test1', 7);

 	dbPromise.onupgradeneeded = function(event) {
 		console.log('making a new object store');
 		var upgradeDb = event.target.result;
    	if (!upgradeDb.objectStoreNames.contains('userlogin')) {
      		const userOS = upgradeDb.createObjectStore('userlogin', {keyPath: 'email'});
      		userOS.createIndex('email', 'email', {unique: true});
    	}
    	if (!upgradeDb.objectStoreNames.contains('student')) {
      		const studentOS = upgradeDb.createObjectStore('student', {keyPath: 'roll'});
      		studentOS.createIndex('roll', 'roll', {unique: true});
    	}
    	if (!upgradeDb.objectStoreNames.contains('sem1')) {
      		var sem1OS = upgradeDb.createObjectStore('sem1', {keyPath: 'roll'});
      		sem1OS.createIndex('roll', 'roll', {unique: true});
    	}
    };
}());

dbPromise.onsuccess = function(event) {
    	db = event.target.result;
      console.log("success: "+ db);
};

//validate form
function validate() {
	let pass = $('#password').val(),
	confpass = $('#ConfirmPassword').val(),
	warnings = $('.warning'), fail = 0;
	warnings.empty();

	if (pass !== confpass) {
		warnings.append("<li>Password don't match</li>");
		fail++;
	}

	let inputs = $('.form-login input');
	inputs.each(function(key, item){
		if ($(item).val() === '') {
			warnings.append('<li>' + $(item).attr('placeholder') + ' field is empty</li>');
			fail++;
		} 
	});

  var validator = $('.form-login').validate({
    rules: {
      password : {
        passcheck : true
      }
    },
    errorElement : "div"
  });


  $.validator.addMethod("passcheck", function (value) {
      var passauth = /[\@\#\$\%\^\&\*\(\)\_\+\!]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value) && /[A-Z]/.test(value);
      if (!passauth) {
        fail++;
      };
      return passauth;
  }, "Enter a strong password");
  
  return fail === 0 ? true : false;

}

$('#signup').on('click', function(event){
  event.preventDefault();
  if (validate()) {
    addUserInfo();
  }
}) 

function addSession() {
    session.setItem("name", $('#userName').val());
}

function logout() {
  $('#logout').on('click', function(){
      session.clear();
      window.location = "login.html";
  });
}

//database creation and storing of data

function addUserInfo() {		
 	//adding user data to database 
    var pass = $('#password').val(),
  		hash = passwordHash.generate($('#password').val()),
  		tx = db.transaction('userlogin', 'readwrite'),
  		store = tx.objectStore('userlogin');
  	var item = {
  		name: $('#Name').val(),
   		class: $('#Class').val(), 
   		email: $('#Username').val(),
   		password: hash
	};
  	var req = store.put(item);

  	req.onsuccess = function(event){
  		window.location = "login.html"
  		console.log("transaction complete");
  	};
};


function login() {
	//checking user info
  addSession();
	var tx = db.transaction('userlogin', 'readonly'),
		store = tx.objectStore('userlogin'),
		email = $('#userName').val(),
		pass = $('#userPassword').val(), request;

	request = store.get(email);
	
    tx.oncomplete = function(event){
      response = request.result; 

      if(response) {
              if(passwordHash.verify(pass, response.password)) {
                window.location = "main.html"
              } else {
                  console.log("incorrect password");
              }
      } else {
              console.log("you haven't signed up yet!Do register");
      }
    };
}


$('#addStudentInfo').on('click', function(e) {
	e.preventDefault();
	var tx = db.transaction('student', 'readwrite'),
  		store = tx.objectStore('student');

  var item = {
  	roll: $('#roll').val(),
   	firstName: $('#FirstName').val(), 
   	lastName: $('#LastName').val(),
    branch: $('#branch').val()
  };
  
  var req = store.put(item);

  tx.oncomplete = function(event) {
    $('#console-log').html("Information is saved");
    $('input[type=text]').val("");
  };

});

$('#addSemData').on('click', function(e){
	e.preventDefault();
	var tx = db.transaction('sem1', 'readwrite'),
  		store = tx.objectStore('sem1');

  var item = {
  	roll: $('#roll').val(),
  	chemistry: $('#Chemistry').val(), 
  	physics: $('#Physics').val(),
  	history : $('#history').val()
	};
  	
  req = store.put(item);

  tx.oncomplete = function(response){
    $('#console-log').html("Semister1 marks are saved");
    $('input[type=text]').val("");
  };

});


$('#getReport').on('click', function(e){
	e.preventDefault();
	fetch_data();
});

function fetch_data() {
	let tx = db.transaction('student', 'readonly'),
		tx1 = db.transaction('sem1', 'readonly'),
		studentstr = tx.objectStore('student'),
		semstr = tx1.objectStore('sem1'),
		roll = $('#roll').val(), studentInfo, marksinfo;

	var request = studentstr.get(roll);
	var request1 = semstr.get(roll);

	var contentElement = $('#main'),
			Handlebars = require('handlebars');

	var contentTemplate = Handlebars.compile($('#entry-template').text());

	 tx.onerror = function(event) {
           alert("Unable to retrieve daa from database!");
    };

    tx.oncomplete = function(event) {
    	studentInfo = request.result;
    }

    tx1.oncomplete = function(event) {
    	marksinfo = request1.result;
        var newData = contentTemplate({
            studentName: studentInfo.firstName +  ' ' + studentInfo.lastName,
            roll: studentInfo.roll,
            chem : marksinfo.chemistry,
            phy : marksinfo.physics,
            his : marksinfo.history
        });
      contentElement.replaceWith(newData);
    };		    
}

 

 
/*var params = {
  'apikey': 'AnPUIZKAJipTOLA7VnUVLC5ENwDD2qkR', // API Key 
  'sender': 'SEDEMO', // Sender Name 
  'to': [
    '8806197164'  //Moblie Number 
  ],
  'message': 'The message received'
};
 
springedge.messages.send(params, 5000, function (err, response) {
  if (err) {
    return console.log(err);
  }
  console.log(response);
});*/

/*$('#print').on('click', function(e){
	e.preventDefault();
	PrintElem($('#main'));
});

function PrintElem(elem)
{
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + document.title  + '</h1>');
    mywindow.document.write(document.getElementById(elem).innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10

    mywindow.print();
    mywindow.close();

    return true;
}*/

	
