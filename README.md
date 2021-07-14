# Sell / Buy Property
The :house_with_garden:**_Property-Expert.Com_**:house_with_garden: is a node app/site that handles user registration, authentication & authorization with [JWT](https://www.npmjs.com/package/jsonwebtoken), home sell data in api form as well as user home interest data.

Here is the [REPO](https://github.com/ranjit95s/property-expert).

Here is the [DEMO](https://property-expert.herokuapp.com/).

### How it works?

  Registered users are stored in mongoDB and their password is hashed by bcrypt. When the user POSTs their credentials to the server, they recieve 1 Json Web Token (access token & that will exprire certain time later!).
for safety purpose we are using firebase phone auth to verify user and then after proccesed next task.
On the client side user have to re-login if token is exprire.
The :house_with_garden: **_Property-Expert.Com_** :house_with_garden: allow user to SELL(post) there Property Details and Property will display on site then user can show there interest in property, after clicking show interest button; user details along with property details save to dbs thats all we have in it

-----

### Installation
```bash
git clone https://github.com/ranjit95s/property-expert.git
cd property-expert
npm i
npm start
npm run dev
```

### Routers

| No  | Method | Endpoint          | Description                                                                      |
|-----|--------|-------------------|----------------------------------------------------------------------------------|
| #1  | `POST` | `/signup`         | Creates a new user in MongoDB and returns it with status 201                     |
| #2  | `POST` | `/verify`         | User have to verify his/her phone number then after can Browse through this site |
| #3  | `POST` | `/login`          | User login after successfully signup                                             |
| #4  | `GET`  | `/property`       | All user uploaded property appears here                                          |
| #5  | `GET`  | `/home?h=home.id` | Each property full details appear here with home ID,(homeID generate automatically after posting property)|
| #6  | `POST` | `/post-property`  | User can post property here                                                      |
| #7  | `GET`  | `/User?_id`       | Registered users information + **_User can change his/her avatar_**              |
| #8  | `POST` | `/logout`         | Registered users can logout and after can login with same registered information |
| #9  | `GET`  | `/aboutmore`      | About page                                                                       |
| #10 | `POST` | `/contact`        | Only registered user can send message                                            |
| #10 | `GET` | `/database/`       | API DATA   |
| #11 | `POST` | `/deptlogin/`     | Department login For stuff only , for deleting , adding , editing infomation and contacting to user that interesting buying or renting homes|



| No  | Request Body                         | Response Body                   |
| --- | ------------------------------------ | ------------------------------- |
| #1  | { username, email, password }        | { username, email, createdAt }  |
| #2  | { userphone , OTP verify code }      | { userphone , Auth userPhone No. }|
| #3  | { email, password }                  | { access_token }                 |
| #4  | { expaire_token }                    | { User have to login to get { access_token }}|
| #5  | Authorization: Bearer <access_token> | User id that is logged in       |


### Configuration
Configuration should made in the .env file, before run. .env.example file is below:
```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/<db_name>
```

### Project Structure

```bash
.
├── public
│   ├── css                    // All css styles
│   │   ├── 404.css
│   │   ├── abouts.css
│   │   ├── contact.css
│   │   ├── footer.css
│   │   ├── AdminSetUp.css
│   │   ├── homeInt.css
│   │   ├── mod-home.css
│   │   ├── userdata.css
│   │   ├── home.css
│   │   ├── index-style.css
│   │   ├── login.css
│   │   ├── navbar.css
│   │   ├── postprop.css
│   │   ├── prop-style.css
│   │   ├── style.css
│   │   ├── user.css
│   ├── images                 // All images
│   │   └── ... 
│   ├── js                     // All js scripts
│   │   ├── home.js
│   │   ├── main.js
│   │   ├── mainlog.js
│   │   ├── post-prop.js
│   │   ├── user.js
│   └── └── verifyOtp.js
├── src                       // Source Folder
│   ├── db                    
│   │   └── conn.js           // Database connection
│   ├── middleware
│   │   └── auth.js           // Authentication of user
│   ├── models                // Mongoose schema
│   │   ├── home.js           // Home schema
│   │   ├── homeInterest.js   // home Interest schema
│   │   ├── message.js        // Message schema
│   │   └── user.js           // User schema
│   └── app.js 
├── templates
│   ├── views
│   │   ├── 404.ejs
│   │   ├── PostProperty.ejs
│   │   ├── aboutmore.ejs
│   │   ├── contact.ejs
│   │   ├── footer.ejs
│   │   ├── home.ejs
│   │   ├── index.ejs
│   │   ├── login.ejs
│   │   ├── navbar.ejs
│   │   ├── properties.ejs
│   │   ├── signup.ejs
│   │   ├── user.ejs
│   │   ├── database.ejs
│   │   ├── deptlogin.ejs
│   │   ├── homeData.ejs
│   │   ├── homeInt.ejs
│   │   ├── userDB_Msg.ejs
│   │   ├── usersData.ejs
│   └── └── verifyOtp.ejs
├── .env
├── .gitignore
├── README.md
├── package-lock.json
└── package.json
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

