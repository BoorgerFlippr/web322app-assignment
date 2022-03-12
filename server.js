/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Glenn Parreno Student ID: 115814196 Date: 22-04-2022
*
*  Online (Heroku) URL: https://stormy-lake-62025.herokuapp.com/about
*
*  GitHub Repository URL: https://github.com/BoorgerFlippr/web322-assignment2.git
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
        }
        
        
    }}))
    
app.set('view engine', '.hbs')

var blogService = require("./blog-service.js")

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
})


app.get('/', function(req, res)
{
    res.redirect('/about')
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

app.get("/blog", function (req, res)
{
    //res.send("<p>/blog not available.<p>")
    blogService.getPublishedPosts().then((data) =>
    {
        res.json({data})
    }).catch((err) =>
    {
        res.json({message: err})
    })
})

app.get("/posts", function (req, res)
{
    if(req.query.category)
    {
        blogService.getPostsByCategory(req.query.category).then((data) =>
        {
            res.json({data})
        }).catch((err) =>
        {
            res.json({message: err})
        })
    }
    else if(req.query.minDate)
    {
        blogService.getPostsByMinDate(req.query.minDate).then((data) =>
        {
            res.json({data})
        }).catch((err) =>
        {
            res.json({message: err})
        })
    }
    else
    {
        blogService.getAllPosts().then((data) =>
        {
            res.json({data})
        }).catch((err) =>
        {
            res.json({message: err})
        })
    }
})

app.get("/post/:value", function (req, res)
{
    blogService.getPostsById(req.params.value).then((data) =>
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
    blogService.getCategories().then((data) =>
    {
        res.json({data})
    }).catch((err) =>
    {
        res.json({message: err})
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
        blogService.addPost(req.body).then(() =>
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


blogService.initialize().then(() =>
{
    app.listen(HTTP_PORT, onHttpStart())
}).catch (() =>
{
    console.log('promise unfulfiled')
})