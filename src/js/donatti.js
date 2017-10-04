

import utils from './web3-utils';
import Donatti from '../../build/contracts/Donatti';
import Don from '../../build/contracts/Don';

const APP = window.APP = {
  //network info
  network: {
    id: 42,
    name: 'kovan',
    url: 'https://kovan.infura.io/',
  },
  connectedNetwork: null,
  contractAddress: '0xcC958Aa9B8C72F6aCa889C94B0b45869d7d01d4f',
  //dons
  donMap: {},
  donParams: {},
  donParamsObj: {},
  donCollected: {},
  donList: [],
  dons: [],
  /**************************************
  * Init
  **************************************/
  //jshint ignore: start
  async init() {
    utils.getWeb3(APP.network.url);
    //get network
    const network = APP.connectedNetwork = await utils.getNetwork();
    //console.log(network);
    if (network.id !== APP.network.id) {
      console.log('MetaMask: wrong network');
      utils.setWeb3(APP.network.url);
      //this.noAccount();
    }
    try {
      APP.accounts = await utils.getAccounts();
    } catch(e) {
      APP.accounts = [null];
      //this.noAccount();
    }
    //regular init
    APP.account = APP.accounts[0];
    //remove for production
    APP.deploy = () => utils.deployContract(Donatti, APP.account, 4000000);
    //regular init
    APP.donatti = await utils.getContract(Donatti, APP.contractAddress);
    APP.initialized = true;
    APP.getUserDons();
  },
  /**************************************
  * Loading a users dons
  **************************************/
  async getUserDons() {
    //we have no user dons to get
    if (!APP.account) {
      APP.userDonsLoaded = true;
      return;
    }
    APP.userDonsLoaded = false;
    //might not have contract yet
    if (!APP.initialized) {
      setTimeout(() => APP.updateDons(cb), 250);
      return;
    }
    //get dons
    const dons = APP.dons = await APP.donatti.getDons.call();
    //break up addresses and indicies
    const addresses = dons[0];
    const indicies = dons[1];
    //grab each don instance
    for (let i in indicies) {
      const addr = addresses[i];
      const index = indicies[i].toNumber();
      if (!APP.donList.includes(index)) {
        await APP.loadDon(index, addr);
      }
    }
    APP.userDonsLoaded = true;
    //console.log('dons loaded');
  },
  async loadDon(id, addr) {
    APP.donList.push(id);
    if (!addr) addr = await APP.donatti.dons.call(id);
    const don = await utils.getContract(Don, addr);
    don.id = id;
    APP.donMap[id] = don;
    await APP.getParams(don);
    await APP.getBalance(don);
    return don;
  },
  /**************************************
  * Loading the params of a don
  **************************************/
  async getParams(don) {
    const params = await don.getParameters.call();
  
    //formatting dates
    if (params[3].toNumber() === 0) params[3] = '';
    else params[3] = FlatpickrInstance.prototype.formatDate(new Date(params[3] * 1000), 'Y-m-d h:i');
    if (params[4].toNumber() === 9999999999) params[4] = '';
    else params[4] = FlatpickrInstance.prototype.formatDate(new Date(params[4] * 1000), 'Y-m-d h:i');
    //goal
    params[5] = utils.toEth(params[5]);
    if (params[5] === 0) params[5] = '';
    //params
    APP.donParams[don.id] = params;
    APP.donParamsObj[don.id] = APP.getParamObj(params);
    return params.slice();
  },
  getParamObj(params) {
    const obj = {};
    ['name', 'open', 'over', 'start', 'end', 'goal', 'url'].forEach((k, i) => obj[k] = params[i]);
    if (obj.start === '') obj.start = 'begun';
    if (obj.end === '') obj.end = 'never';
    if (obj.goal === '') obj.goal = 'unlimited';
    return obj;
  },
  /**************************************
  * Getting and caching the balance of a don
  **************************************/
  async getBalance(don) {
    const collected = utils.toEth(await don.collected.call());
    APP.donCollected[don.id] = collected
    return collected;
  },
  //jshint ignore: end
  /**************************************
  * Callback for mounted components
  **************************************/
  getDons(cb) {
    if (!APP.userDonsLoaded) {
      setTimeout(() => APP.getDons(cb), 50);
      return;
    }
    if (cb) cb();
  }
};