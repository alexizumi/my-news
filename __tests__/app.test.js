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
        console.log(body);
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
});
