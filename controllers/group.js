    module.exports = function(Users,async){
        return {
            SetRouting: function(router) {
                router.get('/group/:name', this.groupPage);
                router.post('/group/:name',this.groupPostPage)
            },

            groupPage: function(req,res){
                const name = req.params.name;
                async.parallel([
                    function(callback){
                        Users.findOne({'username':req.user.username})
                            .populate('request.userId')
                            .exec((err,result)=>{
                                callback(err,result)
                            })
                    }
                ],(err,results)=>{
                    const result1= results[0];
                    //console.log(results)
                    // console.log('m ',result1);
                    //console.log(' yo yo ')
                    //console.log('p ',result1.request[0].userId)
                    res.render('groupchat/group',{title:'Footballkik - Group',user:req.user ,
                        groupName: name, data:result1});
                })
            },
            groupPostPage: function(req,res){
                async.parallel([
                    function(callback){
                        //console.log("fucking ",req.user)
                        if(req.body.receiverName){
                           // console.log(" 1",req.body.receiverName);
                            Users.update({
                                    'username':req.body.receiverName,
                                    'request.userId':{$ne:req.user._id},
                                    'friendsList.friendId':{$ne:req.user._id}
                                },
                                {   $push:{request:{
                                    userId:req.user._id,
                                    username:req.user.username
                                }},
                                    $inc:{"totalRequest":1}
                                    // "totalRequest":{
                                    // $inc: 1
                                    // }
                            },(err,count)=>{
                                callback(err,count);
                               //  console.log('2 ',count)
                            })
                        }
                    },
                    function(callback){
                        if(req.body.receiverName){
                            Users.update({
                                'username':req.user.username,
                                'sentRequest.username':{$ne:req.body.receiverName}
                                },
                                {  $push:{sentRequest: {
                                    username:req.body.receiverName
                                }}
                            },(err,count)=>{
                                callback(err,count);
                                //console.log('3 ',count)
                            })
                        }
                    }
                ],(err, results)=>{
                    res.redirect('/group/'+req.params.name)
                    //console.log('4 ',results)
                });

                async.parallel([
                    //This function is updated for the receiver of the friend request when it is accepted
                    function(callback){
                        if(req.body.senderId){
                            Users.update({
                                '_id': req.user._id,
                                'friendsList.friendId': {$ne: req.body.senderId}
                            }, {
                                $push: {friendsList: {
                                    friendId: req.body.senderId,
                                    friendName: req.body.senderName
                                }},
                                $pull: {request: {
                                    userId: req.body.senderId,
                                    username: req.body.senderName
                                }},
                                $inc: {totalRequest: -1}
                            }, (err, count) => {
                                callback(err, count);
                            });
                        }
                    },

                    //This function is updated for the sender of the friend request when it is accepted by the receiver
                    function(callback){
                        if(req.body.senderId){
                            Users.update({
                                '_id': req.body.senderId,
                                'friendsList.friendId': {$ne: req.user._id}
                            }, {
                                $push: {friendsList: {
                                    friendId: req.user._id,
                                    friendName: req.user.username
                                }},
                                $pull: {sentRequest: {
                                    username: req.user.username
                                }},
                            }, (err, count) => {
                                callback(err, count);
                            });
                        }
                    },

                    function(callback){
                        if(req.body.user_Id){
                            Users.update({
                                '_id': req.user._id,
                                'request.userId': {$eq: req.body.user_Id}
                            }, {
                                $pull: {request: {
                                    userId: req.body.user_Id
                                }},
                                $inc: {totalRequest: -1}
                            }, (err, count) => {
                                callback(err, count);
                            });
                        }
                    },

                    function(callback){
                        if(req.body.user_Id){
                            Users.update({
                                '_id': req.body.user_Id,
                                'sentRequest.username': {$eq: req.user.username}
                            }, {
                                $pull: {sentRequest: {
                                    username: req.user.username
                                }}
                            }, (err, count) => {
                                callback(err, count);
                            });
                        }
                    },

                    function(callback){
                        if(req.body.chatId){
                            Message.update({
                                    '_id': req.body.chatId
                                },
                                {
                                    "isRead": true
                                }, (err, done) => {
                                    callback(err, done);
                                })
                        }
                    }
                ],(err,results)=>{
                    //console.log('6 ',results);
                    res.redirect('/group/'+req.params.name)
                });
            }
        }
    }