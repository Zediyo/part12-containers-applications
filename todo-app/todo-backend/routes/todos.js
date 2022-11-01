const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const { getAsync, setAsync } = require('../redis')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  let value = await getAsync("added_todos")
  value = Number(value) || 0
  await setAsync("added_todos", value + 1)

  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
	const body = req.body

	Todo.findByIdAndUpdate(
		req.todo.id,
		body,
		{ new: true, runValidators: true, context: "query" }
	).then(n =>
	{
		res.send(n)
	}).catch(error => {
		console.log(error)
		res.sendStatus(404)
	})
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
