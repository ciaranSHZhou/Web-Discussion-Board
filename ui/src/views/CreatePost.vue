<template>
    <div class="mx-3 my-3">
      <b-jumbotron header="New Post"  />
  
      <b-container fluid class="my-4">
        <b-row>
          <b-col xs="12" sm="9">
            <b-form>
              <b-form-group
                label="Title:"
                label-for="title-input"
              >
                <b-form-input id="title-input"  placeholder="Title" />
              </b-form-group>


              <b-form-group
                label="content:"
                label-for="content-input"
              >
              <textarea class="form-control col-xs-12" rows="7" cols="50" id="content-input" placeholder="Content" ></textarea>
              </b-form-group>
            </b-form>
  
           
          </b-col>
          <b-col xs="12" sm="3">

          </b-col>
        </b-row>
        <b-row>

            <b-button class="mx-1" variant="primary">Submit</b-button>

            <b-button class="mx-1" href="/">Cancel</b-button>
 
        </b-row>
      </b-container>
    </div>
  </template>
  
  <script setup lang="ts">
import { onMounted, ref, Ref } from 'vue'
import { getPosts, addList, getPost} from '../data'
import { Post } from "../../../server/data"
  
  async function submit() {
  await fetch(
    "/api/create-a-post",
    { method: "POST" }
  )
}

  </script>