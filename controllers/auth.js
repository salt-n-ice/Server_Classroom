import express from 'express';
import passport from 'passport';
import session from 'express-session';
import User from '../models/user.js';
import Class from '../models/class.js';
import Assignment from '../models/assignment.js'
const app = express();
const router = express.Router();

app.use(session({
    secret: 'this is the secret code',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

// const router = express.Router();



passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// ! START PAGE

export const startPage = (req,res) => {
    res.send('THis Works')
}

// require("./passportConfig")(passport);

// ! SIGN UP

export const signUp = async (req, res) => {

    // const user = new User({
    //     fistName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     email:  req.body.email,
    //     isTeacher: req.body.isTeacher
    // })
    
    console.log("THIS IS SIGN UP");
    // id : String,
    // firstName: String,
    // lastName: String,
    // email: String,
    // password: String,
    // isTeacher: Boolean,
    // classes : {type : Array}
    let data = req.body;
    const newId = makeid(), firstName = data.firstName, lastName = data.lastName, email = data.email, password = data.password, isTeacher = data.isTeacher;
    const newUser = new User({
        id: newId,
        firstName : firstName,
        lastName : lastName,
        email : email,
        password : password,
        isTeacher : isTeacher,
    });
    User.find({email : email}, (e, doc)=>{
        if(e) console.log(e);
        else{
            if(doc.length){
                console.log("user already exists!");
                res.json({Authenticated : false});
            }
            else{
                newUser.save((e) => {
                    if(e){
                        console.log("unable to create new user!");
                        res.json({Authenticated : false});
                    }
                    else{
                        console.log("new User created by name : "+firstName+"!");
            
                        res.json({Authenticated : true});
                    }
                })
            }
        }
    })
    


    // console.log(req.body);
    // // { fistName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, isTeacher: req.body.isTeacher }
    // try {
    //     User.register( { fistName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, isTeacher: req.body.isTeacher } , req.body.password, (e,user) => {
    //         if(e) {
    //             res.json({ Authenticated: false, success: false, message: e.message })
    //             console.log("ERROR IN SAVING USER");
    //             console.log(e);
    //         } else {
    //             console.log("USER IS SAVED WALLAH");
    //             passport.authenticate("local")(req,res, () => {
    //                 console.log("AUTHENTICATION IS DONE HERE")
    //                 res.status(201).json({Authenticated: true});
    //             })

    //         }
    //     })

    //     console.log("END OF REGISTER");

    // } catch (error) {
    //     console.log(" ERROR IN SIGN UP ");
    //     console.log(error);
    //     res.status(404).json({message : error.message});
    // }
}

export const signIn = async (req, res) => { 
    console.log("THIS IS SIGN IN");
    
    let data= req.body;
    let email = data.email, pw = data.password;
    User.findOne({email : email}, (e, doc)=>{
        if(e) console.log(e);
        else{
            if(doc){
                Class.find({id : {$in : doc.classes}}, (e, docs)=>{
                    if(e) console.log(e);
                    else res.json({Authenticated : (pw==doc.password), userId : doc.id, hist : docs, userName : doc.firstName});
                });
            }
            else{
                res.json({Authenticated : false});
            }
        }
    })
    // const user = new User(req.body)

    //     // email: req.body.email,
    //     // password: req.body.password,

    // console.log(req.body);

    // try {
    //     req.login(user, (e)=> {
    //         if(e){
    //             console.log("ERROR DECTECTED");
    //             console.log(e);
    //             // res.json({ success: false, message: e.message })
    //         } else {
    //             passport.authenticate("local")(req,res,()=>{
    //                 console.log("AUTHENTICATION IS DONE HERE")
    //                 res.status(201).json({Authenticated: true})
    //             })
    //         }
    //     })

    //     console.log("END OF LOGIN");

    // } catch (error) {
    //     console.log(" ERROR in SIGN IN ");
    //     console.log(error);
    //     res.status(404).json({ message: error.message });
    }

export const createClass = async (req, res) => {
    console.log("THIS IS CREATING CLASS");
    // id : String,
    // name: String,
    // ownerId: String,
    // ownerName: String,
    // users : {type : Array}, //array of users who are joined to the class
    // assignments : {type : Array}
    let newId = makeid(), ownerId = req.body.ownerId, ownerName = req.body.ownerName, name = req.body.name;
    const newClass = new Class({
        id: newId,
        name : name,
        ownerId : ownerId, //this is email id
        ownerName : ownerName,
        users : [ownerId]
    });
    User.updateOne({email : ownerId}, {$push : {classes : newId}}, (e, doc)=>{
        if(e) console.log(e);
        else{
            newClass.save((e) => {
                if(e){
                    console.log("unable to create new class!");
                    res.json({Success : false});
                }
                else{
                    console.log("new Class created by name : "+name+"!");
                    res.json({Success : true, classId : newId});
                }
            })
        }
    })
    
}
export const joinClass = async (req, res) => {
    console.log("THIS IS JOINING CLASS");
    //a user is entering the class
    //insert the user id on the class model
    //insert the class id on the user model
    let classId, userId;  //classId is actual id, userId is email ID
    //if user is already present, do nothing.
    User.findOne({id: userId}, (e, doc)=>{
        if(e){
            console.log(e);
        }
        else{
            let classInUser = doc.classes; 
            if(!classInUser.includes(classId)){
                //now update
                User.updateOne({email : userId}, {$push : {classes : classId}}, (e, doc)=> {
                    if(e){
                        console.log(e);
                    }
                    else{
                        console.log("CLASS ID ADDED TO THE CURRENT USER");
                        //now find the class using class id and add the user in it
                        Class.findOne({id: classId}, (e, doc)=>{
                            if(e) console.log(e);
                            else{
                                let userInClass = doc.users;
                                if(!userInClass.includes(userId)){
                                    Class.updateOne({id : classId}, {$push : {users : userId}}, (e, doc)=>{
                                        if(e) console.log(e);
                                        else{
                                            console.log("USER ID ADDED TO THE CURRENT CLASS");
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            }
            
        }
    })
}
export const addAssignment = async (req, res) => {
    // id : String,
    // name: String, 
    // deadline : {type : Date},
    // classId : String,
    // users : {type : Array}  //id's of users who have yet to do these assignments
    let classId, id = makeid(), name, deadline;
    Class.findOne({id : classId},(e, doc)=>{
        if(e) console.log(e);
        else{
            let userArr = doc.users;
            let newAssignment = new Assignment({
                id : id,
                name : name,
                deadline : deadline,
                classId : classId,
                users : userArr
            })
            newAssignment.save((e)=>{
                if(e) console.log("UNBLE TO SAVE NEW ASSIGNMENT");
                else{
                    console.log("NEW ASSIGNMENT CREATED WITH ID: " + id);
                    Class.updateOne({$push : {assignments : id}}, (e, doc)=>{
                        if(e) console.log("UNABLE to save the newly created assignment to the class");
                        else{
                            console.log("SUCCESSFULLY PROCESSED NEWLY CREATED ASSIGNMENT");
                            res.json({Success : true, assignmentId : id});
                        }
                    })
                }

            })

        } 
    } )
}
export const submitAssignment = async (req, res) => {
    let classId, assignmentId, studentId;
    Assignment.updateOne({$pull : {users : studentId}}, (e, doc)=>{
        if(e) console.log("UNABLE TO SUBMIT THE ASSIGNMENT");
        else{
            console.log("ASSIGNMENT SUB,ITTEED SUCCESSFULLY");
            res.json({Success: true});
        }
    })
}

function makeid() {
    let length = 10;
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result.push(characters.charAt(Math.floor(Math.random() *
        charactersLength)));
    }
    return result.join('');
  }


// 413710211822-amur0107552v3uol3ikdrs65nvl9lcfc.apps.googleusercontent.com

// kABBlOsAb2C7nFk_NaLbnoLC