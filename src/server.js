require('dotenv').config()
const express = require('express');
const { read, write } = require('./utils/FS')
const { sign } = require('./utils/jwt')
const verifyAccess = require('./middlewares/verifyAccess.middleware')

const app = express()

app.use(express.json())

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views/')

// middlewares 
app.use('/assets', express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))

app.get('/sofa', verifyAccess, (req, res) => {
    console.log(req.params)
    const sofa = read('sofa.json')

    res.json(sofa)
})

app.get('/sofa/:id', verifyAccess, (req, res) => {
    const { id } = req.params
    const foundSofa = read('sofa.json')
    .find(e => e.id == id)

    res.json(foundSofa)
})

app.post('/admin', (req, res) => {
    const { name, password } = req.body

    const admin = read('users.json').find(e => e.name = name && e.password == password)

    if (!admin) {
        return res.status(401).json({
            message: "Siz admin emassiz :("
        })
    }

    res.status(200).json({
        message: "Authorized",
        access_token: sign({ id: admin?.id })
    })

})

app.post('/sofa', verifyAccess, (req, res) => {
    const { mebel_name, price } = req.body;

    if (!mebel_name && !price) {
        res.status(401).json({
            message: "mebel_name va price ni kiriting brat bodyda :("
        })
    } else {
        const sofa = read('sofa.json')
    
        sofa.push({ id: (sofa[sofa.length - 1]?.id + 1) || 1, mebel_name, price })
    
        write('sofa.json', sofa)
    
        res.status(200).json({
            message: "create mebel"
        })
    }

})

app.put('/sofa/:id', verifyAccess, (req, res) => {
    const { id } = req.params
    const { mebel_name, price } = req.body

    if (!mebel_name && !price) {
        res.status(401).json({
            message: "mebel_name va price ni kiriting brat bodyda :("
        })
    }

    const sofa = read('sofa.json')

    const foundSofa = sofa.find(e => e.id == id)
    const index = sofa.findIndex(e => e.id == id)
    mebel_name ? foundSofa.mebel_name = mebel_name : foundSofa.mebel_name
    price ? foundSofa.price = price : foundSofa.price

    sofa.splice(index, 1, foundSofa)

    write('sofa.json', sofa)

    res.status(200).json({
        message: `${id} - idlik mebel update qilindi`
    })
})

app.put('/sofa', (_, res) => {
    res.status(401).json({
        message: "id kiriting brat o'zgartirmoqchi bo'lsangiz :("
    })
})

app.delete('/sofa/:id', verifyAccess, (req, res) => {
    const { id } = req.params

    const sofa = read('sofa.json')
    .filter(e => e.id != id)

    write('sofa.json', sofa)

    if (!id) {
        res.status(401).json({
            message: "id berish kerak paramsda :("
        })
    }

    res.status(200).json({
        message: `${id} - idlik mebel deleted`
    })
})

app.delete('/sofa', verifyAccess, (req, res) => {
    res.status(200).json({
        message: "id bering brat delete qilginingiz kelgan bolsa paramsda :)"
    })
})

const arr = [1,2,3,4,6,7]


app.listen(6000, console.log(6000)) 