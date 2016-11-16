var net = require("net");
var ip = require("ip");
var server = net.createServer();
var PORT = process.argv[2] || 5000;
var ADDRESS = ip.address();
var SID = 13325208;

var ROOMS = new Array(); //this will be an array of arrays, the first element of each contains the room name
var SOCKETS = new Array();
var CLIENTS = new Array(); 

var temp;
var len;
var dataIn = new Array();
var roomToJoin;


server.on("connection", function(socket) {
        var remoteAddress = socket.remoteAddress + ":" + socket.remotePort;
        console.log("New Client has connected at %s", remoteAddress);

        socket.on("data", function(d) {
                console.log("Client data: %s", d);
                s = d;
                if(d === "KILL_SERVICE\n"){
                        socket.destroy();
                }

                else if(d.includes("JOIN_CHATROOM:")){
                        dataIn = stringSplit(s);
                        console.log('\n\n\n\n\n\n'+dataIn);
                        //TEST Print out received data
                        //will soon move to be above the 'IFs' to reduce code
                        // while(dataIn[i]!=null){
                        //         console.log("Element "+i+": " + dataIn[i]);
                        //         i++;
                        // }
                        temp = dataIn[0].toString()
                        temp = temp.substring(temp.indexOf(": ")+2);
                        if(ROOMS.indexOf(temp) === -1){
                                ROOMS.push(temp);
                                console.log(temp);
                                                        console.log(ROOMS.indexOf(temp)+"\n\n\n\n\n\n\n\n");
                                                        console.log(ROOMS);

                                len = ROOMS.indexOf(temp).length;
                                ROOMS[ROOMS.indexOf(temp)].push(socket);
                        }

                        console.log(ROOMS);
                        console.log(ROOMS[0]);



                }
	
		else {
                        socket.write(d+"IP:"+ socket.address().address +"\nPort:"+ PORT + "\nStudentID:"+ SID +"\n");
                        socket.end();
		}		

        });

        socket.on("close", function() {
                console.log("Connection has been closed from %s", remoteAddress);
                server.close();
        });

        socket.on("error", function(err){
                
        });

});

server.on("error", function(err){
        console.log("ERROR: %s", err.message);
});

server.on("close", function(){
        console.log("Server now closed for business");
});

server.listen(PORT, ADDRESS, function() {
        console.log("Server listening to Port %s. Server Addess: %s", PORT, server.address().address);
});

function stringSplit(s){
        dataIn = s.toString().split('\n');
        console.log("Data Successfully Split");
        return dataIn;

}

