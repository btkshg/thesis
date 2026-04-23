<template>
    <div class="m-8">
    <h1 class="text-2xl font-medium text-blue-900 my-4 mb-6">Sales</h1>
    <div class="w-1/2 bg-white drop-shadow-md p-4">
        <div class="grid grid-cols-5 gap-4 font-normal text-gray-950 border-b border-gray-300 pb-2">
            <p class="">ID</p>
           <p class="text-end">Total Amount</p>
            <p class="text-end">Cashier</p>
            <p class="text-end">Date</p>
        </div>
        <!-- <div class="grid grid-cols-5 mb-6 gap-4">
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
        </div> -->
        <div v-for="sales in recentSales" class="font-thin">
            <div @click="toggleDetail(sales)" class="grid grid-cols-5 mt-2 p-2 pb-4 bg-white border-b border-gray-300 hover:cursor-pointer">
                <h1 class="">{{sales.id}}</h1>
                <p class="text-end">{{ sales.total_amount }}$</p>
                <p class="text-end">{{ sales.cashier }}</p>
                <p class="text-end">{{ 
                       new Date(sales.sale_time).toLocaleString('en-US', { 
                         hour: 'numeric', 
                         minute: '2-digit', 
                         hour12: true, 
                         month: 'short', 
                         day: 'numeric' 
                       }).replace(',', '') 
                    }}</p>
                <div class="flex justify-end items-center mr-2 w-20">
                    <ChevronDown class="w-4 h-4" />
                </div>
            </div>
            <div v-if="expandedId === sales.id" class="p-4 my-0 bg-white border border-gray-500 border-dashed border-t-0 rounded-b-xl mx-8 mb-6">
                <div v-if="loadingId === sales.id" class="text-gray-400 animate-pulse">Loading items...</div>
                <div v-else-if="sales.products">
                    <div v-for="item in sales.products" :key="item.id" class="flex justify-between py-1">
                        {{ item.product_name }} 
                        <div class="flex gap-8">
                            <span>x{{ item.quantity }}</span>
                            <span>{{ item.price_at_sale }}$</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import api from '../api/index';
import { ref } from 'vue';
import { ChevronDown, Pencil } from 'lucide-vue-next'

const expandedId = ref<number | null>(null);
const loadingId = ref<number | null>(null);

const recentSales = ref<Sales[]>([]);

onMounted( async () => {
    try {
        const response = await api.get('/sales');
        recentSales.value = response.data;
    } catch(err) {
        console.log(err);
    }
})

const toggleDetail = async (sale: Sales) => {
    if (expandedId.value === sale.id) {
        expandedId.value = null;
        return;
    }
    expandedId.value = sale.id;
    if (!sale.products) {
        loadingId.value = sale.id;
        try {
            const response = await api.get(`/sales/${sale.id}`);
            console.log(response.data.items)
            sale.products = response.data.items; 
        } catch (err) {
            console.error("Failed to fetch sale details:", err);
        } finally {
            loadingId.value = null;
        }
    }
};

interface Product {
    id: number;
    product_name: string;
    category: string;
    price_at_sale: number;
    quantity: number;
}

interface Sales {
  id: number;
  cashier: string;
  total_amount: number;
  sale_time: Date;
  products?: Product[];
}
</script>