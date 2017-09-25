

//jshint ignore: start

pragma solidity ^0.4.11;

import './Ownable.sol';

contract Don is Ownable {

  uint256 public balance;
  
  string public name;
  
  bool public open; //open or closed
  bool public over; //allow overcontributing

  uint256 public start;
  uint256 public end;
  
  uint256 public goal;
  
  //modifiers
  modifier isOpen () {
    require(open && (over || goal == 0 || (!over && balance < goal)) && (now > start && now < end));
    _;
  }
  
  //constructor
  
  //default payable
  function() payable isOpen {
    pay(msg.value);
  }
  
  function pay(uint256 _amount) isOpen {
    balance += _amount;
  }
  
  function getParameters() constant returns (string, bool, bool, uint256, uint256, uint256) {
    return (name, open, over, start, end, goal);
  }
  
  /**************************************
  * Owned functions
  **************************************/
  
  //update
  function update(string _name, bool _open, bool _over, uint256 _start, uint256 _end, uint256 _goal) onlyOwner {
    name = _name;
    open = _open;
    over = _over;
    start = _start;
    end = _end;
    goal = _goal;
  }
}

//jshint ignore: end


