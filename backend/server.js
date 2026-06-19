import app from './src/app.js'
const port = process.env.PORT || 4500;
app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})