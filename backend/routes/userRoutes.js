const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/user");

// middlewares
const verifyToken = require("../helpers/check-token");

// helpers
const getUserByToken = require("../helpers/get-user-by-token");

//get an user
router.get("/:id", verifyToken, async (req, res) => {

    const id = req.params.id;

    // verify user 
    try{

        const user = await User.findOne({ _id: id }, {password: 0});
        
        res.json({ error: null, user })

    } catch(err) {

        return res.status(400).json({ error: "O usuário não existe!" });

    }

})

// Atualizar user
router.patch("/", verifyToken, async (req, res) => {

    const token = req.header("auth-token");
    const user = await getUserByToken(token);
    const userReqId = req.body.id;
    const password = req.body.password;
    const confirmPassword = req.body.confirmpassword;

    const userId = user._id.toString();
  
    // check if user id is equal token user id
    if(userId != userReqId) {
  
      res.status(401).json({ error: "Acesso negado!" });
  
    }

    // creating user object
    const updateData = {
        name: req.body.name,
        email: req.body.email
      };

       // check if password match
    if(password != confirmPassword) {

        res.status(401).json({ error: "As senhas não conferem." });
      
      // change password
      } else if(password == confirmPassword && password != null) {
  
        // creating password
        const salt = await bcrypt.genSalt(12);
        const reqPassword = req.body.password;
  
        const passwordHash = await bcrypt.hash(reqPassword, salt);
  
        req.body.password = passwordHash;
  
        // updating data
        updateData.password = passwordHash;
  
      }
    
      try {      
    
        // returns updated data
        const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $set:  updateData}, {new: true});
        res.json({ error: null, msg: "Usuário atualizado com sucesso!", data: updatedUser });
    
      } catch (error) {
    
        res.status(400).json({ error })
          
      }

});

// get users
router.get("/", async (req,res) =>{

  try{

      const people = await User.find()

      res.status(200).json(people)

  } catch(error) {

      res.status(500).json({ error: error })

  }

});

// delete user
router.delete("/:id", async (req, res) => {

  const id = req.params.id;

  const user = await User.findOne({ _id: id }, {password: 0});

  if(!user){

    res.status(402).json({ msg: "O usuário não foi encontrado!" })
    return

  }

  try{

    await User.deleteOne({_id: id})

    res.status(200).json({ msg: "O usuário foi removido com sucesso!", user: user })

  } catch(error){

    res.status(500).json({ error: error })

  }

});

module.exports = router;