

/**************************************
* Get Web3
**************************************/
const getWeb3 = (fallbackURL = 'http://localhost:8545', web3 = window.web3) => {
  if (web3 !== undefined) {
    web3 = new Web3(web3.currentProvider);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider(fallbackURL));
  }
  window.web3 = web3;
  return web3;
};
const setWeb3 = (url = 'http://localhost:8545') => {
  web3 = new Web3(new Web3.providers.HttpProvider(url));
  window.web3 = web3;
  return web3;
};
/**************************************
* Get Network
**************************************/
const getNetwork = (web3 = window.web3) => new Promise((resolve, reject) => {
  if (!web3) {
    console.log('No web3 instance provided');
    return;
  }
  let id, name;
  web3.version.getNetwork((err, networkId) => {
    if (err) {
      reject(err); return;
    }
    id = parseInt(networkId);
    switch (id) {
      case 1: name = 'mainnet'; break;
      case 2: name = 'morden'; break;
      case 3: name = 'ropsten'; break;
      case 4: name = 'rinkeby'; break;
      default: name = 'localhost';
    }
    console.log('The network is:', name, id);
    resolve({ id, name });
  });
});
/**************************************
* Get Accounts (with promise)
**************************************/
const getAccounts = (web3 = window.web3) => new Promise((resolve, reject) => {
  if (!web3) reject('No web3 instance provided');
  //checking for accounts, keep track of attempts
  let accounts, attempts = 0;
  //limit attempts
  const limit = 5;
  //check function
  const check = () => {
    accounts = web3.eth.accounts;
    if (accounts.length > 0) {
      resolve(accounts);
    } else {
      attempts++;
      if (attempts === limit) {
        reject('accounts could not be found on web3 provider');
        return;
      }
      setTimeout(check, 200); //found no accounts, below attempt limit, check again
    }
  };
  check();
});
/**************************************
* Get Contract
**************************************/
const getContract = (json, address, web3 = window.web3) => {
  const contract = TruffleContract(json);
  contract.setProvider(web3.currentProvider);
  return address ? contract.at(address) : contract.deployed();
};
/**************************************
* Deploy Contract
**************************************/
const deployContract = (json, from, gas) => {
  const contract = TruffleContract(json);
  contract.setProvider(web3.currentProvider);
  contract.new({
    from, gas
  });
};
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
const timeout = ms => new Promise(res => setTimeout(res, ms));
/**************************************
* Exports
**************************************/
export default {
  getWeb3,
  setWeb3,
  getNetwork,
  getAccounts,
  getContract,
  deployContract,
  getBalance,
  timeout
};
