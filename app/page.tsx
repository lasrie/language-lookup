import Image from 'next/image'
import React from 'react'
import { Employee } from '../lib/models';
import { fetchEmployeesAndProjects } from '../lib/projectAdapter';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

export default async function Home() {
    const employees: Employee[] = await retrieveEmployees();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
       <EmployeeList employees={employees}/>
    </main>
  )
}

async function retrieveEmployees(): Promise<Employee[]> {
    const employees: Employee[] = await fetchEmployeesAndProjects();
    return employees;
  }
  

  function EmployeeList({employees}){
    return (
      <div>
        {employees.map((employee) => (
        <Card key={employee.login}>
        <CardHeader>
            <Avatar>
                <AvatarImage src={employee.avatar_url} alt="avatorOf" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          <CardTitle>{employee.name}</CardTitle>
          <CardDescription>{employee.login}</CardDescription>
        </CardHeader>
        <CardContent>
         
          {employee.repositoryCountPerLanguage.map((languageCount) => {
            return (
              <div key={languageCount.language}>
                <p>{languageCount.language}</p>
                <p>{languageCount.count}</p>
              </div>
            )
          })}
        </CardContent>
      </Card>
        ))}
      </div>
    )
    
  }
 
