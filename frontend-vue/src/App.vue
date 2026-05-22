<script setup>
import { ref, onMounted } from "vue";
import api from "./services/api";

const tarefas = ref([]);
const novaTarefa = ref("");

// LISTAR
const carregarTarefas = async () => {

  try {

    const response = await api.get("/tarefas");

    tarefas.value = response.data;

  } catch (error) {

    console.error(error);
  }
};

// CRIAR
const criarTarefa = async () => {

  if (!novaTarefa.value.trim()) return;

  try {

    await api.post("/tarefas", {
      text: novaTarefa.value,
      status: "PENDENTE"
    });

    novaTarefa.value = "";

    carregarTarefas();

  } catch (error) {

    console.error(error);
  }
};

// MOVER STATUS
const moverStatus = async (tarefa, novoStatus) => {

  try {

    await api.put(`/tarefas/${tarefa.id}`, {
      id: tarefa.id,
      text: tarefa.text,
      status: novoStatus
    });

    carregarTarefas();

  } catch (error) {

    console.error(error);
  }
};

// EXCLUIR
const excluir = async (id) => {

  try {

    await api.delete(`/tarefas/${id}`);

    carregarTarefas();

  } catch (error) {

    console.error(error);
  }
};

onMounted(() => {
  carregarTarefas();
});
</script>

<template>
  <div class="container">
    <h1>Meu Kanban Vue</h1>

    <div class="input-area">
      <input
        v-model="novaTarefa"
        placeholder="Digite uma nova tarefa..."
      />

      <button @click="criarTarefa">
        Criar
      </button>
    </div>

    <div class="kanban">

      <!-- PENDENTE -->
      <div class="coluna">
        <h2>
          🕓 Pendentes
          ({{ tarefas.filter(t => t.status === 'PENDENTE').length }})
        </h2>

        <div
          v-for="tarefa in tarefas.filter(t => t.status === 'PENDENTE')"
          :key="tarefa.id"
          class="card"
        >
          <p>{{ tarefa.text }}</p>

          <div class="acoes">
            <button
              class="primary"
              @click="moverStatus(tarefa, 'EM_EXECUCAO')"
            >
              Iniciar
            </button>

            <button
              class="danger"
              @click="excluir(tarefa.id)"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>

      <!-- EXECUÇÃO -->
      <div class="coluna">
        <h2>
          ⚡ Em Execução
          ({{ tarefas.filter(t => t.status === 'EM_EXECUCAO').length }})
        </h2>

        <div
          v-for="tarefa in tarefas.filter(t => t.status === 'EM_EXECUCAO')"
          :key="tarefa.id"
          class="card"
        >
          <p>{{ tarefa.text }}</p>

          <div class="acoes">

            <button
              class="primary"
              @click="moverStatus(tarefa, 'PENDENTE')"
            >
              Voltar
            </button>

            <button
              class="success"
              @click="moverStatus(tarefa, 'CONCLUIDO')"
            >
              Concluir
            </button>

          </div>
        </div>
      </div>

      <!-- CONCLUÍDO -->
      <div class="coluna">
        <h2>
          ✅ Concluídas
          ({{ tarefas.filter(t => t.status === 'CONCLUIDO').length }})
        </h2>

        <div
          v-for="tarefa in tarefas.filter(t => t.status === 'CONCLUIDO')"
          :key="tarefa.id"
          class="card concluido"
        >
          <p>{{ tarefa.text }}</p>

          <div class="acoes">

            <button
              class="primary"
              @click="moverStatus(tarefa, 'EM_EXECUCAO')"
            >
              Reabrir
            </button>

            <button
              class="danger"
              @click="excluir(tarefa.id)"
            >
              Excluir
            </button>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Inter", sans-serif;

  background:
    radial-gradient(circle at top left, #312e81, transparent 30%),
    radial-gradient(circle at bottom right, #0f172a, transparent 35%),
    #020617;

  color: white;
  min-height: 100vh;
}

.container {
  width: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 40px;
}

h1 {
  font-size: 4rem;
  font-weight: 900;

  margin-bottom: 45px;

  background: linear-gradient(
    90deg,
    #38bdf8,
    #818cf8,
    #c084fc
  );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  letter-spacing: -3px;
}

.input-area {
  width: 100%;
  max-width: 1100px;

  display: flex;
  gap: 18px;

  margin-bottom: 45px;
}

.input-area input {
  flex: 1;
  height: 75px;

  padding: 0 28px;

  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;

  background: rgba(255,255,255,0.08);

  backdrop-filter: blur(12px);

  color: white;
  font-size: 18px;

  transition: 0.3s;
}

.input-area input::placeholder {
  color: #cbd5e1;
}

.input-area input:focus {
  outline: none;

  border-color: #60a5fa;

  transform: scale(1.01);
}

.input-area button {
  width: 170px;

  border: none;
  border-radius: 24px;

  background: linear-gradient(
    135deg,
    #3b82f6,
    #8b5cf6
  );

  color: white;
  font-size: 18px;
  font-weight: 800;

  cursor: pointer;

  transition: 0.3s;

  box-shadow:
    0 10px 25px rgba(59,130,246,0.35);
}

.input-area button:hover {
  transform: translateY(-3px);
}

.kanban {
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: stretch;

  gap: 30px;
}

.coluna {
  width: 390px;
  min-height: 760px;

  padding: 28px;

  border-radius: 32px;

  background: rgba(255,255,255,0.06);

  border: 1px solid rgba(255,255,255,0.08);

  backdrop-filter: blur(18px);

  box-shadow:
    0 25px 45px rgba(0,0,0,0.35),
    inset 0 1px 0 rgba(255,255,255,0.05);

  transition: 0.3s;
}

.coluna:hover {
  transform: translateY(-6px);
}

.coluna h2 {
  font-size: 1.6rem;
  font-weight: 800;

  margin-bottom: 28px;
}

.card {
  position: relative;

  padding: 22px;

  margin-bottom: 18px;

  border-radius: 24px;

  background: linear-gradient(
    145deg,
    rgba(255,255,255,0.12),
    rgba(255,255,255,0.05)
  );

  border: 1px solid rgba(255,255,255,0.08);

  overflow: hidden;

  transition: 0.35s;
}

.card::before {
  content: "";

  position: absolute;

  width: 140px;
  height: 140px;

  background: rgba(255,255,255,0.04);

  border-radius: 50%;

  top: -60px;
  right: -60px;
}

.card:hover {
  transform: translateY(-5px) scale(1.02);

  box-shadow:
    0 20px 35px rgba(0,0,0,0.35);
}

.card p {
  position: relative;
  z-index: 1;

  font-size: 16px;
  line-height: 1.5;

  margin-bottom: 20px;

  color: #f8fafc;
}

.acoes {
  display: flex;
  gap: 10px;

  position: relative;
  z-index: 1;
}

.card button {
  border: none;

  padding: 12px 18px;

  border-radius: 14px;

  font-size: 13px;
  font-weight: 800;

  cursor: pointer;

  transition: 0.3s;
}

.card button:hover {
  transform: scale(1.05);
}

.primary {
  background: linear-gradient(
    135deg,
    #06b6d4,
    #3b82f6
  );

  color: white;
}

.success {
  background: linear-gradient(
    135deg,
    #10b981,
    #22c55e
  );

  color: white;
}

.danger {
  background: rgba(255,255,255,0.08);

  color: #f8fafc;
}

.concluido {
  opacity: 0.85;
}

@media (max-width: 1400px) {
  .kanban {
    flex-direction: column;
    align-items: center;
  }

  .coluna {
    width: 100%;
    max-width: 850px;
    min-height: 500px;
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.6rem;
    text-align: center;
  }

  .container {
    padding: 20px;
  }

  .input-area {
    flex-direction: column;
  }

  .input-area input {
    width: 100%;
  }

  .input-area button {
    width: 100%;
    height: 70px;
  }

  .coluna {
    padding: 22px;
  }
}
</style>