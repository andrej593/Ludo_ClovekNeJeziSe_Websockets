var socket = io('http://localhost:3000');

//Game globals
var uid=$('.userIdField').attr('id');
let accesstoken = $('.userAccessToken').attr('id');

var inGame=false;
var myRoom={num:0};
var diceClickable=false;
var lastThrow = 0;
var firstThrow = true;

var cheats = true;

var colors = ["nocolor","blue","green","yellow","red"];
const NO_MOVE = 0;
const MOVE = 1;
const REPLACED = 2;

//generira igralno povrsino v UI
function generateGameBoard(){
    $('.gameBoard').html(""); //pobrise staro polje ce resetiras game

    //11*11 grid
    for(let i=1;i<12;i++){
    let row = $('<div>',{'class':'row'});
          for(let j=1;j<12;j++){
     let col = $('<div>',{'class':'col ratio ratio-1x1 bg-dark border border-dark tile','id':i+'_'+j});
     col.html('.');
     row.append(col);
    }
    $('.gameBoard').append(row);
    }
    //blue box
    $('#2_2').toggleClass('bg-dark bg-primary blue path');
    $('#2_2').attr('id', 'BB1');
    $('#2_3').toggleClass('bg-dark bg-primary blue path');
    $('#2_3').attr('id', 'BB2');
    $('#3_2').toggleClass('bg-dark bg-primary blue path');
    $('#3_2').attr('id', 'BB3');
    $('#3_3').toggleClass('bg-dark bg-primary blue path');
    $('#3_3').attr('id', 'BB4');
    //green box
    $('#2_10').toggleClass('bg-dark bg-success green path');
    $('#2_10').attr('id', 'GB1');
    $('#2_9').toggleClass('bg-dark bg-success green path');
    $('#2_9').attr('id', 'GB2');
    $('#3_10').toggleClass('bg-dark bg-success green path');
    $('#3_10').attr('id', 'GB3');
    $('#3_9').toggleClass('bg-dark bg-success green path');
    $('#3_9').attr('id', 'GB4');
    //red box
    $('#10_3').toggleClass('bg-dark bg-danger red path');
    $('#10_3').attr('id', 'RB1');
    $('#10_2').toggleClass('bg-dark bg-danger red path');
    $('#10_2').attr('id', 'RB2');
    $('#9_3').toggleClass('bg-dark bg-danger red path');
    $('#9_3').attr('id', 'RB3');
    $('#9_2').toggleClass('bg-dark bg-danger red path');
    $('#9_2').attr('id', 'RB4');
    //yellow box
    $('#10_10').toggleClass('bg-dark bg-warning yellow path');
    $('#10_10').attr('id', 'YB1');
    $('#10_9').toggleClass('bg-dark bg-warning yellow path');
    $('#10_9').attr('id', 'YB2');
    $('#9_10').toggleClass('bg-dark bg-warning yellow path');
    $('#9_10').attr('id', 'YB3');
    $('#9_9').toggleClass('bg-dark bg-warning yellow path');
    $('#9_9').attr('id', 'YB4');
    
    let counter=1;
    let counter2=40;
    $('#5_1').toggleClass('bg-dark bg-primary path');
    $('#5_1').attr('id', counter);
    counter++;
    $('#6_1').toggleClass('bg-dark bg-secondary path');
    $('#6_1').attr('id', counter2);
    counter2--;
    $('#7_1').toggleClass('bg-dark bg-secondary path');
    $('#7_1').attr('id', counter2);
    counter2--;
    let boxC=1;
    for(let i=2;i<6;i++){
    $('#6_'+i).toggleClass('bg-dark bg-primary path');
    $('#6_'+i).attr('id', 'B'+boxC);
      boxC++;
    if(i!=5){
    $('#5_'+i).toggleClass('bg-dark bg-secondary path');
    $('#5_'+i).attr('id', counter);
    counter++;
    $('#7_'+i).toggleClass('bg-dark bg-secondary path');
    $('#7_'+i).attr('id', counter2);
    counter2--;
    }
    }
    counter2=15;
    boxC=4;
    for(let i=5;i>1;i--){
    $('#'+i+'_6').toggleClass('bg-dark bg-success path');
    $('#'+i+'_6').attr('id', 'G'+boxC);
      boxC--;
    $('#'+i+'_5').toggleClass('bg-dark bg-secondary path');
    $('#'+i+'_5').attr('id', counter);
    counter++;
    $('#'+i+'_7').toggleClass('bg-dark bg-secondary path');
    $('#'+i+'_7').attr('id', counter2);
    counter2--;
    }
    $('#1_5').toggleClass('bg-dark bg-secondary path');
    $('#1_5').attr('id', counter);
    counter++;
    $('#1_6').toggleClass('bg-dark bg-secondary path');
    $('#1_6').attr('id', counter);
    counter++;
    $('#1_7').toggleClass('bg-dark bg-success path');
    $('#1_7').attr('id', counter);
    counter++;
    
    counter=16;
    counter2=24;
    boxC=4;
    for(let i=7;i<11;i++){
    $('#6_'+i).toggleClass('bg-dark bg-warning path');
    $('#6_'+i).attr('id', 'Y'+boxC);
      boxC--;
    if(i!=7){
    $('#5_'+i).toggleClass('bg-dark bg-secondary path');
    $('#5_'+i).attr('id', counter);
    counter++;
    $('#7_'+i).toggleClass('bg-dark bg-secondary path');
    $('#7_'+i).attr('id', counter2);
    counter2--;
    }
    }
    $('#5_11').toggleClass('bg-dark bg-secondary path');
    $('#5_11').attr('id', counter);
    counter++;
    $('#6_11').toggleClass('bg-dark bg-secondary path');
    $('#6_11').attr('id', counter);
    counter++;
    $('#7_11').toggleClass('bg-dark bg-warning path');
    $('#7_11').attr('id', counter);
    counter++;
    
    boxC=4;
    counter=25;
    counter2=35;
    for(let i=7;i<11;i++){
    $('#'+i+'_6').toggleClass('bg-dark bg-danger path');
    $('#'+i+'_6').attr('id', 'R'+boxC);
      boxC--;
    $('#'+i+'_5').toggleClass('bg-dark bg-secondary path');
    $('#'+i+'_5').attr('id', counter2);
    counter2--;
    $('#'+i+'_7').toggleClass('bg-dark bg-secondary path');
    $('#'+i+'_7').attr('id', counter);
    counter++;
    }
    $('#11_7').toggleClass('bg-dark bg-secondary path');
    $('#11_7').attr('id', counter);
    counter++;
    $('#11_6').toggleClass('bg-dark bg-secondary path');
    $('#11_6').attr('id', counter);
    counter++;
    $('#11_5').toggleClass('bg-dark bg-danger path');
    $('#11_5').attr('id', counter);
    counter++;
    
    //premicljiva polja so indexirana
    $('.path').each(function(i, obj){
      $(this).attr('onclick', 'makeMove(this)');
      $(this).html($(this).attr('id'));
    });
}

//SOCKET CLIENT SENT

//click create room
function createRoom(){
    if(!inGame){
        socket.emit('createRoom', {"user_id":uid});
    }
}

//pridruzi se sobi click
function joinRoom(el){
    let id = $(el).attr('id');
    if(!inGame){
        socket.emit('joinRoom', {"user_id":uid, "num":id});
    }
}

//zapusti sobo click
function leaveRoom(el){
    let id = $(el).attr('id');
    //ce si v tem roomu
    if(myRoom!=""){
        if(id==myRoom.num){
            socket.emit('leaveRoom', {"user_id":uid,"num":myRoom.num});
        }
    }
}

//premik glede na met in izbrano figuro
function makeMove(el){
    let id = $(el).attr('id');
    if($(el).hasClass('clickable')){
        $('.clickable').toggleClass("clickable");
        socket.emit("makeMove", {"id":id, "_id":uid, 'num':myRoom.num});
    }
}

//met kocke on click
function throwDie(el, val){
    if(diceClickable){
        diceClickable=false;
        $('#dicesound')[0].load();
        $('#dicesound')[0].play();
        //budget animation
        setTimeout(function(){$(el).html('&#x2682');},150);
        setTimeout(function(){$(el).html('&#x2680');},300);
        setTimeout(function(){$(el).html('&#x2681');},450);
        setTimeout(function(){$(el).html('&#x2683');},600);
        setTimeout(function(){$(el).html('&#x2685');},750);
        setTimeout(function(){$(el).html('&#x2684');},1000);
        
        setTimeout(function(){
            $('#dicesound')[0].pause();
            let thrown;
            //if cheats thrown=val else random
            if(cheats){
                thrown=val;
            }else{
                thrown=Math.floor(Math.random() * 6) + 1;
            }
            $(el).html('&#x268'+(thrown-1));
            lastThrow=thrown;
            socket.emit('thrown', {"pid":uid, "num":myRoom.num, "val":thrown});
        },1150);
    }
    //personal message - not your turn yet? dont want to fill gamemessageboard
}

//SOCKET RECIEVE FROM SERVER

//on connection send id to server
socket.on('Hello', function (data) {
    console.log(data);
    socket.emit('Hello', { _id: uid });
});

//when there is a change with rooms update
socket.on('rooms', function(data){
    console.log("Drawing rooms..");
    let rooms="";
    data.forEach(el => {
        let room = '<div class="room list-group border">'+
                        '<div class="row m-1">'+
                            '<div class="col d-flex justify-content-start">'+
                                '<h3>Room'+ el.num+'</h3>'+
                            '</div>'+
                            '<div class="col d-flex justify-content-end">'+
                                '<a class="btn btn-success" id="'+el.num+'" onclick="joinRoom(this)">Join</a>'+
                                '<a class="btn btn-danger" id="'+el.num+'" onclick="leaveRoom(this)">Leave</a>'+
                            '</div>'+
                        '</div>';
        let tmp=0;
        el.players.forEach(player =>{
            room+='<a class="list-group-item list-group-item-action">'+colors[player.color]+' - '+player.nickname+'</a>';
            tmp++;
        });
        for(let i=0;i+tmp<4;i++){
            if(!room.inProgress){
                room+='<a class="list-group-item list-group-item-action disabled" >Empty</a>';
            }else{
                room+='<a class="list-group-item list-group-item-action disabled" >Player won</a>';
            }
        }
        room+='</div>';
        rooms+=room;
    });
    $('.rooms').html(rooms);
});

//someone created a room
socket.on('createdRoom', function(data){
    $('.messageBoard').prepend(data.nickname+" created room "+data.num+"<br/>");
});

//you join
socket.on('joinedRoom', function(data){
    if(data){
        $('.messageBoard').prepend("You joined room "+data.num+"<br/>");
        inGame=true;
        myRoom=data;
    }else{
        $('.messageBoard').prepend("Failed to join the room"+"<br/>");
    }
});

//someone else joins
socket.on('userJoinedRoom', function(data){
    $('.messageBoard').prepend(data.nickname+" joined room "+data.num+"<br/>");
});

//you leave
socket.on('leftRoom', function(data){
    $('.messageBoard').prepend("You left room "+data.num+"<br/>");
    inGame=false;
    myRoom={num:0};
    diceClickable=false;
    lastThrow = 0;
    firstThrow = true;
});

//somone else leaves
socket.on('userLeftRoom', function(data){
    $('.messageBoard').prepend(data.nickname+" left room "+data.num+"<br/>");
});

//game starts
socket.on('gameStart',function(data){
    generateGameBoard();
    $('.gameMessageBoard').html(""); //pobrise staro polje ce zacnes novo igro
    $('.messageBoard').prepend("Game started in room "+data.num+"<br/>");
    if(data.num==myRoom.num){
        $('.gameMessageBoard').prepend("Game Start! Throw your die."+"<br/>");
        diceClickable=true;
        inGame=true;
    }
});

//klko je gdo vrgo
socket.on('playerThrew', function(data){
    if(data.num == myRoom.num){
        $('.gameMessageBoard').prepend(data.nickname+" threw "+data.val+"<br/>");
    }
});

//update gameBoard
socket.on('gameStateChanged',function(data){
    if(data.num == myRoom.num){
        if(data.playerTurn._id == uid){
            console.log("My turn");
            $('.gameMessageBoard').prepend("Yourn turn! Throw your dice."+"<br/>");
            diceClickable=true;
        }else{
            $('.gameMessageBoard').prepend("It's "+data.playerTurn.nickname+"'s turn to throw dice."+"<br/>");
            console.log("Not my turn");
        }
    }
});

//izbira figuro za premik - aktivira onclicke na teh elementih
socket.on('choseMove', function(data){
    $('.gameMessageBoard').prepend("Chose token to move.<br/>");
    //aktivira figure ki jih lahko premaknes
    data.forEach(function(token){
        $('#'+token.id).toggleClass("clickable");
    });
});

//izvede premik na UI
function makeMoveOnBoard(movedFrom, movedTo, color){
    //console.log(movedFrom +' - '+ movedTo);
    $('#'+movedFrom+'').toggleClass(colors[color]);
    $('#'+movedTo+'').toggleClass(colors[color]);
}

//podatki o premiku figur/tokenov
socket.on('moveReport', function(data){
    if(data.num == myRoom.num){
        if(data.moveType == MOVE){
            $('.gameMessageBoard').prepend(data.nickname+" moved from "+data.movedFrom+" to "+data.movedTo+".<br/>");
            makeMoveOnBoard(data.movedFrom, data.movedTo, data.color);
        }else if(data.moveType == NO_MOVE){
            $('.gameMessageBoard').prepend(data.nickname+"'s turn ends.<br/>");
        }else if(data.moveType == REPLACED){
            $('#kick')[0].play();
            $('.gameMessageBoard').prepend(data.nickname+" moved from "+data.movedFrom+" to "+data.movedTo+" and kicked "+data.replaced+" to "+data.replacedTo+"<br/>");
            //prvo umaknes kicked nazaj v box
            makeMoveOnBoard(data.movedTo, data.replacedTo, data.replacedColor);
            //premik na prazno mesto
            makeMoveOnBoard(data.movedFrom, data.movedTo, data.color);
        }
    }
});

//ko igralec zakljuci igro
socket.on('finished', function(data){
    if(data.num == myRoom.num){
        $('#cheers')[0].load();
        $('#cheers')[0].play();
        $('.gameMessageBoard').toggleClass('win');
        setTimeout(function(){
            $('#cheers')[0].pause();
            $('.gameMessageBoard').toggleClass('win');
        },1500);
        $('.gameMessageBoard').prepend(data.nickname+" finished the game "+data.place+"st place.<br/>");
    }
});

//error
socket.on('error', function(data){
    $('.gameBoard').prepend(data.message+"<br/>");
});

//logout ajax
function logout(el){
    $.ajax({
        url: "http://localhost:3000/user/logout/",
        type: 'GET',
        headers:{
            "Authorization": "Bearer " + accesstoken,
        },
        success: function(res){
            document.open();
            document.write(res);
            document.close();
        }
    });
}

generateGameBoard();
