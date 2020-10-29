/* eslint-env mocha */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');
const middleware = require('../../middleware/index.js');

chai.should();

chai.use(chaiHttp);
describe('Orders, sell', () => {
    var token = middleware.createToken("test@bjos19.me");

    describe('PUT /order/sell (Sell stock)', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .put("/order/sell")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({
                    user: "test@bjos19.me",
                    stock: "Salt sill",
                    price: 1,
                    amount: 2
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.msg.should.be.equal("Order successfully sold");

                    done();
                });
        });

        it('200 HAPPY PATH (check account after sell)', (done) => {
            chai.request(server)
                .post("/user/")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({ user: "test@bjos19.me" })
                .end((err, res) => {
                    // console.log(res.body.data);
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.account.should.be.equal(7);

                    done();
                });
        });
    });

    describe('PUT /order/sell (Get status 401 no User)', () => {
        it('401 error', (done) => {
            chai.request(server)
                .put("/order/sell")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({
                    stock: "Salt sill",
                    price: 2,
                    amount: 1
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");

                    done();
                });
        });
    });

    describe('PUT /order/sell (No stock 401 error)', () => {
        it('401 error', (done) => {
            chai.request(server)
                .put("/order/sell")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({
                    user: "test@bjos19.me",
                    amount: 2,
                    price: 2
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.title.should.be.equal("Unauthorized");

                    done();
                });
        });
    });

    describe('PUT /order/sell (401 error Amount is 0)', () => {
        it('401 error', (done) => {
            chai.request(server)
                .put("/order/sell")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({
                    user: "test@bjos19.me",
                    stock: "Salt sill",
                    price: 2,
                    amount: 0
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.title.should.be.equal("Unauthorized");

                    done();
                });
        });
    });

    describe('PUT /order/sell (500 error No amount)', () => {
        it('500 error', (done) => {
            chai.request(server)
                .put("/order/sell")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({
                    user: "test@bjos19.me",
                    stock: "Salt sill",
                    price: 2
                })
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.an("object");
                    res.body.errors.title.should.be.equal("Database error");

                    done();
                });
        });
    });

    describe('PUT /order/sell (Sell more than user have)', () => {
        it('404 error', (done) => {
            chai.request(server)
                .put("/order/sell")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({
                    user: "test@bjos19.me",
                    stock: "Salt sill",
                    price: 2,
                    amount: 50
                })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.an("object");
                    res.body.errors.title.should.be.equal("Not found");

                    done();
                });
        });

        it('200 HAPPY PATH (check account after try to sell)', (done) => {
            chai.request(server)
                .post("/user/")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({ user: "test@bjos19.me" })
                .end((err, res) => {
                    // console.log(res.body.data);
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.account.should.be.equal(7);

                    done();
                });
        });
    });

    describe('PUT /order/sell (User not found)', () => {
        it('404 error', (done) => {
            chai.request(server)
                .put("/order/sell")
                .set("Content-Type", "application/json")
                .set("x-access-token", token)
                .send({
                    user: "test",
                    stock: "Salt sill",
                    price: 2,
                    amount: 1
                })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.an("object");
                    res.body.errors.title.should.be.equal("Not found");

                    done();
                });
        });
    });
});
