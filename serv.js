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
                        temp = dataIn[2].toString();
                        console.log("DEBUG \n please work \n" + dataIn + "\n\n");
                        socket.name = dataIn[14].toString();
                        console.log(socket.name);
                        if(!roomExists(temp)){
                                ROOMS[roomsOpen][0] = temp;
                                console.log(ROOMS);


                                ROOMS[roomsOpen].push(socket);
                                
                                ref = roomNumber(temp);

                                roomsOpen++;
                                joinID++;

                                console.log("IF Statement \n\n")
                                console.log(ROOMS);

                                socket.write("JOINED_CHATROOM: " + temp + "\n"
                                                + "SERVER_IP: " + "192.168.0.13" + "\n"
                                                + "PORT: " + PORT + "\n"
                                                + "ROOM_REF: " + ref + "\n"
                                                + "JOIN_ID: " + joinID + "\n\n");

                                console.log("End of write");
                        }
                        else{
                                var thisRoom = new Array();
                                thisRoom = ROOMS[roomNumber(temp)];
                                var k;
                                var thisSock;
                                for(k=1; k<thisRoom.length; k++){
                                        thisSock = thisRoom[k];
                                        thisSock.write(dataIn[14] + " has joined the CHATROOM BABY");
                                }
                                ROOMS[roomNumber(temp)].push(socket);
                                joinID++;
                                ref = roomNumber(temp);
                                socket.write("JOINED_CHATROOM: " + temp + "\n"
                                                + "SERVER_IP: " + "192.168.0.13" + "\n"
                                                + "PORT: " + PORT + "\n"
                                                + "ROOM_REF: " + ref + "\n"
                                                + "JOIN_ID: " + joinID + "\n\n");
                       }
                }

                else if(d.includes("MESSAGE: ")){
                        var rID = dataIn[2];
                        var room = new Array();
                        room = ROOMS[roomNumber(rID)];
                        var j;
                        var sock;
                        for(j=1; j<=room.length; j++){
                                sock = room[j];
                                sock.write("CHAT: " + room[0] + "\n"
                                                + "CLIENT_NAME: " + sock.name + "\n"
                                                + "MESSAGE: " + dataIn[7] + "\n\n");
                        }
                }

                else if(dataIn[0].includes("LEAVE_CHATROOM: ")){

                }

		else {
                        socket.write(d+"IP:"+ socket.address().address +"\nPort:"+ PORT + "\nStudentID:"+ SID +"\n");
		}		

        });

        // socket.on("close", function() {
        //         console.log("Connection has been closed from %s", remoteAddress);
        //         server.close();
        // });

        // socket.on("error", function(err){
                
        // });

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
        dataIn = s.toString().split(/(\:|\s)/);
        console.log("Data Successfully Split");
        console.log(dataIn);
        return dataIn;

}


