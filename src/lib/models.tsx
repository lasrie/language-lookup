export interface Project{
    name: string;
    description: string;
    contributors: string[];
    languages: string[];
}

export interface Employee{
    name: string;
    projects: Project[];
}