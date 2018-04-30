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
    socket.on('newFriendRequest',function(friend){

    })
    $('#add_friend').on('submit',function(e){
        e.preventDefault();

        var receiverName = $('#receiverName').val()

        $.ajax({
            url:`/group/${room}`,
            type:'POST',
            data:{
                receiverName:receiverName
            },
            success: function(){
                socket.emit('friendRequest',{
                    receiver: receiverName,
                    sender:sender
                },)
            }
        })
    })


})