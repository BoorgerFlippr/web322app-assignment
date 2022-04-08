var mongoose = require("mongoose")
var Schema = mongoose.Schema

var userSchema = new Schema({
    "userName":{
        "type": String,
        "unique": true
    },
    "address": String,
    "email": String,
    "loginHistory":[{
        "dateTime":Date,
        "userAgent":String
    }]
})

let User 

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://Glenn:1230321glenn@senecaweb.j0rut.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")

        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
           User = db.model("Users", userSchema);
           resolve();
        });
    });
};

module.exports.registerUser = function (userData) {
    return new Promise((resolve, reject) => {
        if(userData.password != userData.password2) {
            reject("Passwords do not match")
        }
        else {
            let newUser = new User(userData)
            newUser.save((err) => {
                if(err) {
                    if(err.code === 11000) {
                        reject("User Name already taken")
                    }
                    else {
                        reject("There was an error creating the user: " + err)
                    }
                }
                else {
                    resolve()
                }
            })
        }
    })   
}

module.exports.checkUser = function (userData) {
    return new Promise((resolve, reject) => {
        User.find({userName:userData.userName})
        .exec()
        .then(users => {
            if(users[0].password != userData.password) {
                reject("Incorrect Password for user: " + userData.userName)
            }
            else if(users[0].password === userData.password) {
                users[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent})
                User.update(
                    {userName: users[0].userName},
                    {$set:{loginHistory: users[0].loginHistory}},
                    {multi: false}//?maybe remove if not need
                )
                .exec()
                .then(()=>{resolve(users[0])})
                .catch(err => {reject("There was an error verifying the user: " + err)})
            }
            else{
                reject("Unable to find user: " + userData.userName)
            }
        })
        .catch(()=>{
            reject("Unable to find user: " + userData.userName)
        })
    })
}