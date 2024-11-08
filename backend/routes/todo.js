const express = require('express')
const User = require("../models/User")
const router= express.Router()
const authenticate = require("../middlewares/authenticate")

router.post('/add', authenticate, async (req, res) => {
  try {
    const { title, desc } = req.body;
    
    if (!title || !desc) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      console.log("user not found")
      return res.status(404).json({ message: "User not found" });
    }

    const newTodo = { title, desc, completed: false };
    user.todos.push(newTodo);
    await user.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Failed to add todo", error: error.message });
  }
});


router.get("/", authenticate, async(req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user.todos)
    } catch (error) {
        res.status(500).json({message: "Failed to fetch Todos", error})
    }
})

router.put('/:id', authenticate, async (req, res) => {
  try {
      const { id } = req.params;
      const { title, desc, completed } = req.body;

      const user = await User.findById(req.user._id);
      if (!user) {
          console.log("User not found");
          return res.status(404).json({ message: "User not found" });
      }

      const todoIndex = user.todos.findIndex(todo => todo._id.toString() === id);
      if (todoIndex === -1) {
          console.log("Todo not found in user's list");
          return res.status(404).json({ message: "Todo not found" });
      }

      if (title !== undefined) user.todos[todoIndex].title = title;
      if (desc !== undefined) user.todos[todoIndex].desc = desc;
      if (completed !== undefined) user.todos[todoIndex].completed = completed;

      await user.save();
      res.status(200).json(user.todos[todoIndex]);
  } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ message: 'Failed to update To-Do', error: error.message });
  }
});


  router.delete('/:id', authenticate, async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const todoIndex = user.todos.findIndex(todo => todo._id.toString() === id);
      if (todoIndex === -1) {
        return res.status(404).json({ message: "Todo not found" });
      }
  
      user.todos.splice(todoIndex, 1);
      await user.save();
  
      return res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
      console.error('Error during deletion:', error);
      return res.status(500).json({ message: 'Failed to delete Todo', error });
    }
  });
    
  module.exports = router;