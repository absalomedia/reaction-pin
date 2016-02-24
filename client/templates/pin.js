Template.stripeSettings.helpers({
  packageData: function() {
    return ReactionCore.Collections.Packages.findOne({
      name: "reaction-pin"
    });
  }
});

Template.pin.helpers({
  packageData: function() {
    return ReactionCore.Collections.Packages.findOne({
      name: "reaction-pin"
    });
  }
});

Template.pin.events({
  "click [data-event-action=showPinSettings]": function () {
    ReactionCore.showActionView();
  }
});

AutoForm.hooks({
  "pin-update-form": {
    onSuccess: function(operation, result, template) {
      Alerts.removeSeen();
      return Alerts.add("Pin settings saved.", "success");
    },
    onError: function(operation, error, template) {
      Alerts.removeSeen();
      return Alerts.add("Pin settings update failed. " + error, "danger");
    }
  }
});
