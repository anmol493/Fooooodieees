//Required stuff
const express=require('express');
const mongoose=require('mongoose');
const passport=require('passport');
const passportLocalMongoose=require('passport-local-mongoose');
const ejs=require('ejs');
const path=require('path');
const bodyParser=require('body-parser');
const session = require('express-session')
const port=process.env.PORT||3000;
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config()

const Directory=path.join(__dirname,'../public');
const app=express();
app.use(express.static(Directory));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize());
  app.use(passport.session());
//Setting Database
//console.log(process.env.url)
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.url;
const client = mongoose.connect(uri, { useNewUrlParser: true });

const eatableSchema=new mongoose.Schema({
    image:String,
    Name:String,
    Price:Number,
    Category:String
})

const userSchema=new mongoose.Schema({
    username : String,
    password : String,
    cart : [eatableSchema]
})
//Setting model
userSchema.plugin(passportLocalMongoose);
let User=new mongoose.model('User', userSchema);
passport.use(User.createStrategy());
const burger= new mongoose.model('burger',eatableSchema);
const funky=new burger({
    image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=902&q=80",
    Name:"Funky burger",
    Price:40,
    Category:"burger"
})
const chicken=new burger({
    image:"https://images.unsplash.com/photo-1530554764233-e79e16c91d08?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
    Name:"Best Chicken Burger",
    Price:60,
    Category:"burger"
})
const chick=new burger({
    image:"https://images.unsplash.com/photo-1547584370-2cc98b8b8dc8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    Name:"Masala Burger",
    Price:80,
    Category:"burger"
})
// Use only single time
// funky.save();
// chicken.save();
// chick.save();
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
   
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

//Register Login
app.post('/register',function(req,res){
    let username=req.body.username;
    let password=req.body.password;
    console.log(username);
    User.register({username:username}, password, function(err, user) {
        if (err) {
            console.log(err); 
            res.render('register');
         }
         else{
         console.log('hi');
         passport.authenticate("local")(req,res,function(){
            res.redirect("/");
         
        });
    }
      });
});

//Logout
app.get('/logout', function(req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function(err) {
        if(err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  });
app.post("/login",function(req,res)
{
    let username=req.body.username;
    let password=req.body.password;
    let user=new User({
        username: username,
        password: password
    });
    console.log(user);
    req.login(user,function(err)
    {
        if(!err)
        {
            passport.authenticate("local")(req,res,function(){
                res.redirect("/");
            });
        }
        else {
            console.log(err);
            res.redirect("/");
        }
    })
})

app.get('/food/:category',(request,response)=>{
    if(request.isAuthenticated())
    {
        if(request.params.category=='all')
        {
            burger.find((err,result)=>{
                response.render('eatable',{result:result,user:request.user});
            })
        }
        else burger.find({Category:`${request.params.category}`},(err,result)=>{
            response.render('eatable',{result:result,user:request.user});
        })
    }
    else{
        response.redirect("/");
    }
})
app.get("/reglog",(req,res)=>{
    res.render('regorlog');
})
app.get("/register",(req,res)=>{
    res.render('register');
})
app.get("/login",(req,res)=>{
    res.render('login');
})
app.get('/',(request,response)=>{
    // console.log(request.user)
    if(request.isAuthenticated()){
    response.redirect("/eatable");
    }
    else{
    console.log('fail')
    response.redirect("reglog");
    }
});
// app.get("/addmore",(request,response)=>{
//     if(request.isAuthenticated()){
//     response.render('addmore',{user:request.user});
//     }
//     else response.render('regorlog');
// })
app.get("/test",(req,res)=>{
    res.render('test');
})
// app.post("/addmore",(request,response)=>{
    
//     const img=request.body.image;
//     const name=request.body.name;
//     const price=Number(request.body.price);
//     const newo=new burger({
//         image:img,
//         Name:name,
//         Price:price,
//         Category : request.body.Category
//     })
//     newo.save();
//     response.redirect('/eatable');

    
// })
app.post('/remove',(request,response)=>{
    let num=(request.body.remove);
    console.log(num);
    User.findOne({_id:request.user._id},(err,doc)=>{
        doc.cart.splice(num,1);
       // console.log(doc.cart);
        doc.save();
        response.render('mycart',{user:doc})
    })
    
});
app.get('/object/:id',(request,response)=>{
    if(request.isAuthenticated()){
    console.log(request.params.id)
    burger.findById(request.params.id,(err,result)=>{
        response.render('specific',{object:result,user:request.user});
    })
    }
    else {
        response.render('regorlog')
    }
});
app.post("/cart",(request,response)=>{
    console.log(request.body.button);
    if(request.isAuthenticated()){
    burger.findById(request.body.button,(err,result)=>{
        console.log(result);
        console.log(request.user)
        response.render('cart',{product:result,user:request.user});
    })
}
})
app.get("/eatable",function(req,res){
    if(req.isAuthenticated()){
    const arr=burger.find(function(err,result){
        res.render('eatable',{result:result,user:req.user});
    })
    }
    else res.render('regorlog');
    
})

app.get("/mycart",(request,response)=>{
    if(request.isAuthenticated())
    {
        response.render('mycart',{user:request.user})
    }
})

app.post("/buynow",(request,response)=>{
    if(request.isAuthenticated){
    User.findOne({_id:request.user._id},(err,doc)=>{
        doc.cart=[];
        doc.save();
    })
    response.render('buynow',{user:request.user})

    }
})
app.post("/addcart",(request,response)=>{
    User.findOne({_id:request.user._id},(err,doc)=>{
        burger.findById(request.body.button,(err,result)=>{
            console.log("hiiiiiiiiiiiiiiiiiiii!!!!!!!!!!!!!!!!");
            console.log(result);
            for(let i=0;i<request.body.number;i++)
            {
                doc.cart.push(result);
            }
            doc.save();
        })
        
    });
    response.redirect("/mycart");
})

app.listen(port,()=>{
    console.log('Server Started!!');
})