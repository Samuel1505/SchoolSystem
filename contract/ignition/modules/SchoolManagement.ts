// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SchoolManagementModule = buildModule("SchoolManagementModule", (m) => {


  const classregister = m.contract("SchoolManagement");

  return { classregister };
});

export default SchoolManagementModule;
