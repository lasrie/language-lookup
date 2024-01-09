import Image from 'next/image'
import React from 'react'
import { Employee, Project } from '../lib/models';
import { fetchEmployeesAndProjects } from '../lib/projectAdapter';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

export default async function Home() {
    const employees: Employee[] = await retrieveEmployees();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 ">
       <EmployeeList employees={employees}/>
    </main>
  )
}

async function retrieveEmployees(): Promise<Employee[]> {
    const employees: Employee[] = await fetchEmployeesAndProjects();
    return employees;
  }
  

  function EmployeeList({employees: employees}: {employees: Employee[]}){
    return (
      <div className="grid grid-cols-4 gap-4 flex min-h-screen flex-col">
        {employees.map((employee: Employee) => (
        <Card key={employee.login} className="mb-12">
        <CardHeader>
            <Avatar>
                <AvatarImage src={employee.avatar_url} alt="avatarofuser" />
                <AvatarFallback>CC</AvatarFallback>
            </Avatar>
          <CardTitle>{employee.name}</CardTitle>
          <CardDescription>{employee.login}</CardDescription>
        </CardHeader>
        <CardContent>
        {employee.repositoryCountPerLanguage.map((languageCount) => {
            return (
                <div
                className="flex justify-between text-sm text-muted-foreground"
                key={languageCount.language}>
                {languageCount.language}
                <span>{languageCount.count}</span>
              </div>
            )
          })}
        <div className=" flex items-center space-x-4 rounded-md border p-4">
            <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                {employee.repositoryCountPerLanguage.length} languages
                </p>
                <p className="text-sm text-muted-foreground">
                {employee.repositories.length} repositories
                </p>
            </div>
            <div className="flex-1" />
        </div>


           {employee.repositories.map((repo: Project, index)=> (
            <div
              key={index}
              className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {repo.name}
                </p>
                <p className="text-sm text-muted-foreground">
                    {Object.keys(repo.languages).map((language) => (
                        <span key={language} className="mr-2">
                        {language}
                        </span>
                    ))}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
        ))}
      </div>
    )
    
  }
 
