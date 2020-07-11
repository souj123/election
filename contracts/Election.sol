// pragma solidity ^0.5.0;

// contract Election {
// 	uint public cand1=0;
// 	uint public cand2=0;

//     constructor() public {
//     	string memory _name = "hello";
//     }
//     function increment_vote(uint _value) public{

//     	if(_value == 1){
//     		cand1++;
//     	}else
//     	if(_value == 2){
//     		cand2++;
//     	}
    	


//     }
// }

pragma solidity ^0.5.0;

contract Election {
    
    constructor () public {
        addCandi("Donal Trump");
        addCandi("Joe  Biden");
    }

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    
    mapping(address => bool) public voters;
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

    event votedEvent (
        uint candiId
    );

    

    function addCandi (string memory _name) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote (uint _candidateId) public {
        require(!voters[msg.sender]);
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        voters[msg.sender] = true;

        candidates[_candidateId].voteCount ++;

        emit votedEvent(_candidateId);
    }
}