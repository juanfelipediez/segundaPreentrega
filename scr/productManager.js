import fs from "fs"
const filePath = "./files/products.json"

class ProductManager {
    static newProduct(id, title, description, code, price, status = true, stock, category, thumbnails){
        const product = {
            id: id,
            title: title,
            description: description,
            code: code,
            price: price,
            status: status,
            stock: stock,
            category: category,
            thumbnails: thumbnails,
        }
        return product
    }
    
    static getProducts(){
        if(fs.existsSync(filePath)){
            return JSON.parse(fs.readFileSync(filePath, "utf8"))
        }    
    }

    static saveProducts(products){
        fs.writeFileSync(filePath, JSON.stringify(products, null, "\t"))
    }
}

export { ProductManager }