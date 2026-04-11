<template>
    <div class="m-8">
        <h1 class="text-2xl font-bold my-4">Dashboard</h1>
        <div class="grid grid-cols-4 gap-4">
            <div class="bg-blue-50 p-4 rounded-xl flex gap-4 items-center ">
              <BanknoteArrowDown class="w-16 h-16 text-green-500" />
                <div>
                    <h1 class="text-gray-500 font-semibold ">Total Sales Last Month</h1>
                    <p class="font-bold text-4xl">{{ salesInfo.currentTotal }}$</p>
                </div>
            </div>
            <div class="bg-blue-50 p-4 rounded-xl flex gap-4 items-center ">
                <ScanBarcode class="w-16 h-16 text-gray-600" />
                <div>
                    <h1 class="text-gray-500 font-semibold">Total Transactions</h1>
                    <p class="font-bold text-4xl">{{ trans }}</p>
                </div>
            </div>
            <div class="bg-blue-50 p-4 rounded-xl flex gap-4 items-center ">
                <TrendingUp v-if="salesInfo.growth > 0" class="w-16 h-16 text-green-500" />
                <TrendingDown v-else class="w-16 h-16 text-red-500" />
                <div>
                    <h1 class="text-gray-500 font-semibold">Sales Growth</h1>
                    <p class="font-bold text-4xl">{{ salesInfo.growth }}%</p>
                </div>
            </div>
            <div class="bg-blue-50 p-4 rounded-xl flex gap-4 items-center ">
                <Package class="w-16 h-16 text-yellow-500" />
                <div>
                    <h1 class="text-gray-500 font-semibold">Low-Stock Products</h1>
                    <p class="font-bold text-4xl">{{ stock.length }}</p>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-4 gap-4 mt-4">
            <div class="col-span-3 bg-blue-50 rounded-xl px-6 py-4 h-min">
                <h2 class="text-xl font-bold mb-4">Last 30 Days Revenue</h2>
                <Line class="" :data="chartData" :options="chartOptions" />
            </div>
            <div class="bg-blue-50 p-4 rounded-xl flex flex-col">
              <h1 class="font-bold text-xl mb-4">Recent Sales</h1>
              <div class="grid grid-cols-4 gap-4 mb-2 font-semibold text-gray-500 border-b pb-2">
                <h1>ID</h1>
                <h1>Amount</h1>
                <h1 class="col-span-2 text-end">Date</h1>
              </div>
              <div v-for="sales in recentSales.slice(0,12)" class="grid grid-cols-4 my-1">
                <p class="font-light">{{ sales.id }}</p>
                <!-- <p>{{ sales.cashier }}</p> -->
                <p class="font-semibold text-gray-700">{{ sales.total_amount }}$</p>
                <p class="col-span-2 text-end font-thin">{{ 
                   new Date(sales.sale_time).toLocaleString('en-US', { 
                     hour: 'numeric', 
                     minute: '2-digit', 
                     hour12: true, 
                     month: 'short', 
                     day: 'numeric' 
                   }).replace(',', '') 
                }}
                </p>
              </div>
            </div>
        </div>
        <!-- <div>
          {{ salesInfo }}
        </div>       -->
    </div>
</template>

<script setup lang="ts">
import { Package, TrendingUp, TrendingDown, AlertTriangle, Barcode, ScanBarcode, BanknoteArrowDown } from 'lucide-vue-next'
import api from '@/api';
import { ref } from 'vue';
import { onMounted, computed } from 'vue';
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

const salesInfo = ref<SalesInfo>({ currentTotal: 0, growth: 0 });
const trans = ref('');
const recentSales = ref<Sales[]>([]);
const dailyRevenue = ref<Revenue[]>([]);
const stock = ref('');

interface Revenue {
  revenue: number;
  date: Date;
}

interface Sales {
  id: number;
  cashier: string;
  total_amount: number;
  sale_time: Date;
}

interface SalesInfo {
    currentTotal: number;
    growth: number;
}

onMounted ( async () => {
    try {
        const [salesRes, transRes, sales, daily, stocks] = await Promise.all([
            api.get('/sales/growth'),
            api.get('/sales/totalTrans'),
            api.get('/sales'),
            api.get('/sales/dailyRevenue'),
            api.get('/products/lowStock')
        ])
        // console.log(res.data);
        salesInfo.value = salesRes.data;
        trans.value = transRes.data[0].count;
        recentSales.value = sales.data
        dailyRevenue.value = daily.data
        stock.value = stocks.data
    } catch(err) {
        console.log(err);
    }
})

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const chartData = computed(() => ({
  labels: dailyRevenue.value.map(item => 
    new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  ),
  datasets: [
    {
      label: 'Daily Revenue',
      data: dailyRevenue.value.map(item => Number(item.revenue)),
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.08)',
      borderWidth: 2,
      pointRadius: 3,
      pointBackgroundColor: '#2563eb',
      tension: 0.4,
      fill: true,
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: any) => `$${context.parsed.y.toLocaleString()}`
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 }, color: '#9ca3af' }
    },
    y: {
      beginAtZero: true,
      grid: { color: '#f3f4f6' },
      ticks: {
        font: { size: 11 },
        color: '#9ca3af',
        callback: (value: any) => `$${value}`
      }
    }
  }
}
</script>
