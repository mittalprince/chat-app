const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const socketIO = require('socket.io');
const {Users} = require('./helpers/UserClass');
const {Global} = require('./helpers/Global');
const compression =require('compression');
const helmet = require('helmet');

var port = process.env.PORT || 8113;

const container = require('./container');


container.resolve(function(users, _, admin, home, group, results, privatechat, profile, interests, news){

    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://mittalprince:prince25@ds255319.mlab.com:55319/chatapp1');

    const app = SetupExpress();

    function SetupExpress(){
        const app =express();
        const server = http.createServer(app);
        const io = socketIO(server);
        server.listen(port,function(){
            console.log('Listening on port 3434');
        });
        ConfigureExpress(app);

        require('./socket/groupchat')(io, Users);
        require('./socket/friend')(io, Users);
        require('./socket/globalroom')(io, Global,_);
        require('./socket/privatemessage')(io);

        const router = require('express-promise-router')();
        users.SetRouting(router);
        admin.SetRouting(router);
        home.SetRouting(router);
        group.SetRouting(router);
        results.SetRouting(router);
        privatechat.SetRouting(router);
        profile.SetRouting(router);
        interests.SetRouting(router);
        news.SetRouting(router);
        app.use(router);

        app.use(function(req,res){
            res.render('404')
        });

    }

    function ConfigureExpress(app){

        app.use(compression());
        app.use(helmet());
        
        require('./passport/passport-local');
        require('./passport/passport-facebook');
        require('./passport/passport-google');

        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine','ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended:true}));

        app.use(validator());
        app.use(session({
            secret:process.env.SECRET_KEY || 'thisisasecretkey',
            resave:true,
            saveInitialized:true,
            store:new MongoStore({mongooseConnection:mongoose.connection})
        }))

        app.use(flash());

        app.use(passport.initialize());
        app.use(passport.session());

        app.locals._ = _;
    }
});