
import React, { useState, useEffect, useRef } from 'react';
import type { Scene } from '../types';
import { Icon } from './Icon';

interface SceneCardProps {
    scene: Scene;
    sceneNumber: number;
    characterBible: string;
    onUpdate: (sceneId: number, newBasePromptEN: string, newBasePromptVI: string) => void;
    onDelete: (sceneId: number) => void;
    onRegenerate: (sceneId: number) => void;
}

interface PromptEditorProps {
    label: string;
    language: 'EN' | 'VI';
    fullPrompt: string;
    basePrompt: string;
    isEditing: boolean;
    onBasePromptChange: (newBasePrompt: string) => void;
}

const PromptDisplay: React.FC<PromptEditorProps> = ({ label, language, fullPrompt, basePrompt, isEditing, onBasePromptChange }) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing && textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [isEditing, basePrompt]);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(fullPrompt);
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-300">{label} ({language})</h4>
                <button onClick={handleCopy} className="text-gray-400 hover:text-cyan-400 transition-colors" title="Copy to clipboard">
                    <Icon name="copy" className="w-4 h-4" />
                </button>
            </div>
            {isEditing ? (
                <textarea
                    ref={textAreaRef}
                    value={basePrompt}
                    onChange={(e) => onBasePromptChange(e.target.value)}
                    className="w-full p-2 bg-gray-900 border border-cyan-500 rounded-md text-gray-200 text-sm font-mono focus:outline-none resize-none overflow-hidden"
                />
            ) : (
                <div className="p-3 bg-gray-800/50 rounded-md text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                    <span className="text-gray-500 italic block mb-2 opacity-70">[Character Bible prepended...]</span>
                    {basePrompt}
                </div>
            )}
        </div>
    );
};

export const SceneCard: React.FC<SceneCardProps> = ({ scene, sceneNumber, characterBible, onUpdate, onDelete, onRegenerate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedBaseEN, setEditedBaseEN] = useState(scene.basePromptEN);
    const [editedBaseVI, setEditedBaseVI] = useState(scene.basePromptVI);
    
    useEffect(() => {
        setEditedBaseEN(scene.basePromptEN);
        setEditedBaseVI(scene.basePromptVI);
    }, [scene.basePromptEN, scene.basePromptVI]);


    const handleSave = () => {
        onUpdate(scene.id, editedBaseEN, editedBaseVI);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedBaseEN(scene.basePromptEN);
        setEditedBaseVI(scene.basePromptVI);
        setIsEditing(false);
    };
    
    const fullPromptEN = `${characterBible}\n\n${scene.basePromptEN}`;
    const fullPromptVI = `${characterBible}\n\n${scene.basePromptVI}`;
    const editedFullPromptEN = `${characterBible}\n\n${editedBaseEN}`;
    const editedFullPromptVI = `${characterBible}\n\n${editedBaseVI}`;

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700/50 shadow-lg flex flex-col transition-all hover:border-cyan-700/50">
            <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Cảnh {sceneNumber}</h3>
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                           <button onClick={handleSave} className="px-3 py-1 text-sm bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors">Save</button>
                           <button onClick={handleCancel} className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 rounded-md transition-colors">Cancel</button>
                        </>
                    ) : (
                         <>
                            <button onClick={() => setIsEditing(true)} title="Chỉnh sửa" className="text-gray-400 hover:text-cyan-400 transition-colors p-1"><Icon name="edit" className="w-5 h-5"/></button>
                            <button onClick={() => onRegenerate(scene.id)} title="Tạo lại" className="text-gray-400 hover:text-cyan-400 transition-colors p-1"><Icon name="regenerate" className="w-5 h-5"/></button>
                            <button onClick={() => onDelete(scene.id)} title="Xóa" className="text-gray-400 hover:text-red-500 transition-colors p-1"><Icon name="delete" className="w-5 h-5"/></button>
                        </>
                    )}
                </div>
            </div>
            <div className="p-4 space-y-4 flex-grow">
                <PromptDisplay 
                    label="Prompt English"
                    language="EN"
                    fullPrompt={isEditing ? editedFullPromptEN : fullPromptEN}
                    basePrompt={editedBaseEN}
                    isEditing={isEditing}
                    onBasePromptChange={setEditedBaseEN}
                />
                 <PromptDisplay 
                    label="Prompt Vietnamese"
                    language="VI"
                    fullPrompt={isEditing ? editedFullPromptVI : fullPromptVI}
                    basePrompt={editedBaseVI}
                    isEditing={isEditing}
                    onBasePromptChange={setEditedBaseVI}
                />
            </div>
        </div>
    );
};
