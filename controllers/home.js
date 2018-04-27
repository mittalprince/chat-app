module.exports = function(async, Club, _){
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
                    Club.aggregate({
                        $group:{
                            _id: "$country"
                        }
                    }, (err, newResults) =>{
                        callback(err, newResults);
                    });
                }

            ],(err,results)=>{
                const res1 = results[0];
                console.log(res1);
                const res2 = results[0];
                console.log(res2);
                const dataChunk = [];
                const chunkSize = 3;

                for(let i=0 ; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i,i+chunkSize));
                }
                console.log(dataChunk);

                res.render('home',{title:'Footballkik - Home', data:dataChunk});
            })

        }
    }
}