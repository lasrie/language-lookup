import { Octokit } from "octokit";
import { Employee, LanguageCount, Project } from "./models";
import { GRAPHQL_GITHUB_QUERY } from "./utils";
import { env } from "process";



export async function fetchEmployeesAndProjects(): Promise<Employee[]> {
  const octokit = new Octokit({
    auth: env.GITHUB_TOKEN,
  });
  octokit.rest.users.getAuthenticated().then((res) => {
  });

  let response = await octokit.graphql(GRAPHQL_GITHUB_QUERY);
  let employees = extractDataFromResponse(response);
  return employees;
}

function extractDataFromResponse(response: any): Employee[] {
  let employees: Employee[] = [];
  let data = response.organization.membersWithRole.nodes;
  data.forEach((element: any) => {
    let employee: Employee = {
      name: element.name,
      login: element.login,
      avatar_url: element.avatarUrl,
      repositories: extractProjectsFromResponse(element.contributionsCollection.commitContributionsByRepository),
      repositoryCountPerLanguage: extractLanguageCountPerEmployeeFromResponse(element.contributionsCollection.commitContributionsByRepository)
    };
    employees.push(employee);
  });
  return employees;
}

function extractProjectsFromResponse(response: any): Project[] {
  let projects: Project[] = [];
  let data = response;
  data.forEach((element: any) => {
    let project: Project = {
      name: element.repository.name,
      languages: extractLanguagesFromResponse(element.repository.languages),
    };
    projects.push(project);
  });
  return projects;
}

function extractLanguagesFromResponse(response: any): { [key: string]: number }{
  let languages: { [key: string]: number } = {};
  let data = response.edges;
  data.forEach((element: any) => {
    languages[element.node.name] = element.size;
  });
  return languages;
}

function extractLanguageCountPerEmployeeFromResponse(response: any): LanguageCount[]{
  let repositoryCountPerLanguage: Map<string, number> = new Map();

  let repositories = response;
  repositories.forEach((repository: any)=> {
    let languages = repository.repository.languages;
    if(!languages){
      console.log(repository.repository.languages.edges, "No edge")
      // No language defined in github repo
      return;
    }

    languages.edges.forEach((language: any) => {
      if (repositoryCountPerLanguage.has(language.node.name)) {
        let currentCount = repositoryCountPerLanguage.get(language.node.name) || 0;
        repositoryCountPerLanguage.set(language.node.name, currentCount + 1);
      } else {
        repositoryCountPerLanguage.set(language.node.name, 1);
      }
    })
  })
  const repositoryCountArray = Array.from(repositoryCountPerLanguage, ([language, count]) => ({ language, count }));
  return repositoryCountArray;
}