import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const GRAPHQL_GITHUB_QUERY = `{
  organization(login: "codecentric") {
    name
    membersWithRole(first: 100) {
      totalCount
      nodes {
        login
        name
        avatarUrl
        contributionsCollection {
          commitContributionsByRepository {
            repository {
              name
              description
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
}`;
