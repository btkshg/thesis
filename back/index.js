const express = require('express');
const cors = require('cors');

//route files
const productRoutes = require('./routes/productRoutes'); 
const saleRoutes = require('./routes/saleRoutes');
const shiftRoutes = require('./routes/shiftRoutes');
const userRoutes = require('./routes/userRoutes');
const forecastRoutes = require('./routes/forecastRoutes');

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/users', userRoutes);
app.use('/api/forecast', forecastRoutes);

app.listen(3000, () => { console.log(`Server running on port 3000`);});