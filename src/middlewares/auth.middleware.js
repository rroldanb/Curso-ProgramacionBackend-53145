 function auth(req, res, next) {
    if(req.session?.user?.admin) {
        return next()
    }
    return res.status(401).send('error de autorización')
}

function isLoggedIn(req, res, next) {
    if (req.session?.user) {
        req.user = req.session.user; 
        return next();
    }
    // return res.status(401).send('Error de inicio de sesión');
    return next();
}



module.exports = {auth, isLoggedIn}