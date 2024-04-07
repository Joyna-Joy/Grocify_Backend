const express = require('express');
const router = express.Router();
const Tip = require('../Models/TipModel');

// Get all tips
router.get('/ViewTips', async (req, res) => {
    try {
        const tips = await Tip.find();
        res.json(tips);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new tip
router.post('/addTips', async (req, res) => {
    const tip = new Tip({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        imageUrl:req.body.imageUrl
    });
    try {
        const newTip = await tip.save();
        res.status(201).json(newTip);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post("/searchTips", async (req, res) => {
    try {
      const tip = await Tip.find({
        title: { $regex: req.body.title, $options: "i" },
      });
      res.json(tip);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
});

router.patch('/updateTips/:id', async (req, res) => {
    try {
      const tip = await Tip.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(tip);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  router.post('/addComment', async (req, res) => {
    try {
        const { tipId, comment } = req.body;

        // Validate comment
        if (!comment) {
            return res.status(400).json({ message: 'Comment cannot be empty' });
        }

        // Find the tip by ID
        const tip = await Tip.findById(tipId);

        if (!tip) {
            return res.status(404).json({ message: 'Tip not found' });
        }

        // Add the comment to the tip
        tip.comments.push(comment);

        // Save the updated tip
        const updatedTip = await tip.save();

        res.status(201).json(updatedTip);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
