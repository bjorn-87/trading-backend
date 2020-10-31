var stock = {
    saltSill: {
        name: "Salt sill",
        rate: 1.0002,
        variance: 0.4,
        startingPoint: 10,
    },

    skolKrita: {
        name: "Skolkrita",
        rate: 1.0001,
        variance: 0.2,
        startingPoint: 10,
    },

    randomAroundZero: function () {
        return Math.random() > 0.5 ? 1 : -1;
    },

    getStockPrice: function (input) {
        let start = input.startingPoint;
        let rate = input.rate;
        let variance = input.variance;

        return start * rate + variance * stock.randomAroundZero();
    },

    updateStockprice: function (input) {
        let start = input.startingPoint;
        let rate = input.rate;
        let variance = input.variance;

        return start * rate + variance * stock.randomAroundZero();
    }
};

module.exports = stock;
