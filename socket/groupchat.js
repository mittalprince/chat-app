module.exports = function(io, Users){
    const users = new Users();
    io.on('connection', (socket)=>{
        console.log("connected");

        socket.on('join',(params, callback)=>{
            socket.join(params.room);
            users.AddUserData(socket.id,params.name,params.room);
            io.to(params.room).emit('userList',users.GetUserList(params.room));
            callback();
        })

        socket.on('createMessage',(message, callback)=>{
            console.log(message);
            io.to(message.room).emit('newMessage',{
                text:message.text,
                room:message.room,
                from:message.from,
                image:message.userPic
            });
            callback()
        });
        socket.on('disconnect',()=>{
            var user = users.RemoveUser(socket.id);
            if(user){
                io.to(user.room).emit('userList',users.GetUserList(user.room));
            }
        })
    });

}