

const Ownable = artifacts.require("./Ownable.sol");
const Don = artifacts.require("./Don.sol");
const Donatti = artifacts.require("./Donatti.sol");

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.link(Ownable, Don);
  deployer.deploy(Don);
  deployer.link(Ownable, Donatti);
  deployer.link(Don, Donatti);
  deployer.deploy(Donatti);
};
