/*
 *  Meteor.settings.pin =
 *    production: false  #sandbox
 *    key: ""
 *  see: https://pin.net.au/docs/api
 */
ReactionCore.Schemas.PinPackageConfig = new SimpleSchema([
  ReactionCore.Schemas.PackageConfig, {
    "settings.production": {
      type: Boolean,
      defaultValue: false
    },
    "settings.key": {
      type: String,
      label: "Pin API key"
    }
  }
]);

ReactionCore.Schemas.PinPayment = new SimpleSchema({
  payerName: {
    type: String,
    label: "Cardholder name"
  },
  cardNumber: {
    type: String,
    min: 14,
    max: 16,
    label: "Card number"
  },
  expireMonth: {
    type: String,
    max: 2,
    label: "Expiration month"
  },
  expireYear: {
    type: String,
    max: 4,
    label: "Expiration year"
  },
  cvv: {
    type: String,
    max: 4,
    label: "CVV"
  }
});

ReactionCore.Schemas.PinPayment.messages({
  "regEx payerName": "[label] must include both first and last name"
});
