const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User"); // Assuming this is your user model

// Create event
router.post("/", async (req, res) => {
  try {
    const { title, message, createdBy } = req.body;
    if (!title || !message || !createdBy) {
      return res
        .status(400)
        .json({ error: "Title, message, and createdBy are required" });
    }

    const newEvent = new Event({ title, message, createdBy });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(500).json({ error: "Server error while saving event" });
  }
});

// Get all events with raised hands
router.get("/", async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ createdAt: -1 })
      .populate("raisedHands", "name email branch batch"); // Show limited user info
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching events" });
  }
});

// Raise hand for an event
router.post("/:eventId/raise-hand", async (req, res) => {
  try {
    const { userId } = req.body;
    const { eventId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Prevent duplicate hand-raises
    if (event.raisedHands.includes(userId)) {
      return res
        .status(400)
        .json({ error: "User already raised hand for this event" });
    }

    event.raisedHands.push(userId);
    await event.save();

    res.status(200).json({ message: "Hand raised successfully", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while raising hand" });
  }
});

// Update event
router.put("/:id", async (req, res) => {
  try {
    const { title, message, createdBy } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title,
        message,
        createdBy,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedEvent)
      return res.status(404).json({ error: "Event not found" });
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(500).json({ error: "Server error while updating event" });
  }
});

// Delete event
router.delete("/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent)
      return res.status(404).json({ error: "Event not found" });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error while deleting event" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching event" });
  }
});

module.exports = router;
