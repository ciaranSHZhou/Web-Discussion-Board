<template>
  <div class="mx-3 my-3">
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-table :items="orders" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const orders: Ref<Order[]> = ref([])

async function refresh() {
  orders.value = await (await fetch("/api/orders")).json()
}
onMounted(refresh)
</script>