

//jshint ignore: start

pragma solidity ^0.4.11;

import './Ownable.sol';

contract Don is Ownable {
  
  //collected
  uint256 public collected;
  
  //donatti
  address private donatti;
  
  //params
  string private name;
  bool private open; //open or closed
  bool private over; //allow over collecting
  uint256 private start;
  uint256 private end;
  uint256 private goal;
  
  /**************************************
  * Modifiers
  **************************************/
  modifier isOpen() {
    require(open && (over || goal == 0 || collected < goal) && (now > start && now < end));
    _;
  }
  
  /**************************************
  * Public Functions
  **************************************/
  function Don(address _donatti) {
    donatti = _donatti;
  }
  
  function getParameters() constant returns (string, bool, bool, uint256, uint256, uint256) {
    return (name, open, over, start, end, goal);
  }
  
  /**************************************
  * Payable
  **************************************/
  function() payable isOpen {
    collected += msg.value;
    donatti.transfer((msg.value - (msg.value % 100)) / 100);
  }
  
  /**************************************
  * Only Owner Functions
  **************************************/
  function update(string _name, bool _open, bool _over, uint256 _start, uint256 _end, uint256 _goal) onlyOwner {
    name = _name;
    open = _open;
    over = _over;
    start = _start;
    end = _end;
    goal = _goal;
  }
  
  function reset() onlyOwner {
    collected = 0;
  }
  
  function withdraw(address _dest) onlyOwner {
    _dest.transfer(this.balance);
  }
  
}

//jshint ignore: end