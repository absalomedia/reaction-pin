 var Fiber, Future, ValidCVV, ValidCardNumber, ValidExpireMonth, ValidExpireYear;

Fiber = Npm.require("fibers");

Future = Npm.require("fibers/future");

Meteor.methods({
  pinSubmit: function (transactionType, cardData, paymentData) {
    var Pin, chargeObj, fut;
    check(transactionType, String);
    check(cardData, {
      name: String,
      number: ValidCardNumber,
      expire_month: ValidExpireMonth,
      expire_year: ValidExpireYear,
      cvv2: ValidCVV,
      type: String
    });
    check(paymentData, {
      total: String,
      currency: String
    });
    Pin = Npm.require("pinjs")(Meteor.Pin.setup());
    chargeObj = Meteor.Pin.chargeObj();
    if (transactionType === "authorize") {
      chargeObj.capture = false;
    }
    chargeObj.card = Meteor.Pin.parseCardData(cardData);
    chargeObj.amount = Math.round(paymentData.total * 100);
    chargeObj.currency = paymentData.currency;
    fut = new Future(
    this.unblock();
    Pin.charges.create(chargeObj, Meteor.bindEnvironment(function (
      error, result) {
      if (error) {
        fut["return"]({
          saved: false,
          error: error
        });
      } else {
        fut["return"]({
          saved: true,
          response: result
        });
      }
    }, function (e) {
      ReactionCore.Log.warn(e);
    }));
    return fut.wait();
  },

  /**
   * Capture a Pin charge
   * @see https://pin.net.au/docs/api/charges
   * @param  {Object} paymentMethod A PaymentMethod object
   * @return {Object} results from Pin normalized
   */
  "pin/payment/capture": function (paymentMethod) {
    check(paymentMethod, ReactionCore.Schemas.PaymentMethod);
    this.unblock();

    let result;
    const pin = Npm.require("pinjs")(Meteor.Pin.setup());
    const capturePayment = Meteor.wrapAsync(pin.charges.capture, pin.charges);
    const captureDetails = {
      amount: Math.round(paymentMethod.amount * 100)
    };

    try {
      const response = capturePayment(paymentMethod.transactionId, captureDetails);
      result = {
        saved: true,
        response: response
      };
    } catch (e) {
      ReactionCore.Log.warn(e);
      result = {
        saved: false,
        error: e
      };
    }

    return result;
  },

  "pin/refund/create": function(paymentMethod, amount) {
    check(paymentMethod, ReactionCore.Schemas.PaymentMethod);
    check(amount, Number);


    let refundDetails = {
      charge: paymentMethod.transactionId,
      amount: Math.round(amount * 100),
      reason: "requested_by_customer"
    };

    var Pin, fut;
    Pin = Npm.require("pinjs")(Meteor.Pin.setup());
    fut = new Future();
    this.unblock();
    Pin.refunds.create(refundDetails, Meteor.bindEnvironment(
      function (error, result) {
        if (error) {
          fut["return"]({
            saved: false,
            error: error
          });
        } else {
          fut["return"]({
            saved: true,
            type: result.object,
            amount: result.amount / 100,
            rawTransaction: result
          });
        }
      },
      function (e) {
        ReactionCore.Log.warn(e);
      }));
    return fut.wait();
  },

  /**
   * List refunds
   * @param  {Object} paymentMethod object
   * @return {Object} result
   */
  "pin/refund/list": function (paymentMethod) {
    check(paymentMethod, ReactionCore.Schemas.PaymentMethod);
    this.unblock();

    let stripe = Npm.require("pinjs")(Meteor.Pin.setup());
    let listRefunds = Meteor.wrapAsync(pin.refunds.list, pin.refunds);
    let result;

    try {
      let refunds = listRefunds({charge: paymentMethod.transactionId});
      result = [];
      for (let refund of refunds.data) {
        result.push({
          type: refund.object,
          amount: refund.amount / 100,
          created: refund.created * 1000,
          currency: refund.currency,
          raw: refund
        });
      }
    } catch (e) {
      result = {
        error: e
      };
    }

    return result;
  }
});

ValidCardNumber = Match.Where(function (x) {
  return /^[0-9]{14,16}$/.test(x);
});

ValidExpireMonth = Match.Where(function (x) {
  return /^[0-9]{1,2}$/.test(x);
});

ValidExpireYear = Match.Where(function (x) {
  return /^[0-9]{4}$/.test(x);
});

ValidCVV = Match.Where(function (x) {
  return /^[0-9]{3,4}$/.test(x);
});
