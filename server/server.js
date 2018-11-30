//server.js

//BASE SETUP
// =============================================================================

var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

//connect database
var mongoose = require('mongoose');
mongoose.connect('mongodb://jye64:se3316@ds237379.mlab.com:37379/lab5',{useNewUrlParser:true});
mongoose.set('useCreateIndex',true);

//database models
var User = require('./models/userModel');
var TempUser = require('./models/tempUserModel');
var Item = require('./models/item');
var Policy = require('./models/policy');
var Cart = require('./models/cart');
var UserItem = require('./models/userItem');


//email verification
var nev = require('./backend_modules/email-verification')(mongoose);

//for hashing
var bcrypt = require('bcrypt');

//string validators and sanitizers
var validator = require('validator');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

var port = 8081;

var router = express.Router();

router.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Controll-ALlow-Methods','POST,PATCH,GET,PUT,DELETE,OPTIONS');

    console.log('Something is happening.');
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'welcome to our api' });
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
    verificationURL: 'http://localhost:8081/api/email-verification/${URL}',
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



// Sign Up
// =============================================================================
router.post('/signUp', function(req, res) {
    console.log('user attempts to sign up');
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
                        return res.status(404).send(err);
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
                console.log('resent verification email');
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
    console.log('user accesses the link that is sent');

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




// on routes that end in /publicitems
// ----------------------------------------------------
router.route('/publicitems')
    .post(function(req,res){
        var item = new Item();
        item.name = req.body.name;
        item.price = req.body.price;
        item.description = req.body.description;
        item.comment = req.body.comment;
        item.rating = req.body.rating;

        item.quantity = req.body.quantity;
        item.tax = req.body.tax;
        item.rater = req.body.rater;
        item.priv = req.body.priv;

        item.save(function(err){
            if(err){
                res.send(err);
            }
            res.json({message: 'item created'});
        })
    })

    .get(function(req,res){
        Item.find({priv:false},function(err,items){
            if(err){
                res.send(err);
            }
            res.json(items);
        });

    });

// on routes that end in /userItems
// ----------------------------------------------------
router.route('/useritems')
    .post(function(req,res){
        var userItem = new UserItem();
        userItem.name = req.body.name;
        userItem.price = req.body.price;
        userItem.description = req.body.description;
        userItem.comment = req.body.comment;
        userItem.rating = req.body.rating;

        userItem.quantity = req.body.quantity;
        userItem.tax = req.body.tax;
        userItem.rater = req.body.rater;
        userItem.priv = req.body.priv;

        userItem.save(function(err){
            if(err){
                res.send(err);
            }
            res.json({message: 'item created'});
        })
    })

    .put(function(req,res){
        UserItem.update({ name:req.body.name },
            { $set: {
                    name:req.body.name,
                    quantity:req.body.quantity}},
            function (err, newCart) {
                if (err) return handleError(err);
                res.json({message:"Saved"});
            });

    })

    .get(function(req,res){
        UserItem.find(function(err,userItem){
            if(err){
                res.send(err);
            }
            res.json(userItem);
        });
    });


// on routes that end in /addCart
// ----------------------------------------------------
router.route('/addCart')
    .post(function(req,res){
        var cart = new Cart();
        cart.name = req.body.name;
        cart.quantity = req.body.quantity;

        cart.save(function(err){
            if(err){
                res.send(err);
            }
            res.json({message:'added to cart'});
        })
    })

    .put(function(req,res){
        Cart.update({ name:req.body.name },
            { $set: {
                    name:req.body.name,
                    quantity:req.body.quantity}},
            function (err, newCart) {
                if (err) return handleError(err);
                res.json({message:"Saved"});
            });

    })

    .get(function(req,res){
        Cart.find(function(err,cart){
            if(err){
                res.send(err);
            }
            res.json(cart);
        });
    })


    .delete(function(req,res){
        Cart.deleteMany({
            name:req.body.name
        },function(err,cart){
            if(err){
                res.send(err);
            }
            res.json({message:'Successfully deleted'});
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

            item.name = req.body.name;
            item.price = req.body.price;
            item.quality = req.body.quantity;
            item.tax = req.body.tax;
            item.description = req.body.description;

            item.save(function(err){
                if(err){
                    res.send(err);
                }
                res.json({message: 'Item updated'});
            });
        });

    })

    .delete(function(req,res){
        Item.deleteOne({
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
        Policy.findOne({name:"privacy"},function(err,returnedPolicy){
            if(returnedPolicy==null){
                var policy = new Policy();
                policy.name="privacy";
                policy.content = 'privacy policy as follows:';
                policy.save(function(err){
                    if(err){
                        res.send(err);
                    }
                    res.json({content:policy.content});
                })
            }
            else{
                res.json(returnedPolicy);
            }
        });
    })


    .put(function(req, res) {
        Policy.update({name: "privacy"}, {$set: {content: req.body.content}}, function (err) {
            if (err){
                res.send(err);
            }
            res.json({message: "privacy policy updated"});
        });
    })



// on routes that end in /dmca
// ----------------------------------------------------
router.route('/dmca')
    .get(function(req,res){
        Policy.findOne({name:"DMCA"},function(err,returnedPolicy){
            if(returnedPolicy==null){
                var policy = new Policy();
                policy.name="DMCA";
                policy.content = "DMCA policy as follows";
                policy.save(function(err){
                    if(err) throw err;
                    res.json({content:policy.content});
                });
            }else{
                res.json(returnedPolicy);
            }
        });
    })

    //Issue: cannot update content
    .put(function(req, res) {
        Policy.update({name: "DMCA" }, { $set: { content: req.body.content }}, function (err) {
            if(err){
                res.send(err);
            }
            res.json({message:"DMCA policy updated"});
        });
    })



app.use('/api',router);

app.listen(port);
console.log('Magic happens on port '+port);
