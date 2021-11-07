import React from "react";

function SideBar() {
  return (
    <div className="fixed top-0 h-screen w-16 flex flex-col items-center bg-gray-800">
      <SideBarItem />
      <SideBarItem />
      <SideBarItem />
    </div>
  );
}

function SideBarItem() {
  return <div className="text-white font-bold text-lg">item</div>;
}

export default SideBar;
