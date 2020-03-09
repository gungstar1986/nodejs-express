module.exports = (req, res, next) => {
    // isAuth => user переменная (добавляемая в res.local)
    res.locals.isAuth = req.session.isAuthenticated
    res.locals.csrf = req.csrfToken()
    next()
}