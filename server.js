require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());

let db;

async function connectToMongoDB() {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    db = client.db('myBlogDB'); // 여기서 'myBlogDB'는 사용하려는 데이터베이스 이름입니다.
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

//모든 포스트 조회
app.get('/posts', async (req, res) => {
  try {
    const posts = await db.collection('posts').find().toArray();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 포스트 생성
app.post('/posts', async (req, res) => {
  try {
    const { title, content } = req.body;
    const result = await db.collection('posts').insertOne({ title, content });
    res.status(201).json({ _id: result.insertedId, title, content });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 특정 포스트 가져오기
app.get('/posts/:id', async (req, res) => {
  try {
    const post = await db.collection('posts').findOne({ _id: new ObjectId(req.params.id) });
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 포스트 업데이트
app.put('/posts/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const result = await db.collection('posts').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { title, content } }
    );
    if (result.matchedCount > 0) {
      res.json({ message: 'Post updated successfully' });
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 포스트 삭제
app.delete('/posts/:id', async (req, res) => {
  try {
    const result = await db.collection('posts').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount > 0) {
      res.json({ message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


async function startServer() {
  await connectToMongoDB();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('서버가 잘 작동합니다.')
  });
}

startServer();

 