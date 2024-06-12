const socket = io()
const filePath = "./files/products.json"



const title = document.getElementById("title")
const code = document.getElementById("code")
const stock = document.getElementById("stock")
const category = document.getElementById("category")
const price = document.getElementById("price")
const description = document.getElementById("description")
const button = document.getElementById('button')
const monitor = document.getElementById('monitor')
const list = document.getElementById("list")

const deleteButtons = []

socket.on('list', (data) => {
        list.innerHTML = ''
        data.forEach((el) => {
            const item = document.createElement('li')
            const deleteButton = document.createElement('button')
            deleteButton.id = `delete-${el.id}`
            deleteButton.innerText = `Delete`
            deleteButtons.push(deleteButton)
            item.innerText = `Product: ${el.title} | Price: $${el.price}`
            item.appendChild(deleteButton)
            list.appendChild(item)
            
        })

        deleteButtons.forEach((el) => {
            el.addEventListener('click', () => {
                let data = el.id.slice(7)
                socket.emit('deleteProduct', data)
            })
        })
    
})  

button.addEventListener('click', () => {


    socket.emit('newProduct', {
        title: title.value,
        code: code.value,
        stock: stock.value,
        category: category.value,
        price: price.value,
        description: description.value,
    })
    const errors = document.getElementById('errors')
    errors.innerText = ''

    title.value = ''
    code.value = ''
    stock.value = ''
    category.value = ''
    price.value = ''
    description.value = ''
})

socket.on('error', (data) => {
    const errors = document.getElementById('errors')
    errors.innerText = data
})