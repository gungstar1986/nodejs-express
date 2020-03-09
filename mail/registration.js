const keys = require('../keys/keys')

module.exports = email => ({
    to: email,
    from: keys.MAIL_FROM,
    subject: 'Регистрация прошла успешно',
    html: `
            <h1>Добро пожаловатть!</h1>
            <p>Регистрация прошла успешно. Ваш email ${email}</p>
            <hr/>
            <a href="${keys.BASE_URL}">Магазин курсов</a>  
        `
})

