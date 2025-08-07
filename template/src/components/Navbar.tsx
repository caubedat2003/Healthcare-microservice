import React from 'react';
import logo from '../assets/logo.svg';

const Navbar = () => {
    return (
        <header className="bg-white shadow fixed top-0 w-full z-20">
            <div className="container mx-auto flex justify-between items-center p-4">
                <a className="w-50 cursor-pointer " href="/">
                    <img src={logo} alt="Logo" />
                </a>

                <nav className='flex gap-4 items-center'>
                    <a href="/appointment" className='text-md font-bold'>APPOINTMENT</a>
                    <a href="/doctors" className='text-md font-bold'>DOCTORS</a>
                    <a href="/about" className='text-md font-bold'>ABOUT</a>
                    <a href="/contact" className='text-md font-bold'>CONTACT</a>
                    <div>
                        {/* Btn Login & Register here */}
                        {/* If user is logged in, show username & logout button */}
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;