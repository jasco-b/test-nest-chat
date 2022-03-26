
<p  align="center">

<a  href="http://nestjs.com/"  target="blank"><img  src="https://nestjs.com/img/logo_text.svg"  width="320"  alt="Nest Logo"  /></a>

</p>

  

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

  

## Description
 
 Nest +typeorm + socket.io +postgresql chat showcase. Nest socket.io validation, class transform, sending notification (event, message) to other users. Uploading file via socket and more
 
## Installation

### Method 1 docker
 ```docker-compose build	```
  
  ### Method 2 
  ```npm install```

## Running the app

You can run app with docker or standalone

### Running with docker
 ```docker-compose build	```
### Running stand alone
Before running make changes for DB connection.
``` vi ormconfig.json```

#### Run...

```bash

# development

$ npm run start

  

# watch mode

$ npm run start:dev

  

# production mode

$ npm run start:prod

```

  

## Test
  At the moment no tests :(

## Issue
IF you find any error or bug just open an issue or make a pull request

## License

Project is [MIT licensed](LICENSE).
