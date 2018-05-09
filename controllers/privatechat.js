module.exports = function(async,Users,Message){
    return {
        SetRouting: function(router){
            router.get('/chat/:name',this.getchatPage);
            router.post('/chat/:name',this.chatPostPage);
        },

        getchatPage: function(req,res){
            async.parallel([
                function(callback){
                    Users.findOne({'username':req.user.username})
                        .populate('request.userId')
                        .exec((err,result)=>{
                            callback(err,result)
                        })
                },
                function(callback){
                    Message.aggregate(
                        {$match:{$or:[{'senderName':req.user.username},
                        {'receiverName':req.user.username}]}},
                        {$sort:{'createdAt':-1}},
                        {
                            $group:{"_id":{
                                "last_message_between":{
                                    $cond:[
                                        {
                                            $gt:[
                                                {$substr:["$senderName",0,1]},
                                                {$substr:["$receiverName",0,1]}]
                                        },
                                        {$concat:["$senderName"," and ","$receiverName"]},
                                        {$concat:["$receiverName"," and ","$senderName"]}

                                    ]
                                }
                            }, "body":{$first:"$$ROOT"}
                            }
                        }, function (err,newResult) {
                            callback(err,newResult);
                        }
                    )
                }
            ],(err,results)=>{
                const result1= results[0];
                //console.log(results)
                // console.log('m ',result1);
                //console.log(' yo yo ')
                //console.log('p ',result1.request[0].userId)
                res.render('private/privatechat',{title:'Footballkik - Private Chat',user:req.user ,
                     data:result1});
            })
        },

        chatPostPage: function(req,res,next){
            const params = req.params.name.split('.');
            const nameParams = params[0];
            const nameRegex = new RegExp("^"+nameParams.toLowerCase(), "i");

            async.waterfall([
                function(callback){
                console.log("fuck")
                    if(req.body.message){
                        Users.findOne({'username':{$regex: nameRegex}}, (err, data) => {
                            callback(err, data);
                        });
                    }
                },

                function(data, callback){
                    if(req.body.message){
                        console.log("prince")
                        const newMessage = new Message();
                        newMessage.sender = req.user._id;
                        newMessage.receiver = data._id;
                        newMessage.senderName = req.user.username;
                        newMessage.receiverName = data.username;
                        newMessage.message = req.body.message;
                        newMessage.userImage = req.user.UserImage;
                        newMessage.createdAt = new Date();

                        newMessage.save((err, result) => {
                            if(err){
                                return next(err);
                            }
                            //console.log(result);
                            callback(err, result);
                        })
                    }
                }
            ], (err, results) => {
                res.redirect('/chat/'+req.params.name);
            });
        }
    }
}

