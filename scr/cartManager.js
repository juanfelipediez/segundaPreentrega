import fs from "fs"
const filePath = "./files/carts.json"

class CartManager {
    static newCart(id){
        const cart = {
            id: id,
            includedProducts: [],
        }
        return cart
    }

    static getCarts(){
        if(fs.existsSync(filePath)){
            return JSON.parse(fs.readFileSync(filePath, "utf8"))
        }    
    }

    static saveCarts(carts){
        fs.writeFileSync(filePath, JSON.stringify(carts, null, "\t"))
    }

}

export { CartManager }