const Sequelize = require('sequelize');

var sequelize = new Sequelize('dcun5oknh2b301', 'opolordashcyrl', 'e5b1e425b04c973aa036c449f700e2fad3f6d99e79e6f2a8709d38789f18c101', {
    host: 'ec2-34-205-209-14.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

var Post = sequelize.define('Post',
{
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
})

var Category = sequelize.define('Category',
{
    category: Sequelize.STRING
})

Post.belongsTo(Category,{foreignKey:'category'})

exports.initialize = () =>
{
    return new Promise ((resolve, reject) =>
    {
        sequelize.sync()
        .then(resolve('Success! Database is synced.'))
        .catch(reject('Unable to sync the database.'))
    })
}

exports.getAllPosts = () =>
{
    return new Promise ((resolve, reject) =>
    {
        Post.findAll()
        .then(data => resolve(data))
        .catch(reject('No results returned.'))
    })
}

exports.getPublishedPosts = () =>
{
    return new Promise ((resolve, reject) =>
    {
        Post.findAll({
            where:
            {
                published: true
            }
            .then(data => resolve(data))
            .catch(reject('No results returned.'))
        })
    })
}

exports.getPublishedPostsByCategory = (category) =>
{
    return new Promise ((resolve, reject) =>
    {
        Post.findAll({
            where:
            {
                published: true,
                category: category
            }
            .then(data => resolve(data))
            .catch(reject('No results returned.'))
        })
    })
}

exports.getCategories = () =>
{
    return new Promise ((resolve, reject) =>
    {
        Category.findAll()
        .then(data => resolve(data))
        .catch(reject('No results returned.'))
    })
}

exports.addPost = (postData) =>
{
    return new Promise ((resolve, reject) =>
    {
        postData.published = (postData.published)?true:false;
        for (var i in postData)
        {
            if(postData[i] == ""){postData[i] = null}
        }
        let today = new Date()
        postData.postDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()

        Post.create(postData)
        .then(resolve('Post successfuly created!'))
        .catch(reject('Unable to create post.'))

    })
}

exports.getPostsByCategory = (category) =>
{
    return new Promise ((resolve, reject) =>
    {
        Post.findAll({
            where:
            {
                category: category
            }
        })
        .then(data => resolve(data))
        .catch(reject('No results returned.'))
    })
}

exports.getPostsByMinDate = (minDateStr) =>
{
    return new Promise ((resolve, reject) =>
    {
        const {gte} = Sequelize.Op

        Post.findAll({
            where:
            {
                postDate:
                {
                    [gte]:new Date(minDateStr)
                }
            }
        })
        .then(data => resolve(data))
        .catch(reject('No results returned.'))
    })
}

exports.getPostById = (id) =>
{
    return new Promise ((resolve, reject) =>
    {
        Post.findAll({
            where:
            {
                id:id
            }
        })
        .then(data => resolve(data))
        .catch(reject('No results returned.'))
    })
}

exports.addCategory = (categoryData) =>
{
    return new Promise((resolve,reject) =>
    {
        for (var i in categoryData)
        {
            if (categoryData[i] == ""){categoryData[i] = null}
        }

        Category.create(categoryData)
        .then(resolve('Category successfuly created!'))
        .catch(reject('Unable to create category.'))
    })
}

exports.deleteCategoryById = (id) =>
{
    return new Promise((resolve,reject) =>
    {
        Category.destroy({
            where: 
            {
                id:id
            }
        })
        .then(resolve())
        .catch(reject('Deletion failed'))
    })
}

exports.deletePostById = (id) =>
{
    return new Promise((resolve,reject) =>
    {
        Post.destroy({
            where:
            {
                id:id
            }
        })
        .then(resolve())
        .catch(reject('Deletion failed'))
    })
}