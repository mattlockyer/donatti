

const Ownable = artifacts.require("./Ownable.sol");
const Don = artifacts.require("./Don.sol");
const Donatti = artifacts.require("./Donatti.sol");

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(Don);
  deployer.deploy(Donatti);
};
