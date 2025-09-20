import React, { useState } from "react";
import { projectlist, taskmanagementlist } from "../assets/assets";

const Project = () => {
    const [color , setcolor] = useState('gray')
  return (
    <div className="h-screen">
      <div className="flex items-center justify-between">
        <h1 className="max-md:hidden md:text-xl md:font-semibold">
          Project Management
        </h1>
        <div className="flex gap-3 justify-between w-lg">
          <div className="">
            <input
              type="text"
              placeholder="search..."
              className="border px-4 py-2 rounded-lg outline-none"
            />
          </div>
          <button
            className="bg-blue-500 py-1 px-1 md:py-0 md:px-4 rounded-lg text-sm 
          md:text-base max-sm:hidden "
          >
            + Add Project
          </button>
        </div>
      </div>
      <div className="border border-t-1 my-4 opacity-70"></div>

      {/* card */}
      <div className="flex flex-wrap gap-10">
        {projectlist.map((item, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 shadow-sm p-5 rounded-lg border max-w-60 w-56"
          >
            <h1 className="text-base md:text-lg font-semibold  ">
              {item.name}
            </h1>
            <p className={`bg-gray-200 rounded-lg text-center max-w-24 px-2`}>
              {item.state}
              
            </p>
         <p className="">{item.time}</p>
            <img src={item.img} alt="" className="w-10" />
            <p className="flex w-sm justify-between items-center">
              <span className="">Progress</span>
              {item.progress}
            </p>
          </div>
        ))}
      </div>

      {/* task-managemnt */}
      <div className=" ">
        <h1 className="text-2xl font-semibold py-4">Task Mangement</h1>
        <div className="flex flex-wrap gap-10">
          {taskmanagementlist.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 shadow-sm p-5 rounded-lg border max-w-60 w-56"
            >
                <h1 className="text-lg font-semibold">{item.name}</h1>

              <div className=" border p-4 rounded-lg border-gray-300/70 py-2">
                <p className="">{item[1]}</p>
                <img src={item.img1} alt="" className="w-10" />
              </div>
            
              <div className=" border p-4 rounded-lg border-gray-300/70">
              <p className="">{item[2]}</p>
              <img src={item.img2} alt="" className="w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Project;
