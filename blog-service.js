const fs = require('fs')
var posts = []
var categories = []

exports.initialize = () =>
{
    return new Promise ((resolve, reject) =>
    {
        fs.readFile('./data/categories.json','utf8',(err,data) =>
        {
            if (err)
            {
                reject('unable to read file')
            }
            else
            {
                categories = JSON.parse(data)
                console.log(data)
            }
        })

        fs.readFile('./data/posts.json','utf8',(err,data) =>
        {
            if (err)
            {
                reject('unable to read file')
            }
            else
            {
                posts = JSON.parse(data)
                console.log(data)
            }
        })

        resolve()
    })
}

exports.getAllPosts = () =>
{
    return new Promise ((resolve, reject) =>
    {
        if (posts.length == 0)
        {
            reject("no results returned")
        }
        else
        {
            resolve(posts)
        }
    })
}

exports.getPublishedPosts = () =>
{
    return new Promise ((resolve,reject) =>
    {
        var isPublished = posts.filter(posts => posts.published == true)
        if (isPublished.length == 0)
        {
            reject('no results returned')
        }
        else
        {
            resolve(isPublished)
        }
    })
}

exports.getCategories = () =>
{
    return new Promise ((resolve,reject) =>
    {
        if (categories.length == 0)
        {
            reject('no results returned')
        }
        else
        {
            resolve(categories)
        }
    })
}