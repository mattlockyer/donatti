

//jshint ignore: start

pragma solidity ^0.4.11;

import './Ownable.sol';
import './Don.sol';

contract Donatti is Ownable {
  
  address[] public dons;
  mapping(address => uint256[]) public donMap;
  
  function() payable {}
  
  //new don
  function create(string _name, bool _open, bool _over, uint256 _start, uint256 _end, uint256 _goal) {
    Don don = new Don(this);
    don.update(_name, _open, _over, _start, _end, _goal);
    don.transferOwnership(msg.sender);
    donMap[msg.sender].push(dons.length);
    dons.push(don);
  }
  
  //get dons
  function getDons() returns (address[], uint256[]) {
    uint256[] storage list = donMap[msg.sender];
    address[] memory addr = new address[](list.length);
    for (uint i = 0; i < list.length; i++) {
      addr[i] = dons[list[i]];
    }
    return (addr, list);
  }
  
  /**************************************
  * Only Owner
  **************************************/
  function withdraw(address _dest) onlyOwner returns(uint256) {
    _dest.transfer(this.balance);
  }
  
  function collectFees(uint256[] _from) onlyOwner returns(uint256) {
    for (uint i = 0; i < _from.length; i++) {
      Don(dons[_from[i]]).withdrawFee(this);
    }
  }
}

//jshint ignore: end