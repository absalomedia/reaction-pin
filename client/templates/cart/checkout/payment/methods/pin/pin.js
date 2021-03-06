var handlePinSubmitError, hidePaymentAlert, paymentAlert, submitting, uiEnd;

uiEnd = function(template, buttonText) {
  template.$(":input").removeAttr("disabled");
  template.$("#btn-complete-order").text(buttonText);
  return template.$("#btn-processing").addClass("hidden");
};

paymentAlert = function(errorMessage) {
  return $(".alert").removeClass("hidden").text(errorMessage);
};

hidePaymentAlert = function() {
  return $(".alert").addClass("hidden").text('');
};

handlePinSubmitError = function(error) {
  var serverError, singleError;
  singleError = error;
  serverError = error != null ? error.message : void 0;
  if (serverError) {
    return paymentAlert("Oops! " + serverError);
  } else if (singleError) {
    return paymentAlert("Oops! " + singleError);
  }
};

submitting = false;

AutoForm.addHooks("pin-payment-form", {
  onSubmit: function(doc) {
    var form, storedCard, template;
    submitting = true;
    template = this.template;
    hidePaymentAlert();
    form = {
      name: doc.payerName,
      number: doc.cardNumber,
      expire_month: doc.expireMonth,
      expire_year: doc.expireYear,
      cvv2: doc.cvv,
      type: getCardType(doc.cardNumber)
    };
    storedCard = form.type.charAt(0).toUpperCase() + form.type.slice(1) + " " + doc.cardNumber.slice(-4);
    Meteor.Pin.authorize(form, {
      total: ReactionCore.Collections.Cart.findOne().cartTotal(),
      currency: ReactionCore.Collections.Shops.findOne().currency
    }, function(error, transaction) {
      var normalizedMode, normalizedStatus, paymentMethod;
      submitting = false;
      if (error) {
        handlePinSubmitError(error);
        uiEnd(template, "Resubmit payment");
      } else {
        if (transaction.saved === true) {
          normalizedStatus = (function() {
            switch (false) {
              case !(!transaction.response.captured && !transaction.response.failure_code):
                return "created";
              case !(transaction.response.captured === true && !transaction.response.failure_code):
                return "settled";
              case !transaction.response.failure_code:
                return "failed";
              default:
                return "failed";
            }
          })();
          normalizedMode = (function() {
            switch (false) {
              case !(!transaction.response.captured && !transaction.response.failure_code):
                return "authorize";
              case !transaction.response.captured:
                return "capture";
              default:
                return "capture";
            }
          })();
          paymentMethod = {
            processor: "Pin",
            storedCard: storedCard,
            method: transaction.response.source.funding,
            transactionId: transaction.response.id,
            amount: transaction.response.amount * 0.01,
            status: normalizedStatus,
            mode: normalizedMode,
            createdAt: new Date(transaction.response.created),
            transactions: []
          };
          paymentMethod.transactions.push(transaction.response);
          Meteor.call("cart/submitPayment", paymentMethod);
        } else {
          handlePinSubmitError(transaction.error);
          uiEnd(template, "Resubmit payment");
        }
      }
    });
    return false;
  },
  beginSubmit: function() {
    this.template.$(":input").attr("disabled", true);
    this.template.$("#btn-complete-order").text("Submitting ");
    return this.template.$("#btn-processing").removeClass("hidden");
  },
  endSubmit: function() {
    if (!submitting) {
      return uiEnd(this.template, "Complete your order");
    }
  }
});
