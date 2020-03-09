const keys = require('../keys/keys')

module.exports = (email, token) => ({
    to: email,
    from: keys.MAIL_FROM,
    subject: 'Восстановление доступа',
    html: `
            <p>Вы запросили восстановление пароля</p>
            <p>Если это были не Вы - проигнорируйте данное письмо</p>
            <p>Для сброса пароля перейдите по ссылке: </p>
            <p><a href="${keys.BASE_URL}/reset/password/${token}">Сбросить пароль</a></p>
            <hr/>
            <a href="${keys.BASE_URL}">Магазин курсов</a>  
        `
})