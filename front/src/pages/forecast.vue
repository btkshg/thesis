<template>
    <div class="m-8">
        <h1 class="text-2xl font-medium text-blue-900 my-4 mb-6">Forecasting</h1>
        <div class="bg-white drop-shadow-md rounded-lg p-4 w-1/2">
            <div class="flex gap-4 justify-between items-center">
                <div class="flex items-center justify-center gap-4">
                   <p class="my-2 flex gap-2 font-thin"><CalendarDays class="text-blue-900" />Choose the duration of forecasting:</p> 
                   <div class="border border-gray-400 w-min flex justify-center items-center px-2 py-1 rounded font-thin">
                    <select v-model="days" class="w-24 outline-0">
                        <option :value="7">7 days</option>
                        <option :value="14">14 days</option>
                        <option :value="21">21 days</option>
                    </select>
                   </div> 
                </div>
                <button @click="loadAll" class="rounded-lg text-blue-800 bg-gray-50 px-4 py-2 outline
                uppercase font-semibold transition-all hover:bg-blue-800 hover:text-white hover:cursor-pointer">
                    Generate
                </button>
            </div>
            <div class="flex justify-center">
                <!-- <p v-if="!loader">Click the button to generate the forecast. It might take few minutes</p> -->
                <p v-if="loader" class="my-8 pt-2"><Loader2 class="w-10 h-10 animate-spin text-blue-600"/></p>
                <Line v-if="render" :data="chartData" :options="chartOptions" class="mt-8" />
            </div>
        </div>
        <div class="bg-white drop-shadow-md rounded-lg px-4 py-6 w-1/2 mt-4">
            <p class="flex gap-2 font-semibold text-gray-400"><Hammer class="text-amber-600 animate-pulse" />Staff forecast in development...</p>
        </div>
        <!-- <h1 class="text-2xl font-bold my-4">Staffing</h1>
        <div>To be build</div> -->
        <!-- <h1 class="text-2xl font-bold my-4">Error rates</h1>
        <div>Absolute mean error and accuracy</div> -->
    </div>
</template>

<script setup lang="ts">
import api from '@/api'
import { ref, computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Loader2 } from 'lucide-vue-next'
import { CalendarDays, Hammer } from 'lucide-vue-next'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement, 
  LineElement, 
  Tooltip, 
  Legend, 
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
)
const days = ref(21)
const actualData = ref<{ date: string, total: number }[]>([])
const forecastData = ref<{ date: string, predicted_sales: number }[]>([])
const loader = ref(false)
const render = ref(false)

const loadActual = async () => {
    const to = new Date().toISOString().split('T')[0]
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - 30)
    const from = fromDate.toISOString().split('T')[0]

    const response = await api.get(`/sales/range?from=${from}&to=${to}`)
    
    const grouped: Record<string, number> = {}
    for (const sale of response.data) {
        const date = sale.sale_time.split('T')[0]
        grouped[date] = (grouped[date] || 0) + parseFloat(sale.total_amount)
    }

    actualData.value = Object.entries(grouped)
        .map(([date, total]) => ({ date, total: Math.round(total * 100) / 100 }))
        .sort((a, b) => a.date.localeCompare(b.date))
}

const loadForecast = async () => {
    const response = await api.get(`/forecast/sales?days=${days.value}`)
    forecastData.value = response.data.forecast
    loader.value = false
    render.value = true
}

const loadAll = async () => {
    loader.value = true;
    await Promise.all([loadActual(), loadForecast()])
}

const chartData = computed(() => {
    const actualLabels = actualData.value.map(d => d.date)
    const forecastLabels = forecastData.value.map(d => d.date)
    const allLabels = [...actualLabels, ...forecastLabels]
    const lastActual = actualData.value[actualData.value.length - 1]

    return {
        labels: allLabels,
        datasets: [
            {
                label: 'Actual Sales',
                data: allLabels.map(date => {
                    const found = actualData.value.find(d => d.date === date)
                    return found ? found.total : null
                }),
                borderColor: '#16a34a',
                backgroundColor: 'rgba(22,163,74,0.08)',
                borderWidth: 2,
                pointRadius: 3,
                tension: 0.4,
                fill: true,
                spanGaps: false,
            },
            {
                label: 'Predicted Sales',
                data: allLabels.map(date => {
                    if (date === lastActual?.date) return lastActual.total
                    const found = forecastData.value.find(d => d.date === date)
                    return found ? found.predicted_sales : null
                }),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37,99,235,0.08)',
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 3,
                tension: 0.4,
                fill: true,
                spanGaps: false,
            }
        ]
    }
})

const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: { display: true, position: 'top' as const },
        tooltip: {
            callbacks: {
                label: (ctx: any) => `$${ctx.parsed.y?.toLocaleString() ?? 'N/A'}`
            }
        }
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { font: { size: 10 }, color: '#9ca3af', maxTicksLimit: 15 }
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