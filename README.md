# Sports courses

## Prerequisites:

### Docker
Make sure docker is up and running

### .env file
Create a `.env` file in the project root and fill it out accordingly:
```shell
DB_HOST=localhost
DB_PORT=        
DB_USERNAME=       
DB_PASSWORD=       
DB_NAME=
PORT=
JWT_SECRET=
JWT_ACCESS_EXPIRATION=
JWT_ACCESS_EXPIRATION=
```

For the `JWT_ACCESS_EXPIRATION`, `JWT_ACCESS_EXPIRATION` variables, make sure they are in the [vercel/ms](https://github.com/vercel/ms) format.

## To run the app, follow these simple instructions:

Prerequisites: make sure `docker` is up and running.

```shell
npm install
npm run build
sh start_db.sh
npm run migration:run
npm run start prod
```

## Automated testing:

### Prerequisites

When running tests, the app connects to `sqlite`, so it needs to be installed on your system.

### Flavors

You have your standard options here. Choose wisely!

```shell
1. npm run test
2. npm run test:cov
3. npm run test:e2e
```

## Manual testing
The Postman collection can be found [here](https://github.com/rjuric/sports-courses-postman/blob/main/README.md).