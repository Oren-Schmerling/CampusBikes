# CampusBikes

CampusBikes is a bike and scooter rental platform built by group Waxwing. It's a service available only to UMass community members. We allow posting of

# Tech Stack

This app consists of 3 services: Frontend, Backend, and Database.

Our Frontend service is running Next.js with React and TailwindCSS. We're mainly just using Next.js for the routing logic, with most of the implementation depending only on React. We opted for JavaScript rather than TypeScript for quicker development without being hindered by requiring type definitions for every new object.

Our Backend is built with SpringBoot, which means it's written in Java. We selected SpringBoot because it's a framework in high demand in the job market, and Java is a relevant and performant language which we're all already familiar with.

Our Database is relational, deployed with Postgres. We chose Postgres because it's an industry standard, and familiarity with it is in high demand in the current job market.

# Running the code locally

First, you will need to clone this repo to run the code locally.Then, the project depends on some environment variables. You must create a `.env` file in the root directory of the repo. The following values are essential:

```
## Database
POSTGRES_DB
POSTGRES_URL
POSTGRES_USER
POSTGRES_PASSWORD

## Frontend
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_APP_ENV

## JWT Key
JWT_SECRET
```

Reach out to Waxwing if you need help setting up your `.env` file.

The code is set up to run with `docker-compose`. Please install the latest stable version of Docker and the docker-compose CLI. Once installed, run `docker-compose up --build` in the root directory of the repository and it will run the frontend, backend, and PostgreSQL db.

After starting up the containers on docker, you should be able to see the CampusBikes landing page at http://localhost:3000/. Then, create a user, sign in, and you'll have full access. If you wish to access the backend API automatically, you can do so at http://localhost:8080/.

You can look at the PostgreSQL database by logging into it via the virtual network created by Docker. It's on port 5432 and you can connect to it with the following command: `psql -h localhost -p 5432 -U postgres_user -d bikedb`. You'll be prompted to enter the password which is set in your .env file.

When you're done running the server, be sure to stop the process and then run `docker-compose down -v` to stop the running containers and tear down all newly created volumes.
