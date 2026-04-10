<template>
    <div class="m-8">
        <h1 class="text-2xl font-bold my-4">Dashboard</h1>
        <div class="grid grid-cols-4 gap-8">
            <div class="bg-blue-50 p-4 rounded-xl flex gap-4 items-center ">
                <Handbag class="w-20 h-20 text-blue-500" />
                <div>
                    <h1 class="text-gray-500 font-semibold">Total Sales</h1>
                    <p class="font-bold text-4xl">1000$</p>
                </div>
            </div>
            <div class="bg-blue-50 p-4 rounded-xl flex gap-4 items-center ">
                <AlertTriangle class="w-20 h-20 text-red-500" />
                <div>
                    <h1 class="text-gray-500 font-semibold">Total Sales</h1>
                    <p class="font-bold text-4xl">1000$</p>
                </div>
            </div>
            <div class="bg-blue-50 p-4 rounded-xl flex gap-4 items-center ">
                <TrendingUp class="w-20 h-20 text-green-500" />
                <div>
                    <h1 class="text-gray-500 font-semibold">Total Sales</h1>
                    <p class="font-bold text-4xl">1000$</p>
                </div>
            </div>
            <div class="bg-blue-50 p-4 rounded-xl flex gap-4 items-center ">
                <Package class="w-20 h-20 text-yellow-500" />
                <div>
                    <h1 class="text-gray-500 font-semibold">Total Sales</h1>
                    <p class="font-bold text-4xl">1000$</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Package, TrendingUp, Handbag, AlertTriangle } from 'lucide-vue-next'
</script>
