import { Router } from "express"
import { ProductManager } from "../productManager.js"

const router = Router()

router.get("/", (req, res) => {
    const products = ProductManager.getProducts()
    if(products.length < 1){
        res.status(200).json("There are no products yet")
        return
    }
    res.status(200).json(products)
})

router.get("/:id", (req, res) => {
    const { id } = req.params
    const products = ProductManager.getProducts()
    const product = products.find((el) => el.id === Number(id))

    if(isNaN(Number(id))){
        res.status(400).json(`Only numbers are allowed. Please enter the ID of the product you want to find.`)
        return
    }
    if(!product){
        res.status(400).json(`The number ID ${id} doesn't exist.`)
        return
    }
    res.status(200).json(product)
})

router.post("/", (req, res) => {
    const {title, description, code, price, status, stock, category, thumbnails} = req.body
    if(!title || !description || !code || !price || !stock || !category){
        res.status(400).json("All this properties are required: title, description, code, price, stock, category")
        return
    }
    const products = ProductManager.getProducts()
    
    let lastProductId = products[(products.length)-1].id
    const product = ProductManager.newProduct(lastProductId+1, title, description, code, price, status, stock, category, thumbnails)

    products.push(product)
    ProductManager.saveProducts(products)    
    res.status(201).json(`The product ${title} was successfully created.`)

})

router.put("/:pid", (req, res) => {
    const {id, title, description, code, price, status, stock, category, thumbnails} = req.body
    const {pid} = req.params
    const products = ProductManager.getProducts()
    const selectedProduct = products.find((el) => el.id === Number(pid))

    if(isNaN(Number(pid))){
        res.status(400).json(`Only numbers are allowed. Please enter the ID of the product you want to edit.`)
        return
    }

    if(!selectedProduct){
        res.status(400).json("The introduced ID number doesn`t exist.")
        return
    }


    if(Number(id) && Number(id) != selectedProduct.id) {
        res.status(400).json("ID numbers of products can`t be changed.")
        return
    }

    selectedProduct.title = title;
    selectedProduct.description = description || selectedProduct.description;
    selectedProduct.code = code || selectedProduct.code;
    selectedProduct.price = price || selectedProduct.price;
    selectedProduct.status = status || selectedProduct.status;
    selectedProduct.stock = stock || selectedProduct.stock;
    selectedProduct.category = category || selectedProduct.category;
    selectedProduct.thumbnails = thumbnails || selectedProduct.thumbnails;

    ProductManager.saveProducts(products)    

    res.status(200).json(`The product ${selectedProduct.title} was successfully edited`)
})

router.delete("/:pid", (req, res) => {
    const {pid} = req.params
    const products = ProductManager.getProducts()
    const selectedProduct = products.find((el) => el.id === Number(pid))
    if(!selectedProduct){
        res.status(400).json("The introduced ID number doesn`t exist.")
        return
    }

    if(isNaN(Number(pid))){
        res.status(400).json(`Only numbers are allowed. Please enter the ID of the product you want to delete.`)
        return
    }

    const productIndex = products.indexOf(selectedProduct)
    products.splice(productIndex, 1)

    ProductManager.saveProducts(products)    
    res.json(`The product ${selectedProduct.title} was deleted properly.`)
})

export default router
