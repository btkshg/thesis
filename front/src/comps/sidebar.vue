<template>
    <div class="h-screen w-60 bg-gray-100 p-4 flex flex-col">
        <h1 class="text-gray-400 mt-2 mb-4 ml-2">Menu</h1>
        <div v-for="item in menu" class="pl-4 pb-2" >
            <RouterLink :to="'/' + item.route" class="hover:text-gray-500 transition-all hover:ml-2">{{ item.name }}</RouterLink>
        </div>
        <div class="absolute bottom-0 py-6 px-2 gap-4">
            <div class="">Hello, User</div>
            <p>Login / Sign in</p>
        </div>
    </div>
</template>

<script setup lang="ts">
    const menu = [
        {name: 'Dashboard', route: ""}, 
        {name: 'Sales', route: "sales"},
        {name: 'Inventory', route: "inventory"},
        {name: 'Forecast', route: "forecast"},
        {name: 'Schedule', route: "schedule"},
        // {name: 'Login', route: "login"},
    ]
</script>