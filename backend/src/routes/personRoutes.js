const express = require("express");
const router = express.Router();
const personService = require("../services/personService");

router.post("/", async (req, res) => {
  try {
    const record = await personService.createPerson(req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const records = await personService.getAllPersons();
    res.status(200).json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const record = await personService.getPersonById(req.params.id);
    res.status(200).json(record);
  } catch (error) {
    if (error.message === "Person not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const record = await personService.updatePersonById(req.params.id, req.body);
    res.status(200).json(record);
  } catch (error) {
    if (error.message === "Person not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const record = await personService.patchPersonById(req.params.id, req.body);
    res.status(200).json(record);
  } catch (error) {
    if (error.message === "Person not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const record = await personService.deletePersonById(req.params.id);
    res.status(200).json(record);
  } catch (error) {
    if (error.message === "Person not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
