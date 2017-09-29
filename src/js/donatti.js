

import utils from './web3-utils';
import Donatti from '../../build/contracts/Donatti';
import Don from '../../build/contracts/Don';

const APP = window.APP = {
  donMap: {},
  donParams: {},
  donList: [],
  dons: [],
  //jshint ignore: start
  async init() {
    utils.getWeb3();
    APP.account = (await utils.getAccounts())[0];
    APP.donatti = await utils.getContract(Donatti);
    APP.initialized = true;
    APP.updateDons();
  },
  async updateDons(cb, newDon = false) {
    //might not have contract yet
    if (!APP.initialized) {
      setTimeout(() => APP.updateDons(cb), 250);
      return;
    }
    //get dons
    let dons = APP.dons;
    if (dons.length === 0 || newDon) dons = APP.dons = await APP.donatti.getDons.call();
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
    //callback
    if (cb) cb();
  }
  //jshint ignore: end
};