const multer = require('multer')
const path = require('path')

// Инициализация storage
const storage = multer.diskStorage({
    // Инициализация места храниения файла
    destination: (req, file, callback) => {
        // Где null => некоторая ошибка (передаем null); "images" => локальная папка для хранения
        callback(null, 'images')
    },
    // Инициализация имени файла
    filename: (req, file, callback) => {
        // Где null => некоторая ошибка передаем null); Второй параметр: инициализация уникального имени (дата + оригинальное имя файла)
        // Для Windows использовать replace() для замены ":" на "-"
        callback(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
})


// Массив разрешенных расширений файлов
/// 'image/png'... - шаблоны сравнения расширений файлов
const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']


// Некоторая валидация (по фильтру) файлов
const fileFilter = (req, file, callback) => {
    // Где mimetype - шаблон из массива разрешенных расширений
    allowedTypes.includes(file.mimetype) ? callback(null, true) : callback(null, false)
}

module.exports = multer({ storage, fileFilter })