# My News API

This app is a back-end service coded in JavaScript running on Node.js and Express.js simulating a Reddit style website, with articles that can have comments, and each article has an associated topic. The user is able retrieve a complete list of endpoints and it's functionalities by accessing the /api endpoint.

https://my-nc-news-x75i.onrender.com/api

# Instructions

If you want to clone and run this project locally you will need to follow these steps:

1 - CREATE ENVIRONMENT FILES
Create two .env files in the root folder for running this project: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names).

2 - INSTALL DEPENDENCIES PACKAGES
To install the required packages run the command:

> npm install

3 - CREATE THE DATABASE
Run the following command:

> npm run setup-dbs

4 - SEED THE DATABASE
To populate the database with the necessary tables and data run the following command:

> npm run seed

5 - RUN THE CODE LOCALLY
Using a browser or a tool like "Insomnia" (so you can make posts and patches), will require for you to run the code:

> npm run start

6 - TEST
The first endpoint to check is the "http://localhost:9090/api", where you'll have the information about all endpoints present and an example of each.

The application is also deployed in a webserver and you cann reach following the address:

https://my-nc-news-x75i.onrender.com/api

The requirements are:
Node.js v23.2.0 or later,
Postgres v14.13 or later

Thanks for taking a look at my work and feel free to get in touch for any information.
Alex

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
