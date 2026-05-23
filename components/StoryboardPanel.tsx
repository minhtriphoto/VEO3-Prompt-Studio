
import React from 'react';
import type { Scene } from '../types';
import { SceneCard } from './SceneCard';

interface StoryboardPanelProps {
    storyboard: Scene[];
    characterBible: string;
    onUpdateScene: (sceneId: number, newBasePromptEN: string, newBasePromptVI: string) => void;
    onDeleteScene: (sceneId: number) => void;
    onRegenerateScene: (sceneId: number) => void;
    isLoading: boolean;
}

export const StoryboardPanel: React.FC<StoryboardPanelProps> = ({ storyboard, characterBible, onUpdateScene, onDeleteScene, onRegenerateScene, isLoading }) => {
    return (
        <section className="flex-1 w-full lg:w-2/3 xl:w-3/4 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Storyboard</h2>

            {isLoading && storyboard.length === 0 && (
                <div className="text-center text-gray-400">
                    <svg className="animate-spin mx-auto h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2">Đang tạo storyboard của bạn...</p>
                </div>
            )}
            
            {!isLoading && storyboard.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line>
                        <line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line>
                    </svg>
                    <h3 className="text-xl font-semibold">Storyboard trống</h3>
                    <p className="mt-1">Nhập các thiết lập và nhấn "Generate Storyboard" để bắt đầu.</p>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                {storyboard.map((scene, index) => (
                    <SceneCard
                        key={scene.id}
                        scene={scene}
                        sceneNumber={index + 1}
                        characterBible={characterBible}
                        onUpdate={onUpdateScene}
                        onDelete={onDeleteScene}
                        onRegenerate={onRegenerateScene}
                    />
                ))}
            </div>
        </section>
    );
};
