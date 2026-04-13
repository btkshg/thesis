<template>
    <div class="m-8">
        <h1 class="text-2xl font-bold my-4">Inventory</h1>
        <div class="grid grid-cols-8 mt-8 mb-4 gap-4 font-semibold text-gray-400">
            <p class="col-span-2">Product Name</p>
            <p class="text-end">Category</p>
            <p class="text-end">Base Price</p>
            <p class="text-end">Current Price</p>
            <p class="text-end">Stock Quantity</p>
            <p class="text-end">Reorder Level</p>
            <p class="text-end">Edit</p>
        </div>
        <div class="grid grid-cols-8 mb-6 gap-4">
            <input class="col-span-2 border border-gray-900 rounded px-2 py-1" placeholder="Search by name"></input>
            <select class="border rounded">
                <option :value="7">Food</option>
                <option :value="14">Appliance</option>
                <option :value="21">Household</option>
            </select>
            <div class="flex justify-end">
               <ChevronDown @click="rank = !rank" class="transition-all" :class="rank === true ? 'rotate-180' : ''" /> 
            </div>
            <div class="flex justify-end">
               <ChevronDown @click="rank = !rank" class="transition-all" :class="rank === true ? 'rotate-180' : ''" /> 
            </div>
            <div class="flex justify-end">
               <ChevronDown @click="rank = !rank" class="transition-all" :class="rank === true ? 'rotate-180' : ''" /> 
            </div>
            <div class="flex justify-end">
               <ChevronDown @click="rank = !rank" class="transition-all" :class="rank === true ? 'rotate-180' : ''" /> 
            </div>
        </div>
        <div v-for="product in products" class="grid grid-cols-8 my-2 p-2 rounded bg-gray-100 hover:bg-blue-50">
            <h1 class="col-span-2">{{product.name}}</h1>
            <p class="text-end">{{ product.category }}</p>
            <p class="text-end">{{ product.base_price }}</p>
            <p class="text-end">{{ product.current_price }}</p>
            <p class="text-end">{{ product.stock_quantity }}</p>
            <p class="text-end">{{ product.reorder_level }}</p>
            <div class="flex justify-end items-center mr-2">
                <Pencil class="w-4 h-4" />
            </div>
        </div>
        <!-- {{products}} -->
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import api from '../api/index';
import { ref } from 'vue';
import { ChevronDown, Pencil } from 'lucide-vue-next'

const rank = ref(false)


const products = ref<Product[]>([]);

onMounted( async () => {
    try {
        const response = await api.get('/products');
        products.value = response.data;
    } catch(err) {
        console.log(err);
    }
})

interface Product {
    id: number;
    name: string;
    category: string;
    base_price: number;
    current_price: number;
    reorder_level: number;
    stock_quantity: number;
}
</script>