// Don't use module.exports
import {User} from "../models/User.js"
import { PlayerDetails } from "../models/PlayerDetails.js";
import jwt from 'jsonwebtoken';
const handleErrors=(error)=>{
    console.log(error.message,error.code);
    let err = {email:'', password:''}

    // incorrect email
    if(error.message==='User doesnt exists'){
      err.email = 'that mail is not registered yet';
      return err;
    }
    if(error.message==='Incorrect Password'){
      err.password = 'Incorrect Password';
      return err;
    }
    // duplicate error code
    if(error.code===11000){
      err.email = 'User already exists';
      return err;
    }

    // validation errors
    if(error.message.includes('user validation failed')){
      Object.values(error.errors).forEach(({properties})=>{
        err[properties.path] = properties.message;
      })
    }
    return err;
}
const maxAge = 3*24*60*60;
const createTokens= (id)=>{
  return jwt.sign({id},'Net Ninja Secrect',{expiresIn: maxAge});
}

export const login_get = (req, res) => {
  res.status(200).json({ message: 'Login GET hit' }); // ✅
};

export const signup_get = (req, res) => {
  res.status(200).json({ message: 'Signup GET hit' }); // ✅
};



export const signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    console.log("✅ User created:", user._id);

    try {
      const playerDetails = await PlayerDetails.create({
        userId: user._id,
        total: {},
        easy: {},
        medium: {},
        hard: {},
        pvp: {},
        battingMoves: [],
        bowlingMoves: [],
        matchIds: []
      });
      console.log("✅ PlayerDetails created:", playerDetails);
    } catch (pdError) {
      console.error("❌ Failed to create playerDetails:", pdError);
      await User.deleteOne({ _id: user._id });
      throw pdError;
    }

    const token = createTokens(user._id);
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 1000 * maxAge,
      sameSite: 'None',
      secure: true,
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (error) {
    const errors = handleErrors(error);
    console.error("❌ Signup failed:", error);
    res.status(400).json({ errors });
  }
};


export const login_post = async(req, res) => {
    const {email, password} = req.body;
    try {
      const user = await User.login(email,password);
      const token = createTokens(user._id);
      res.cookie('jwt', token, {httpOnly: true, maxAge: 1000*maxAge, sameSite: 'lax',secure: process.env.NODE_ENV === 'production'})
      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          email: user.email
        }
      });
    } catch (error) {
      const errors= handleErrors(error);
      res.status(400).json({errors});
    }
};

export const logout_get = (req, res) => {
  res.cookie('jwt','', {
    httpOnly: true,
    maxAge: 1,
    sameSite: 'None',
    secure: true
  });
  res.status(401).json({ error: 'Unauthorized' });

};
