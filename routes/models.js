const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /api/models - 取得所有車系
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM vehicle_models");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/models/:id - 取得單一車系
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM vehicle_models WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Model not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/models - 新增車系
router.post("/", async (req, res) => {
  const { name, slug } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO vehicle_models (name, slug) VALUES (?, ?)",
      [name, slug],
    );
    res.status(201).json({ id: result.insertId, name, slug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/models/:id - 更新車系
router.put("/:id", async (req, res) => {
  const { name, slug } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE vehicle_models SET name = ?, slug = ? WHERE id = ?",
      [name, slug, req.params.id],
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Model not found" });
    res.json({ id: req.params.id, name, slug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/models/:id - 刪除車系
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM vehicle_models WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Model not found" });
    res.json({ message: "Model deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
