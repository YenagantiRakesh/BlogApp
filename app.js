var express         =require("express"),
methodOverride      =require("method-override"),
app                 =express(),
bodyParser          =require("body-parser"),
mongoose            =require("mongoose");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost/blog_app", { useNewUrlParser: true ,useUnifiedTopology: true });

var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}

});

var Blog=mongoose.model("Blog",blogSchema);

// Blog.create({
// title:"text Blog",
// image:"https://pixabay.com/get/57e8d1454b56ae14f1dc84609620367d1c3ed9e04e5074417c2e78d19145c7_340.jpg",
// body:"First Blog of Mine",    
// },function(err,blog){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(blog);
//     }
// });

app.get("/",function(req,res){
res.redirect("/blogs");
});

//Index
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs});
        }
    });
});

//New
app.get("/blogs/new",function(req,res){
res.render("new");
});

//Create

app.post("/blogs",function(req,res){
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    })
});

// Show

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundBlog});
        }
    });
});
// Edit
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundBlog});
        }
    });
});

//update
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//Delete

app.delete("/blogs/:id",function(req,res){
Blog.findByIdAndRemove(req.params.id,function(err){
     if(err){
         res.redirect("/blogs");
     }else{
         res.redirect("/blogs");
     }
});
});



app.listen(3000,function(){
    console.log("server is Running");
})