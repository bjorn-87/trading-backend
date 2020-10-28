/* eslint-env mocha */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');
const middleware = require('../../middleware/index.js');

chai.should();

chai.use(chaiHttp);
describe('/user/, getAccount', () => {
    var token = middleware.createToken("test@bjos19.me");

    describe('Post /user/ (get account)', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/user/")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({ user: "test@bjos19.me" })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");

                    done();
                });
        });
    });

    describe('Post /user/ (User does not exist)', () => {
        it('404 Not found', (done) => {
            chai.request(server)
                .post("/user/")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({ user: "test@bjos19" })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.an("object");
                    res.body.data.text.should.be.equal("404 Page not found");

                    done();
                });
        });
    });
});
