
import React from 'react';
import { Icon } from './Icon';

interface HeaderProps {
    onImport: () => void;
    onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onImport, onExport }) => {
    return (
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 p-4 h-16 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400">
                    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 12V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 4.5L7 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1 className="text-xl font-bold text-white">VEO 3 Prompt Studio</h1>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={onImport}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                    <Icon name="upload" className="w-4 h-4" />
                    Import JSON
                </button>
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                    <Icon name="download" className="w-4 h-4" />
                    Export JSON
                </button>
            </div>
        </header>
    );
};
