

//jshint ignore: start

pragma solidity ^0.4.11;

contract Ownable {
  
  address private owner;
  
  //modifiers
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  //constructor
  function Ownable() {
    owner = msg.sender;
  }
  
  function transferOwner(address _owner) onlyOwner {
    owner = _owner;
  }

}

//jshint ignore: end