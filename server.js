/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Glenn Parreno Student ID: 115814196 Date: 22-04-2022
*
*  Online (Heroku) URL: https://stormy-lake-62025.herokuapp.com/blog
*
*  GitHub Repository URL: https://github.com/BoorgerFlippr/web322app-assignment
*
********************************************************************************/
//express from a2
const express = require("express")
//multer + others from a3
const multer = require("multer")
const cloudinary = require(`cloudinary`).v2
const streamifier = require(`streamifier`)
//express handlebars from a4
const exphbs = require('express-handlebars')
const stripJs = require('strip-js')
var app = express();

app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    helpers:{
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
        safeHTML: function(context){
            return stripJs(context);
        }
        
        
        
    }}))

app.set('view engine', '.hbs')

const blogData = require("./blog-service.js")

var HTTP_PORT = process.env.PORT || 8080

cloudinary.config
({
    cloud_name:`dvk0g9rbl`,
    api_key:`662154322959576`,
    api_secret:`fW4U_Vb8mwjyuvoB9Pg-gZyN6tk`,
    secure:true
})

const upload = multer()

function onHttpStart()
{
    console.log("Express http server listening on " + HTTP_PORT)
}

//routes

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = (route == "/") ? "/" : "/" + route.replace(/\/(.*)/, "");
    app.locals.viewingCategory = req.query.category;
    next();
});


app.get('/', function(req, res)
{
    res.redirect('/blog')
})

app.get('/about', function (req, res)
{
    res.render('about',
    {
        data:null,
        layout: "main"
    })
})

app.get('/posts/add', function (req, res)
{
    res.render('addPost',
    {
        data:null,
        layout: "main"
    })
})

app.get('/blog', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blogData.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blogData.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // get the latest post from the front of the list (element 0)
        let post = posts[0]; 

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;
        viewData.post = post;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blogData.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})

});

app.get('/blog/:id', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blogData.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blogData.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the post by "id"
        viewData.post = await blogData.getPostById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blogData.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})
});

app.get("/posts", function (req, res)
{
    if(req.query.category)
    {
        blogData.getPostsByCategory(req.query.category).then((data) =>
        {
            res.render("posts",{posts:data})
        }).catch((err) =>
        {
            res.json({message: err})
        })
    }
    else if(req.query.minDate)
    {
        blogData.getPostsByMinDate(req.query.minDate).then((data) =>
        {
            res.render("posts",{posts:data})
        }).catch((err) =>
        {
            res.json({message: err})
        })
    }
    else
    {
        blogData.getAllPosts().then((data) =>
        {
            res.render("posts",{posts:data})
        }).catch((err) =>
        {
            res.render("posts",{message: "no results"})
        })
    }
})

app.get("/post/:value", function (req, res)
{
    blogData.getPostsById(req.params.value).then((data) =>
    {
        res.json({data})
    }).catch((err) =>
    {
        res.json({message: err})
    })
})

app.get("/categories", function (req, res)
{
    //res.send("<p>/categories not available.<p>")
    blogData.getCategories().then((data) =>
    {
        res.render("categories", {categories: data});
    }).catch((err) =>
    {
        res.render("categories", {message: "no results"});
    })
})

app.post("/posts/add", upload.single("featureImage"), function (req,res) 
{
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
                }
            );
    
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };
    
    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
    }
    
    upload(req).then((uploaded)=>{
        req.body.featureImage = uploaded.url;
    
        // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
        blogData.addPost(req.body).then(() =>
        {
          res.redirect("/posts")  
        })
    
    });
})

app.get("/*", function (req, res)
{
    res.status(404).send("Not found")
})

//app.listen(HTTP_PORT, onHttpStart)


blogData.initialize().then(() =>
{
    app.listen(HTTP_PORT, onHttpStart())
}).catch (() =>
{
    console.log('promise unfulfiled')
})