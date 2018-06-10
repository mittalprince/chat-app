module.exports = function(async,Users,Message,FriendResult){
    return {
        SetRouting: function(router){
            router.get('/settings/interests', this.getInterestPage);

        },

        getInterestPage: function(req,res){

            async.parallel([
                function(callback){
                    Users.findOne({'username':req.user.username})
                        .populate('request.userId')
                        .exec((err,result)=>{
                            callback(err,result)
                        })
                },
                function(callback){
                    const nameRegex = new RegExp("^"+req.user.username.toLowerCase(), "i");
                    Message.aggregate([
                        {$match:{$or:[{"senderName":nameRegex}, {"receiverName":nameRegex}]}},
                        {$sort:{"createdAt":-1}},
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
                            }, "body": {$first:"$$ROOT"}
                            }
                        }
                    ],function(err, newResult){
                        //console.log(newResult);
                        callback(err,newResult)
                    })
                }
            ],(err,results)=>{
                const result1= results[0];
                const result2 = results[1];
                //console.log(results)
                // console.log('m ',result1);
                //console.log(' yo yo ')
                //console.log('p ',result1.request[0].userId)
                res.render('user/interest',{title:'Footballkik - Interest',user:req.user, data:result1, chat:result2 });
            })
        },
    }
}