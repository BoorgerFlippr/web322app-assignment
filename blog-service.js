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

exports.getPublishedPostsByCategory = (category) =>
{
    return new Promise ((resolve,reject) =>
    {
        var isPublished = posts.filter(posts => posts.published == true && posts.category == category)
        var thisCategory = posts.filter(posts => posts.category == category)

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

exports.addPost = (postData) =>
{
    if(postData.published == undefined)
    {
        postData.published = false
    }
    else
    {
        postData.published = true;
    }

    postData.id = posts.length + 1
    posts.push(postData)

    return new Promise ((resolve,reject) =>
    {
        if (posts.length == 0)
        {
            reject('no results returned')
        }
        else{
            resolve(posts)
        }
    })
}

exports.getPostsByCategory = (category) =>
{
    return new Promise ((resolve,reject) =>
    {
        var thisCategory = posts.filter(posts => posts.category == category)
        if (thisCategory.length == 0)
        {
            reject('no results returned')
        }
        else
        {
            resolve(thisCategory)
        }
    })
}

exports.getPostsByMinDate = (minDateStr) =>
{
    return new Promise ((resolve,reject) =>
    {
        var minDates = posts.filter(posts => posts.postDate >= minDateStr)
        if (minDates.length == 0)
        {
            reject('no results returned')
        }
        else
        {
            resolve(minDates)
        }
    })
}

exports.getPostsById = (id) =>
{
    return new Promise ((resolve, reject) =>
    {
        var thePost = posts.filter(posts => posts.id == id)
        if (thePost.length == 0)
        {
            reject("no result returned")
        }
        else
        {
            resolve(thePost)
        }
    })
}