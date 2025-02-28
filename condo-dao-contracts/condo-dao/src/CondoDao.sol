// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CondoDAO {
    string public name;

    struct Proposal {
        string description;
        uint256 approvals;
        bool executed;
    }

    struct Resident {
        string id;
        address wallet;
        uint256 lastPaymentTimestamp;
    }

    struct VoteProposal {
        string theme;
        uint256 votes;
    }

    address[] public committee;
    mapping(address => bool) public isCommitteeMember;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    Proposal[] public proposals;
    
    mapping(address => Resident) public residents;
    address[] public residentList;

    mapping(uint256 => mapping(address => bool)) public hasVotedForTheme;
    VoteProposal[] public voteProposals;

    uint256 public constant PAYMENT_INTERVAL = 30 days;
    uint256 public condominiumFee;
    
    event ProposalCreated(uint256 indexed proposalId, string description);
    event ProposalApproved(uint256 indexed proposalId, address indexed approver);
    event ProposalExecuted(uint256 indexed proposalId, string description);
    event ResidentAdded(address indexed wallet, string id);
    event PaymentReceived(address indexed wallet, uint256 timestamp, string paymentMethod);
    event CondominiumFeeUpdated(uint256 newFeeETH);
    event VoteProposalCreated(uint256 indexed proposalId, string theme);
    event VoteSubmitted(uint256 indexed proposalId, address indexed voter);
    event VoteResultsCleared();

    modifier onlyCommittee() {
        require(isCommitteeMember[msg.sender], "Apenas membros do comite podem executar esta acao");
        _;
    }

    constructor(string memory _name, address[] memory _committee, string[] memory _ids, uint256 _feeETH) {
        require(_committee.length > 0, "Comite deve ter ao menos um membro");
        require(_committee.length == _ids.length, "Cada membro do comite deve ter um ID correspondente");

        name = _name;
        condominiumFee = _feeETH;
        
        for (uint256 i = 0; i < _committee.length; i++) {
            address member = _committee[i];
            string memory id = _ids[i];
            
            isCommitteeMember[member] = true;
            committee.push(member);
            
            residents[member] = Resident({
                id: id,
                wallet: member,
                lastPaymentTimestamp: block.timestamp
            });
            residentList.push(member);
            emit ResidentAdded(member, id);
        }
    }

    function setCondominiumFee(uint256 _feeETH) external onlyCommittee {
        condominiumFee = _feeETH;
        emit CondominiumFeeUpdated(_feeETH);
    }

    function payCondominiumFee() external payable {
        require(residents[msg.sender].wallet != address(0), "Voce nao e um condomino registrado");
        require(msg.value == condominiumFee, "Valor incorreto de ETH enviado");
        residents[msg.sender].lastPaymentTimestamp = block.timestamp;
        emit PaymentReceived(msg.sender, block.timestamp, "ETH");
    }

    function createProposal(string memory _description) external onlyCommittee {
        proposals.push(Proposal({
            description: _description,
            approvals: 0,
            executed: false
        }));

        uint256 proposalId = proposals.length - 1;
        emit ProposalCreated(proposalId, _description);
    }

    function approveProposal(uint256 proposalId) external onlyCommittee {
        require(proposalId < proposals.length, "Proposta invalida");
        require(!hasVoted[proposalId][msg.sender], "Voce ja votou nessa proposta");
        require(!proposals[proposalId].executed, "Proposta ja foi executada");

        proposals[proposalId].approvals++;
        hasVoted[proposalId][msg.sender] = true;

        emit ProposalApproved(proposalId, msg.sender);

        if (proposals[proposalId].approvals >= committee.length / 2 + 1) {
            executeProposal(proposalId);
        }
    }

    function executeProposal(uint256 proposalId) internal {
        require(proposalId < proposals.length, "Proposta invalida");
        require(!proposals[proposalId].executed, "Proposta ja foi executada");
        require(proposals[proposalId].approvals >= committee.length / 2 + 1, "Aprovacao insuficiente");

        proposals[proposalId].executed = true;
        emit ProposalExecuted(proposalId, proposals[proposalId].description);
    }

    function getProposalDetails(uint256 proposalId) external view returns (string memory description, uint256 approvals, bool executed) {
        require(proposalId < proposals.length, "Proposta invalida");

        Proposal memory proposal = proposals[proposalId];
        return (proposal.description, proposal.approvals, proposal.executed);
    }

    function addResident(address _wallet, string memory _id) external onlyCommittee {
        require(_wallet != address(0), "Endereco invalido");
        require(residents[_wallet].wallet == address(0), "Condomino ja registrado");

        residents[_wallet] = Resident({
            id: _id,
            wallet: _wallet,
            lastPaymentTimestamp: block.timestamp
        });

        residentList.push(_wallet);

        emit ResidentAdded(_wallet, _id);
    }

    function getInadimplentes() external view returns (address[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < residentList.length; i++) {
            if (block.timestamp - residents[residentList[i]].lastPaymentTimestamp > PAYMENT_INTERVAL) {
                count++;
            }
        }

        address[] memory inadimplentes = new address[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < residentList.length; i++) {
            if (block.timestamp - residents[residentList[i]].lastPaymentTimestamp > PAYMENT_INTERVAL) {
                inadimplentes[index] = residentList[i];
                index++;
            }
        }

        return inadimplentes;
    }

    function getMonthsOwed(address _wallet) external view returns (uint256) {
        require(residents[_wallet].wallet != address(0), "Condomino nao encontrado");

        uint256 monthsOwed = (block.timestamp - residents[_wallet].lastPaymentTimestamp) / PAYMENT_INTERVAL;
        return monthsOwed;
    }

    function hasOpenInvoice() external view returns (bool) {
        require(residents[msg.sender].wallet != address(0), "Condomino nao encontrado");
        return block.timestamp - residents[msg.sender].lastPaymentTimestamp > PAYMENT_INTERVAL;
    }

    function createVoteProposal(string memory _theme) external {
        voteProposals.push(VoteProposal({theme: _theme, votes: 0}));
        emit VoteProposalCreated(voteProposals.length - 1, _theme);
    }

    function vote(uint256 proposalId) external {
        require(proposalId < voteProposals.length, "Proposta invalida");
        require(!hasVotedForTheme[proposalId][msg.sender], "Voce ja votou nesta proposta");

        voteProposals[proposalId].votes++;
        hasVotedForTheme[proposalId][msg.sender] = true;

        emit VoteSubmitted(proposalId, msg.sender);
    }

    function clearVoteResults() external onlyCommittee {
        delete voteProposals;
        emit VoteResultsCleared();
    }
}
