$(document).ready(function(){
    var socket = io();

    var room = $('#groupName').val()
    var sender = $('#sender').val()

    socket.on('connect',function(){
        console.log("Yeah! user connected");

        var params = {
            room: room
        }
        socket.emit('join', params ,function(){
            console.log('User has joined this channel ')
        } )
    });

    socket.on('newMessage', function(data){
        console.log(data);
    })

    $('#message-form').on('submit', function(e){
        e.preventDefault();

        var msg = $('#msg').val();
        socket.emit('createMessage', {
            text: msg,
            room: room,
            from:sender
        }, function(){
            $('#msg').val('');
        });
    })
})