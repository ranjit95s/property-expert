const jwt = require("jsonwebtoken");

const user = require("../models/user");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);

        const users = await user.findOne({ _id: verifyUser._id });
        console.log(users);

        next();
    } catch (e) {
        // res.status(401).send("user token isnt available");
        res.status(401).render("login", { err: "Login required", success: "false" });
    }
}

module.exports = auth;