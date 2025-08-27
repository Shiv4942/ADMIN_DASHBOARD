import React from 'react'
import search from '../assets/search.svg'
import { find } from '../assets/assets'
import { medicine } from '../assets/assets'

const DrugAndMed = () => {
  return (
    <>
    {/* search section */}
    <div className='flex flex-col items-center justify-center text-center w-full'>
        <h1 className='text-center text-4xl font-semibold text-blue-900'>Drugs & Medictions </h1>
        <p className='py-4 text-sm md:text-lg'>Your trusted source of information for prescription drugs and medications
        </p>
        <div className="w-full flex flex-col justify-center items-center bg-blue-100/50 px-10 py-10 rounded-lg">
            <div className="w-full bg-white flex justify-between gap-4 ">
                <input type="text" placeholder='Enter medication name to searchs' className='outline-none w-full px-10 py-2 transition-all duration-200 hover:ring-1 ring-blue-700' />
                <button className='px-3'>
                    <img src={search} alt="" className='h-6 bg-transparent '  />
                </button>
            </div>
            <div className="flex justify-between items-center w-full mt-7 max-md:flex-col max-md:items-start max-sm:text-sm">
                <div className="flex gap-2 ">
                     <p className="">Search Medicatons by Letter</p>
                     <select name="" id="" className='outline-none'>
                        <option value="Select">Select</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                     </select>
                </div>
               
                <p className="">Search Mediactions by Condition</p>
                <p className=''>Find Off-market Medications</p>
            </div>
            
        </div>
    </div>
    {/* ImageList with name */}
    <div className="flex justify-between items-center w-full my-10 max-md:flex-col">
        {
            find.map((item,i)=>(
                <div key={i} className="flex flex-col items-center p-8 justify-center">
                    <div className="bg-blue-100/50 rounded-full h-24 w-24 flex items-center justify-center ">
                        <img src={item.image} alt="" className='w-14 ' />
                    </div>
                    <h1 className='py-4 font-semibold'>{item.name}</h1>
                </div>
            ))
        }
    </div>
    {/* Top medicine */}
    <div className="flex flex-col items-center justify-center w-full my-10">
        <h1 className="text-3xl font-semibold text-blue-900 my-6">Top Searched Medications</h1>
        <div className="grid grid-cols-6 gap-6 w-full max-md:grid-cols-3">
        {
            medicine.map((i)=>(
            <div key={i} className="font-medium">
                {i}
            </div>
            ))
       }
        </div>
      
    </div>
    </>
  )
}

export default DrugAndMed