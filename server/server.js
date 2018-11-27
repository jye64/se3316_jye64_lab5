//server.js

//BASE SETUP
// =============================================================================

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//connect database
var mongoose = require('mongoose');
mongoose.connect('mongodb://jye64:se3316@ds237379.mlab.com:37379/lab5',{useNewUrlParser:true});
mongoose.set('useCreateIndex',true);

//database models
var User = require('./models/userModel');
var TempUser = require('./models/tempUserModel');
var Item = require('./models/item');
var Policy = require('./models/policy');

//email verification
var nev = require('email-verification')(mongoose);

//for hashing
var bcrypt = require('bcrypt');

//string validators and sanitizers
var validator = require('validator');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

var router = express.Router();

router.use(function(req,res,next){

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, access-control-allow-credentials, access-control-allow-origin");

    console.log('Something is happening.');
    next();
});


//Hashing Functions
// =============================================================================

// sync version of hashing function
var myHasher = function(password, tempUserData, insertTempUser, callback) {
    var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    return insertTempUser(hash, tempUserData, callback);
};

// async version of hashing function
myHasher = function(password, tempUserData, insertTempUser, callback) {
    bcrypt.genSalt(8, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            return insertTempUser(hash, tempUserData, callback);
        });
    });
};


// NEV configuration =====================
nev.configure({
    verificationURL: 'http://localhost:8080/api/email-verification/${URL}',
    persistentUserModel: User,
    tempUserCollection: 'tempUser',
    expirationTime:600,

    transportOptions: {
        service: 'Gmail',
        auth: {
            user: 'webtech3316@gmail.com',
            pass: 'webtech2018'
        }
    },
    verifyMailOptions: {
        from: 'Do Not Reply <webtech3316_do_not_reply@gmail.com>',
        subject: 'Please confirm account',
        html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
        text: 'Please confirm your account by clicking the following link: ${URL}'
    },
    hashingFunction: myHasher,
    passwordFieldName:'password'
}, function(err, options){
    if(err){
        console.log(err);
        return;
    }
    console.log('configured: ' + (typeof options === 'object'));
});


nev.configure({
    tempUserModel:TempUser
},function(error,options){

});


nev.generateTempUserModel(User,function(err,tempUserModel){
    if(err){
        console.log(err);
        return;
    }
    console.log('generated temp user model: ' + (typeof tempUserModel === 'function'));
});



router.post('/signUp', function(req, res) {
    console.log('post data received');
    var email = validator.escape(req.body.email);
    var password = validator.escape(req.body.password);

    // register button was clicked
    if (req.body.type === 'register') {

        var newUser = new User({
            email: email,
            password: password,
        });


        nev.createTempUser(newUser, function(err, existingPersistentUser, newTempUser) {
            if (err) {
                return res.status(404).send('ERROR: creating temp user FAILED');
            }

            // user already exists in persistent collection
            if (existingPersistentUser) {
                console.log('user already exists');
                return res.json({
                    msg: 'You have already signed up and confirmed your account.'
                });
            }

            // new user created
            if (newTempUser) {
                console.log('new user created');

                var URL = newTempUser[nev.options.URLFieldName];

                nev.sendVerificationEmail(email, URL, function(err, info) {
                    if (err) {
                        return res.status(404).send('ERROR: sending verification email FAILED');
                    }
                    console.log('sending verification email');
                    res.json({
                        msg: 'An email has been sent to you. Please check it to verify your account.',
                        info: info
                    });
                });

                // user already exists in temporary collection!
            } else {
                res.json({
                    msg: 'You have already signed up. Please check your email to verify your account.'
                });
            }
        });

        // resend verification button was clicked
    } else {
        nev.resendVerificationEmail(email, function(err, userFound) {
            if (err) {
                return res.status(404).send('ERROR: resending verification email FAILED');
            }
            if (userFound) {
                res.json({
                    msg: 'An email has been sent to you, yet again. Please check it to verify your account.'
                });
            } else {
                res.json({
                    msg: 'Your verification code has expired. Please sign up again.'
                });
            }
        });
    }
});


// user accesses the link that is sent
router.get('/email-verification/:URL', function(req, res) {
    var url = req.params.URL;

    nev.confirmTempUser(url, function(err, user) {
        if (user) {
            nev.sendConfirmationEmail(user.email, function(err, info) {
                if (err) {
                    return res.status(404).send('ERROR: sending confirmation email FAILED');
                }
                else {
                    console.log('confirmed');
                    res.send(
                        'Your account has been confirmed! Go browse some images that are OUT OF THIS WORLD'
                    );
                }
            });
        } else {
            return res.status(404).send('ERROR: confirming temp user FAILED');
        }
    });
});


//check login credentials
router.get('/login?:query', function (req, res){
    if(req.header('authentication') === 'false') {
        User.find({"email": validator.escape(req.query.email)}, function (err, userList) {
            if (err)
                res.send(err);

            //check password
            bcrypt.compare(validator.escape(req.query.password), userList[0].password, function(err, result){
                if(result === true)
                    res.send(userList);
                else
                    res.send({message: 'Incorrect Username or Password'});
            });
        })
    }else{
        res.send({message: 'You are already signed in!'});
    }
});


// on routes that end in /items
// ----------------------------------------------------

router.route('/items')
    .post(function(req,res){
        var item = new Item();
        item.name = req.body.name;
        item.quantity = Number(req.body.quantity);
        item.description = req.body.description;
        item.tax = req.body.tax;

        item.save(function(err){
            if(err){
                res.send(err);
            }
            res.json({message: 'item created'});
        })

    })

    .get(function(req,res){
        Item.find(function(err,items){
            if(err){
                res.send(err);
            }
            res.json(items);
        });

    });

// on routes that end in /items/:item_id
// ----------------------------------------------------

router.route('./items/:item_id')
    .get(function(req,res){
        Item.findById(req.params.item_id, function(err,item){
            if(err){
                res.send(err);
            }
            res.json(item);
        });
    })

    .put(function(req,res){
        Item.findById(req.params.item_id,function(err,item){
            if(err){
                res.send(err);
            }

            item.name = req.body.mame;
            item.price = req.body.price;
            item.tax = req.body.tax;

            item.save(function(err){
                if(err){
                    res.send(err);
                }
                res.json({message: 'Item updated'});
            });
        });

    })

    .delete(function(req,res){
        Item.remove({
            _id:req.params.item_id
        },function(err,item){
            if(err){
                res.send(err);
            }
            res.json({message:'Successfully deleted'});
        });

    });



// on routes that end in /privacy
// ----------------------------------------------------
router.route('/privacy')
    .get(function(req,res){
        Policy.findOne({name:'privacy'},function(err,returnedPolicy){
            if(returnedPolicy == null){
                var policy = new Policy();
                policy.name = 'privacy';
                policy.content = "Privacy Policy";
                policy.save(function(err){
                    if(err){
                        res.send(err);
                    }
                    res.json({content:policy.content});
                });
            }else{
                res.json(returnedPolicy);
            }
        });

    })

// on routes that end in /dmca
// ----------------------------------------------------
router.route('/dmca')
    .get(function(req,res){
        Policy.findOne({name:'DMCA'},function(err,returned){
            if(returned == null){
                var policy = new Policy();
                policy.name = 'DMCA';
                policy.content = "DMCA Policy";
                policy.save(function(err){
                    if(err){
                        res.send(err);
                    }
                    res.json({content:policy.content});
                });
            }else{
                res.json(returned);
            }
        })

    })











app.use('/api',router);

app.listen(port);
console.log('Magic happens on port '+port);
