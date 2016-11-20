var net = require("net");
var ip = require("ip");
var server = net.createServer();
var PORT = process.argv[2] || 5000;
var ADDRESS = ip.address();
var SID = 13325208;

 //this will be an array of arrays, the first element of each contains the room name
var ROOMS = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
var SOCKETS = new Array();
var CLIENTS = new Array(); 

var temp;
var len;
var dataIn = new Array();
var roomToJoin;
var roomsOpen = 0;
var joinID = 0;
var ref;
var tempSock = new net.Socket();

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
                        temp = dataIn[1].toString();
                        socket.name = dataIn[7].toString();
                        console.log(socket.name);
                        if(!roomExists(temp)){
                                ROOMS[roomsOpen][0] = temp;
                                ROOMS[roomsOpen].push(socket);
                                ref = roomNumber(temp);
                                roomsOpen++;
                                joinID++;
                                socket.write("JOINED_CHATROOM: " + temp + "\n"
                                                + "SERVER_IP: " + "192.168.0.13" + "\n"
                                                + "PORT: " + PORT + "\n"
                                                + "ROOM_REF: " + ref + "\n"
                                                + "JOIN_ID: " + joinID + "\n");
                                printRooms();

                                var thisRoom = new Array();
                                thisRoom = ROOMS[ref];
                                var l;
                                var thisSock;
                                for(l=1; l<thisRoom.length; l++){
                                        thisSock = thisRoom[l];
                                        thisSock.write("CHAT:" + ref + "\n"
                                                + "CLIENT_NAME:" + dataIn[7] + "\n"
                                                + "MESSAGE:" + dataIn[7] + " has joined this chatroom.\n\n";);
                                }
                        }
                        else{
                                var thisRoom = new Array();
                                var k;
                                var thisSock;
                          
                                joinID++;
                                ref = roomNumber(temp);
                                socket.write("JOINED_CHATROOM: " + temp + "\n"
                                                + "SERVER_IP: " + "192.168.0.13" + "\n"
                                                + "PORT: " + PORT + "\n"
                                                + "ROOM_REF: " + ref + "\n"
                                                + "JOIN_ID: " + joinID + "\n");
                                ROOMS[roomNumber(temp)].push(socket);
                                printRooms();
                                var thisRoom = new Array();
                                thisRoom = ROOMS[ref];
                                var l;
                                var thisSock;
                                for(l=1; l<thisRoom.length; l++){
                                        thisSock = thisRoom[l];
                                        thisSock.write("CHAT: "+ ref + "\n"
                                                        + "CLIENT_NAME: " + thisSock.name + "\n"
                                                        + "MESSAGE: " + thisSock.name +" has joined the chatroom.\n\n");
                                }
                        }
                }

                else if(d.includes("MESSAGE:")){
                        console.log(dataIn);
                        var rID = dataIn[1];
                        console.log("RID: " + rID);
                        var room = new Array();
                        console.log(roomNumber(rID));
                        room = ROOMS[rID];
                        console.log("xxxxxxxxx\n\n");
                        console.log(room);
                        console.log("\n\nxxxxxxxxx");
                        var j;
                        var sock;
                        for(j=1; j<room.length; j++){
                                sock = room[j];
                                sock.write("CHAT: " + room[0] + "\n"
                                                + "CLIENT_NAME: " + sock.name + "\n"
                                                + "MESSAGE: " + dataIn[7] + "\n\n");
                        }
                }

                else if(dataIn[0].includes("LEAVE_CHATROOM:")){
                        console.log("\n\nEntering Leave loop\n\n" + ROOMS);
                        var ID = dataIn[1];
                        var room = ROOMS[ID];
                        var n;
                        var sock;
                        socket.write("LEFT_CHATROOM: " + ID +"\n"
                                      + "JOIN_ID: " + dataIn[3] + "\n");
                        for(n=1; n<room.length; n++){
                                tempSock = room[n];
                                if(tempSock.name === dataIn[5].toString()){
                                        printRooms();
                                        tempSock.write("CHAT: " + ID +"\n"
                                                        + "CLIENT_NAME: " + dataIn[5] + "\n"
                                                        + "MESSAGE: " + dataIn[5] + " has left this chatroom.\n\n");
                                        ROOMS[ID].splice(n, 1);
                                        console.log("\n------------------------------------------------------------------------------");
                                        console.log("|                               Room spliced                                   |");
                                        console.log("-------------------------------------------------------------------------------\n\n");
                                        printRooms();
                                }
                        }
                }

		else if(d.includes("HELO")){
                        socket.write(d+"IP:"+ socket.address().address +"\nPort:"+ PORT + "\nStudentID:"+ SID +"\n");
		}		

        });

        socket.on("close", function() {
                console.log("Connection has been closed from %s", remoteAddress);
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
        var tmpArray = new Array();

        for(i = 0; i < ROOMS.length; i++){
              
                tmpArray = ROOMS[i];
                

                if(tmpArray[0] === name){
                        return true;
                }
        }
        return false;
}

function roomNumber(name){
        var i;
        for(i=0; i < ROOMS.length; i++){
                if(ROOMS[i][0] === name){
                        return i;
                }
        }
}

function isEmpty(){
        var i;
        for(i=0;i < ROOMS.length;i++){
                if(ROOM[i][0] === 'x'){
                        return i;
                }
        }        
        return -1;
}

function stringSplit(s){
        dataIn = s.toString().split(/\s/);
        console.log("Data Successfully Split");
        console.log(dataIn);
        return dataIn;

}

function printRooms(){
        var i, j;
        console.log("________________________ THE CHATROOMS _________________________\n");
        for(i=0; i<ROOMS.length; i++){
                console.log("ROOM "+i+": ");
                for(j=1; j<ROOMS[i].length; j++){
                        console.log(ROOMS[i][j].name +", ");
                }
        }
}



