# CampusBikes

Campus bike rental project made by group Waxwing

# Testing the code

SpringBoot is set to run in this repository on Java 21. Please install Java 21 or a newer version.

The code is set up to run with `docker-compose`. Please install the latest stable version of Docker. Once installed, you should be able to run `docker-compose up --build` in the root directory of the repository and it will run the backend as well as the PostgreSQL db.

After starting up the volumes on docker, you should be able to see "Hello World!" printed on your screen at http://localhost:8080/hello

You can look at the PostgreSQL database by logging into it. It's on port `5432` and you can connect to it with the following command: `psql -h localhost -p 5432 -U postgres -d bikedb`. You'll be prompted to enter the password which is "postgres" for now.

When you're done running the server, be sure to stop the process and then run `docker-compose down` to tear down the docker images.
