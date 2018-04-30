module.exports = function(Users,async){
    return {
        SetRouting: function(router) {
            router.get('/group/:name', this.groupPage);
            router.post('/group/:name',this.groupPostPage)
        },

        groupPage: function(req,res){
            const name = req.params.name;
            res.render('groupchat/group',{title:'Footballkik - Group',user:req.user ,groupName: name});
        },
        groupPostPage: function(req,res){
            async.parallel([
                function(callback){
                    if(req.body.receiverName){
                        Users.update({
                            'username':req.body.receiverName,
                            'request.userId':{$ne:req.user._id},
                            'freindsList.friendId':{$ne:req.user._id}
                        },{
                            $push:{request:{
                                userId:req.user._id,
                                username:req.user.username
                            }},
                            $inc:{totoalRequest: 1}
                        },(err,count)=>{
                            callback(err,count);
                        })
                    }
                },
                function(callback){
                    if(req.body.receiverName){
                        Users.update({
                            'username':req.user.username,
                            'sentRequest.username':{$ne:req.body.receiverName}
                        },{
                            $push: {sendRequest:{
                                username:req.body.receiverName
                            }}
                        },(err,count)=>{
                            callback(err,count);
                        })
                    }
                }
            ],(err, results)=>{
                res.redirect(`/group/${req.param.name}`)
            });
        }
    }
}