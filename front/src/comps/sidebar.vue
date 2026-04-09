<template>
    <div class="h-screen w-60 bg-gray-100 p-4 flex flex-col sticky top-0">
        <h1 class="text-gray-400 mt-2 mb-4 ml-2">Menu</h1>
        <div v-for="item in menu" class="pl-4 pb-2" >
            <RouterLink :to="'/' + item.route" class="hover:text-gray-500 transition-all hover:ml-2">{{ item.name }}</RouterLink>
        </div>
        <div class="absolute bottom-0 py-6 px-2 gap-4">
            <div class="mb-4">Hello, <br>{{ user?.full_name }}</div>
            <p @click="logout()" class="underline hover:no-underline hover:cursor-pointer">Sign out</p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import router from '@/router';
    const user = ref<User | null>(null);

    onMounted(() => {
        const userStr = localStorage.getItem('user');
        if(userStr){
        user.value = JSON.parse(userStr);
    }
    })

    const menu = [
        {name: 'Dashboard', route: ""}, 
        {name: 'Sales', route: "sales"},
        {name: 'Inventory', route: "inventory"},
        {name: 'Forecast', route: "forecast"},
        {name: 'Schedule', route: "shift"},
        // {name: 'Login', route: "login"},
    ]

    interface User {
        id: number
        full_name: string
        email: string
        role: string
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
}
</script>