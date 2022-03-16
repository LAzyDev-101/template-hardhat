export const ExchangeContract = describe("Exchange NFT Market Contract Testing", function() {
  beforeEach(function() {
  });

  require('./deploy');
  require('./SaleItem');
  require('./BuyItem');

  after(function() {
  });
});

