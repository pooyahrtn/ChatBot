# How Can I Help You? 
## An intelligent chat bot, written for Peeyade

# How To Use
## Populate Database

1. **Add questions**: </br>
    Questions are things come from the server. they can be a greeting message, or the end converstation.</br>
    by POST [/add_quesition]() you can add this converstations.
    later we will add possible answers to it.
    post params are 
    ```javascript 
    {
        "text": String, // REQUIRED min_length=10 the question, or message you wanna show
        "is_starter": Boolean
    }
    ```

2. **Add possible answers**: </br>
   
    After you entered appropriate questions, you should add the possible answers.<br>
    Each possible answer should has a specific type, which can be an image, text, voice or video.<br>
    If the answer type is an option, you should pass **is_option** proprty to true, and backend expect you
    to pass **body** parameter.<br>
    **For not text** types, body is the url of the content you wanna show to user.<br>
    **IMPORTANT**: if you not pass the next_question, the converstaion will be ended.
     POST [/add_answer]()
    ```javascript 
    {
        "question_id": ObjectID,    // REQUIRED question id, whose this answer belongs to
	    "body_type": String         // REQUIRED enum('im', 'te', 'vo', 'vi'),
	    "is_option": Boolean,       // REQUIRED
	    "next_question": ObjectID,  // REQUIRED next question, to redirect user to
    }
    ```

    Created answer will be added to the question **expected_answers** property.

## Client

1. **Start A Converstation**: <br>
    First we should start a converstation with  POST [/start]() <br>
    This will create a converstation, and return **converstation id** and **Greetin message** 
    ```javascript
    // response body
    {
        "session": ObjectId, //used for further chats,
        "question": {
            "text": String, // question text
            "expected_answers": [
                "_id": ObjectId,        // will be used to answer questions
                "body_type": String,    // enum('im', 'te', 'vo', 'vi') 
                                        // used to help client properly show the content 
                "is_option": Boolean,   // if is true, user has to send body
            ]
        }
    }
    ```

2. **Answer A Question**: <br>
    After Each question, user should send an answer, which is provided in **expected_answers**.<br>
    Client should POST [/answer/:session_id]() <br>
    ```javascript
    // Request Body
    {
        "answer_id": ObjectId,  // REQUIRED the answer selected from expected answers
        "body": String,         // REQUIRED if the answer is_optional
    }
    ```
    Response is the next question, same structure as the /start response's question.

3. **Show The Whole Converstation** :<br>
    Client always can see the converstation, made with server by calling 
    [converstation/:session_id]().
    ```javascript
        // Response
    {
            "is_ended": Boolean, // If converstation is ended.
            "_id": ObjectId,     // Converstation id
            "chats": [
                {
                    "time": Date,
                    "_id": ObjectID , 
                    "sender": String, //enum('us','se') if it's from server or user
                    "message": {
                        "_id": ObjectID,
                        "body": String,         // text or url of the content
                        "message_type" : String // type of message 
                    }
                },
            ],
            "start_time": "2019-01-04T12:28:49.227Z",
    }
    ```
    <br>

# About The Architecture
We have two main models:
* **Question**: Messages send from server, are stored here. Each question has a list of **possible answers**.
</br> In order to answer a question, user should return a "possible answer" of that question.
</br> **Possible Answer** can be an option, so the body is defined by the server, and can be text or url of some medias content.
* **Converstation**: They created when user want to start new converstation, and has **chats** property to store that converstation messages.
</br> **chat** object contains a *sender* property shows, if message is from 'server' or 'user', and *body* property,
shows message content. In order to track questions and answers later, I stored the original question or answer _id as chat _id.
#### Assumption
I assumed converstations length are not great, so I stored them into Converstation object.

#### A Problem
Current implementation, supports only one option as an answer. The problem is, for example if you have n options, to answer, to direct the user to next question, we should consider 2<sup>n</sup> - 1 conditions.


# About The Code
## Folder Structure 
  Folder Structure is inspired of Django framework. I tried to [seperate logics by components](https://github.com/i0natan/nodebestpractices/blob/master/sections/projectstructre/breakintcomponents.md).<br>

### Component
Each component is a role in our application. like User, Chat, Notification or ...

#### src/components/chat
Each component contains: <br>
* **/model**: where models, schemas and model-methods placed here <br>
* **/tests**: unit and integrity tests placed here
* **/serializers**: it can be a folder or a file, used to select fields from object, to show neccessary fields, if whole the object is loaded.
* **validators.js**: used to validate request params, body, query ...
* **router.js**: route requests to appropriate controller
* **/controllers**: I did'nt use for this application, but it's very helpful to seperate controller logis in seperated files, so we have cleaner code.

### src/config
Here I placed app configs
* **express.js**: Append plugins and routers here.
* **router**: Here we add components routers to the app.
* **vars**: It reads and converts enviroment variables to structured "env" object.
* **logger**: uses winston and return a logger object to log.
* **Joi**: just add ObjectID validator to joi
* **error**: we converts error to a uniform shape.
* **mongoose**: mongoose configuration

### src/utils
Where common utils placed here

### src/index.js
Entry point of app. There is a spectial thing happened here:
```javacript
    require('express-async-errors');

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
```
Now in if our throw an exception, it will be route to error router. And also we treat unhandled rejections
like exceptions, to handle all possible errors.

## Special Packages
* **apidocs**: this package create a beautiful api doc from @api docs we used for our routers.

## Scripts

# Add enviroment variables
    cp .env.example .env
# Run Locally
    yarn dev
# Test
    yarn test
# Documentation
    yarn docs
# Docker

    yarn docker:dev
    or
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

    # run container in production
    yarn docker:prod
    or
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

    # run tests
    yarn docker:test
    or
    docker-compose -f docker-compose.yml -f docker-compose.test.yml up
