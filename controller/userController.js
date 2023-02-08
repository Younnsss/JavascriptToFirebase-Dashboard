const jwt = require('jsonwebtoken');

const signin = async (req, res) => {
  const { pseudo, password } = req.body
  try {
    if (pseudo!=process.env.USER) {
      res.status(404).json({ message: 'Pseudo not found' })
      return ;
    }
    if (password!=process.env.PASS) {
      res.status(404).json({ message: 'Invalid Credentials' })
      return ;
    }

    const token = jwt.sign({pseudo : process.env.USER}, process.env.TOKEN)
    res.status(201).json({ token: token, user : {pseudo : process.env.USER}})
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong" })
  }
}

module.exports = {signin}