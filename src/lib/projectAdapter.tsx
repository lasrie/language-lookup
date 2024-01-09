import { Octokit } from "octokit";
import { Employee, Project } from "./models";



export function fetchProjectsGraphQL(): Promise<Project[]> {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
  octokit.rest.users.getAuthenticated().then((res) => {
    console.log(res.data);
  });

  let response = octokit.graphql(`
  {
    organization(login: "codecentric") {
      name
      membersWithRole(first: 100) {
        totalCount
        nodes {
          login
          name
          contributionsCollection {
            commitContributionsByRepository {
              repository {
                name
                languages(first: 5) {
                  totalCount
                  edges {
                    size
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  `
  );

  return response.then((value) => {
    let projects: Project[] = [];
    console.log(value);
    
    return projects;
  });


}
export function fetchProjects(): Promise<Project[]> {
  let response = octokit.request("GET /orgs/{org}/repos", {
    org: "codecentric",
  });
  return response.then((value) => {
    let projects: Project[] = [];
    value.data.forEach((element: any) => {
      let languagesUsed = octokit.request("GET /repos/{owner}/{repo}/languages", {
        owner: "codecentric",
        repo: element.name,
      });
      let contributors = octokit.request("GET /repos/{owner}/{repo}/contributors", {
        owner: "codecentric",
        repo: element.name,
      });
      languagesUsed.then((res) => {
        console.log(res.data);
      });
      contributors.then((res) => {
        console.log(res.data);
      });

      let project: Project = {
        name: element.name,
        description: element.description,
        contributors: [],
        languages: [],
      };
      projects.push(project);
    });
    return projects;
  });
}

export function fetchEmployees(): Promise<Employee[]> {
  let response = octokit.request("GET /orgs/{org}/members", {
    org: "codecentric",
  });
  return response.then((value) => {
    let employees: Employee[] = [];
    value.data.forEach((element: any) => {
      let employee: Employee = {
        name: element.login,
        projects: [],
      };
      employees.push(employee);
    });
    return employees;
  });
}