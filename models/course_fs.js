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
    toJSON = () => ({
        title: this.title,
        price: this.price,
        url: this.url,
        id: this.id
    });

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
    };

    // .then method  &&  async/await method
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

    // async/await method && .then method
    static async __getOne(id) {
        const courses = await Course.getAll();
        return courses.find(item => item.id === id)
    }
    static getOne = (id) => Course.getAll().then(promise => promise.find(item => item.id === id));

    // async/await && .then
    static async __update(course) {
        const courses = await Course.getAll();
        const ind = courses.findIndex(item => item.id === course.id);
        courses[ind] = course;
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '../data', 'courses.json'),
                JSON.stringify(courses),
                err => {
                    if (err) reject(err);
                    resolve()
                })
        })
    }
    static update = (course) => Course.getAll()
        .then(promise => {
        const ind = promise.findIndex(ind => ind.id === course.id);
        promise[ind] = course;
        return promise
    })
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


    static delete = (course) => Course.getAll()
        .then(courses => courses.filter(item => item.id !== course.id))
        .then(result => console.log(result))
}


// module.exports = Course;

