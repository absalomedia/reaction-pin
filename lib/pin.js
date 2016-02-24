Meteor.Pin = {
  setup: function () {
    const settings = ReactionCore.Collections.Packages.findOne({
      name: "reaction-pin"
    }).settings;
    if (!settings.key) {
      throw new Meteor.Error(403, "Invalid Pin Payement Credentials");
    }
    return settings;
  },
  authorize: function (cardInfo, paymentInfo, callback) {
    Meteor.call("pinSubmit", "authorize", cardInfo, paymentInfo,
      callback);
  },
  capture: function(transactionId, amount, callback) {
    var captureDetails;
    // TODO: This may need to be somewhere more apparant
    // Amount must be an integer for stripe ($19.99 => 1999)
    captureDetails = {
      amount:  Math.round(amount * 100)
    };
    Meteor.call("pinCapture", transactionId, captureDetails, callback);
  },
  refund: function(transactionId, amount, callback) {
    let refundDetails = {
      charge: transactionId,
      amount:  Math.round(amount * 100),
      reason: "requested_by_customer"
    };
    Meteor.call("pinRefund", refundDetails, callback);
  },
  refunds: (transactionId, callback) => {
    Meteor.call("pin/refunds/list", transactionId, callback);
  },
  config: function (options) {
    this.setup = options;
  },
  chargeObj: function () {
    return {
      amount: "",
      currency: "",
      card: {},
      capture: true
    };
  },
  parseCardData: function (data) {
    return {
      number: data.number,
      name: data.name,
      cvc: data.cvv2,
      exp_month: data.expire_month,
      exp_year: data.expire_year
    };
  }
};
