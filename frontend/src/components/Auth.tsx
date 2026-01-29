'use client'
import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { gql } from "@apollo/client"
import { motion } from "framer-motion"

const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password)
    }
`;

const REGISTER_MUTATION = gql`
    mutation Register($email: String!, $password: String!) {
        register(email: $email, password: $password)
    }
`

export default function Auth({ onLogin }: { onLogin: () => void }) {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [login] = useMutation(LOGIN_MUTATION)
    const [register] = useMutation(REGISTER_MUTATION)

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const { data } = await login({ variables: { email, password } });
                localStorage.setItem('token', data.login)
                onLogin()
            } else {
                await register({ variables: { email, password } });
                alert("Conta criada! Agora faça o login.")
                setIsLogin(true)
            }
        } catch (err: any) {
            alert(err.message)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mt-20 p-8 bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl"
        >
            <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">
                {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email" placeholder="E-mail"
                    className="p-3 bg-gray-900 rounded border border-gray-600 focus::border-blue-500 outline-none"
                    onChange={e => setEmail(e.target.value)} required
                />
                <input
                    type="password" placeholder="Senha"
                    className="p-3 bg-gray-900 rounded border border-gray-600 focus::border-blue-500 outline-none"
                    onChange={e => setPassword(e.target.value)} required
                />
                <button className="bg-blue-600 hover:bg-blue-500 py-3 rounded font-bold transition">
                    {isLogin ? 'Entrar' : 'Cadastrar'}
                </button>
            </form>

            <button
                onClick={() => setIsLogin(!isLogin)}
                className="mt-4 text-sm text-gray-400 hover:text-white w-full text-center"
            >
                {isLogin ? 'Não tem conta? Registre-se' : 'Já tem conta? Faça login'}
            </button>
        </motion.div>
    )
}