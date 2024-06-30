const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// 간단한 라우트 추가
app.get('/', (req, res) => {
    res.send('Hello, World!');
  });
  
  // 서버 시작
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });