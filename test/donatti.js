

//jshint ignore: start

const Donatti = artifacts.require("./Donatti.sol");
const Don = artifacts.require("./Don.sol");

contract('Donatti', function(accounts) {
  
  let donatti, don;
  const owner = accounts[0];
  
  it("should be deployed", async () => {
    donatti = await Donatti.deployed();
    
    assert(donatti !== undefined, "donatti wasn't deployed");
  });
  
  /**************************************
  * Create and Contribute
  **************************************/
  
  it("should be create a don", async () => {
    const tx = await donatti.create("Test Don Box", true, false, 0, 999999999999, 1000, {
      from: owner,
      gas: 4000000
    });
    don = await Don.at(await donatti.dons.call(0));
    
    assert(don !== undefined, "don wasn't deployed");
  });
  
  //return;
  
  //pay with default
  
  it("should be able to pay a don using default", async () => {
    const tx = await don.send(500, { from: owner });
    const balance = (await don.balance.call()).toNumber();
    
    assert(balance === 500, "don balance doesn't match");
  });
  
  //pay with .pay
  
  it("should be able to pay a don using pay function", async () => {
    const tx = await don.pay(500, { from: owner });
    const balance = (await don.balance.call()).toNumber();
    
    assert(balance === 1000, "don balance doesn't match");
  });
  
  /**************************************
  * Goal Reached
  **************************************/
  
  it("EXCEPTION: should NOT pay past goal using default", async () => {
    const tx = don.send(1000, { from: owner });
    tx.catch((e) => assert(true, 'invalid opcode exception caught'));
    const balance = (await don.balance.call()).toNumber();
    
    assert(balance !== 2000, "don balance increased");
  });
  
  it("EXCEPTION: should NOT pay past goal with pay function", async () => {
    const tx = don.pay(1000, { from: owner });
    tx.catch((e) => assert(true, 'invalid opcode exception caught'));
    const balance = (await don.balance.call()).toNumber();
    
    assert(balance !== 2000, "don balance increased");
  });
  
  /**************************************
  * Update don
  **************************************/
  
  it("increase goal", async () => {
    const params = await don.getParameters.call();
    params[5] = 2000;
    const tx = await don.update(...params);
    const tx2 = await don.pay(1000, { from: owner });
    const balance = (await don.balance.call()).toNumber();
    
    assert(balance === 2000, "don balance doesn't match");
  });
  
  it("update to allow over contribution", async () => {
    const params = await don.getParameters.call();
    params[2] = true;
    const tx = await don.update(...params);
    const tx2 = await don.pay(1000, { from: owner });
    const balance = (await don.balance.call()).toNumber();
    
    assert(balance === 3000, "don balance doesn't match");
  });
  
  it("close contributions", async () => {
    const params = await don.getParameters.call();
    params[1] = false;
    const tx = await don.update(...params);
    const tx2 = don.pay(1000, { from: owner });
    tx2.catch((e) => assert(true, 'invalid opcode exception caught'));
    const balance = (await don.balance.call()).toNumber();
    
    assert(balance !== 4000, "don balance increased");
  });
  
  it("open contributions", async () => {
    const params = await don.getParameters.call();
    params[1] = true;
    const tx = await don.update(...params);
    const tx2 = await don.pay(1000, { from: owner });
    const balance = (await don.balance.call()).toNumber();
    
    assert(balance === 4000, "don balance doesn't match");
  });
  
  //don balance === 4000
  
  //start time
  
  it("EXCEPTION: set start time to now + 1000", async () => {
    const params = await don.getParameters.call();
    params[3] = Math.floor((Date.now() / 1000)) + 1000;
    const tx = await don.update(...params);
    const tx2 = don.pay(1000, { from: owner });
    tx2.catch((e) => assert(true, 'invalid opcode exception caught'));
    const balance = (await don.balance.call()).toNumber();

    assert(balance !== 5000, "don balance increased");
  });
  
  
  it("set start time to now - 1000", async () => {
    const params = await don.getParameters.call();
    params[3] = Math.floor((Date.now() / 1000)) - 1000;
    const tx = await don.update(...params);
    const tx2 = await don.pay(1000, { from: owner });
    const balance = (await don.balance.call()).toNumber();
    
    assert(balance === 5000, "don balance doesn't match");
  });
  
  //don balance === 5000
  
  //end time
  
  it("EXCEPTION: set end time to now - 1000", async () => {
    const params = await don.getParameters.call();
    params[4] = Math.floor((Date.now() / 1000)) - 1000;
    const tx = await don.update(...params);
    const tx2 = don.pay(1000, { from: owner });
    tx2.catch((e) => assert(true, 'invalid opcode exception caught'));
    const balance = (await don.balance.call()).toNumber();

    assert(balance !== 6000, "don balance increased");
  });
  
  it("set end time to now + 1000", async () => {
    const params = await don.getParameters.call();
    params[4] = Math.floor((Date.now() / 1000)) + 1000;
    const tx = await don.update(...params);
    const tx2 = await don.pay(1000, { from: owner });
    const balance = (await don.balance.call()).toNumber();
    
    assert(balance === 6000, "don balance doesn't match");
  });
  
  //don balance === 6000
  

});

//jshint ignore: end
