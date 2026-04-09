<template>
    <div class="m-8">
        <div v-for="product in products" class="grid grid-cols-7 my-2 p-2 rounded bg-gray-100 hover:bg-blue-100">
            <h1 class="col-span-2">{{product.name}}</h1>
            <p>{{ product.category }}</p>
            <p>{{ product.base_price }}</p>
            <p>{{ product.current_price }}</p>
            <p>{{ product.stock_quantity }}</p>
            <p>{{ product.reorder_level }}</p>
        </div>
        <!-- {{products}} -->
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import api from '../api/index';
import { ref } from 'vue';

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