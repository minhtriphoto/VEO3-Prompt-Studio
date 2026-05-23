
import React from 'react';
import type { Settings } from '../types';
import { GENRE_OPTIONS } from '../constants';

interface SettingsPanelProps {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    characterBible: string;
    setCharacterBible: (value: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
}

const InputField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        {children}
    </div>
);

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, setSettings, characterBible, setCharacterBible, onGenerate, isLoading }) => {
    
    const handleSettingChange = <K extends keyof Settings,>(key: K, value: Settings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };
    
    return (
        <aside className="w-full lg:w-1/3 xl:w-1/4 bg-gray-900/50 border-r border-gray-700/50 p-6 flex flex-col space-y-6 overflow-y-auto">
            <h2 className="text-lg font-semibold text-white">Thiết lập đầu vào</h2>

            <InputField label="Bối cảnh (Tùy chọn)">
                <input
                    type="text"
                    value={settings.context}
                    onChange={(e) => handleSettingChange('context', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
                />
            </InputField>

            <InputField label="Ý tưởng video / Kịch bản tóm tắt">
                <textarea
                    value={settings.videoIdea}
                    onChange={(e) => handleSettingChange('videoIdea', e.target.value)}
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
                />
            </InputField>

            <InputField label="Character Bible (Mô tả nhân vật)">
                <textarea
                    value={characterBible}
                    onChange={(e) => setCharacterBible(e.target.value)}
                    rows={12}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200 font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Dán Character Bible của bạn vào đây..."
                />
            </InputField>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <InputField label="Thể loại">
                    <select
                        value={settings.genre}
                        onChange={(e) => handleSettingChange('genre', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
                    >
                        {GENRE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </InputField>

                <InputField label="Tỉ lệ khung hình">
                    <select
                        value={settings.aspectRatio}
                        onChange={(e) => handleSettingChange('aspectRatio', e.target.value as '16:9' | '9:16')}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
                    >
                        <option value="16:9">16:9 (Ngang)</option>
                        <option value="9:16">9:16 (Dọc)</option>
                    </select>
                </InputField>
            </div>
           
            <InputField label="Số lượng cảnh (Tùy chọn)">
                <input
                    type="number"
                    value={settings.numScenes}
                    onChange={(e) => handleSettingChange('numScenes', Math.max(1, parseInt(e.target.value, 10) || 1))}
                    min="1"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
                />
            </InputField>

            <div className="flex-grow"></div>

            <button
                onClick={onGenerate}
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 bg-cyan-600 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
                 {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang tạo...
                    </>
                ) : 'Generate Storyboard'}
            </button>
        </aside>
    );
};
