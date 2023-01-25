const jwt = require('jsonwebtoken');
const SECRET_KEY = "NonoOuYouns";

const signin = async (req, res) => {
  const { pseudo, password } = req.body
  try {
    if (pseudo!="YounsOuNono") {
      res.status(404).json({ message: 'Pseudo not found' })
    }
    if (password!="Youns>>>Nono") {
      res.status(404).json({ message: 'Invalid Credentials' })
    }

    const token = jwt.sign({pseudo : "YounsOuNono"},SECRET_KEY)
    res.status(201).json({ token: token, user : {pseudo : "YounsOuNono", password : "Youns>>>Nono"}})


  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong" })
  }
}

module.exports = { signin}