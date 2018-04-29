var expressSanitizer= require("express-sanitizer"),
    methodOverride  = require("method-override"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    express         = require("express"),
    app             = express();
    
// APP config
mongoose.connect("mongodb://localhost/blog_app");
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.set("view engine","ejs");

app.use(function(req, res, next){
    res.locals.isLoggedIn = isLoggedIn;
    next();
});

// Mongoose config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

var isLoggedIn = false;

// blog.create({
//     title: "Sunrise",
//     image: "https://source.unsplash.com/Aj6mvFNBXAA",
//     body: "A beatiful sunrise spot between the cliffs with a beatiful couple."
// });

//ROOT ROUTE
app.get("/", (req, res)=>{
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", (req, res)=>{
    Blog.find({}, (err, blogs)=>{
        if(err){
            console.log(err);
        }
        else {
            res.render("index", {blogs: blogs});
        }
    });
});

// NEW ROUTE
app.get("/blogs/new", (req, res)=>{
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", (req, res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, blog)=>{
        if(err)
            res.render("new");
        else
            res.redirect("/blogs");
    });
});

// SHOW ROUTE
app.get("/blogs/:id", (req, res)=>{
    Blog.findById(req.params.id, (err, blog)=>{
        if(err)
            res.redirect("/blogs");
        else{
            res.render("show", {blog: blog});
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", LoggedIn, (req, res)=>{
    Blog.findById(req.params.id, (err, blog)=>{
        if(err)
            res.redirect("/show/"+req.params.id);
        else{
            res.render("edit", {blog: blog});
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", LoggedIn, (req, res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, blog)=>{
        if(err)
            res.redirect("/blogs/"+req.params.id+"/edit");
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });;
});

// DELETE ROUTE
app.delete("/blogs/:id", LoggedIn, (req, res)=>{
    Blog.findByIdAndRemove(req.params.id, (err)=>{
        if(err)
            res.redirect("/blogs/"+req.params.id);
        else
            res.redirect("/blogs");
    })
});

// ADMIN ROUTE
app.get("/admin", (req, res)=>{
    res.render("login");
});

app.post("/login", (req, res)=>{
    // console.log("==============================");
    // console.log(req.body);
    if(req.body.email === "nitish" && req.body.pass === "password"){
        isLoggedIn = true;
        res.redirect("/blogs");
    }
    else
        res.redirect("back");
});

app.post("/logout", (req, res)=>{
    isLoggedIn = false;
    res.redirect("/blogs");
});


//For non-existing ROUTES
app.get("*", (req, res)=>res.send("Page Not Found."));
app.post("*", (req, res)=>res.send("Page Not Found"));

function LoggedIn(req, res, next){
    if(isLoggedIn)
        return next();
    return res.redirect("back");
}

// Listen to a PORT
app.listen(process.env.PORT, process.env.IP, ()=>{
    console.log("Server Started!");
});