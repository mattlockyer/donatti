

//jshint ignore: start

pragma solidity ^0.4.11;

contract Ownable {
  
  address public owner;
  
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function Ownable() {
    owner = msg.sender;
  }
  
  function transferOwnership(address _owner) onlyOwner {
    owner = _owner;
  }
  
}

//jshint ignore: end