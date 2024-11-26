const endpointsJson = require('../endpoints.json');
const db = require('../db/connection');
const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');

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
  // - Article ID is null - 400 "Article ID required" NOT SURE IF NEEDED
  // test('400: should respond with "Article ID required" if article ID nor provided', () => {
  //   return request(app)
  //     .get('/api/articles/')
  //     .expect(404)
  //     .then(({ body }) => {
  //       expect(body.msg).toBe('Article ID required');
  //     });
  // });
});
describe('GET /api/articles', () => {
  test.only('200: Responds with all articles in database', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
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
});
