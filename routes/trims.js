const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /api/trims - 取得所有車型
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM vehicle_trims");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/trims/:id - 取得單一車型
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM vehicle_trims WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Trim not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/trims - 新增車型
router.post("/", async (req, res) => {
  const {
    model_id,
    name,
    price,
    price_display,
    main_image,
    booking_link,
    online_order_link,
    disclaimer,
    basic_specs_json,
    detailed_specs_json,
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO vehicle_trims 
            (model_id, name, price, price_display, main_image, booking_link, online_order_link, disclaimer, basic_specs_json, detailed_specs_json) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        model_id,
        name,
        price,
        price_display,
        main_image,
        booking_link,
        online_order_link,
        disclaimer,
        JSON.stringify(basic_specs_json),
        JSON.stringify(detailed_specs_json),
      ],
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/trims/:id - 更新車型
router.put("/:id", async (req, res) => {
  const {
    model_id,
    name,
    price,
    price_display,
    main_image,
    booking_link,
    online_order_link,
    disclaimer,
    basic_specs_json,
    detailed_specs_json,
  } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE vehicle_trims SET 
            model_id=?, name=?, price=?, price_display=?, 
            main_image=?, booking_link=?, online_order_link=?, disclaimer=?, 
            basic_specs_json=?, detailed_specs_json=? 
            WHERE id = ?`,
      [
        model_id,
        name,
        price,
        price_display,
        main_image,
        booking_link,
        online_order_link,
        disclaimer,
        JSON.stringify(basic_specs_json),
        JSON.stringify(detailed_specs_json),
        req.params.id,
      ],
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Trim not found" });
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/trims/:id - 刪除車型
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM vehicle_trims WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Trim not found" });
    res.json({ message: "Trim deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
