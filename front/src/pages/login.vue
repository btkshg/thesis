<script setup lang="ts">
import { ref } from 'vue';
import api  from "../api/index.ts"
import { useRouter } from 'vue-router';
const router = useRouter();

const email = ref('');
const password = ref('');

const login = async () => {
    try {
        const response = await api.post('/users/login', {
            email: email.value,
            password: password.value,
        })
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/');
        // console.log(response)
    } catch(err) {
        console.error(err);
        alert("Invalid emaill or password");
    }
}
</script>

<template>
    <div class="flex justify-center items-center w-screen h-screen m-0 bg-cover bg-[url(https://i.pinimg.com/736x/6e/2d/97/6e2d971d054aa9529d539e88748e9753.jpg)]">
        <div class="bg-gray-50/80 p-8 rounded-2xl">
            <form class="flex flex-col items-center gap-2">
                <h1 class="text-2xl text-center font-">Welcome Back!</h1>
                <span class="text-base font-thin text-gray-600 -mt-2">Enter your credientals below</span>
                <input v-model="email" selected ?  placeholder="Email" class="bg-gray-100 outline-0 px-2 py-1 w-60 rounded mt-8" type="email">
                <input v-model="password" placeholder="Password" class="px-2 py-1 w-60 bg-gray-100 rounded outline-0" type="password">
                <button @click="login()" type="button" class="mt-6 w-60 font-medium py-2 bg-blue-800 rounded-lg text-white 
                hover:bg-white hover:text-blue-800 hover:cursor-pointer transition-all">Sign in</button>
            </form>
        </div>
    </div>
</template>
