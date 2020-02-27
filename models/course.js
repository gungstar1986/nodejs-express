const uuid = require('uuid/v4');
const path = require('path');
const fs = require('fs');


class Course {
    constructor(title, price, url) {
        this.title = title;
        this.price = price;
        this.url = url;
        this.id = uuid();
    }

    // .parse with JSON
    toJSON = () => {
        return {
            title: this.title,
            price: this.price,
            url: this.url,
            id: this.id
        }
    };

    // .then method
    save = () => {
        Course.getAll()
            .then(response => response.concat(this.toJSON()))
            .then(result => new Promise((resolve, reject) => {
                fs.writeFile(
                    path.join(__dirname, '../data', 'courses.json'),
                    JSON.stringify(result),
                    err => {
                        if (err) reject(err);
                        resolve()
                    })
            }))
            .catch(err => err);
    };

    // async/await method
    async __save() {
        const courses = await Course.getAll(); // Обрабатываем промис из getAll()
        courses.push(this.toJSON());

        // return Promise to the add.js
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '../data', 'courses.json'),
                JSON.stringify(courses),
                err => {
                    if (err) reject(err);
                    resolve()
                })
        })
    };

    // Get all .json data
    static getAll = () => {
        // Обрабатываем с помощью промиса
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '../data/', 'courses.json'),
                'utf-8',
                (err, content) => {
                    if (err) reject(err);
                    resolve(JSON.parse(content))
                }
            )
        })
    }
}


module.exports = Course;

