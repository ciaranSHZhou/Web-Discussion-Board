<template>
  <div class="mx-3 my-3">
    <h2>Orders</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-table v-if="customer" :items="customer.orders" />
    
    <h2>Draft Order</h2>
    Check the ingredients you want:
    <b-form-checkbox-group v-model="draftOrderIngredients" :options="possibleIngredients" />
    <div class="mt-2">
      <b-button @click="save">Save</b-button>
    </div>
    <div class="mt-2">
      <b-button @click="submit">Submit</b-button>
      Note: must save before submitting
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, inject, Ref } from 'vue'
import { CustomerWithOrders } from "../../../server/data"

const customer: Ref<CustomerWithOrders | null> = ref(null)
const user: Ref<any> = inject("user")!

const draftOrderIngredients: Ref<string[]> = ref([])
const possibleIngredients: Ref<string[]> = ref([])

async function refresh() {
  possibleIngredients.value = await (await fetch("/api/possible-ingredients")).json()

  if (user.value) {
    customer.value = await (await fetch("/api/customer")).json()
    draftOrderIngredients.value = (await (await fetch("/api/customer/draft-order")).json())?.ingredients || []
  }
}
watch(user, refresh, { immediate: true })

async function save() {
  await fetch(
    "/api/customer/draft-order",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ ingredients: draftOrderIngredients.value })
    }
  )
}

async function submit() {
  await fetch(
    "/api/customer/submit-draft-order",
    { method: "POST" }
  )
  await refresh()
}
</script>