const   express         = require("express"),
        mongoose        = require("mongoose"),
        app             = express(),
        bodyParser      = require("body-parser"),
        AWS             = require('aws-sdk'),
        passport        = require("passport"),
        LocalStrategy   = require("passport-local"),
        User            = require("./models/user");
        
        
AWS.config.update({region: 'us-east-1'});
app.use(express.static(__dirname + "/public"))
// check the credential
AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
  }
});
var DynamoDB = new AWS.DynamoDB();
var DocumentClient = new AWS.DynamoDB.DocumentClient();


const uri = "mongodb+srv://Camps:Camps.Password@cluster0.hxvjy.mongodb.net/test?retryWrites=true&w=majority";

const connectDB = async () =>{
    await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('connected')
};

connectDB();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(require("express-session")({
    secret: "Vanessa is the best wife in the world",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

/*===============================================
                        ROUTE
=================================================
*/

    app.get("/", function(req, res){
        res.render("index"); 
    });
    
    app.get("/campgrounds", function(req, res){
        DocumentClient.scan({TableName: "Camps"}, function(err, data){
            if(err)
                console.log(err, err.stack);
            else
            {
                res.render("campground", {campgrounds : data.Items, currentUser: req.user});
            }});
    });
    
    app.get("/campgrounds/new", function(req, res){
        res.render("new.ejs");
    });
// work on the post later

    app.post("/campgrounds", function(req, res){
        var new_camp_name = req.body.new_camp_name;
        var image_url = req.body.image_url;
        var new_description = req.body.new_description;
        var new_camp = 
        {
            TableName: "Camps",
            Item:
            {
                "name": new_camp_name, 
                "image": image_url, 
                "description":  new_description,
                "comment_count": '0',
                "comments_ids": [0, 1]
            }
        }
        DocumentClient.put(new_camp, function(err, data){
            if(err) console.log(err. err.stack);
            else console.log(data);
        });
        res.redirect("/campgrounds");
    });

    app.get("/campgrounds/:id/comment/new", is_logged_in, function(req, res){
        var k = req.params.id;
        k = k.slice(1, -1);
        var params = 
        {
            TableName : 'Camps',
            Key: {"name": k}
        };
        
        DocumentClient.get(params, function(err, data)
            {
                if(err) 
                {
                    console.log(err, err.stack);
                } 
                else
                {
                    res.render("new_comment", {comment_detail : data.Item});
                }
            });
    });
    
    app.get("/campgrounds/:id", function(req, res){
        DocumentClient.get(
            {
                TableName: "Camps",
                Key: {name: req.params.id}
            }, function(err, data)
            {
                if(err) 
                {
                    console.log(err, err.stack);
                }
                else
                {
                    var comment_list_id = data.Item.comments_ids;
                    var camp_detail = data.Item;
                    var comment_list = [];
                    var the_comments =
                    {
                        TableName: "comments",
                        ScanFilter:
                        {
                            "id": 
                            {
                                ComparisonOperator: "IN",
                                AttributeValueList: comment_list_id  
                            }
                        }
                    }
                    DocumentClient.scan(the_comments, function(err, data){
                        if(err) console.log(err, err.stack);
                        else
                        {
                            comment_list = data.Items
                            comment_list.sort(function(a, b){
                                return b.id - a.id;
                            })
                            console.log(comment_list);
                            res.render("show", {camp_detail: camp_detail, comment_list: comment_list});
                        }
                    });
                
                    //
                }
            });
    });
    

    
    app.post("/campgrounds/:id/comment", function(req, res){
        var params = 
        {
            TableName : 'commentcnt',
            Key: {"cur_cnt": 0},
        };
        var par =
        {
            TableName : 'commentcnt',
            Key: {"cur_cnt": 0},
            AttributeUpdates: 
            {
                cnt: {Action: 'ADD', Value: 1}
            }
        };
        var total_cnt = 0;
        
        DocumentClient.get(params, function(err, data){
                if(err) console.log(err, err.stack)
                else
                {
                    total_cnt = data.Item.cnt;
                    DocumentClient.update(par, function(err, data){if(err) console.log(err, err.stack);});
                    var author = req.body.Author;
                    var comment = req.body.Comment;
                    console.log(author, comment, total_cnt);
                    var new_comment_db = 
                    {
                        TableName: "comments",
                        Item:
                        {
                            "id": total_cnt,
                            "author": author,
                            "comment": comment
                        }
                    }
                    DocumentClient.put(new_comment_db, function(err, data){
                        if(err) console.log(err, err.stack);
                        else
                        {
                            console.log(data);
                        }
                    });
                    
                    var update_list = 
                    {
                        TableName: "Camps",
                        Key: {"name": req.params.id},
                        AttributeUpdates:
                        {
                            "comments_ids": {Action: "ADD", Value: [total_cnt]} 
                        }
                    }
                    DocumentClient.update(update_list, function(err, data){
                        if(err) console.log(err, err.stack);
                        else
                        {
                            console.log(data);
                        }
                    });
                   
                }
        });
        var endding = 0;
        res.redirect("/campgrounds/" + req.params.id);
    });
/// =================================
/// AUTH ROUTE
/// ===================================

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    console.log("posting...");
    console.log(req.body.username);
    console.log(req.body.password);
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err) 
        {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            console.log("No error");
            res.redirect("/campgrounds");
        });
    });
});

/// Login
app.get('/login', function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect('/');   
});

function is_logged_in(req, res, next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/login');
};

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server start"); 
}); 