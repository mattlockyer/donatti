

//jshint ignore: start

pragma solidity ^0.4.11;

import './Ownable.sol';
import './Don.sol';

contract Donatti is Ownable {
  
  address[] public dons;
  mapping(address => address[]) public donMap;
  
  function() payable {}
  
  //create a new contract
  function create(string _name, bool _open, bool _over, uint256 _start, uint256 _end, uint256 _goal) {
    Don don = new Don(this);
    don.update(_name, _open, _over, _start, _end, _goal);
    don.transferOwnership(msg.sender);
    donMap[msg.sender].push(don);
    dons.push(don);
  }
  
  function getDons() returns (address[]) {
    return donMap[msg.sender];
  }
  
  /**************************************
  * Only Owner
  **************************************/
  
  function withdraw(address _dest) onlyOwner returns(uint256) {
    _dest.transfer(this.balance);
  }
  
  function collectFee(uint256 _from) onlyOwner returns(uint256) {
    Don(dons[_from]).withdrawFee(this);
  }
    
}

//jshint ignore: end