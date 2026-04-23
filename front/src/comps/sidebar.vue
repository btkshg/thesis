<template>
    <div class="h-screen w-60 bg-gray-100 p-4 flex flex-col sticky top-0">
        <div class="px-1 pt-1 gap- border-b border-gray-400">
            <div class="mb-4 flex items-center rounded-md bg-gray-100 px-2 py-1 gap-3">
                <User class="p-2 w-8 h-8 bg-white rounded-full" />
                <div class="">
                    <p class="font-medium text-blue-950">{{ user?.full_name }}</p>
                    <p class="capitalize text-gray-500 text-xs font-thin">{{ user?.role }}</p>
                </div>
                
            </div>
        </div>
        <div class="border-b border-gray-400 pb-6 text-sm">
            <h1 class="text-gray-400 my-4 ml-2">Menu</h1>
            <RouterLink  v-for="item in menu"  :key="item.name" :to="'/' + item.route"  
            class="pl-4 py-1.5 mb-1 flex items-center hover:text-gray-500 transition-all hover:ml-2
            gap-2 text-gray-800 rounded-sm" active-class="bg-blue-300 !text-blue-950 shadow-md ml-2 transition-all">
                <component :is="item.icon" :size="18" />
                <span>{{ item.name }}</span>
            </RouterLink>
            <p @click="logout()" class="absolute bottom-0 px-2 mb-10 border w-5/6 gap-2 text-sm
            rounded-md py-2 font-medium hover:cursor-pointer transition hover:text-white hover:bg-gray-800 flex justify-center items-center"><LogOutIcon class="w-4 h-4" />Sign out</p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { User, LogOut, LogOutIcon, House, CirclePercent, SquarePercent,
        Package, ChartArea, CalendarFold
    } from 'lucide-vue-next'
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
        {name: 'Dashboard', icon: House,  route: ""}, 
        {name: 'Sales', icon: CirclePercent, route: "sales"},
        {name: 'Inventory', icon: Package, route: "inventory"},
        {name: 'Forecast', icon: ChartArea, route: "forecast"},
        {name: 'Schedule', icon: CalendarFold, route: "shift"},
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