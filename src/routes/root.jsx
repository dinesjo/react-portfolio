import { Fragment, useState } from 'react'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { FaHome, FaCopy, FaEnvelope, FaCertificate } from 'react-icons/fa'

const SideBar = () => {
  return (
    <div className="fixed top-0 left-0 w-screen shadow flex justify-center gap-5 bg-neutral-800 z-50">
      <SideBarItem name="App" icon={<FaHome />} to="/" />
      <SideBarItem name="Projects" icon={<FaCertificate />} to="/projects" />
      <SideBarItem name="Contact" icon={<FaEnvelope />} to="/contact" />
    </div>
  )
}

const SideBarItem = ({ name, icon, to }) => {
  let current = useLocation().pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center p-2 text-lg font-semibold rounded-md transition-all ${current ? 'text-indigo-500' : 'text-zinc-300 hover:text-indigo-500'}`}
      onClick={() => {console.log(current)}}
    >
      <span className="text-xl">{icon}</span>
      <span className="ml-2">{name}</span>
    </Link>
  )
}

export default function Root() {
  return (
    <div className="flex flex-col min-h-screen">
      <SideBar />
      <Outlet />
    </div>
  )
}