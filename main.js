const request = require('supertest')('https://dummyjson.com')
const chai = require('chai')
const chaiJsonSchemaAjv = require('chai-json-schema-ajv')

chai.use(chaiJsonSchemaAjv)
const { expect } = chai

const todosSchemaProperties = { 
    id:{type: "number"}, 
    todo:{type:"string"},
    userId: { type: 'number' },
    completed: { type: 'boolean' }}
    
const todoSchema = {
    type: 'object',
    properties: todosSchemaProperties,
    required: ['id','todo','userId','completed']
}
const todosSchemaAll = {
    type: 'object',
    properties: {
        todos: {
            type: 'array',
            items: todoSchema
        }
    }
}

describe("FT_002_todos_API",function(){
    describe("TD_001 Mencoba menampilkan semua data",function(){
        it("Menampilkan semua data", async function(){
            const result = await request.get('/todos')
            expect(result.body).have.jsonSchema(todosSchemaAll)
        })
    })
    describe("TD_002 Mencoba menampilkan data dengan input id:1",function(){
        it ("Menampilkan data yang memiliki id 1",async function(){
            const result = await request.get('/todos/1')
            expect(result.body).have.jsonSchema(todoSchema)
        })
    })
    describe("TD_003 Mencoba menampilkan 1 data random",function(){
        it ("Menampilkan 1 data random",async function(){
            const result = await request.get('/todos/random')
            expect(result.body).have.jsonSchema(todoSchema)
        })
    })
    describe("TD_004 Mencoba menampilkan data dengan menggunakan limit dan skip",function(){
        it ("Menampilkan data dengan id 11, 12, dan 13",async function(){
            const result = await request.get('/todos?limit=3&skip=10')
            expect(result.body).have.jsonSchema(todosSchemaAll)
        })
    })
    describe("TD_005 Mencoba menampilkan data dengan input userId:5",function(){
        it ("Menampilkan data dengan userId 5",async function(){
            const result = await request.get('/todos/user/5')
            expect(result.body).have.jsonSchema(todosSchemaAll)
        })
    })
    describe("TD_006 Mencoba menambahkan data dengan input todo:'Monday left me broken', completed: false, userId: 5",function(){
        const data ={
        todo: 'Monday left me broken',
        completed: false,
        userId: 5,
        }
        it ("Menampilkan data todo: "+data.todo+ ","+
        " completed: "+data.completed+ ","+
        " userId: "+data.userId ,async function(){
            const result = await request.post('/todos/add').send(data)
            expect(result.body).have.jsonSchema(todoSchema)
        })
    })
    describe("TD_007 Mencoba mengubah todo pada data id:1 dengan input todo: 'we live, we love, we lie'",function(){
        const data ={
        todo: 'we live, we love, we lie',
        }
        it ("Mengganti dan menampilkan data todo yang baru: "+data.todo ,async function(){
            const result = await request.put('/todos/1').send(data)
            expect(result.body).have.jsonSchema(todoSchema)
        })
    })
    describe("TD_008 Mencoba menghapus data dengan id:1 ",function(){
        it ("Data berhasil dihapus" ,async function(){
            const todoDeleteSchema = {
                type: 'object',
                properties: { 
                    id:{type: "number"}, 
                    todo:{type:"string"},
                    userId: { type: 'number' },
                    completed: { type: 'boolean' },
                    isDeleted:{type:'boolean'}},
                required: ['id','todo','userId','completed','isDeleted']
            }
            const result = await request.delete('/todos/1')
            expect(result.body).have.jsonSchema(todoDeleteSchema)
        })
    })
})
