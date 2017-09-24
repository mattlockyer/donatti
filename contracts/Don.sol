

//jshint ignore: start

pragma solidity ^0.4.11;

import './Ownable.sol';

contract Don is Ownable {

  string public name;
  uint256 public balance;
  
  bool public open = true; //open or closed
  
  uint256 public start = 0; //beginning of time
  uint256 public end = 999999999999; //forever
  
  bool public over = false; //allow overcontributing
  uint256 public goal = 1000;
  
  //modifiers
  modifier isOpen () {
    require(open && (over || (!over && balance < goal)) && (now > start && now < end));
    _;
  }
  
  //constructor
  function Don(string _name) {
    name = _name;
  }
  
  //default payable
  function() payable isOpen {
    pay(msg.value);
  }
  
  function pay(uint256 _amount) isOpen {
    balance += _amount;
  }
  
  function getParameters() constant returns (bool _over, bool _open, uint256 _start, uint256 _end, uint256 _goal) {
    return (open, over, start, end, goal);
  }
  
  /**************************************
  * Owned functions
  **************************************/
  function setOpen(bool _open) onlyOwner { open = _open; }
  function setOver(bool _over) onlyOwner { over = _over; }
  function setStart(uint256 _start) onlyOwner { start = _start; }
  function setEnd(uint256 _end) onlyOwner { end = _end; }
  function setGoal(uint256 _goal) onlyOwner { goal = _goal; }
  
  //update
  function update(bool _open, bool _over, uint256 _start, uint256 _end, uint256 _goal) onlyOwner {
    setOpen(_open); setOver(_over); setStart(_start); setEnd(_end); setGoal(_goal);
  }
}

//jshint ignore: end


