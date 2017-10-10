

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
  contractAddress: '0xE30f7d84e36897ad3Ee1eAC95554b3CeC55a4160',
  //dons
  donMap: {},
  donParams: {},
  donParamsObj: {},
  donCollected: {},
  donList: [],
  dons: [],
  //browseList
  publicDonList: [],
  //state
  initialized: false,
  userDonsLoaded: false,
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
      this.accounts = await utils.getAccounts();
    } catch(e) {
      this.accounts = [null];
      //this.noAccount();
    }
    //regular init
    this.account = this.accounts[0];
    //remove for production
    this.deploy = () => utils.deployContract(Donatti, this.account, 4000000);
    //regular init
    this.donatti = await utils.getContract(Donatti, this.contractAddress);
    this.initialized = true;
    this.getUserDons();
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
      const id = indicies[i].toNumber();
      if (!APP.donList.includes(id)) {
        APP.donList.push(id);
        await APP.loadDon(id, addr);
      }
    }
    APP.userDonsLoaded = true;
    //console.log('dons loaded');
  },
  /**************************************
  * Loading Public Dons
  **************************************/
  async getPublicDons(cb) {
    //might not have contract yet
    if (!APP.initialized) {
      setTimeout(() => APP.getPublicDons(cb), 250);
      return;
    }
    const totalDons = (await APP.donatti.totalDons.call()).toNumber() - 1;
    console.log('totalDons', totalDons);
    //grab each don instance
    for (let id = totalDons; id > -1; id--) {
      const addr = await APP.donatti.dons.call(id);
      if (!APP.publicDonList.includes(id)) {
        APP.publicDonList.push(id);
        await APP.loadDon(id, addr);
      }
    }
    if (cb) cb();
  },
  /**************************************
  * Load a Single Dons
  **************************************/
  async loadDon(id, addr) {
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
  },
};