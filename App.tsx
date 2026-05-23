
import React, { useState, useCallback, useRef } from 'react';
import { SettingsPanel } from './components/SettingsPanel';
import { StoryboardPanel } from './components/StoryboardPanel';
import { Header } from './components/Header';
import { generateStoryboard, regenerateScene } from './services/geminiService';
import type { Settings, Scene } from './types';
import { DEFAULT_SETTINGS, DEFAULT_CHARACTER_BIBLE } from './constants';

const App: React.FC = () => {
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [characterBible, setCharacterBible] = useState<string>(DEFAULT_CHARACTER_BIBLE);
    const [storyboard, setStoryboard] = useState<Scene[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const importFileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerateStoryboard = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const newScenes = await generateStoryboard(settings, characterBible);
            setStoryboard(newScenes);
        } catch (e) {
            console.error(e);
            setError('Không thể tạo storyboard. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    }, [settings, characterBible]);

    const handleRegenerateScene = useCallback(async (sceneId: number) => {
        const sceneToRegenerate = storyboard.find(s => s.id === sceneId);
        if (!sceneToRegenerate) return;

        setIsLoading(true);
        setError(null);
        try {
            const regeneratedScene = await regenerateScene(settings, characterBible, sceneToRegenerate);
            setStoryboard(prev => prev.map(s => s.id === sceneId ? { ...s, basePromptEN: regeneratedScene.basePromptEN, basePromptVI: regeneratedScene.basePromptVI } : s));
        } catch (e) {
            console.error(e);
            setError(`Không thể tạo lại cảnh ${sceneId}. Vui lòng thử lại.`);
        } finally {
            setIsLoading(false);
        }
    }, [settings, characterBible, storyboard]);

    const handleUpdateScene = useCallback((sceneId: number, newBasePromptEN: string, newBasePromptVI: string) => {
        setStoryboard(prev => prev.map(s => s.id === sceneId ? { ...s, basePromptEN: newBasePromptEN, basePromptVI: newBasePromptVI } : s));
    }, []);

    const handleDeleteScene = useCallback((sceneId: number) => {
        setStoryboard(prev => prev.filter(s => s.id !== sceneId));
    }, []);

    const handleExport = () => {
        try {
            const data = { settings, characterBible, storyboard };
            const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
            const link = document.createElement("a");
            link.href = jsonString;
            link.download = "veo-storyboard.json";
            link.click();
        } catch (e) {
            setError("Lỗi khi xuất file JSON.");
        }
    };
    
    const handleImportClick = () => {
        importFileInputRef.current?.click();
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const result = e.target?.result as string;
                    const data = JSON.parse(result);
                    if (data.settings && typeof data.characterBible === 'string' && Array.isArray(data.storyboard)) {
                        setSettings(data.settings);
                        setCharacterBible(data.characterBible);
                        setStoryboard(data.storyboard);
                    } else {
                        setError("File JSON không hợp lệ.");
                    }
                } catch (err) {
                    setError("Lỗi khi đọc file.");
                }
            };
            reader.onerror = () => {
                setError("Lỗi khi đọc file.");
            }
            reader.readAsText(file);
        }
         // Reset file input to allow importing the same file again
        if(event.target) {
            event.target.value = '';
        }
    };


    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
            <Header onImport={handleImportClick} onExport={handleExport} />
            <input type="file" ref={importFileInputRef} onChange={handleImport} accept=".json" className="hidden" />
            
            <main className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
                <SettingsPanel
                    settings={settings}
                    setSettings={setSettings}
                    characterBible={characterBible}
                    setCharacterBible={setCharacterBible}
                    onGenerate={handleGenerateStoryboard}
                    isLoading={isLoading}
                />
                <StoryboardPanel
                    storyboard={storyboard}
                    characterBible={characterBible}
                    onUpdateScene={handleUpdateScene}
                    onDeleteScene={handleDeleteScene}
                    onRegenerateScene={handleRegenerateScene}
                    isLoading={isLoading}
                />
            </main>
            {error && (
                <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50">
                    <p>{error}</p>
                    <button onClick={() => setError(null)} className="absolute top-1 right-2 text-xl">&times;</button>
                </div>
            )}
        </div>
    );
};

export default App;
