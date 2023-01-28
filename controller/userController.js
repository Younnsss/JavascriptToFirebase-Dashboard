const jwt = require('jsonwebtoken');
const SECRET_KEY = "FOCZVNZUVZOVZRKJIVNOJVUORZOZEOZB";

const signin = async (req, res) => {
  const { pseudo, password } = req.body
  try {
    if (pseudo!="YounsOuNono") {
      res.status(404).json({ message: 'Pseudo not found' })
      return ;
    }
    if (password!="Youns>=Nono") {
      res.status(404).json({ message: 'Invalid Credentials' })
      return ;
    }

    const token = jwt.sign({pseudo : "YounsOuNono"},SECRET_KEY)
    res.status(201).json({ token: token, user : {pseudo : "YounsOuNono"}})
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong" })
  }
}

module.exports = {signin}