import bcrypt from "bcrypt";       // to encrypt our password
import jwt from "jsonwebtoken";    // this will give us a way to send webtoken to the user that they can use for authorization
import User from "../models/User.js";

/* REGISTER USER */ 

export const register = async(req, res) =>{
    try{
        const {
        firstName,
        lastName,
        email,
        password,
        picturePath,
        friends,
        location,
        occupation
        }  = req.body;

        const salt = await bcrypt.genSalt();                      
        const passwordHash = await bcrypt.hash(password, salt)     // Encrypting passwords 

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random()*100),
            impressions: Math.floor(Math.random()*100)
        });
        const savedUser = await newUser.save();             // Saving this user 
        res.status(201).json(savedUser);
    } 
    catch(err){
        res.status(500).json({error: err.message})
    }
};


/* LOGGIN IN */

export const login = async (req, res)  =>{
    try {
      const {
        email,
        password
      } = req.body;

      const  user = await User.findOne({email: email});                         // comaping frontend email input to our database
      if (!user) return res.status(400).json({msg: "User does not exist."});  

      const isMatch = await bcrypt.compare(password, user.password)              // comaping frontend password to our database
      if (!isMatch) return res.status(400).json({msg: "Invalid credentials"});

      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET );
      delete user.password;
      res.status(200).json({token, user})

    } catch (err) {
        res.status(500).json({error: err.message})
    }
}