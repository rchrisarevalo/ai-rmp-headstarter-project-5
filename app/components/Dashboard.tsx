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
      <div className="mt-6 ml-6 mr-6 mb-6 space-y-6">{children}</div>
    </div>
  );
};

export default Dashboard;
