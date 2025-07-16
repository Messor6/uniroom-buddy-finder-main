import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
    university: "",
    course: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/users", form);
      alert("Usuário cadastrado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      alert("Erro ao cadastrar usuário.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
            Criar Conta
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              name="name"
              placeholder="Nome"
              value={form.name}
              onChange={handleChange}
              required
              className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              name="email"
              placeholder="E-mail"
              value={form.email}
              onChange={handleChange}
              required
              className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              name="city"
              placeholder="Cidade"
              value={form.city}
              onChange={handleChange}
              required
              className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              name="university"
              placeholder="Universidade"
              value={form.university}
              onChange={handleChange}
              required
              className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              name="course"
              placeholder="Curso"
              value={form.course}
              onChange={handleChange}
              required
              className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-md transition"
            >
              Cadastrar
            </button>
          </form>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
            >
              Já tem conta? Faça login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}