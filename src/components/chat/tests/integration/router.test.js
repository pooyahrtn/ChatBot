/* eslint-disable camelcase */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../../../../index');
const questions = require('../../model/question');


const sandbox = sinon.createSandbox();


/**
 * ADMIN routers
 */
describe('Admin Panel API', () => {
    let questionBody;


    beforeEach(async () => {
        questionBody = {
            text: 'this is the title of the question',
            is_starter: false,
            is_the_end: false,
        };
        await questions.Question.deleteMany({});
    });

    afterEach(() => sandbox.restore());

    describe('POST /add_question', async () => {
        const url = '/add_question';
        it('should not allow if text is empty', () => {
            questionBody.text = '';
            return request(app)
                .post(url)
                .send(questionBody)
                .expect(httpStatus.BAD_REQUEST);
        });
        it('should have appropriate response', () => request(app)
            .post(url)
            .send(questionBody)
            .expect(httpStatus.OK)
            .then((res) => {
                const {
                    is_starter, is_the_end, _id, text,
                } = res.body;

                expect(is_starter).to.equal(questionBody.is_starter);
                expect(text).to.equal(questionBody.text);
                expect(is_the_end).to.equal(questionBody.is_the_end);
                expect(_id).not.to.be.an('object');
            }));
    });
});
