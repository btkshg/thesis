<template>
    <div class="m-8">
        <h1 class="text-2xl font-bold mt-4 mb-8">Staff Scheduling</h1>
        <div class="grid grid-cols-2 gap-8">
            <div class="p-6 border rounded-2xl">
                <h1 class="font-bold mb-4 text-gray-500">Shift History</h1>
                <div v-for="shift in shifts" class="grid grid-cols-4 gap-4 my-2">
                    <p>{{ shift.full_name }}</p>
                    <p class="text-end">{{ 
                       new Date(shift.start_time).toLocaleString('en-US', { 
                         hour: 'numeric', 
                         minute: '2-digit', 
                         hour12: true, 
                         month: 'short', 
                         day: 'numeric' 
                       }).replace(',', '') 
                    }}</p>
                    <p v-if="shift.total_hours !== null" class="text-end">{{ 
                       new Date(shift.end_time).toLocaleString('en-US', { 
                         hour: 'numeric', 
                         minute: '2-digit', 
                         hour12: true, 
                         month: 'short', 
                         day: 'numeric' 
                       }).replace(',', '') 
                    }}</p>
                    <p v-else>Ongoing</p>
                    <p v-if="shift.total_hours !== null">{{ shift.total_hours }} hrs</p>
                    <p v-else>Active</p>
                </div>
            </div>
            <div class="grid grid-cols-2 border rounded-2xl h-min p-6 gap-4">
                <div class="border-r">
                    <h1 class="font-semibold text-xl mb-6">Staff List</h1>
                    <div v-for="user in inactiveStaff" :key="user.id" class="my-2 flex justify-between mr-4">
                        <div>
                            <p class="font-semibold">{{ user.full_name }}</p>
                            <p class="font-thin -mt-2 text-sm text-gray-600">{{ user.email }}</p>  
                        </div>
                        <ArrowBigRightDash @click="startShift(user)" class="text-white p-1 w-6 h-6 rounded-sm bg-green-600 hover:cursor-pointer" />
                    </div> 
                </div>
                <div>
                    <h1 class="font-semibold text-xl mb-6">Active Shift</h1>
                    <div v-for="user in activeStaff" :key="user.id" class="my-2 flex justify-between mr-4">
                        <div>
                            <p class="font-semibold">{{ user.full_name }}</p>
                            <p class="font-thin -mt-2 text-sm text-gray-600">{{ user.email }}</p>  
                        </div>
                        <ClockArrowDown @click="endShift(user)" class="text-white p-1 w-6 h-6 rounded-sm bg-red-600 hover:cursor-pointer"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import api from '@/api';
import { ArrowBigRightDash, ClockArrowDown, X } from 'lucide-vue-next'

const shifts = ref<shift[]>([]);
const staff = ref<any[]>([]);

interface shift {
    start_time: Date;
    end_time: Date;
    total_hours: number;
    id: number;
    user_id: number;
    full_name: string;
    email: string;
}

onMounted(async () => {
    try {
        const [shiftRes, staffRes] = await Promise.all([
            api.get("/shifts"),
            api.get("/users")
        ]);

        shifts.value = shiftRes.data;

        staff.value = staffRes.data
            .filter((u: any) => u.role === 'staff')
            .map((u: any) => {
                const openShift = shiftRes.data.find((s: any) => 
                    s.user_id === u.id && (s.end_time === null || s.end_time === undefined)
                );
                
                return {
                    ...u,
                    active_shift_id: openShift ? openShift.id : null
                };
            });
    } catch (err) {
        console.error("Error initializing staff:", err);
    }
});

const inactiveStaff = computed(() => staff.value.filter(s => !s.active_shift_id));
const activeStaff = computed(() => staff.value.filter(s => s.active_shift_id));

const startShift = async (user: any) => {
    try {
        const res = await api.post('/shifts', { user_id: user.id });
        // Setting this property causes the user to fail the 'inactiveStaff' 
        // filter and pass the 'activeStaff' filter instantly.
        user.active_shift_id = res.data.id; 
        
        // Refresh history to show the new "Clocked In" entry
        const results = await api.get("/shifts");
        shifts.value = results.data;
    } catch (err) {
        console.error("Failed to start shift:", err);
    }
};

const endShift = async (user: any) => {
    try {
        await api.put(`/shifts/${user.active_shift_id}`);
        user.active_shift_id = null; // Moves them back to the left column
        
        const results = await api.get("/shifts");
        shifts.value = results.data;
    } catch (err) {
        console.error("Failed to end shift:", err);
    }
};
</script>