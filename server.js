const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());


// 테스트용 더미 데이터
let posts = [
  { id: '1', title: '첫 번째 글', content: '안녕하세요!' },
  { id: '2', title: '두 번째 글', content: '반갑습니다!' }
];

app.get('/api/posts', (req, res) => {
  res.json(posts);
});


// 새 포스트 만들기
app.post('/api/posts', (req, res) => {
  const newId = (posts.length + 1).toString();
  const newPost = {
    id: newId,
    title: req.body.title,
    content: req.body.content
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

//특정 포스트 가져오기
app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).send('포스트를 찾을 수 없어요');
  }
});

// 포스트 수정하기
app.put('/api/posts/:id', (req, res) => {
  const index = posts.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...req.body };
    res.json(posts[index]);
  } else {
    res.status(404).send('포스트를 찾을 수 없어요');
  }
});

//포스트 삭제
app.delete('/api/posts/:id', (req, res) => {
  const index = posts.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    posts.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('포스트를 찾을 수 없어요');
  }
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});