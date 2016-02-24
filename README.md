reaction-pin
=============

Meteor package adds Pin Payments for Reaction Commerce.

This is a prototype module -> pull requests are celebrated, feedback encouraged.

**Usage**
```bash
meteor add reactioncommerce:reaction-pin
```
*Note: this package automatically converts the total charge amount into smallest currency units as is required by Pin before the API call is made.*

For information on the **charge** object returned see [Pin's Charges Documentation](https://pin.com/docs/api#charges)