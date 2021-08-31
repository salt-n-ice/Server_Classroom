import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose'

const userSchema = mongoose.Schema({
    id : String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    isTeacher: Boolean,
    classes : {type : Array}
});

userSchema.plugin(passportLocalMongoose, { usernameField : 'email' } )

const User = mongoose.model('User', userSchema);

export default User;