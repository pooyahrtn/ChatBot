const express = require('express');
const validate = require('express-validation');
const validators = require('./validators');
const _ = require('lodash');
const serializers = require('./serializers');
const httpStatus = require('http-status');

const { questions, converstations } = require('./model');

const router = express.Router();

/**
 * @api {post} /start StartConverstation
 * @apiDescription Start a new converstation
 * @apiVersion 1.0.0
 * @apiName StartConverstation
 * @apiGroup Chat
 * @apiPermission public
 * @apiSuccess (OK 200) {ObjectId}  session                    Session Id, which used next for chat
 * @apiSuccess (OK 200) {String}    question.text              Question Text
 * @apiSuccess (OK 200) {String}    question.expected_answers.body_type     Expected answer type
 */
router.post('/start', async (_req, res) => {
    const question = await questions.methods.greeting();
    const conv = new converstations.Converstation();

    converstations.methods.addQuestion(conv, question);
    await conv.save();

    res.send({
        session: conv._id,
        question: serializers.questionSerializer(question),
    });
});


/**
 * @api {post} /answer/:session_id Answer to last Question
 * @apiDescription Start a new converstation
 * @apiVersion 1.0.0
 * @apiName Answer Question
 * @apiGroup Chat
 * @apiPermission public
 * @apiSuccess (OK 200) {Question} ... return next question
 * 
 * @apiError (BadRequest 400)    BadRequest     If converstation id that mentioned is invalid
 * @apiError (BadRequest 400)    BadRequest     If converstaion is ended
 * @apiError (BadRequest 400)    BadRequest     If answer type is not optional, but body is empty
 */
router.post('/answer/:session_id', validate(validators.answer), async (req, res) => {
    // lets find the converstation first
    const converstation = await converstations.Converstation.findById(req.params.session_id);
    if (!converstation) {
        return res.status(httpStatus.BAD_REQUEST).send('not valid converstation');
    }
    if (converstation.is_ended) {
        return res.status(httpStatus.BAD_REQUEST).send('converstation is ended');
    }
    const lastQuestionId = converstation.chats[converstation.chats.length - 1];
    // the question is the last chat in chats
    const question = await questions.Question.findById(lastQuestionId);

    const answer = questions.methods.findAnswer(question, req.body.answer_id);
    
    if (!answer) {
        return res.status(httpStatus.BAD_REQUEST).send('not valid answer');
    }
    if (!answer.is_option) {
        // this is not an option. so we need to feel the body.
        if (!req.body.body) {
            return res.status(httpStatus.BAD_REQUEST).send('body should not be null');
        }
        // so we are good. lets just create a clone of answer and add it to the converstation.
        const userAnswer = {
            ...answer.toObject(),
            body: req.body.body,
        };
        converstations.methods.addAnswer(converstation, userAnswer);
    } else {
        // it's just an option, so we are good with default answer
        converstations.methods.addAnswer(converstation, answer);
    }

    // now give me next question
    const nextQuestion = await questions.Question.findById(answer.next_question);

    if (!nextQuestion) {
        // so converstation is ended
        converstation.is_ended = true;
    } else {
        // append it to the chats
        converstations.methods.addQuestion(converstation, nextQuestion);
    }

    await converstation.save();
    return res.send(nextQuestion);
});

router.get('/converstation/:session_id', validate(validators.showConverstation), async (req, res) => {
    const converstation = await converstations.Converstation.findById(req.params.session_id);
    if (!converstation) {
        return res.status(httpStatus.NOT_FOUND).send();
    }
    return res.send(converstation);
});

// ################ FOR ADMIN #####################
/** 
 * TODO: add admin validator
 * this is for Admin users, to add new questions. 
 */
router.post('/add_question', validate(validators.addQuestion), async (req, res) => {
    const data = _.pick(req.body, ['is_starter', 'text']);
    const question = await questions.Question.create(data);
    res.send(question);
});


router.post('/add_answer', validate(validators.addAnswer), async (req, res) => {
    const question = await questions.Question.findById(req.body.question_id);
    if (!question) {
        return res.status(httpStatus.BAD_REQUEST).send('not valid question');
    }
    const answer = _.pick(req.body, ['body_type', 'body', 'is_option', 'next_question', 'hint']);
    if (answer.is_option && !answer.body) {
        return res.status(400).send('body should not be null');
    }
    questions.methods.addPossibleAnswer(question, answer);
    const savedQuestion = await question.save();
    return res.send(savedQuestion);
});

router.get('/all_questions', async (_req, res) => {
    const results = await questions.Question.find({});
    res.send(results);
});

module.exports = router;
