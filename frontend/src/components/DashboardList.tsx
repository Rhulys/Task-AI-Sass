'use client'
import { useQuery, useMutation } from "@apollo/client/react";
import { motion, AnimatePresence } from "framer-motion";
import { gql } from "@apollo/client";
import { useState } from "react";

const GET_TASKS = gql`
  query GetTasks {
    getTasks{
      id
      title
      complexity
      predictedTime
      status
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

const COMPLETE_TASK = gql`
  mutation CompleteTask($id: ID!, $actualTimeSpent: Float!) {
    completeTask(id: $id, actualTimeSpent: $actualTimeSpent) {
      id
      status
    }
  }
`

const UPDATE_TASK = gql`
    mutation UpdateTask($id: ID!, $title: String, $complexity: Int, $category: String){
        updateTask(id: $id, title: $title, complexity: $complexity, category: $category) {
            id
            title
            predictedTime
        }
    }
`

export default function DashboardList() {
    const { loading, error, data } = useQuery(GET_TASKS);
    const [deleteTask] = useMutation(DELETE_TASK, { refetchQueries: [{ query: GET_TASKS }] });
    const [completeTask] = useMutation(COMPLETE_TASK, { refetchQueries: [{ query: GET_TASKS }] })
    const [editingTask, setEditingTask] = useState<any>(null);
    const [updateTask] = useMutation(UPDATE_TASK, { refetchQueries: [{ query: GET_TASKS }] })

    const handleDelete = (id: string) => {
        if (window.confirm("Deseja mesmo excluir esta tarefa?")) {
            deleteTask({ variables: { id } })
        }
    }

    const handleComplete = (id: string) => {
        const time = prompt("Quanto tempo (em horas) você realmente levou?");
        if (time) {
            completeTask({ variables: { id, actualTimeSpent: parseFloat(time) } })
        }
    }

    const handleUpdate = async (e: React.SubmitEvent) => {
        e.preventDefault()
        await updateTask({
            variables: {
                id: editingTask.id,
                title: editingTask.title,
                complexity: Number(editingTask.complexity),
                category: editingTask.category
            }
        })
        setEditingTask(null)
    }

    if (loading) return <p className="text-center mt-10">Carregando cérebro da IA...</p>

    const tasks = data.getTasks;
    const highComplexityTasks = tasks.filter((t: any) => t.complexity >= 4 && t.status !== 'DONE')

    return (
        <main className="p-8 bg-gray-900 min-h-screen text-white">

            <div className="max-w-6xl mx-auto">

                <div className="mb-8">
                    {highComplexityTasks.length > 3 && (
                        <motion.div
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="bg-red-900/30 border border-red-500 p-4 rounded-lg text-red-200"
                        >
                            ⚠️ **Alerta de Gargalo:** Você tem muitas tarefas complexas pendentes.
                            A IA sugere focar em Backend para evitar atrasos.
                        </motion.div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {data.getTasks.map((task: any) => (
                            <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, x: -50 }}
                                whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.3" }}
                                className="p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500 transition">
                                {editingTask?.id === task.id ? (
                                    <form onSubmit={handleUpdate} className="space-y-3">
                                        <input
                                            className="w-full p-2 bg-gray-900 rounded border border-blue-500"
                                            value={editingTask.title}
                                            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                                        />
                                        <div className="flex gap-2">
                                            <p>Complexidade:</p>
                                            <select
                                                className="flex-1 p-2 bg-gray-900 rounded"
                                                value={editingTask.complexity}
                                                onChange={(e) => setEditingTask({ ...editingTask, complexity: e.target.value })}
                                            >
                                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                                            </select>
                                            <button type="submit" className="bg-green-600 px-4 py-1 rounded">Salvar</button>
                                            <button onClick={() => setEditingTask(null)} className="bg-gray-600 px-4 py-1 rounded">X</button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="flex justify-between">
                                            <h2 className="text-xl font-bold">{task.title}</h2>
                                            <button
                                                onClick={() => setEditingTask(task)}
                                                className="text-blue-400 hover:underline text-sm"
                                            >
                                                Editar
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="text-red-500 hover:text-red-400 text-sm"
                                        >
                                            Excluir
                                        </button>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">Complexidade: {task.complexity}</span>
                                            <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-xs">
                                                {task.status}
                                            </span>
                                        </div>
                                        <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                                            <p className="text-xs text-gray-400 uppercase tracking-wider">Previsão da IA</p>
                                            <p className={`text-2xl font-mono ${task.predictedTime > 15 ? 'text-orange-500' : 'text-green-400'}`}>
                                                {task.predictedTime?.toFixed(1)} <span className="text-sm text-gray-500">horas</span>
                                            </p>
                                        </div>
                                        {task.status !== 'DONE' && (
                                            <button
                                                onClick={() => handleComplete(task.id)}
                                                className="mt-4 w-full bg-green-700 hover:bg-green-600 text-white py-1 rounded text-sm transition"
                                            >
                                                Concluir Tarefa
                                            </button>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </main >
    )
}