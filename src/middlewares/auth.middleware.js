 function auth(req, res, next) {
    if(req.session?.user?.admin) {
        return next()
    }
    return res.status(401).send('error de autorización')
}



const authorization =  (roles) => {
    return async (req, res, next) => {

        if (roles.includes('public')) return next();
        if (!req.user) return res.status(401).send({ status: 'error', error: 'Unauthorized' });
        const userRole = req.user.role.toLowerCase();
        const allowedRoles = roles.map(role => role.toLowerCase());
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).send({ status: 'error', error: 'No permissions' });
        }
        next();
    };
};




function isLoggedIn(req, res, next) {
    
    if (req.session?.user?.user) {
        req.user = req.session.user.user; 
        return next();
    }
    if (req.session?.user) {
        req.user = req.session.user; 
        return next();
    }
    // return res.status(401).send('Error de inicio de sesión');
    return next();
}

module.exports = {auth, isLoggedIn, authorization}