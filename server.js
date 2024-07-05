const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs').promises;
const PORT = 3000;

const DATA_FILE = path.join(__dirname, 'posts.json');

app.use(express.json());

// 파일에서 포스트 읽기
async function readPosts() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // 파일이 없거나 읽을 수 없는 경우 빈 배열 반환
    return [];
  }
}

// 파일에 포스트 쓰기
async function writePosts(posts) {
  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2));
}

// 모든 포스트 가져오기
app.get('/api/posts', async (req, res) => {
  const posts = await readPosts();
  res.json(posts);
});

// 새 포스트 만들기
app.post('/api/posts', async (req, res) => {
  const posts = await readPosts();
  const newId = (posts.length + 1).toString();
  const newPost = {
    id: newId,
    title: req.body.title,
    content: req.body.content
  };
  posts.push(newPost);
  await writePosts(posts);
  res.status(201).json(newPost);
});



// 특정 포스트 가져오기
app.get('/api/posts/:id', async (req, res) => {
  const posts = await readPosts();
  const post = posts.find(p => p.id === req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).send('포스트를 찾을 수 없어요');
  }
});

// 포스트 수정하기
app.put('/api/posts/:id', async (req, res) => {
  const posts = await readPosts();
  const index = posts.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...req.body };
    await writePosts(posts);
    res.json(posts[index]);
  } else {
    res.status(404).send('포스트를 찾을 수 없어요');
  }
});

// 포스트 삭제하기
app.delete('/api/posts/:id', async (req, res) => {
  const posts = await readPosts();
  const newPosts = posts.filter(p => p.id !== req.params.id);
  if (posts.length !== newPosts.length) {
    await writePosts(newPosts);
    res.status(204).send();
  } else {
    res.status(404).send('포스트를 찾을 수 없어요');
  }
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});