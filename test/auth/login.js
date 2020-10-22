/* eslint-env mocha */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');

chai.should();

chai.use(chaiHttp);

describe('Login', () => {
    describe('GET /login (index)', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/login")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.msg.should.be.an("string");

                    done();
                });
        });
    });

    describe('POST /login (Login user successfully)', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/login")
                .set("Content-Type", "application/json")
                .send({ email: "test@bjos19.me", password: "test"})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.type.should.be.equal("success");

                    done();
                });
        });
    });

    describe('POST /login (Login user without password)', () => {
        it('401 Error', (done) => {
            chai.request(server)
                .post("/login")
                .set("Content-Type", "application/json")
                .send({ email: "test@bjos19.me", password: ""})
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.title.should.be.equal("Email or password missing");

                    done();
                });
        });
    });

    describe('POST /login (Login user with wrong password)', () => {
        it('401 Error', (done) => {
            chai.request(server)
                .post("/login")
                .set("Content-Type", "application/json")
                .send({ email: "test@bjos19.me", password: "frdshh"})
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.title.should.be.equal("Wrong password");

                    done();
                });
        });
    });

    describe('POST /login (Login with wrong username)', () => {
        it('401 Error', (done) => {
            chai.request(server)
                .post("/login")
                .set("Content-Type", "application/json")
                .send({ email: "test@bth.me", password: "frdshh"})
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.title.should.be.equal("User not found");

                    done();
                });
        });
    });
});
