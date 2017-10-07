

//jshint ignore: start

const Donatti = artifacts.require("./Donatti.sol");
const Don = artifacts.require("./Don.sol");

/**************************************
* Helpers
**************************************/
const promisify = (inner) => new Promise((resolve, reject) =>
  inner((err, res) => {
    if (err) { reject(err) }
    resolve(res);
  })
);
const getBalance = (account, at) => promisify(cb => web3.eth.getBalance(account, at, cb));
const timeout = ms => new Promise(res => setTimeout(res, ms))

/**************************************
* Tests
**************************************/
contract('Donatti', function(accounts) {
  
  let donatti, don;
  const owner = accounts[0];
  const random = accounts[1];
  
  it("should be deployed", async () => {
    donatti = await Donatti.deployed();
    assert(donatti !== undefined, "donatti wasn't deployed");
  });
  
  /**************************************
  * Create and Contribute
  **************************************/
  
  it("should be create a don", async () => {
    
    const args = ["Test Don Box", true, false, 0, 999999999999, 1000, 'https://mywickedsite.com'];
    
    const estimate = await donatti.create.estimateGas(...args);
    console.log('Don gas cost', estimate);
    
    const tx = await donatti.create(...args, {
      from: owner,
      gas: 4000000
    });
    const dons = await donatti.getDons.call();
    don = await Don.at(dons[0][0]);
    assert(don !== undefined, "don wasn't deployed");
  });
  
  it("should be able to get dons", async () => {
    const dons = await donatti.getDons.call();
    assert(dons[0].length === 1, "dons length doesn't match");
  });
  
  //pay with default
  
  it("should be able to pay a don using default", async () => {
    const tx = await don.send(1000, { from: owner });
    const collected = (await don.collected.call()).toNumber();
    assert(true, "don balance doesn't match");
  });
  
  /**************************************
  * Goal Reached
  **************************************/
  
  it("EXCEPTION: should NOT pay past goal using default", async () => {
    const tx = don.send(1000, { from: owner });
    tx.catch((e) => assert(true, 'invalid opcode exception caught'));
    const collected = (await don.collected.call()).toNumber();
    
    assert(collected !== 2000, "don balance increased");
  });
  
  /**************************************
  * Update don
  **************************************/
  
  it("increase goal", async () => {
    const params = await don.getParameters.call();
    params[5] = 2000;
    const tx = await don.update(...params);
    const tx2 = await don.send(1000, { from: owner });
    const collected = (await don.collected.call()).toNumber();
    
    assert(collected === 2000, "don balance doesn't match");
  });
  
  it("update to allow over contribution", async () => {
    const params = await don.getParameters.call();
    params[2] = true;
    const tx = await don.update(...params);
    const tx2 = await don.send(1000, { from: owner });
    const collected = (await don.collected.call()).toNumber();
    
    assert(collected === 3000, "don balance doesn't match");
  });
  
  it("close contributions", async () => {
    const params = await don.getParameters.call();
    params[1] = false;
    const tx = await don.update(...params);
    const tx2 = don.send(1000, { from: owner });
    tx2.catch((e) => assert(true, 'invalid opcode exception caught'));
    const collected = (await don.collected.call()).toNumber();
    
    assert(collected !== 4000, "don balance increased");
  });
  
  it("open contributions", async () => {
    const params = await don.getParameters.call();
    params[1] = true;
    const tx = await don.update(...params);
    const tx2 = await don.send(1000, { from: owner });
    const collected = (await don.collected.call()).toNumber();
    
    assert(collected === 4000, "don balance doesn't match");
  });
  
  //don balance === 4000
  
  //start time
  
  it("EXCEPTION: set start time to now + 1000", async () => {
    const params = await don.getParameters.call();
    params[3] = Math.floor((Date.now() / 1000)) + 1000;
    const tx = await don.update(...params);
    const tx2 = don.send(1000, { from: owner });
    tx2.catch((e) => assert(true, 'invalid opcode exception caught'));
    const collected = (await don.collected.call()).toNumber();

    assert(collected !== 5000, "don balance increased");
  });
  
  
  it("set start time to now - 1000", async () => {
    const params = await don.getParameters.call();
    params[3] = Math.floor((Date.now() / 1000)) - 1000;
    const tx = await don.update(...params);
    const tx2 = await don.send(1000, { from: owner });
    const collected = (await don.collected.call()).toNumber();
    
    assert(collected === 5000, "don balance doesn't match");
  });
  
  //don balance === 5000
  
  //end time
  
  it("EXCEPTION: set end time to now - 1000", async () => {
    const params = await don.getParameters.call();
    params[4] = Math.floor((Date.now() / 1000)) - 1000;
    const tx = await don.update(...params);
    const tx2 = don.send(1000, { from: owner });
    tx2.catch((e) => assert(true, 'invalid opcode exception caught'));
    const collected = (await don.collected.call()).toNumber();

    assert(collected !== 6000, "don balance increased");
  });
  
  it("set end time to now + 1000", async () => {
    const params = await don.getParameters.call();
    params[4] = Math.floor((Date.now() / 1000)) + 1000;
    const tx = await don.update(...params);
    const tx2 = await don.send(1000, { from: owner });
    const collected = (await don.collected.call()).toNumber();
    
    assert(collected === 6000, "don balance doesn't match");
  });
  
  //don balance === 6000
  
  /**************************************
  * Checking Balances and Fees were paid
  **************************************/
  
  it("withdraw the balance", async () => {
    const rb1 = (await getBalance(random));
    const collected = (await don.collected.call()).toNumber();
    const tx = await don.withdraw(random);
    await timeout(250);
    const rb2 = (await getBalance(random));
    //got the balance with fees minused
    assert(rb2.minus(rb1).toNumber() === collected - (collected * 0.01), 'true');
    assert(collected === 6000, "don balance doesn't match");
  });
  
  
  it("donatti balance has the fee", async () => {
    const balance = (await getBalance(donatti.address)).toNumber();
    assert(balance === 60, "donatti fee balance doesn't match");
  });
  
  
  it("reset the collected amount", async () => {
    const tx = await don.reset({ from: owner });
    const collected = (await don.collected.call()).toNumber();
    assert(collected === 0, "don collected does not equal zero");
  });

});

//jshint ignore: end
