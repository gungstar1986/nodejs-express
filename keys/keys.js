// использование разных ключей для production и develop
process.env.NODE_ENV === 'production'
    ? module.exports = require('./keys.prod')
    : module.exports = require('./keys.dev')
