/* eslint-env mocha */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');
const middleware = require('../../middleware/index.js');

chai.should();

chai.use(chaiHttp);
describe('Post get orders', () => {
    var token = middleware.createToken("test@bjos19.me");

    describe('POST /order (Get all orders)', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/order")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({ user: "test@bjos19.me"})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");

                    done();
                });
        });
    });


    describe('POST /order (No orders)', () => {
        it('Status 200', (done) => {
            chai.request(server)
                .post("/order")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({ user: ""})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.length.should.be.equal(0);

                    done();
                });
        });
    });

    describe('POST /order (No token 500 error)', () => {
        it('Error 500', (done) => {
            chai.request(server)
                .post("/order")
                .set("Content-Type", "application/json")
                .set("x-access-token", "")
                .send({ user: ""})
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.an("object");
                    res.body.errors.detail.should.be.equal("jwt must be provided");

                    done();
                });
        });
    });
});
