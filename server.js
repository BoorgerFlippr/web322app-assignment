/*********************************************************************************
*  WEB322 – Assignment 02
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
var express = require("express")
var app = express();
var blogService = require("./blog-service.js")

var HTTP_PORT = process.env.PORT || 8080

function onHttpStart()
{
    console.log("Express http server listening on " + HTTP_PORT)
}

app.get('/', function(req, res)
{
    res.redirect('/about')
})

app.get('/about', function (req, res)
{
    res.sendFile('./views/about.html', {root:__dirname})
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
    //res.send("<p>/posts not available.<p>")
    blogService.getAllPosts().then((data) =>
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