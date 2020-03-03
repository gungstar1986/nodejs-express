const { Schema, model } = require("mongoose");
const courseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  url: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User" // Ссылка на модель User
  }
});

courseSchema.method("toClient", function() {
    const course = this.toObject()
    course.id = course._id
    delete course._id
    return course.id
});

module.exports = model("Course", courseSchema);
