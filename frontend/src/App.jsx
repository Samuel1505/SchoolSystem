import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./abi.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const App = () => {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length === 0) {
        console.error("No accounts found");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      setProvider(provider);
      setContract(contract);
      setAccount(accounts[0]);
      fetchStudents(contract);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  const fetchStudents = async (contract) => {
    try {
      const students = await contract.getAllStudents();
      setStudents(students);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const registerStudent = async () => {
    if (contract && studentId && studentName) {
      try {
        const tx = await contract.registerStudent(studentId, studentName);
        await tx.wait();
        fetchStudents(contract);
      } catch (error) {
        console.error("Error registering student:", error);
      }
    }
  };

  const removeStudent = async (id) => {
    if (contract) {
      try {
        const tx = await contract.removeStudent(id);
        await tx.wait();
        fetchStudents(contract);
      } catch (error) {
        console.error("Error removing student:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">School Management System</h1>
      {account ? (
        <p>Connected Account: {account}</p>
      ) : (
        <button onClick={connectWallet} className="bg-green-500 text-white p-2">Connect Wallet</button>
      )}

      <div className="mt-4">
        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={registerStudent} className="bg-blue-500 text-white p-2" disabled={!account}>Register Student</button>
      </div>

      <h2 className="mt-6 text-xl font-bold">Registered Students</h2>
      <ul>
        {students.map((student, index) => (
          <li key={index} className="flex justify-between border p-2 mt-2">
            {student.id.toString()} - {student.name}
            <button onClick={() => removeStudent(student.id)} className="bg-red-500 text-white p-2">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
