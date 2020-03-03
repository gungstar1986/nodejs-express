// Реализация страницы "Корзина"
const { Router } = require("express");
const Course = require("../models/course");
const router = Router();

// Re-build user data {req.user} => req.user - модель корзины from ('./index.js)
const userMap = array =>
  // ...elem.courseId._doc => копия содержимого корзины
  array.items.map(elem => ({
    ...elem.courseId._doc,
    id: elem.courseId.id,
    count: elem.count
  }));

// Get total price from user data
const userPrice = array => array.reduce((acc, curr) => acc + curr.price, 0);

// Add item to tha cart (в корзину)
router.post("/add", async (req, res) => {
  try {
    // Выбор курса по id
    const course = await Course.findById(req.body.id);
    // Вызов custom метода у модели User(),
    await req.user.addToCart(course);
    // Отрисовка front-end
    res.redirect("/card");
  } catch (e) {
    console.log(e);
  }
});

// Получаем содержимое корзины
router.get("/", async (req, res) => {
  // Получаем коллекцию user содержащую корзину пользователя
  const user = await req.user.populate("cart.items.courseId").execPopulate();
  // Получаем корзину
  const courses = userMap(user.cart);
  // Получаем Общую цену
  const coast = userPrice(courses);
  // Отрисовка front-end ('./страница', { передача значений })
  res.render("card", {
    title: "Корзина",
    isCard: true,
    courses: courses,
    coast: coast
  });
});

// Удаление item из корзины
router.delete("/remove/:id", async (req, res) => {
  await req.user.removeFromCard(req.params.id);
  const user = await req.user.populate("cart.items.courseId").execPopulate();
  const courses = userMap(user.cart);
  const cart = {
    courses,
    coast: userPrice(courses)
  };
  res.status(200).json(cart);
});

module.exports = router;
