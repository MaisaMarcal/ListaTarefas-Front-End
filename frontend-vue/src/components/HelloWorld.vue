<script setup>

import { ref } from "vue"

const texto = ref("")

const tarefas = ref([])

function adicionarTarefa() {

  if (texto.value.trim() === "") return

  tarefas.value.push({
    id: Date.now(),
    titulo: texto.value,
    concluida: false
  })

  texto.value = ""
}

</script>

<template>

  <h1>Lista de Tarefas</h1>

  <input
    v-model="texto"
    placeholder="Digite uma tarefa"
  >

  <button @click="adicionarTarefa">
    Adicionar
  </button>

</template>