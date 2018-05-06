module.exports = function(async, Club, _, Users){
    return {
        SetRouting: function(router){
            router.get('/home', this.homePage);

        },

        homePage: function(req, res){
            async.parallel([
                function(callback){
                    Club.find({},(err,result)=>{
                        callback(err,result);
                    })
                },

                function(callback){
                    Club.aggregate([{
                        $group:{
                            _id:"$country"
                        }
                    }], (err, newResults) =>{
                        callback(err, newResults);
                    });
                },

                function(callback){
                    Users.findOne({'username':req.user.username})
                        .populate('request.userId')
                        .exec((err,result)=>{
                            callback(err,result)
                        })
                }

            ],(err,results)=>{
                const res1 = results[0];
                //console.log(res1);
                const res2 = results[1];
                const res3 = results[2];
                //console.log(res2);
                const dataChunk = [];
                const chunkSize = 3;

                for(let i=0 ; i < results[0].length; i += chunkSize){
                    dataChunk.push(results[0].slice(i,i+chunkSize));
                }
                //console.log(dataChunk);
                //console.log("\n ",results)
                const countrySort = _.sortBy(res2, '_id')
                res.render('home',{title:'Footballkik - Home', user:req.user, chunks:dataChunk, country:countrySort, data:res3});
            })

        }
    }
}