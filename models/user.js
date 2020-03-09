const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: String,
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExp: Date,
  cart: {
    items: [{
      count: {
        type: Number,
        required: true,
        default: 1
      },
      courseId: {
        type: Schema.Types.ObjectID,
        required: true,
        ref: "Course" // Ссылка на модель Course
      }
    }]
  }
});


// Add custom method to the User.prototype
userSchema.methods.addToCart = function (course) {
  // Копия массива items
  const items = [...this.cart.items];
  // Поиск по индексу
  const ind = items.findIndex(
    el => el.courseId.toString() === course._id.toString()
  );
  // Проверка на существование в items
  if (ind >= 0) items[ind].count++;
  // Если в items нет => пушим в items
  else {
    items.push({
      courseId: course._id,
      count: 1
    });
  }
  // Перезаписывем items в req.user
  this.cart = { items };
  return this.save();
};

userSchema.methods.removeFromCart = function (id) {
  // Копия массива items
  let items = [...this.cart.items];
  // Поиск по индекса
  const ind = items.findIndex(el => el.courseId.toString() === id.toString());
  // фильтрация по индексу
  if (items[ind].count === 1) items = items.filter(el => el.courseId.toString() !== id.toString());
  else items[ind].count--;
  // Перезаписывем items в БД (MongoDB)
  this.cart = { items };
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] }
  return this.save()
}

module.exports = model("User", userSchema);




