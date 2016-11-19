var net = require("net");
var ip = require("ip");
var server = net.createServer();
var PORT = process.argv[2] || 5000;
var ADDRESS = ip.address();
var SID = 13325208;

var ROOMS = new Array(5); //this will be an array of arrays, the first element of each contains the room name
ROOMS = [['x'],['x'],['x'],['x'],['x'],['x'],['x'],['x'],['x'],['x'],['x'],['x'],['x'],['x'],['x'],['x'],['x'],['x'],['x']];
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
                dataIn = stringSplit(s);

                if(d === "KILL_SERVICE\n"){
                        socket.destroy();
                }

                else if(d.includes("JOIN_CHATROOM:")){
                        console.log('\n\n\n\n\n\n'+dataIn);
                        //TEST Print out received data
                        //will soon move to be above the 'IFs' to reduce code
                        // while(dataIn[i]!=null){
                        //         console.log("Element "+i+": " + dataIn[i]);
                        //         i++;
                        // }
                        temp = dataIn[1].toString();
                        socket.name = dataIn[7].toString();
                        console.log(socket.name);
                        if(!roomExists(temp)){
                                ROOMS[0].push(temp);
                                console.log(ROOMS);
                                //ROOMS.push(socket);
                                //console.log(ROOMS);
                                ROOMS[0].push(socket);
                                console.log("IF Statement \n\n")
                                console.log(ROOMS);

                                socket.write("JOINED_CHATROOM: " + temp "\n"
                                                + "SERVER_IP: " + ip + "\n"
                                                + "PORT: " + PORT + "\n"
                                                + "ROOM_REF");
                                //ROOMS[ROOMS.indexOf(temp)].push(socket);
                        }
                        else{
                                ROOMS[roomNumber(temp)].push(socket);
                        }
                }

                else if(dataIn[6].includes("MESSAGE: ")){
                        var rID = dataIn[1];
                        var room = ROOMS[roomNumber(rID)];
                        var j;
                        var sock;
                        for(j=1; j<=room.length; j++){
                                sock = room[j];
                                sock.write("CHAT: " + room[0] "\n"
                                                + "CLIENT_NAME: " + sock.name + "\n"
                                                + "MESSAGE: " + dataIn[7] + "\n\n");
                        }

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

function roomExists(name){
        var i;
        var tmp;
        for(i = 0; i <= ROOMS.length; i++){
                if(ROOMS[i][0] === name){
                        return true;
                }
        }
        return false;
}

function roomNumber(name){
        var i;
        for(i=0; i<=ROOMS.length; i++){
                if(ROOMS[i][0] === name){
                        return i;
                }
        }
}

function isEmpty(){
        var i;
        for(i=0;i<=ROOMS.length;i++){
                if(ROOM[i][0] === 'x'){
                        return i;
                }
        }        
        return -1;
}

function stringSplit(s){
        dataIn = s.toString().split(/\s/);
        console.log("Data Successfully Split");
        return dataIn;

}

