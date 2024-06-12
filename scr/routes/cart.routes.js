import { Router } from "express"
import { ProductManager } from "../productManager.js"
import { CartManager } from "../cartManager.js"

const router = Router()


router.post("/", (req, res) => {
    
    const carts = CartManager.getCarts()
    let lastCartId
    
    if(carts.length < 1){
        lastCartId = 0
    } else {
        lastCartId = carts[carts.length-1].id
    }

    const cart = CartManager.newCart(lastCartId+1)
    carts.push(cart)
    CartManager.saveCarts(carts)
    res.status(201).json(`A new cart has been created. Currently there are ${carts.length} carts.`)
})

router.get("/:cid", (req, res) => {
    const { cid } = req.params
    
    if(isNaN(Number(cid))){
        res.status(400).json(`Only numbers are allowed. Please enter the ID of the cart you want to find.`)
        return
    }

    const carts = CartManager.getCarts()
    const selectedCart = carts.find((el) => el.id === Number(cid))
    if(!selectedCart){
        res.status(400).json(`The cart with number ID ${cid} doesn't exist`)
        return
    }

    if(selectedCart.includedProducts.length < 1){
        res.status(200).json(`This cart is currently empty`)
    }
    
    res.status(200).json(selectedCart.includedProducts)
})

router.post("/:cid/product/:pid", (req, res) => {
    const { cid, pid } = req.params
    const carts = CartManager.getCarts()
    const products = ProductManager.getProducts()
    const selectedProduct = products.find((el) => el.id === Number(pid))
    const selectedCart = carts.find((el) => el.id === Number(cid))

    
    if(isNaN(Number(cid))){
        res.status(400).json(`Only numbers are allowed. Please enter the ID of the cart you want to edit.`)
        return
    }

    
    if(isNaN(Number(pid))){
        res.status(400).json(`Only numbers are allowed. Please enter the ID of the product you want to add.`)
        return
    }
    
    if(!selectedCart){
        res.status(400).json(`The cart with number ID (${cid}) doesn't exist`)
        return
    }

    if(!selectedProduct){
        res.status(400).json(`The product with number ID (${pid}) doesn't exist`)
        return
    }

    const alreadyIncludedProduct = selectedCart.includedProducts.find((el) => el.id === Number(pid))

    const newIncludedProduct = {
        id: Number(pid),
        quantity: 1,
    }

    if(alreadyIncludedProduct){
        alreadyIncludedProduct.quantity++
        res.status(200).json(`A new item with the number ID ${pid} has been added. This cart includes ${alreadyIncludedProduct.quantity} items of that product`)
    } else {
        selectedCart.includedProducts.push(newIncludedProduct)
        res.status(200).json(`A new product with the number ID ${pid} has been added to the cart`)
    }
    CartManager.saveCarts(carts)
})

export default router 