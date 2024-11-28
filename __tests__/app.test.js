const endpointsJson = require('../endpoints.json');
const db = require('../db/connection');
const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const comments = require('../db/data/test-data/comments');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET /api', () => {
  test('200: Responds with an object detailing the documentation for each endpoint', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe('GET /api/topics', () => {
  test('200: Responds with topics and slugs with type string', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        body.forEach((topic) => {
          expect(topic).toHaveProperty('slug', expect.any(String));
          expect(topic).toHaveProperty('description', expect.any(String));
        });
      });
  });
  test("500: Responds with 'Internal Server Error' when a server error occurs", () => {
    return request(app)
      .get('/api/topics?forceError=true')
      .expect(500)
      .then(({ body }) => {
        expect(body.msg).toBe('Internal Server Error');
      });
  });
});
describe('GET /api/articles/:article_id', () => {
  test('200: Responds with requested article', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        expect(body[0].article_id).toBe(1);
        expect(body[0].title).toBe('Living in the shadow of a great man');
        expect(body[0].topic).toBe('mitch');
        expect(body[0].author).toBe('butter_bridge');
        expect(body[0].body).toBe('I find this existence challenging');
        expect(body[0].created_at).toBe('2020-07-09T20:11:00.000Z');
        expect(body[0].votes).toBe(100);
        expect(body[0].article_img_url).toBe(
          'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        );
      });
  });
  test('400: should respond with "Bad request" if invalid article provided', () => {
    return request(app)
      .get('/api/articles/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  test('404: should respond with "Article not found" if article doesnt exist', () => {
    return request(app)
      .get('/api/articles/1230')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found');
      });
  });
});
describe('GET /api/articles', () => {
  test('200: Responds with all articles in database', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body).toBeSortedBy('created_at', { descending: true });
        body.forEach((article) => {
          expect(article).toHaveProperty('author', expect.any(String));
          expect(article).toHaveProperty('title', expect.any(String));
          expect(article).toHaveProperty('article_id', expect.any(Number));
          expect(article).toHaveProperty('topic', expect.any(String));
          expect(article).toHaveProperty('created_at', expect.any(String));
          expect(article).toHaveProperty('votes', expect.any(Number));
          expect(article).toHaveProperty('article_img_url', expect.any(String));
          expect(article).toHaveProperty('comments_count', expect.any(Number));
          expect(article).not.toHaveProperty('body');
        });
      });
  });
  test('200: Response is sorted by the article_id in ascending order', () => {
    return request(app)
      .get('/api/articles?sort_by=article_id&order=ASC')
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(13);
        expect(body).toBeSortedBy('article_id', { ascending: true });
      });
  });
  test('400: Response error Bad request if invalid argument passed', () => {
    return request(app)
      .get('/api/articles?sort_by=banana&order=ASC')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  test('400: Response error Bad request if invalid argument passed', () => {
    return request(app)
      .get('/api/articles?sort_by=article_id&order=invalid')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
});
describe('GET /api/articles/:article_id/comments', () => {
  test('200: should respond with all coments related to article', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body).toBeSortedBy('created_at', { descending: true });
        body.forEach((comment) => {
          expect(comment).toHaveProperty('article_id', expect.any(Number));
          expect(comment).toHaveProperty('votes', expect.any(Number));
          expect(comment).toHaveProperty('created_at', expect.any(String));
          expect(comment).toHaveProperty('author', expect.any(String));
          expect(comment).toHaveProperty('body', expect.any(String));
          expect(comment).toHaveProperty('article_id', expect.any(Number));
        });
      });
  });
  test('400: should respond with "Bad request" if invalid article provided', () => {
    return request(app)
      .get('/api/articles/banana/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  test('404: should respond with "Article not found" if article doesnt exist', () => {
    return request(app)
      .get('/api/articles/1230/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found');
      });
  });
});
describe('POST /api/articles/:article_id/comments', () => {
  test('201: should insert comment in correct article', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'This is a sample comment created by butter_bridge.',
    };
    return request(app)
      .post('/api/articles/2/comments')
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment[0]).toHaveProperty('article_id', 2);
        expect(comment[0]).toHaveProperty('votes', 0);
        expect(comment[0]).toHaveProperty('created_at', expect.any(String));
        expect(comment[0]).toHaveProperty('author', 'butter_bridge');
        expect(comment[0]).toHaveProperty(
          'body',
          'This is a sample comment created by butter_bridge.'
        );
      });
  });
  test('400: should respond with "Bad request" if invalid article provided', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'This is a sample comment created by butter_bridge.',
    };
    return request(app)
      .post('/api/articles/banana/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  test('400: should respond with "Bad request" if article doesnt exist', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'This is a sample comment created by butter_bridge.',
    };
    return request(app)
      .post('/api/articles/1230/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  test('400: should respond with "Missing argument" if empty comment provided', () => {
    const newComment = {
      username: 'butter_bridge',
      body: '',
    };
    return request(app)
      .post('/api/articles/2/comments')
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Missing argument');
      });
  });
  test('400: should respond with "Missing argument" if empty username provided', () => {
    const newComment = {
      username: 'butter_bridge',
      body: '',
    };
    return request(app)
      .post('/api/articles/2/comments')
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Missing argument');
      });
  });
});
describe('PATCH /api/articles/:article_id', () => {
  test('200: should update article vote in correct article ID', () => {
    const updateVote = { inc_votes: 1 };
    return request(app)
      .patch('/api/articles/3')
      .send(updateVote)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty('article_id', 3);
        expect(article).toHaveProperty(
          'title',
          'Eight pug gifs that remind me of mitch'
        );
        expect(article).toHaveProperty('votes', 1);
        expect(article).toHaveProperty('created_at', expect.any(String));
        expect(article).toHaveProperty('author', 'icellusedkars');
        expect(article).toHaveProperty('body', 'some gifs');
      });
  });
  test('400: should respond with "Bad request" if invalid article provided', () => {
    const updateVote = { inc_votes: 1 };
    return request(app)
      .patch('/api/articles/banana')
      .send(updateVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  test('404: should respond with "Article not found" if article doesnt exist', () => {
    const updateVote = { inc_votes: 1 };
    return request(app)
      .patch('/api/articles/1230')
      .send(updateVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found');
      });
  });
  test('400: should respond with "Bad request" increment value is not a number', () => {
    const updateVote = { inc_votes: 'one' };
    return request(app)
      .patch('/api/articles/3')
      .send(updateVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
});
describe('DELETE /api/comments/:comment_id', () => {
  test('204: should delete the given comment by comment_id', () => {
    return request(app)
      .delete('/api/comments/3')
      .expect(204)
      .then(() => {
        return db.query('SELECT * FROM comments WHERE comment_id = 3');
      })
      .then(({ rows }) => {
        expect(rows).toHaveLength(0);
      });
  });
  test("404: should return an error if comment_id doesn't exist", () => {
    return request(app)
      .delete('/api/comments/9999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Comment not found');
      });
  });
  test('400: should return an error if comment_id is invalid', () => {
    return request(app)
      .delete('/api/comments/invalid')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid comment_id');
      });
  });
});
describe('GET /api/users', () => {
  test('200: should return all users', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ text }) => {
        const users = JSON.parse(text);
        users.forEach((user) => {
          expect(user).toHaveProperty('username', expect.any(String));
          expect(user).toHaveProperty('name', expect.any(String));
          expect(user).toHaveProperty('avatar_url', expect.any(String));
        });
      });
  });
});
