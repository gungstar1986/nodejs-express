const path = require('path');
const fs = require('fs');

const cardLink = path.join(path.dirname(process.mainModule.filename), 'data', 'card.json');


class Card {

    // Add card to the basket
    static async add(course) {
        // Получаем содержимое card.json
        const card = await Card.fetch();

        // Проверяем, есть ли выбранный item в данных card.json (корзина)
        const ind = card.courses.findIndex(item => item.id === course.id);
        const target = card.courses[ind];

        // Если есть => Увеличиваем колличество item на 1
        if (target) {
            target.count++;
            card.courses[ind] = target; // Нужно проверить без этой строчки

            // Если нет => создаем счетчик купленных курсов и добавляем item в data
        } else {
            course.count = 1;
            card.courses.push(course)
        }

        // Суммируем стоимость всех курсов
        card.price += Number(course.price);

        // Записываем данные card обратно в card.json
        return new Promise((resolve, reject) => {
            fs.writeFile(cardLink, JSON.stringify(card), err => {
                if (err) reject(err);
                resolve()
            })
        })
    }

    // Remove card from basket
    static async remove(id) {
        const card = await Card.fetch();
        const ind = card.courses.findIndex(item => item.id === id);
        const course = card.courses[ind];

        // if item.count = 1 => удаляем курс из массива json
        if (course.count === 1) {
            card.courses = card.courses.filter(elem => elem.id !== id)
            // Уменьшаем count на 1
        } else {
            card.courses[ind].count--
        }

        card.price -= course.price;

        // Re-write data
        return new Promise((resolve, reject) => {
            fs.writeFile(cardLink, JSON.stringify(card), err => {
                if (err) reject(err);
                resolve(card)
            })
        })
    }

    // Get all cards
    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(cardLink, 'utf-8', (err, content) => {
                if (err) reject(err);
                else resolve(JSON.parse(content))
            })
        })
    }
}

module.exports = Card;
