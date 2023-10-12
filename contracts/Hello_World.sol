// SPDX-License-Identifier: MIT
pragma solidity  0.8.19;

contract Hello_World {
    string value;

    constructor() {
        value = "Hello World!";
    }
      

    function get() public view returns (string memory){
        return value;
    }

    function set(string memory _value) public {
        value=_value;
    }

}
