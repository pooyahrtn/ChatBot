const express = require('express');
const validate = require('express-validation');
const validators = require('./validators');
const _ = require('lodash');
const serializers = require('./serializers');

const { questions, converstations } = require('./model');

const router = express.Router();

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

// ################ FOR ADMIN #####################
/** 
 * TODO: add admin validator
 * this is for Admin users, to add new questionns. 
 */
router.post('/add_question', validate(validators.addQuestion), async (req, res) => {
    const data = _.pick(req.body, ['is_starter', 'text']);
    const question = await questions.Question.create(data);
    res.send(question);
});

// router.post('/add_answer', )

module.exports = router;
