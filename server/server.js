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
var Log = require('./models/log');
var Collection = require('./models/collection');

// admin login code
var adminCode = 'webtech3316';

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
    console.log('login credential checking');
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
// items shown on the landing page
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
            res.json({message: 'public item created'});
        })
    })

    .delete(function(req,res){
        Item.deleteMany({
            name:req.body.name
        },function(err,item){
            if(err){
                res.send(err);
            }
            res.json({message:'public item Successfully deleted'});
        });
    })

    .get(function(req,res){
        Item.find(function(err,items){
            if(err){
                res.send(err);
            }
            items.sort(function(b,a){
                return a.rating-b.rating;
            });
            var itemToSend = [];
            for(var i = 0;i<items.length; i++){
                itemToSend.push(items[i]);
            }
            res.send(itemToSend);
        });
    });


// return a specific item based on name
router.route('/publicitems/name')
    .get(function(req,res){
        Item.find({name:req.body.name},function(err,item){
            if(err){
                res.send(err);
            }
            res.send(item);
        })
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
            res.json({message: 'user item created'});
        })
    })

    .get(function(req,res){
        UserItem.find(function(err,userItem){
            if(err){
                res.send(err);
            }
            userItem.sort(function(b,a){
                return a.rating-b.rating;
            });
            var userItemToSend = [];
            for(var i=0;i<userItem.length;i++){
                userItemToSend.push(userItem[i]);
            }
            res.send(userItemToSend);
        });
    })

    .delete(function(req,res){
        UserItem.deleteMany({
            name:req.body.name
        },function(err,cart){
            if(err){
                res.send(err);
            }
            res.json({message:'user item Successfully deleted'});
        });
    });


// update a specific item's comments based on name
router.route('/useritems/comment')
    .put(function(req,res){
        UserItem.findOne({name:req.body.name},function(err,userItem){
            if(err){
                res.send(err);
            }
            userItem.comment.push(req.body.comment);
            userItem.save(function(err,item){
                if(err){
                    throw err;
                }
                res.json({message:'user item updated'});
            })
        })
    });

// update a specific item's ratings based on name
router.route('/useritems/rating')
    .put(function(req,res){
        UserItem.findOne({name:req.body.name},function(err,userItem){
            if(err){
                res.send(err);
            }
            userItem.rating.push(req.body.rating);
            userItem.save(function(err,item){
                if(err){
                    throw err;
                }
                res.json({message:'user item updated'});
            })
        })
    });


router.route('/useritems/stock')
    .put(function(req,res){
        UserItem.updateOne({ name:req.body.name },
            { $inc: {
                    quantity:req.body.quantity}},
            function (err, newItem) {
                if (err) return handleError(err);
                res.json({message:"stock level updated"});
            });

        });


// on routes that end in /addCart
// ----------------------------------------------------
router.route('/addCart')
    .post(function(req,res){
        var cart = new Cart();
        cart.name = req.body.name;
        cart.quantity = req.body.quantity;
        cart.rm = true;

        cart.save(function(err){
            if(err){
                res.send(err);
            }
            res.json({message:'added to cart'});
        })
    })

    .put(function(req,res){
        Cart.updateOne({ name:req.body.name },
            { $set: {
                    name:req.body.name,
                    quantity:req.body.quantity}},
            function (err, newCart) {
                if (err) return handleError(err);
                res.json({message:"cart saved"});
            });

    })

    .get(function(req,res){
        Cart.find(function(err,cart){
            if(err){
                res.send(err);
            }
            res.send(cart);
        });
    })


    .delete(function(req,res){
        Cart.deleteMany({
            name:req.body.name
        },function(err,cart){
            if(err){
                res.send(err);
            }
            res.json({message:'Cart Successfully deleted'});
        });
    });

// clear shopping cart
router.route('/addCart/clear')
    .delete(function(req,res){
        Cart.deleteMany({
            rm:true
        },function(err,cart){
            if(err){
                res.send(err);
            }
            res.json({message:'Cart Successfully cleared'});
        });
    });


// on routes that end in /log
// ----------------------------------------------------
router.route('/log')
    .get(function(req,res){
        Log.find(function(err,logs){
            if(err){
                res.send(err);
            }
            res.json(logs);
        });
    })

    .delete(function(req,res){
        Log.deleteOne({
            type:req.body.type
        },function(err,log){
            if(err){
                res.send(err);
            }
            res.json({message:'log successfully deleted'});
        });
    })

    .post(function(req,res){
        var log = new Log();
        log.type = req.body.type;
        log.description = req.body.description;
        log.save(function(err){
            if(err){
                res.send(err);
            }
            res.json({message:'log saved'});
        });
    });


// on routes that end in /collections
// user create their own collection
// ----------------------------------------------------
router.route('/collections')
    .get(function(req,res){
        Collection.find(function(err,collection){
            if(err){
                res.send(err);
            }
            res.json(collection);
        });
    })

    .post(function(req,res){
        var collection = new Collection();
        collection.name = req.body.name;
        collection.privacy = req.body.privacy;
        collection.description = req.body.description;
        collection.rating = req.body.rating;
        collection.owner = req.body.owner;

        collection.save(function(err){
            if(err){
                res.send(err);
            }
            res.json({message:'collection created.'});
        })
    })

    .delete(function(req,res){
        Collection.deleteOne({
            name:req.body.name
        },function(err,col){
            if(err){
                res.send(err);
            }
            res.json({message:'collection successfully deleted'});
        });

    });

// user rename their own collection
router.route('/collections/rename')
    .put(function(req,res){
        Collection.updateOne({name:req.body.name}, {$set: {name: req.body.newName}}, function (err) {
            if (err){
                res.send(err);
            }
            res.json({message: "collection name updated"});
        });
    })


// on routes that end in /items/:item_id
// ----------------------------------------------------
router.route('/items/:item_id')
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
        Policy.findOne({name:'privacy'}, function(err,policy){
            if(err){
                res.send(err);
            }
            res.json(policy);
        });

    })

    .put(function(req, res) {
        Policy.updateOne({name: "privacy"}, {$set: {content: req.body.content}}, function (err) {
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
        Policy.findOne({name:'DMCA'}, function(err,policy){
            if(err){
                res.send(err);
            }
            res.json(policy);
        });
    })

    //Issue: cannot update content
    .put(function(req, res) {
        Policy.updateOne({name: "DMCA" }, { $set: { content: req.body.content }}, function (err) {
            if(err){
                res.send(err);
            }
            res.json({message:"DMCA policy updated"});
        });
    })



app.use('/api',router);

app.listen(port);
console.log('Magic happens on port '+port);
