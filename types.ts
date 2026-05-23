
export interface Settings {
    context: string;
    videoIdea: string;
    genre: string;
    aspectRatio: '16:9' | '9:16';
    numScenes: number;
}

export interface Scene {
    id: number;
    basePromptEN: string;
    basePromptVI: string;
}
