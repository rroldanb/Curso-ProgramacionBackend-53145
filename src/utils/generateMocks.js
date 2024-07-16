const { faker } = require ('@faker-js/faker')
const crypto = require  ('crypto')



function generateProducts() {
    // let numOfThumbnails = parseInt(faker.string.numeric( {length:1, exclude: ['0'] , max:4}))
    let numOfThumbnails = faker.number.int({ min: 1, max: 5 }) 
    let thumbnails = []
    for (let i = 0; i < numOfThumbnails; i++) {
        thumbnails.push(faker.image.urlLoremFlickr({ category: 'toys', width: 300, height:300 }))        
    }
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.commerce.isbn(),
        price: faker.commerce.price({dec: 0, max: 100000}),
        status: faker.datatype.boolean(0.9),
        stock: parseInt(faker.string.numeric()),
        category: faker.commerce.department(),
        thumbnails
    }
}
function generateUsers  ()  {
    // let numOfProducts = parseInt(faker.string.numeric(1, {bannedDigits: ['0']}))
    let numOfProducts = faker.number.int({ min: 1, max: 8 }) 
    let products = []
    for (let i = 0; i < numOfProducts; i++) {
        products.push(generateProducts())        
    }

    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        sex: faker.person.sex(),
        birthDate: faker.date.birthdate(),
        phone: faker.phone.number(),
        image: faker.image.avatar(),
        _id: crypto.randomUUID(),
        products,
        role: faker.helpers.arrayElement(['user', 'user_premium', 'admin']) 

    }
}

module.exports = {generateProducts, generateUsers}