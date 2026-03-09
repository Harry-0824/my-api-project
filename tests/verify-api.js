const http = require('http');

// 發送 HTTP 請求的輔助函式
const makeRequest = (method, path, data) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log("Starting Verification Tests... (開始驗證測試)");
  
  // 1. 取得所有車系 (Get Models)
  console.log("\n1. GET /api/models");
  const res1 = await makeRequest('GET', '/api/models');
  console.log(`Status: ${res1.status}, Data Length: ${Array.isArray(res1.body) ? res1.body.length : 'N/A'}`);

  // 2. 新增車系 (Create Model)
  console.log("\n2. POST /api/models");
  const newModel = { name: "Test Model " + Date.now(), slug: "test-model-" + Date.now() };
  const res2 = await makeRequest('POST', '/api/models', newModel);
  console.log(`Status: ${res2.status}, Created (新增成功):`, res2.body.name);
  const modelId = res2.body.id;

  if (modelId) {
    // 3. 更新車系 (Update Model)
    console.log("\n3. PUT /api/models/" + modelId);
    const updatedModel = { name: "Updated " + newModel.name, slug: newModel.slug };
    const res3 = await makeRequest('PUT', '/api/models/' + modelId, updatedModel);
    console.log(`Status: ${res3.status}, Updated (更新成功):`, res3.body.name);

    // 4. 新增車型 (Create Trim)
    console.log("\n4. POST /api/trims");
    const newTrim = { 
        model_id: modelId, 
        name: "Test Trim", 
        price: 1000000, 
        price_display: "100萬",
        basic_specs_json: { engine: "1.5T" },
        detailed_specs_json: { power: "180hp" }
    };
    const res4 = await makeRequest('POST', '/api/trims', newTrim);
    console.log(`Status: ${res4.status}, Created Trim (新增車型成功):`, res4.body.name);
    const trimId = res4.body.id;

    if (trimId) {
       // 5. 刪除車型 (Delete Trim)
       console.log("\n5. DELETE /api/trims/" + trimId);
       const res5 = await makeRequest('DELETE', '/api/trims/' + trimId);
       console.log(`Status: ${res5.status}, Msg:`, res5.body.message);
    }

    // 6. 刪除車系 (Delete Model)
    console.log("\n6. DELETE /api/models/" + modelId);
    const res6 = await makeRequest('DELETE', '/api/models/' + modelId);
    console.log(`Status: ${res6.status}, Msg:`, res6.body.message);
  }

  console.log("\nTests Completed. (測試完成)");
};

// 執行測試
// 注意：請用另一個終端機執行 node index.js 啟動伺服器後，再執行此腳本
runTests();
