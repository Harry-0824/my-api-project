/**
 * 認證端點測試
 * 測試範圍：POST /api/auth/login、POST /api/auth/register
 * 策略：mock Sequelize User 模型與 bcryptjs，不需真實 DB
 */
process.env.JWT_SECRET = "test-secret-for-jest";
process.env.NODE_ENV = "test";

const request = require("supertest");

// mock models 避免真實 DB 連線
jest.mock("../models", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(),
    sync: jest.fn().mockResolvedValue(),
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mock.jwt.token"),
  verify: jest.fn(),
}));

const app = require("../app");
const { User } = require("../models");
const bcrypt = require("bcryptjs");

// ─────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────
describe("POST /api/auth/login", () => {
  beforeEach(() => jest.clearAllMocks());

  it("正確帳密 → 200 + { success: true, data: { token, user } }", async () => {
    User.findOne.mockResolvedValue({
      id: 1,
      username: "mguser",
      email: "user@mg.com",
      password: "hashed",
    });
    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@mg.com", password: "Password1!" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data).toHaveProperty("user");
    expect(res.body.data.user).not.toHaveProperty("password");
  });

  it("不存在的帳號 → 401，回應不洩漏內部資訊", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "noone@mg.com", password: "Password1!" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBeUndefined(); // 舊格式 message only
    expect(res.body).not.toHaveProperty("stack");
    expect(res.body).not.toHaveProperty("sql");
  });

  it("錯誤密碼 → 401", async () => {
    User.findOne.mockResolvedValue({
      id: 1,
      username: "mguser",
      email: "user@mg.com",
      password: "hashed",
    });
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@mg.com", password: "wrongpass" });

    expect(res.status).toBe(401);
    expect(res.body).not.toHaveProperty("stack");
  });

  it("缺少 email 欄位 → 400 驗證錯誤", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "Password1!" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("驗證錯誤");
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it("缺少 password 欄位 → 400 驗證錯誤", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@mg.com" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("email 格式錯誤 → 400 驗證錯誤", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "not-an-email", password: "Password1!" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("DB 拋出例外 → 500，回應不洩漏 stack/sql", async () => {
    User.findOne.mockRejectedValue(new Error("DB connection lost"));

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@mg.com", password: "Password1!" });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("伺服器內部錯誤");
    expect(res.body).not.toHaveProperty("stack");
    expect(res.body).not.toHaveProperty("error");
  });
});

// ─────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────
describe("POST /api/auth/register", () => {
  beforeEach(() => jest.clearAllMocks());

  it("正常註冊 → 201 + { success: true }", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      id: 2,
      username: "newuser",
      email: "new@mg.com",
    });

    const res = await request(app).post("/api/auth/register").send({
      username: "newuser",
      email: "new@mg.com",
      password: "Password1!",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("重複 email → 400", async () => {
    User.findOne.mockResolvedValue({ id: 1, email: "dup@mg.com" });

    const res = await request(app).post("/api/auth/register").send({
      username: "dup",
      email: "dup@mg.com",
      password: "Password1!",
    });

    expect(res.status).toBe(400);
    expect(res.body).not.toHaveProperty("stack");
  });

  it("密碼少於 6 字元 → 400 驗證錯誤", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "user",
      email: "user@mg.com",
      password: "abc",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("驗證錯誤");
  });

  it("缺少 username → 400 驗證錯誤", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "user@mg.com",
      password: "Password1!",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("無效 email 格式 → 400 驗證錯誤", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "user",
      email: "invalid",
      password: "Password1!",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("DB 拋出例外 → 500，不洩漏內部資訊", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockRejectedValue(new Error("Deadlock found"));

    const res = await request(app).post("/api/auth/register").send({
      username: "user",
      email: "user@mg.com",
      password: "Password1!",
    });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("伺服器內部錯誤");
    expect(res.body).not.toHaveProperty("stack");
    expect(res.body).not.toHaveProperty("error");
  });
});
