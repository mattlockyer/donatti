

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
  contractAddress: '0xC92b4A07199422434E97541d6c081069797AAd95',
  //dons
  donMap: {},
  donParams: {},
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
    console.log(network);
    if (network.id !== APP.network.id) {
      console.log('MetaMask: wrong network');
      utils.setWeb3(APP.network.url);
      //this.noAccount();
    }
    try {
      APP.accounts = await utils.getAccounts();
    } catch(e) {
      APP.accounts = ['0x'];
      //this.noAccount();
    }
    
    //regular init
    APP.account = (await utils.getAccounts())[0];
    //remove for production
    APP.deploy = () => utils.deployContract(Donatti, APP.account, 4000000);
    //regular init
    APP.donatti = await utils.getContract(Donatti, APP.contractAddress);
    APP.initialized = true;
    APP.updateDons();
  },
  async updateDons() {
    APP.donsLoaded = false;
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
      //check if we already have this don or don't need to update it
      if (!APP.donList.includes(index)) {
        APP.donList.push(index);
        const don = await utils.getContract(Don, addr);
        const params = await don.getParameters.call();
        APP.donMap[index] = don;
        APP.donParams[index] = params;
      }
    }
    APP.donsLoaded = true;
    console.log('dons loaded');
  },
  getDons(cb) {
    if (!APP.donsLoaded) {
      setTimeout(() => APP.getDons(cb), 50);
      return;
    }
    if (cb) cb();
  }
  //jshint ignore: end
};