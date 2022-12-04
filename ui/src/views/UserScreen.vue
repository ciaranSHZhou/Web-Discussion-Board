<template>
  <div class="mx-3 my-3">
    <h2>Posts</h2>
    <b-container fluid class="my-4">
      <b-row>
        <b-col xs="12" sm="4">
          <b-card no-body class="mb-3">
            <template #header>
              <div class="d-flex justify-content-between align-items-center">
                Lists
                <b-button class="ml-3" size="sm" @click="refreshPosts"><b-icon-arrow-clockwise /></b-button>
              </div>
            </template>
            <b-list-group flush>
              <b-list-group-item
                v-for="post, i in posts"
                :key="i"
                class="d-flex justify-content-between align-items-center"
                :class="{ 'font-weight-bold': selectedPost?.id === post.id }"
              >
                <span @click="selectPost(post.id)" title="list.id">{{ post.title }}</span>
              </b-list-group-item>
              <b-list-group-item>
                <!-- <b-input-group>
                  <b-form-input v-model="nameOfListToCreate" placeholder="List name" />
                  <b-input-group-append>
                    <b-button @click="handleClickAddList"><b-icon-plus-circle /></b-button>
                  </b-input-group-append> -->
                <!-- </b-input-group> -->
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-col>
        <!-- <b-col xs="12" sm="8">
          <b-card no-body>
            <template #header>
              <div v-if="selectedList != null" class="d-flex justify-content-between align-items-center">
                {{ selectedList.name }}
                <b-button class="ml-3" size="sm" @click="refreshSelectedList"><b-icon-arrow-clockwise /></b-button>
              </div>
              <div v-else>
                No List Selected
              </div>
            </template>
            <b-list-group flush>
              <b-list-group-item
                v-for="item, i in (selectedList == null ? [] : selectedList.items)"
                :key="i"
                class="d-flex justify-content-between align-items-center"
              >
                <span :title="item.id">
                  <b-form-checkbox class="d-inline-block" @input="checkItem(item.id, $event)" :checked="item.completed" />
                  {{ item.description }}
                </span>
                <b-badge variant="secondary">{{ item.priority }}</b-badge>
              </b-list-group-item>
              <b-list-group-item v-if="selectedList != null">
                <b-input-group>
                  <b-form-input v-model="descriptionOfItemToAdd" placeholder="Task description" />
                  <b-input-group-append>
                    <b-button @click="handleClickAddItem"><b-icon-plus-circle /></b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-col> -->
      </b-row>
    </b-container>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, inject, Ref } from 'vue'
import { Post, User } from "../../../server/data"


const user: Ref<any> = inject("user")!
const posts: Ref<Post[]> = ref([])
const draftOrderIngredients: Ref<string[]> = ref([])
const selectedPost: Ref<null | Post> = ref(null)

async function refreshPosts() {
  posts.value = await (await fetch("/api/posts")).json()

}
watch(user, refreshPosts, { immediate: true })

async function selectPost(listId: string) {
  // selectedPost.value = await getPost(listId)
}

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
  await refreshPosts()
}
</script>