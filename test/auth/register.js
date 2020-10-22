/* eslint-env mocha */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');

chai.should();

chai.use(chaiHttp);

describe('Register user', () => {
    describe('GET /register/', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/register/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.msg.should.be.an("string");
                    res.body.data.msg.should.be.equal("Register a user");

                    done();
                });
        });
    });


    describe('POST /register (create a user)', () => {
        it('201 Created', (done) => {
            chai.request(server)
                .post("/register")
                .send({ email: "test@test.test", password: "test" })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.data.msg.should.be.an("string");
                    res.body.data.msg.should.be.equal("User successfully registered");

                    done();
                });
        });
    });

    describe('POST /register (create a user without password)', () => {
        it('401 Error', (done) => {
            chai.request(server)
                .post("/register")
                .send({ email: "test@te.te" })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.title.should.be.an("string");
                    res.body.errors.title.should.be.equal("Email or password missing");

                    done();
                });
        });
    });

    describe('POST /register (create a that already exists)', () => {
        it('500 Error', (done) => {
            chai.request(server)
                .post("/register")
                .send({ email: "test@test.test", password: "test" })
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.an("object");
                    res.body.errors.title.should.be.an("string");
                    res.body.errors.title.should.be.equal("Database error");

                    done();
                });
        });
    });
});
