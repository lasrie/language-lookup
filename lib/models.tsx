export interface Project{
    name: string;
    languages: {
        [key: string]: number;
    }
}

export interface Employee{
    name: string;
    login: string;
    avatar_url: string;
    repositories: Project[];
    repositoryCountPerLanguage: LanguageCount[];
}

export interface LanguageCount {
    language: string;
    count: number;
}

