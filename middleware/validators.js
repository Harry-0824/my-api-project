const { body, validationResult } = require("express-validator");

// 統一驗證錯誤處理
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "驗證錯誤",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// 認證相關驗證
exports.validateRegister = [
  body("username").trim().notEmpty().withMessage("帳號為必填"),
  body("email").isEmail().withMessage("電子郵件格式不正確"),
  body("password").isLength({ min: 6 }).withMessage("密碼至少需要 6 個字元"),
];

exports.validateLogin = [
  body("email").isEmail().withMessage("電子郵件格式不正確"),
  body("password").notEmpty().withMessage("密碼為必填"),
];

exports.validateForgotPassword = [
  body("email").isEmail().withMessage("電子郵件格式不正確"),
];

exports.validateResetPassword = [
  body("password").isLength({ min: 6 }).withMessage("密碼至少需要 6 個字元"),
];

// 車款相關驗證
exports.validateCreateModel = [
  body("name").trim().notEmpty().withMessage("車款名稱為必填"),
  body("slug")
    .trim()
    .notEmpty()
    .withMessage("slug 為必填")
    .matches(/^[a-z0-9-]+$/)
    .withMessage("slug 只能包含小寫字母、數字和連字符"),
];

exports.validateUpdateModel = [
  body("name").optional().trim().notEmpty().withMessage("車款名稱不可為空"),
  body("slug")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("slug 不可為空")
    .matches(/^[a-z0-9-]+$/)
    .withMessage("slug 只能包含小寫字母、數字和連字符"),
];

// 車型相關驗證
exports.validateCreateTrim = [
  body("model_id").isInt({ min: 1 }).withMessage("model_id 必須為有效的整數"),
  body("name").trim().notEmpty().withMessage("車型名稱為必填"),
];

exports.validateUpdateTrim = [
  body("name").optional().trim().notEmpty().withMessage("車型名稱不可為空"),
];
