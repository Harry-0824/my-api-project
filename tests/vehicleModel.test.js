/**
 * 車款 API 端點測試
 * 測試範圍：GET /api/models、GET /api/models/:id
 * 策略：mock VehicleModel，不需真實 DB
 */
process.env.JWT_SECRET = "test-secret-for-jest";
process.env.NODE_ENV = "test";

const request = require("supertest");

jest.mock("../models", () => ({
  VehicleModel: {
    findAll: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  VehicleTrim: { findAll: jest.fn(), findAndCountAll: jest.fn() },
  Article: { findAll: jest.fn(), findAndCountAll: jest.fn() },
  HomeSlide: { findAll: jest.fn(), findAndCountAll: jest.fn() },
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(),
    sync: jest.fn().mockResolvedValue(),
  },
}));

const app = require("../app");
const { VehicleModel } = require("../models");

const mockModels = [
  { id: 1, name: "MG HS", slug: "hs" },
  { id: 2, name: "MG ZS", slug: "zs" },
];

// ─────────────────────────────────────────────
// GET /api/models
// ─────────────────────────────────────────────
describe("GET /api/models", () => {
  beforeEach(() => jest.clearAllMocks());

  it("應回傳 200 + { success: true, data: [...] }", async () => {
    VehicleModel.findAll.mockResolvedValue(mockModels);

    const res = await request(app).get("/api/models");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(2);
  });

  it("data 陣列中的物件應包含 id、name、slug", async () => {
    VehicleModel.findAll.mockResolvedValue(mockModels);

    const res = await request(app).get("/api/models");

    const first = res.body.data[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("slug");
  });

  it("帶 page/limit 參數時應回傳分頁格式", async () => {
    VehicleModel.findAndCountAll.mockResolvedValue({
      count: 2,
      rows: mockModels,
    });

    const res = await request(app).get("/api/models?page=1&limit=10");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("pagination");
    expect(res.body.pagination).toMatchObject({
      page: 1,
      limit: 10,
      total: 2,
    });
  });

  it("DB 拋出例外 → 500，不洩漏 stack/sql", async () => {
    VehicleModel.findAll.mockRejectedValue(new Error("Query timeout"));

    const res = await request(app).get("/api/models");

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("伺服器內部錯誤");
    expect(res.body).not.toHaveProperty("stack");
    expect(res.body).not.toHaveProperty("sql");
    expect(res.body).not.toHaveProperty("error");
  });
});

// ─────────────────────────────────────────────
// GET /api/models/:id
// ─────────────────────────────────────────────
describe("GET /api/models/:id", () => {
  beforeEach(() => jest.clearAllMocks());

  it("存在的 id → 200 + { success: true, data: {...} }", async () => {
    VehicleModel.findByPk.mockResolvedValue(mockModels[0]);

    const res = await request(app).get("/api/models/1");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({ id: 1, name: "MG HS" });
  });

  it("不存在的 id → 404 + { success: false }，不洩漏內部資訊", async () => {
    VehicleModel.findByPk.mockResolvedValue(null);

    const res = await request(app).get("/api/models/9999");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(typeof res.body.message).toBe("string");
    expect(res.body).not.toHaveProperty("stack");
    expect(res.body).not.toHaveProperty("sql");
  });

  it("DB 拋出例外 → 500，不洩漏 stack/sql", async () => {
    VehicleModel.findByPk.mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/api/models/1");

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("伺服器內部錯誤");
    expect(res.body).not.toHaveProperty("stack");
    expect(res.body).not.toHaveProperty("error");
  });
});

// ─────────────────────────────────────────────
// POST /api/models（需認證）
// ─────────────────────────────────────────────
describe("POST /api/models（認證保護）", () => {
  it("無 token → 401 { success: false }", async () => {
    const res = await request(app)
      .post("/api/models")
      .send({ name: "MG4", slug: "mg4" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
