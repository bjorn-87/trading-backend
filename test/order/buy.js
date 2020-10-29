/* eslint-env mocha */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');
const middleware = require('../../middleware/index.js');

chai.should();

chai.use(chaiHttp);
describe('Orders, buy', () => {
    var token = middleware.createToken("test@bjos19.me");

    describe('POST /order/buy (Buy stock)', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/order/buy")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({
                    user: "test@bjos19.me",
                    stock: "Salt sill",
                    price: 2,
                    amount: 2
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");

                    done();
                });
        });

        it('200 HAPPY PATH (check account after buy)', (done) => {
            chai.request(server)
                .post("/user/")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({ user: "test@bjos19.me" })
                .end((err, res) => {
                    // console.log(res.body.data);
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.account.should.be.equal(6);

                    done();
                });
        });
    });

    describe('POST /order/buy (Get status 401)', () => {
        it('401 error', (done) => {
            chai.request(server)
                .post("/order/buy")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({
                    stock: "Salt sill",
                    price: 2
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");

                    done();
                });
        });
    });

    describe('POST /order/buy (Buy with user that does not exist)', () => {
        it('500 error', (done) => {
            chai.request(server)
                .post("/order/buy")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({
                    user: "test",
                    stock: "Salt sill",
                    price: 2,
                    amount: 1
                })
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.an("object");
                    res.body.errors.detail.should.be.equal("Not enough money to buy");

                    done();
                });
        });
    });

    describe('POST /order/buy (Try to update account with string/specialsign)', () => {
        it('500 error', (done) => {
            chai.request(server)
                .post("/order/buy")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({
                    user: "test@bjos19.me",
                    stock: "Salt sill",
                    price: "@",
                    amount: 1
                })
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.an("object");

                    done();
                });
        });
    });

    describe('POST /order/buy (Buy stock thats not in portfolio)', () => {
        it('201 created', (done) => {
            chai.request(server)
                .post("/order/buy")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({
                    user: "test@bjos19.me",
                    stock: "Skolkrita",
                    price: 1,
                    amount: 1
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");

                    done();
                });
        });

        it('200 HAPPY PATH (check account after buy)', (done) => {
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
});
