// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SchoolManagement {
    address public admin;
    
    struct Student {
        uint256 id;
        string name;
        bool isRegistered;
    }
    
    mapping(uint256 => Student) private students;
    uint256[] private studentIds;
    
    event StudentRegistered(uint256 id, string name);
    event StudentRemoved(uint256 id);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    constructor() {
        admin = msg.sender;
    }
    
    function registerStudent(uint256 _id, string memory _name) external onlyAdmin {
        require(!students[_id].isRegistered, "Student already registered");
        students[_id] = Student(_id, _name, true);
        studentIds.push(_id);
        emit StudentRegistered(_id, _name);
    }
    
    function removeStudent(uint256 _id) external onlyAdmin {
        require(students[_id].isRegistered, "Student not found");
        delete students[_id];
        
        for (uint256 i = 0; i < studentIds.length; i++) {
            if (studentIds[i] == _id) {
                studentIds[i] = studentIds[studentIds.length - 1];
                studentIds.pop();
                break;
            }
        }
        
        emit StudentRemoved(_id);
    }
    
    function getStudentById(uint256 _id) external view returns (string memory) {
        require(students[_id].isRegistered, "Student not found");
        return students[_id].name;
    }
    
    function getAllStudents() external view returns (Student[] memory) {
        Student[] memory registeredStudents = new Student[](studentIds.length);
        for (uint256 i = 0; i < studentIds.length; i++) {
            registeredStudents[i] = students[studentIds[i]];
        }
        return registeredStudents;
    }
}
