import express from 'express';
import gcodeRoutes from "./routes/GocodeRoutes";
const cors = require('cors');

const port:number=3000;
const app=express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());


app.use("/api/gcode", gcodeRoutes);

app.listen(port,()=>{
    console.log(`Server started at port : ${port}`);
})
app.use("/",(req,res)=>{
    res.status(404).send("Not Found");
})
