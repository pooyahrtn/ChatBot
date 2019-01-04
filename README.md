# How Can I Help You? 
## An intelligent chat bot, written for Peeyade

# Procedure
## Populate Database

1. **Add questions**: </br>
    Questions are things come from server. they can be greeting, or the end converstation.</br>
    by POST [/add_quesition]() you can add this converstations.
    later we will add possible answers to it.
    post params are 
    ```javascript 
    {
        "text": "text you wanna ask, or tell.", // min_length=10 *required*
        "is_starter": "if it's greeting"
    }
    ```

2. **Add possible answers**: </br>
   
    After you entered appropriate questions, you should add possible answers.<br>
    Each possible should has a specific type, which can be image, text, voice or video.<br>
    If answer type is an option, you should pass **is_option** proprty to true, and backend expect you
    to pass **body** parameter.<br>
    **For not text** types, body is the url of the content you wanna show to user.<br>
    **IMPORTANT**: if you not pass the next_question, converstaion will be ended.
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

