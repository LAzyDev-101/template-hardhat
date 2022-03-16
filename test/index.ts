import * as util from 'util';
describe("Runing Testing all Smart Contract", function() {
  beforeEach(function() {
    global.currentStepInfo = {};
  });

  afterEach(function() {
    if (this.currentTest?.state == 'failed') {
      if (global.currentStepInfo) {
        console.log(
          util.inspect(global.currentStepInfo, {
            colors: true,
            depth: null,
            showHidden: false,
          })
        );
      }
    }

    global.currentStepInfo = {};
  });

  require('./PetToken');
  require('./Market');

  after(function() {
  });
});

