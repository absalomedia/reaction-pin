Package.describe({
  summary: "Reaction Pin - Pin Payments for Reaction Commerce",
  name: "absalomedia:reaction-pin",
  version: "0.0.1",
  git: "https://github.com/absalomedia/reaction-pin.git"
});

Npm.depends({
  pinjs: "1.0.1"
});

Package.onUse(function (api) {
  api.versionsFrom("METEOR@1.2");

  // meteor base packages
  api.use("meteor-base");
  api.use("mongo");
  api.use("ecmascript");
  api.use("blaze-html-templates");
  api.use("session");
  api.use("jquery");
  api.use("tracker");
  api.use("logging");
  api.use("reload");
  api.use("random");
  api.use("ejson");
  api.use("spacebars");
  api.use("check");


  api.use("reactioncommerce:core@0.12.0");

  api.addFiles("server/register.js", ["server"]); // register as a reaction package
  api.addFiles("server/pin.js", ["server"]);
  api.addFiles([
    "common/collections.js",
    "lib/pin.js"
  ], ["client", "server"]);

  api.addFiles([
    "client/templates/pin.html",
    "client/templates/pin.js",
    "client/templates/cart/checkout/payment/methods/pin/pin.html",
    "client/templates/cart/checkout/payment/methods/pin/pin.less",
    "client/templates/cart/checkout/payment/methods/pin/pin.js"
  ], ["client"]);
});
