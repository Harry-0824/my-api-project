/**
 * check-auth 中介軟體單元測試
 */
process.env.JWT_SECRET = "test-secret-for-jest";
process.env.NODE_ENV = "test";

const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");

// 建立輕量 mock req/res/next
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("check-auth middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = mockRes();
    next = jest.fn();
  });

  it("無 Authorization header → 401 { success: false, message: '驗證失敗' }", () => {
    checkAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "驗證失敗",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("有效 token → 呼叫 next()，req.userData 已解碼", () => {
    const payload = { userId: 1, username: "mguser" };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    req.headers.authorization = `Bearer ${token}`;

    checkAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.userData).toMatchObject({ userId: 1, username: "mguser" });
    expect(res.status).not.toHaveBeenCalled();
  });

  it("過期 token → 401 { success: false, message: '驗證失敗' }", () => {
    // 使用不同 secret 模擬過期/無效 token
    const invalidToken = jwt.sign({ userId: 1 }, "wrong-secret");
    req.headers.authorization = `Bearer ${invalidToken}`;

    checkAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "驗證失敗",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("格式錯誤（非 Bearer）→ 401", () => {
    req.headers.authorization = "Token abc123";

    checkAuth(req, res, next);

    // verify 會拋出，middleware 應回 401
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("回應中不應洩漏內部錯誤訊息", () => {
    req.headers.authorization = "Bearer bad.token.value";

    checkAuth(req, res, next);

    const jsonArg = res.json.mock.calls[0][0];
    expect(jsonArg).not.toHaveProperty("stack");
    expect(jsonArg).not.toHaveProperty("error");
    expect(jsonArg.message).toBe("驗證失敗");
  });
});
