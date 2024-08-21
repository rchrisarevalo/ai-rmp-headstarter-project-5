import React from "react";

interface DashboardProps {
  children: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  return (
    <div
      className="flex flex-col items-center h-96 max-sm:w-96 rounded-lg border border-solid border-black bg-white"
      style={{ overflowY: "scroll" }}
    >
      <div className="mt-10 ml-10 mr-10 mb-10 space-y-10">{children}</div>
    </div>
  );
};

export default Dashboard;
