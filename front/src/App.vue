<script setup lang="ts">
import Sidebar from './comps/sidebar.vue';
import Header from './comps/header.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template class="">
  <div class="flex w-full h- p-0 m-0 relative">
    <!-- <Header/> -->
    <Sidebar v-if="route.path !== '/login'"/>
    <div class="w-full">
      <RouterView />
    </div>
  </div>
</template>