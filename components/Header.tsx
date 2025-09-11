
import React from 'react';
import { ShoppingCartIcon, UserIcon, SearchIcon } from './Icons';
import { Page } from '../types';

interface HeaderProps {
    cartItemCount: number;
    setPage: (page: Page) => void;
    isLoggedIn: boolean;
}

const Header: React.FC<HeaderProps> = ({ cartItemCount, setPage, isLoggedIn }) => {
    
    const handleUserIconClick = () => {
        if (isLoggedIn) {
            setPage(Page.Dashboard);
        } else {
            setPage(Page.Login);
        }
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a href="#" onClick={() => setPage(Page.Home)} className="text-2xl font-bold text-gray-800">
                            شلوارکده
                        </a>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:block flex-1 max-w-lg mx-8">
                        <div className="relative">
                            <input
                                type="search"
                                placeholder="جستجو در میان محصولات..."
                                className="w-full bg-gray-100 border border-gray-200 rounded-full py-2 ps-10 pe-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-s-4">
                        <button onClick={handleUserIconClick} className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <UserIcon className="h-6 w-6" />
                        </button>
                        <div className="h-6 border-e border-gray-300 mx-2"></div>
                        <button onClick={() => setPage(Page.Cart)} className="relative p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <ShoppingCartIcon className="h-6 w-6" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -end-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
