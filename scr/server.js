import express from "express"
import productRoutes from "./routes/product.routes.js"
import cartsRoutes from "./routes/cart.routes.js"
import handlebars from "express-handlebars"
import __dirname from "./dirname.js"
import viewsRouter from "./routes/views.router.js"
import {Server} from "socket.io"
import { ProductManager } from "./productManager.js"


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const PORT = 5000

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname+"/views")
app.set("view engine", "handlebars")
app.use(express.static(__dirname+"/public"))

app.use("/api/products", productRoutes)
app.use("/api/carts", cartsRoutes)

const httpServer = app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})

const io = new Server(httpServer)

const products = ProductManager.getProducts()

io.on('connection', socket => { 
    socket.emit('list', products)

    socket.on('newProduct', (data) => {
        let lastProductId = products[(products.length)-1].id
        const product = ProductManager.newProduct(lastProductId+1, data.title, data.description, data.code, data.price, true, data.stock, data.category)
        if(!product.title || !product.price){
            socket.emit('error', 'Error: the new product must have at least a title and a price.')
            return
        }
        products.push(product)
        ProductManager.saveProducts(products)    
        socket.broadcast.emit('liveList', products)    
    })

    socket.on('deleteProduct', (data) => {
        const selectedProduct = products.find((el) => el.id === Number(data))
        const productIndex = products.indexOf(selectedProduct)
        products.splice(productIndex, 1)
    
        ProductManager.saveProducts(products)
        socket.broadcast.emit('liveList', products)
    })

})    

app.use('/', viewsRouter)
