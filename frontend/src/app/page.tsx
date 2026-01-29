'use client';
import { ApolloProvider } from "@apollo/client/react";
import { client } from "@/lib/apollo-client";
import { useState, useEffect } from "react";
import TaskForm from "@/components/TaskForm";
import Auth from "@/components/Auth";
import DashboardList from "@/components/DashboardList";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true)
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false)
  }

  return (
    <ApolloProvider client={client}>
      <main className="p-8 bg-gray-900 min-h-screen text-white">
        {!isAuthenticated ? (
          <Auth onLogin={() => setIsAuthenticated(true)} />
        ) : (
          <div className="max-w-6xl mx-auto">
            <header className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-blue-400 italic">TaskFlow AI</h1>
              <button onClick={handleLogout} className="text-sm bg-gray-700 px-4 py-2 rounded hover:bg-red-600">Sair</button>
            </header>
            <TaskForm />
            <DashboardList />
          </div>
        )}
      </main>
    </ApolloProvider>
  )
}