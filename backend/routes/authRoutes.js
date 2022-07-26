const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/register", async (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    // check for required fields
    if(name == null || email == null || password == null || confirmpassword == null) {
        return res.status(400).json({ error: "Please fill in all fields." });
    }
    
    // check if password match
    if(password != confirmpassword){
        return res.status(400).json({ error: "Invalid password" });
    }

    // check if user exists
    const emailExists = await User.findOne({ email: email });
    if(emailExists){
        return res.status(400).json({ error: "Email is already in use!" }); 
    }

    // creating password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
        name: name,
        email: email,
        password: passwordHash
    });

    try{

        const newUser = await user.save();

        // create token
        const token = jwt.sign(
            // payload data
            {
            name: newUser.name,
            id: newUser._id,
            },
            "nossosecret"
        );

        // return token
        res.json({ error: null, msg: "You have successfully registered!", token: token, userId: newUser._id });

    }catch(error){

        res.status(400).json({error})
    }

})

//login an user
router.post("/login", async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    // check if user exists
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(400).json({ error: "There is no user registered with this email!" });
    }

    // check if password match
    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword) {
        return res.status(400).json({ error: "Invalid password" });
    }

    // create token
    const token = jwt.sign(
        // payload data
        {
        name: user.name,
        id: user._id,
        },
        "nossosecret"
    );
    
    // return token
    res.json({ error: null, msg: "You are authenticated!", token: token, userId: user._id });

})

module.exports = router;