const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const { access_token } = req.headers

    jwt.verify(access_token, process.env.SECRET_KEY, (err, decode) => {
        
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(400).json({
                message: "Token invalid :("
            })
        }
        
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                message: "Noto'g'ri token :)"
            })
        }

        const { id } = decode 

        req.userId = id

        next()
    })

}