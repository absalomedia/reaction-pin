ReactionCore.registerPackage({
  label: "Pin",
  name: "reaction-pin",
  icon: "fa fa-map-marker",
  autoEnable: false,
  settings: {
    production: false,
    key: ""
  },
  registry: [
    // Dashboard card
    {
      provides: "dashboard",
      label: "Pin",
      description: "Pin Payments",
      icon: "fa fa-map-marker",
      priority: 2,
      container: "paymentMethod"
    },

    // Settings panel
    {
      label: "Pin Settings",
      route: "/dashboard/pin",
      provides: "settings",
      container: "dashboard",
      template: "pinSettings",
    },

    // Payment form for checkout
    {
      template: "pinPaymentForm",
      provides: "paymentMethod"
    }
  ]
});
