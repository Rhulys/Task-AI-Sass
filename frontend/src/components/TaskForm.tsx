'use client'

import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { gql } from "@apollo/client"

const CREATE_TASK = gql`
    mutation CreateTask($title: String!, $complexity: Int!, $category: String!) {
        createTask(title: $title, complexity: $complexity, category: $category) {
            id
            title
            predictedTime
        }
    }
`
const GET_TASKS = gql`
    query GetTasks {
        getTasks {
            id
            title
            complexity
            predictedTime
            status
        }
    }
`

export default function TaskForm() {
    const [title, setTitle] = useState('')
    const [complexity, setComplexity] = useState(1)
    const [category, setCategory] = useState('Frontend')

    const [createTask, { loading }] = useMutation(CREATE_TASK, {
        refetchQueries: [{ query: GET_TASKS }]
    });

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        await createTask({ variables: { title, complexity: Number(complexity), category } })
        setTitle('')
    };

    return (
        <form onSubmit={handleSubmit} className="mb-10 p-6 bg-gray-800 rounded-xl border border-gray-700">
            <h2 className="text-xl mb-4 text-blue-400 font-bold">Nova Tarefa</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                    placeholder="O que precisa ser feito?"
                    className="p-2 rounded bg-gray-900 border border-gray-600 focus:border-blue-500 outline-none md:col-span-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <select
                    className="p-2 rounded bg-gray-900 border border-gray-600"
                    value={complexity}
                    onChange={(e) => setComplexity(Number(e.target.value))}
                >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>Complexidade {n}</option>)}
                </select>

                <select
                    className="p-2 rounded bg-gray-900 border border-gray-600"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Design">Design</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded transition shadow-lg"
            >
                {loading ? 'IA Processando...' : 'Adicionar Tarefa com Previsão'}
            </button>
        </form>
    )
}