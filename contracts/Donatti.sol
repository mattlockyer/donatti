

//jshint ignore: start

pragma solidity ^0.4.11;

import './Ownable.sol';
import './Don.sol';

contract Donatti is Ownable {
  
  //private
  uint256 private balance;
  address private owner;
  
  Don[] public dons;
  mapping(address => address[]) public donMap;
  
  //constructor
  function Donatti() {}
  
  //create a new contract
  function create(string _name, bool _open, bool _over, uint256 _start, uint256 _end, uint256 _goal) {
    Don don = new Don();
    don.update(_name, _open, _over, _start, _end, _goal);
    don.transferOwnership(msg.sender);
    donMap[msg.sender].push(don);
    dons.push(don);
  }
  
  function getDons() returns (address[]) {
    return donMap[msg.sender];
  }
  
  /**************************************
  * Owner methods
  **************************************/
  function getBalance() onlyOwner returns(uint256) {
    return balance;
  }
    
}

//jshint ignore: end