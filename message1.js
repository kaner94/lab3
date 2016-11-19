var net = require('net');

var PORT = 5000;
var HOST = '192.168.0.13';

var socket = new net.Socket();

socket.connect(PORT, HOST, function(){
        console.log("Connected!\n");
        //socket.write("GET /echo.php?message=" + process.argv[2] + " HTTP/1.1\r\n\r\n");
        socket.write("CHAT:0\n" + 
        				"JOIN_ID:1\n" +
        				"CLIENT_NAME:testingName\n" +
        				"MESSAGE:this is a big bloody message that I am sending to the guys in the chat" + "\n\n"
        			);
});

socket.on('data', function(data){
        console.log("Received: " + data);
});

socket.on('close', function() {
        console.log('Thanks for coming, see ya soon!');
});