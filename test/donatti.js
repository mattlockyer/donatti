

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
    const tx = await donatti.create("Test Don Box", true, false, 0, 999999999999, 1000, {
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
    const balance = (await getBalance(don.address)).toNumber();
    assert(balance === 1000, "don balance doesn't match");
  });
  
  /**************************************
  * Goal Reached
  **************************************/
  
  it("EXCEPTION: should NOT pay past goal using default", async () => {
    const tx = don.send(1000, { from: owner });
    tx.catch((e) => assert(true, 'invalid opcode exception caught'));
    const balance = (await getBalance(don.address)).toNumber();
    
    assert(balance !== 2000, "don balance increased");
  });
  
  /**************************************
  * Update don
  **************************************/
  
  it("increase goal", async () => {
    const params = await don.getParameters.call();
    params[5] = 2000;
    const tx = await don.update(...params);
    const tx2 = await don.send(1000, { from: owner });
    const balance = (await getBalance(don.address)).toNumber();
    
    assert(balance === 2000, "don balance doesn't match");
  });
  
  it("update to allow over contribution", async () => {
    const params = await don.getParameters.call();
    params[2] = true;
    const tx = await don.update(...params);
    const tx2 = await don.send(1000, { from: owner });
    const balance = (await getBalance(don.address)).toNumber();
    
    assert(balance === 3000, "don balance doesn't match");
  });
  
  it("close contributions", async () => {
    const params = await don.getParameters.call();
    params[1] = false;
    const tx = await don.update(...params);
    const tx2 = don.send(1000, { from: owner });
    tx2.catch((e) => assert(true, 'invalid opcode exception caught'));
    const balance = (await getBalance(don.address)).toNumber();
    
    assert(balance !== 4000, "don balance increased");
  });
  
  it("open contributions", async () => {
    const params = await don.getParameters.call();
    params[1] = true;
    const tx = await don.update(...params);
    const tx2 = await don.send(1000, { from: owner });
    const balance = (await getBalance(don.address)).toNumber();
    
    assert(balance === 4000, "don balance doesn't match");
  });
  
  //don balance === 4000
  
  //start time
  
  it("EXCEPTION: set start time to now + 1000", async () => {
    const params = await don.getParameters.call();
    params[3] = Math.floor((Date.now() / 1000)) + 1000;
    const tx = await don.update(...params);
    const tx2 = don.send(1000, { from: owner });
    tx2.catch((e) => assert(true, 'invalid opcode exception caught'));
    const balance = (await getBalance(don.address)).toNumber();

    assert(balance !== 5000, "don balance increased");
  });
  
  
  it("set start time to now - 1000", async () => {
    const params = await don.getParameters.call();
    params[3] = Math.floor((Date.now() / 1000)) - 1000;
    const tx = await don.update(...params);
    const tx2 = await don.send(1000, { from: owner });
    const balance = (await getBalance(don.address)).toNumber();
    
    assert(balance === 5000, "don balance doesn't match");
  });
  
  //don balance === 5000
  
  //end time
  
  it("EXCEPTION: set end time to now - 1000", async () => {
    const params = await don.getParameters.call();
    params[4] = Math.floor((Date.now() / 1000)) - 1000;
    const tx = await don.update(...params);
    const tx2 = don.send(1000, { from: owner });
    tx2.catch((e) => assert(true, 'invalid opcode exception caught'));
    const balance = (await getBalance(don.address)).toNumber();

    assert(balance !== 6000, "don balance increased");
  });
  
  it("set end time to now + 1000", async () => {
    const params = await don.getParameters.call();
    params[4] = Math.floor((Date.now() / 1000)) + 1000;
    const tx = await don.update(...params);
    const tx2 = await don.send(1000, { from: owner });
    const balance = (await getBalance(don.address)).toNumber();
    
    assert(balance === 6000, "don balance doesn't match");
  });
  
  //don balance === 6000
  
  
  it("withdraw the balance", async () => {
    
    const rb1 = (await getBalance(random));
    const balance = (await getBalance(don.address)).toString();
    const tx = await don.withdraw(random);
    await timeout(250);
    const rb2 = (await getBalance(random));
    assert(rb2.minus(rb1).toNumber() === balance - (balance * 0.01), 'true');
    
  });
  
  
  it("withdraw the fee", async () => {
    
    const rb1 = (await getBalance(random));
    const fee = (await getBalance(don.address)).toNumber(); //fee is all that's left
    const tx = await donatti.collectFees([0], { from: owner });
    await timeout(250);
    const tx2 = await donatti.withdraw(random);
    await timeout(250);
    const rb2 = (await getBalance(random));
    assert(rb2.minus(rb1).toNumber() === fee, 'true');
    
  });

});

//jshint ignore: end
