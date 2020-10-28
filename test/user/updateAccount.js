/* eslint-env mocha */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');
const middleware = require('../../middleware/index.js');

chai.should();

chai.use(chaiHttp);
describe('/user/account, updateAccount', () => {
    var token = middleware.createToken("test@bjos19.me");

    describe('PUT /user/account (Insert into account)', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .put("/user/account")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({
                    user: "test@bjos19.me",
                    money: 3,
                    type: "insert"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.msg.should.be.equal("Money inserted successfully");

                    done();
                });
        });

        it('200 HAPPY PATH (Check account after insert)', (done) => {
            chai.request(server)
                .post("/user/")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({ user: "test@bjos19.me" })
                .end((err, res) => {
                    // console.log(res.body.data);
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.account.should.be.equal(10);

                    done();
                });
        });
    });

    describe('PUT /user/account (Withdraw from account)', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .put("/user/account")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({
                    user: "test@bjos19.me",
                    money: 5,
                    type: "withdraw"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.msg.should.be.equal("Money withdraw was a success");

                    done();
                });
        });

        it('200 HAPPY PATH (Check account after withdraw)', (done) => {
            chai.request(server)
                .post("/user/")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({ user: "test@bjos19.me" })
                .end((err, res) => {
                    // console.log(res.body.data);
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.account.should.be.equal(5);

                    done();
                });
        });
    });

    describe('PUT /user/account (Insert into account with empty string)', () => {
        it('500 error', (done) => {
            chai.request(server)
                .put("/user/account")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({
                    user: "test@bjos19.me",
                    money: "",
                    type: "insert"
                })
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.an("object");
                    res.body.errors.title.should.be.equal("Database error");

                    done();
                });
        });

        it('200 HAPPY PATH (Check account after insert)', (done) => {
            chai.request(server)
                .post("/user/")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({ user: "test@bjos19.me" })
                .end((err, res) => {
                    // console.log(res.body.data);
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.account.should.be.equal(5);

                    done();
                });
        });
    });

    describe('PUT /user/account (Withdraw from account with empty string)', () => {
        it('500 error', (done) => {
            chai.request(server)
                .put("/user/account")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({
                    user: "test@bjos19.me",
                    money: "",
                    type: "withdraw"
                })
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.an("object");
                    res.body.errors.title.should.be.equal("Database error");

                    done();
                });
        });

        it('200 HAPPY PATH (Check account after failing withdraw)', (done) => {
            chai.request(server)
                .post("/user/")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({ user: "test@bjos19.me" })
                .end((err, res) => {
                    // console.log(res.body.data);
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.account.should.be.equal(5);

                    done();
                });
        });
    });

    describe('PUT /user/account (Withdraw too much from account)', () => {
        it('401 error', (done) => {
            chai.request(server)
                .put("/user/account")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({
                    user: "test@bjos19.me",
                    money: 100,
                    type: "withdraw"
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.title.should.be.equal("Not enough money");

                    done();
                });
        });

        it('200 HAPPY PATH (Check account after failing withdraw)', (done) => {
            chai.request(server)
                .post("/user/")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({ user: "test@bjos19.me" })
                .end((err, res) => {
                    // console.log(res.body.data);
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.account.should.be.equal(5);

                    done();
                });
        });
    });


    describe('PUT /user/account (Try updateAccount with no type)', () => {
        it('401 error', (done) => {
            chai.request(server)
                .put("/user/account")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({
                    user: "test@bjos19.me",
                    money: 1,
                    type: ""
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.title.should.be.equal("Unauthorized");

                    done();
                });
        });
    });
});
