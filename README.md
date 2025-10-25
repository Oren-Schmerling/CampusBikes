# CampusBikes

Campus bike rental project made by group Waxwing

# Running the code locally

The code is set up to run with `docker-compose`. Please install the latest stable version of Docker. Once installed, you should be able to run `docker-compose up --build` in the root directory of the repository and it will run the frontend, backend, and PostgreSQL db.

The project depends on some environment variables. You must create a `.env` file in the root directory of the repo. The following values are essential:

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

After starting up the volumes on docker, you should be able to see "Hello World!" printed on your screen at http://localhost:8080/hello

You can look at the PostgreSQL database by logging into it. It's on port `5432` and you can connect to it with the following command: `psql -h localhost -p 5432 -U postgres_user -d bikedb`. You'll be prompted to enter the password which is visible in your .env file.

You can look at the PostgreSQL database by logging into it. It's on port `5432` and you can connect to it with the following command: `psql -h localhost -p 5432 -U postgres_user -d bikedb`. You'll be prompted to enter the password which is visible in your .env file.

When you're done running the server, be sure to stop the process and then run `docker-compose down -v` to tear down the docker images.
