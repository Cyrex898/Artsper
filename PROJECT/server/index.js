import dotenv from 'dotenv';
import express  from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";

import path from "path";   
import { fileURLToPath } from "url";  // These two files are to configure the path later
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import { register } from "./controllers/auth.js"
import { createPost } from "./controllers/post.js"
import { verifyToken } from './middleware/auth.js';

import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */   // all middleware configurations , Middleware (is basically something that runs in between diffrent requests )

const __filename = fileURLToPath(import.meta.url);   //__filename basically points to the current file you're writing the code in 
const __dirname = path.dirname(__filename);         //__dirname gives you the parent folder of that current file

dotenv.config();         // So we can use dotenv file

//{path: './server/.env'}

const app = express(); 
app.use(express.json());     // invoking express application 

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"})); // invoking helmet

app.use(morgan("common"));   // is a middleware for node.js that logs HTTP requests and contains a list of handler methods
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb",extended: true}));

app.use(cors());   // invoke cross origin request policy 

app.use("/assets", express.static(path.join(__dirname, 'public/assets')));  // setting directory of our assets, hamare case me saari images 

/* FILE STORAGE */

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,"public/assets");
    },
    filename: function (req, file, cb){
        cb(null, file.originalname)
    } 
});                                         

const upload = multer({storage});             // To store files locally , cb mean call back 

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);  
app.post("/posts", verifyToken, upload.single("picture"),createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts",postRoutes)

/* MONGOOSE SETUP */

const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{
    //useNewUrlParser: true,
    //useUnifiedTopology: true                // Deprecated 
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));