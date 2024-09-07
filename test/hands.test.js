const chai = require('chai')
// const mongoose = require("mongoose");
// const SessionDaoMongo = require('../src/dao/mongo/sessions.mongo');
const UserDTO = require('../src/dtos/users.dto');
const { createHash, isValidPassword  } = require('../src/utils/bcrypt');


// mongoose.connect("mongodb://127.0.0.1:27017/testdata");
const expect =chai.expect


describe("Tests Bcrypt utilidad", () => {
//   before(function () {
//     this.productDao = new ProductDaoMongo();
//   });
//   beforeEach(async function () {
//     // await mongoose.connection.collections.products.drop().catch(() => {});
//     this.timeout(500);
//   });

  it("El hacheo debe vover un hasheo efectivo del password", async  () => {

    const password = '123456'
    const hashPassword = await createHash(password)
    // console.log(hashPassword)
    expect(hashPassword).to.not.equal(password)
});
it('El hasheo debe compararse efectivamente con el pwd original' , async () =>{
    const password = '123456'
    const user ={password}
    const hashPassword = await createHash(password)

    const passwordValidation = await isValidPassword(password, {password: hashPassword})
    expect (passwordValidation).to.be.true
})

it('El hasheo realizado al ser alterado debe fallar la prueba' , async () =>{
    const password = '123456'
    const hashPassword = await createHash(password)
    const hashPasswordAlterado = hashPassword+'10'
    const passwordValidation = await isValidPassword(password, {password: hashPasswordAlterado})
    expect (passwordValidation).to.be.false
})

after(function () {
    setTimeout(() => process.exit(), 100);
  });

});


describe('Testing de User DTO', ()=>{
    before(function (){
        // this.userDTO = new UserDTO()
    })
    it('El DTO debe unificar nombre y apellido en full_name', ()=>{
        const userMock = {
            first_name:'Gago',
            last_name:'Roldan',
            email:'gago.email.com',
            role:'user',
            password:'1234567'
        }
        const userDTOTocken = new UserDTO(userMock)
        expect(userDTOTocken).to.have.property('full_name', 'Gago Roldan')
})
    it('El DTO no debe devolver la password', ()=>{
        const userMock = {
            first_name:'Gago',
            last_name:'Roldan',
            email:'gago.email.com',
            role:'user',
            password:'1234567'
        }
        const userDTOTocken = new UserDTO(userMock)
        expect(userDTOTocken).to.not.have.property('password')
})
})
