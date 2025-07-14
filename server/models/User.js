import mongoose from "mongoose";
import pkg from 'validator';
import bcrypt from "bcrypt";
const {isEmail} = pkg;



const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:[true, 'Please emter email'],
        unique: true,
        lowercase: true,
        validate: [isEmail,"Please enter Valid Email"]
    },
    password:{
        type: String,
        required:[true, 'Please enter Password'],
        minlength: [6,"Enter atleast 6 characters for password"],
    },

})
// before

userSchema.pre('save', async function (next){
    console.log("User about to be created",this);
    const salt = await bcrypt.genSalt();
    this.password= await bcrypt.hash(this.password, salt);

    next();
})
// static method to log in

userSchema.statics.login= async function (email,password) {
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error("Incorrect Password");
    }
    throw Error("User doesnt exists");
}

// after
userSchema.post('save', function (doc,next){
    console.log("New User was created",doc)
    next();
})

export const User = mongoose.model('user',userSchema);

