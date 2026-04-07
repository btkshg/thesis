<script lang="ts">

</script>

<template>
    <div class="flex justify-center items-center w-screen h-screen m-0 bg-cover bg-[url(https://i.pinimg.com/1200x/2f/f7/46/2ff74610b1ff719bb7aafa8477d8ba6e.jpg)]">
        <div class="bg-gray-100 p-8 rounded-2xl">
            <form class="flex flex-col items-center gap-4" action="">
                <h1 class="text-3xl text-center font-bold text-black">Welcome Back!</h1>
                <span class="text-base font-thin text-gray-600 -mt-2">Enter your credientals below</span>
                <input selected ?  placeholder="Email" class="px-2 py-1 w-60 border border-gray-400 rounded mt-6" type="email">
                <input placeholder="Password" class=" px-2 py-1 w-60 border border-gray-400 rounded">
                <button class="mt-10 w-60 py-2 bg-blue-500 rounded-lg text-white">Sign in</button>
            </form>
        </div>
    </div>
</template>
