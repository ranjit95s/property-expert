# Sell / Buy Property
The :house_with_garden:**_Property-Expert.Com_**:house_with_garden: is a node app/site that handles user registration, authentication & authorization with [JWT](https://www.npmjs.com/package/jsonwebtoken), home sell data in api form as well as user home interest data.

Here is the [REPO](https://github.com/ranjit95s/property-expert).

Here is the [DEMO](https://property-expert.herokuapp.com/).

### How it works?
Registered users are stored in mongoDB and their password is hashed by bcrypt. When the user POSTs their credentials to the server, they recieve 1 Json Web Token (access token & that will exprire certain time later!).

for safety purpose we are using firebase phone auth to verify user and then after proccesed next task.
On the client side user have to re-login if token is exprire.
The :house_with_garden:**_Property-Expert.Com_**:house_with_garden: allow user to SELL(post) there Property Details and Property will display on site then user can show there interest in property, after clicking show interest button; user details along with property details save to dbs thats all we have in it
-----

### Installation
```bash
git clone https://github.com/ranjit95s/property-expert.git
cd property-expert
npm i
npm start
```

### API

| No  | Method | Endpoint    | Description                                                                   |
| --- | ------ | ----------- | ----------------------------------------------------------------------------- |
| #1  | `POST` | `/signup`   | Creates a new user in MongoDB and returns it with status 201                  |
| #2  | `POST` | `/login`    | Returns access & refresh tokens if user credentials is valid                  |
| #3  | `POST` | `/token`    | Returns a new access token if refresh token in body is verified               |


| No  | Request Body                         | Response Body                   |
| --- | ------------------------------------ | ------------------------------- |
| #1  | { username, email, password }        | { username, email, createdAt }  |
| #2  | { email, password }                  | { access_token, refresh_token } |
| #3  | { refresh_token }                    | { access_token }                |
| #4  | Authorization: Bearer <access_token> | User id that is logged in       |


### Configuration
Configuration should made in the .env file, before run. .env.example file is below:
```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/<db_name>
ACCESS_TOKEN_EXPIRES_IN=5m
ACCESS_TOKEN_SECRET=c1ec3791140abfdddd...
REFRESH_TOKEN_EXIPRES_IN=1d
REFRESH_TOKEN_SECRET=2a4de696eb12838bc...
```

### Scripts

1. ACCESS_TOKEN_SECRET & REFRESH_TOKEN_SECRET (both should be **different**) can be securely created with:
```bash
npm run secret  # returns secret, paste it in .env
```
2. MongoDB connection can be tested with:
```bash
npm run dbtest
```
3. Start authentication-server:
```bash
npm start
```
4. Start development server with nodemon:
```bash
npm run dev
```


### Project Structure

```bash
.
├── src                       // Source Folder
│   ├── controllers           // Controllers in the API
│   │   ├── index.js
│   │   ├── login.js          // No: #1 /login
│   │   ├── register.js       // No: #2 /register
│   │   └── tokenRefresh.js   // No: #3 /token 
│   ├── public
│   │   └── index.html        // Mini User Interface built with vue
│   ├── authRouter.js         // All routings 
│   ├── middleware.js         // Authorize user with access token in header
│   ├── mongo.js              // Initialize MongoDB connection
│   ├── token.js              // Token Utils. Creates and verifies JWT
│   ├── userModel.js          // Mongoose Model and Schema
│   └── validation.js         // Joi validation for User Model
├── test
│   ├── mongoConnection.js    // "npm run dbtest" executes this
│   └── ...                   // login and regiter tests
├── .env.exmaple              // Rename it with ".env"
├── index.js                  // Entry file
└── server.js                 // authentication-server app
```


### User Interface
Mini user interface is build with vue.js to show up what is going on.
Available on root "/". It can be removed from server.js file.
![Screenshot_2021-05-02 authentication-sever User Interface](https://user-images.githubusercontent.com/39749730/116825809-808cf700-ab99-11eb-8b30-98a5cfbc8f3e.png)
![Screenshot_2021-05-02 authentication-sever User Interface(1)](https://user-images.githubusercontent.com/39749730/116825812-8256ba80-ab99-11eb-9e98-9f9741344224.png)

### User Model
User Model is created with [mongoose](https://www.npmjs.com/package/mongoose) in userModel.js.
userModel = { username, email, password }

### Hash Password
Password is hashed with [bcryptjs](https://www.npmjs.com/package/bcryptjs).
For performance see also: [bcrypt](https://www.npmjs.com/package/bcrypt).

### Validations
Implemented with [joi](https://joi.dev/api/?v=17.4.0) in validation.js
There are 2 validations(register and login) for request body.

### Middleware
The isAuthenticated middleware verifies the jwt in authorization header.
Simplified version of [express-jwt](https://www.npmjs.com/package/express-jwt).
Used in /validate endpoint for testing purposes.

### Logger
Logging made with [morgan](https://www.npmjs.com/package/morgan).
The formats is "tiny". In server.js file it can be customized.

### Todos
- Refresh tokens can be saved in storage like redis or mongoDB
- Login or Register limitation by ip address
- Add JWT claims like iss, sub, aud...
- Email verification
- Login with username instead of email

