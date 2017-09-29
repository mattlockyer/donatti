

//jshint ignore: start

pragma solidity ^0.4.11;

import './Ownable.sol';

contract Don is Ownable {

  address public donatti;
  uint256 public fee;
  
  string public name;
  bool public open; //open or closed
  bool public over; //allow overcontributing
  uint256 public start;
  uint256 public end;
  uint256 public goal;
  
  //modifiers
  modifier isOpen(uint256 value) {
    require(open && (over || goal == 0 || this.balance - value < goal) && (now > start && now < end));
    _;
  }
  
  modifier onlyDonatti() {
    require(msg.sender == donatti);
    _;
  }
  
  //constructor
  function Don(address _donatti) {
    donatti = _donatti;
  }
  
  //default payable
  function() payable isOpen(msg.value) {
    fee += (msg.value - (msg.value % 100)) / 100;
  }
  
  function getParameters() constant returns (string, bool, bool, uint256, uint256, uint256) {
    return (name, open, over, start, end, goal);
  }
  
  function getBalance() public constant returns (uint256) {
    
    //TODO change tests to use getBalance promise functions
    
    //return this.balance - fee;
    return this.balance;
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
  
  function withdraw(address _dest) onlyOwner {
    _dest.transfer(this.balance - fee);
  }
  
  /**************************************
  * Only Donatti Functions
  **************************************/
  
  function withdrawFee(address _dest) onlyDonatti {
    _dest.transfer(fee);
    fee = 0;
  }
}

//jshint ignore: end


