const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',      
    host: 'localhost',
    database: 'retail',
    password: 'the4736251',
    port: 5433,
});

//AI generated code!

// ─── Helpers ────────────────────────────────────────────────────────────────

const randomBetween = (min, max) =>
    Math.round((Math.random() * (max - min) + min) * 100) / 100;

const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const randomFrom = (arr) =>
    arr[Math.floor(Math.random() * arr.length)];

// Sales multiplier by day of week (0=Sun, 1=Mon ... 6=Sat)
const dayMultiplier = [1.4, 0.7, 0.8, 0.9, 1.0, 1.3, 1.5];

// Monthly trend — slight growth over 6 months
const monthMultiplier = [0.85, 0.88, 0.92, 0.97, 1.02, 1.08];

// ─── Seed Data ───────────────────────────────────────────────────────────────

const users = [
    { email: 'manager@store.com', password: 'password123', full_name: 'Alex Johnson', role: 'manager', hourly_rate: 25.00 },
    { email: 'sarah@store.com',   password: 'password123', full_name: 'Sarah Miller',  role: 'staff',   hourly_rate: 14.50 },
    { email: 'james@store.com',   password: 'password123', full_name: 'James Wilson',  role: 'staff',   hourly_rate: 13.00 },
    { email: 'emily@store.com',   password: 'password123', full_name: 'Emily Davis',   role: 'staff',   hourly_rate: 13.50 },
    { email: 'michael@store.com', password: 'password123', full_name: 'Michael Brown', role: 'staff',   hourly_rate: 14.00 },
];

const products = [
    // Beverages
    { name: 'Coca Cola 500ml',     category: 'beverage', base_price: 1.50, stock_quantity: 200, reorder_level: 30 },
    { name: 'Water Bottle 1L',     category: 'beverage', base_price: 0.99, stock_quantity: 300, reorder_level: 50 },
    { name: 'Orange Juice 1L',     category: 'beverage', base_price: 2.50, stock_quantity: 100, reorder_level: 20 },
    { name: 'Energy Drink 250ml',  category: 'beverage', base_price: 2.00, stock_quantity: 150, reorder_level: 25 },
    { name: 'Coffee Can 250ml',    category: 'beverage', base_price: 1.75, stock_quantity: 120, reorder_level: 20 },
    // Snacks
    { name: 'Chips 100g',          category: 'snack',    base_price: 1.25, stock_quantity: 180, reorder_level: 30 },
    { name: 'Chocolate Bar 50g',   category: 'snack',    base_price: 0.99, stock_quantity: 200, reorder_level: 40 },
    { name: 'Cookies 200g',        category: 'snack',    base_price: 1.80, stock_quantity: 100, reorder_level: 20 },
    { name: 'Nuts Mix 150g',       category: 'snack',    base_price: 2.20, stock_quantity: 80,  reorder_level: 15 },
    { name: 'Popcorn 80g',         category: 'snack',    base_price: 1.10, stock_quantity: 120, reorder_level: 20 },
    // Food
    { name: 'Sandwich Ham & Cheese', category: 'food',   base_price: 3.50, stock_quantity: 50,  reorder_level: 10 },
    { name: 'Instant Noodles',     category: 'food',     base_price: 0.75, stock_quantity: 200, reorder_level: 40 },
    { name: 'Canned Tuna 185g',    category: 'food',     base_price: 1.99, stock_quantity: 100, reorder_level: 20 },
    { name: 'Bread Loaf',          category: 'food',     base_price: 2.00, stock_quantity: 60,  reorder_level: 15 },
    { name: 'Eggs 6pcs',           category: 'food',     base_price: 2.50, stock_quantity: 80,  reorder_level: 15 },
    // Household
    { name: 'Dish Soap 500ml',     category: 'household', base_price: 2.00, stock_quantity: 80, reorder_level: 15 },
    { name: 'Shampoo 200ml',       category: 'household', base_price: 3.00, stock_quantity: 60, reorder_level: 10 },
    { name: 'Toothpaste 100g',     category: 'household', base_price: 1.50, stock_quantity: 90, reorder_level: 15 },
    { name: 'Tissue Box',          category: 'household', base_price: 1.80, stock_quantity: 100, reorder_level: 20 },
    { name: 'Laundry Detergent 1kg', category: 'household', base_price: 4.50, stock_quantity: 50, reorder_level: 10 },
];

// ─── Main Seeder ─────────────────────────────────────────────────────────────

async function seed() {
    const client = await pool.connect();
    try {
        console.log('🌱 Starting seeder...\n');
        await client.query('BEGIN');

        // ── 1. Clear existing data (in order to respect foreign keys) ──
        console.log('🗑️  Clearing existing data...');
        await client.query('DELETE FROM sale_body');
        await client.query('DELETE FROM sales_header');
        await client.query('DELETE FROM shifts');
        await client.query('DELETE FROM forecasts');
        await client.query('DELETE FROM products');
        await client.query('DELETE FROM users');
        console.log('   Done.\n');

        // ── 2. Insert users ──
        console.log('👤 Inserting users...');
        const userIds = [];
        for (const u of users) {
            const result = await client.query(
                `INSERT INTO users (email, password, full_name, role, hourly_rate)
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                [u.email, u.password, u.full_name, u.role, u.hourly_rate]
            );
            userIds.push(result.rows[0].id);
        }
        console.log(`   Inserted ${userIds.length} users.\n`);

        // manager is first user, staff are the rest
        const managerId = userIds[0];
        const staffIds = userIds.slice(1);

        // ── 3. Insert products ──
        console.log('📦 Inserting products...');
        const productIds = [];
        const productPrices = [];
        for (const p of products) {
            const result = await client.query(
                `INSERT INTO products (name, category, base_price, current_price, stock_quantity, reorder_level)
                 VALUES ($1, $2, $3, $3, $4, $5) RETURNING id`,
                [p.name, p.category, p.base_price, p.stock_quantity, p.reorder_level]
            );
            productIds.push(result.rows[0].id);
            productPrices.push(p.base_price);
        }
        console.log(`   Inserted ${productIds.length} products.\n`);

        // ── 4. Insert 6 months of sales ──
        console.log('💰 Inserting 6 months of sales data...');
        const today = new Date();
        const startDate = new Date(today);
        startDate.setMonth(startDate.getMonth() - 6);

        let totalSales = 0;

        for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
            const dayOfWeek = d.getDay();
            const monthIndex = Math.min(
                Math.floor((d - startDate) / (1000 * 60 * 60 * 24 * 30)),
                5
            );

            const multiplier = dayMultiplier[dayOfWeek] * monthMultiplier[monthIndex];

            // number of transactions per day (busier on weekends)
            const transactionsToday = Math.round(randomInt(8, 15) * multiplier);

            for (let t = 0; t < transactionsToday; t++) {
                // random time during business hours (8am - 9pm)
                const saleDate = new Date(d);
                saleDate.setHours(randomInt(8, 21), randomInt(0, 59), randomInt(0, 59));

                // random staff member processes the sale
                const cashierId = randomFrom(staffIds);

                // random 1-4 items per transaction
                const itemCount = randomInt(1, 4);
                const items = [];
                const usedProductIndexes = new Set();

                for (let i = 0; i < itemCount; i++) {
                    let productIndex;
                    do {
                        productIndex = randomInt(0, productIds.length - 1);
                    } while (usedProductIndexes.has(productIndex));
                    usedProductIndexes.add(productIndex);

                    const quantity = randomInt(1, 3);
                    // slight price variation (+/- 5%) to simulate promotions
                    const priceVariation = randomBetween(0.95, 1.05);
                    const price_at_sale = Math.round(productPrices[productIndex] * priceVariation * 100) / 100;

                    items.push({
                        product_id: productIds[productIndex],
                        quantity,
                        price_at_sale,
                    });
                }

                const total_amount = items.reduce(
                    (sum, item) => sum + item.price_at_sale * item.quantity, 0
                );

                // insert sale header
                const headerResult = await client.query(
                    `INSERT INTO sales_header (user_id, total_amount, sale_time)
                     VALUES ($1, $2, $3) RETURNING id`,
                    [cashierId, Math.round(total_amount * 100) / 100, saleDate]
                );
                const sale_header_id = headerResult.rows[0].id;

                // insert sale body items
                for (const item of items) {
                    await client.query(
                        `INSERT INTO sale_body (sale_header_id, product_id, quantity, price_at_sale)
                         VALUES ($1, $2, $3, $4)`,
                        [sale_header_id, item.product_id, item.quantity, item.price_at_sale]
                    );
                }

                totalSales++;
            }
        }
        console.log(`   Inserted ${totalSales} sales transactions.\n`);

        // ── 5. Insert shifts ──
        console.log('🕐 Inserting shifts...');
        let totalShifts = 0;

        for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
            // 2-3 staff work each day
            const staffOnDuty = staffIds
                .sort(() => Math.random() - 0.5)
                .slice(0, randomInt(2, 3));

            for (const staffId of staffOnDuty) {
                const shiftStart = new Date(d);
                shiftStart.setHours(randomFrom([8, 9, 12, 13]), 0, 0);

                const hoursWorked = randomInt(6, 9);
                const shiftEnd = new Date(shiftStart);
                shiftEnd.setHours(shiftStart.getHours() + hoursWorked);

                await client.query(
                    `INSERT INTO shifts (user_id, start_time, end_time, total_hours)
                     VALUES ($1, $2, $3, $4)`,
                    [staffId, shiftStart, shiftEnd, hoursWorked]
                );
                totalShifts++;
            }
        }
        console.log(`   Inserted ${totalShifts} shifts.\n`);

        await client.query('COMMIT');
        console.log('✅ Seeding complete!');
        console.log(`   Users: ${userIds.length}`);
        console.log(`   Products: ${productIds.length}`);
        console.log(`   Sales transactions: ${totalSales}`);
        console.log(`   Shifts: ${totalShifts}`);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Seeder failed:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
