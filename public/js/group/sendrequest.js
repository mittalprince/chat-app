$(document).ready(function(){
    var socket = io();

    var room = $('#groupName').val()
    var sender = $('#sender').val()

    socket.on('connect',function(){
        var params = {
            sender:sender
        }

        socket.emit('joinRequest',params, function(){

        });
    });
    $('#add_friend').on('submit',function(e){
        e.preventDefault();

        var receuverName = $('#receiverName').val()

        $.ajax({
            url:`/group/${room}`,
            type:'POST',
            data:{

            }
        })
    })


})