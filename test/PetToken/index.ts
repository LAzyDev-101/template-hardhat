export const pettoken = describe("PetToken Contract Testing", function() {
  beforeEach(function() {
  });

  require('./deploy');
  require('./mint');
  require('./setTokenURI');
  require('./transfer');

  after(function() {
  });
});

