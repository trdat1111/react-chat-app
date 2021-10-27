import React from "react";

function TopBar() {
  return (
    <div className="flex flex-row w-full h-12 justify-around items-center ml-16 bg-gray-700">
      <TopBarItem />
      <TopBarItem />
      <TopBarItem />
    </div>
  );
}

function TopBarItem() {
  return <div className="text-lg font-bold text-white">item</div>;
}

export default TopBar;
