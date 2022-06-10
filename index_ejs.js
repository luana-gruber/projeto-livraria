(async () => {
    const express = require('express')
    const app = express()
    const db = require('./db.js')
    const port = 8080
    const url = require('url')
    const bodyParser = require('body-parser')

    app.set("view engine", "ejs")

    //config variáveis post

    app.use(bodyParser.urlencoded({extended:false}))
    app.use(bodyParser.json())

    app.use(express.static('livraria-2022'))
    app.use("/books", express.static("books"))
    app.use("/imgs", express.static("imgs"))
    app.use("/css", express.static("css"))
    app.use("/js", express.static("js"))

    const consulta = await db.selectFilmes()
    const consultaLivros = await db.selectLivros()
    const consultaProdutos = await db.selectProdutos()

    app.get('/', (req, res) => {
        res.render(`index`, {
            titulo: "Conheça nossos livros",
            promo: "Alugue com telas ilimitadas",
            livro: consulta,
            galeria: consultaLivros
        })
    })

    app.get("/insert-livro", async (req,res)=> {
        await db.insertLivro({titulo: "A Ilha Misteriosa", resumo:"lorem lorem", valor: 20.45, imagem:"ilha.jpg"})
        res.send("<h2>Livro adicionado com sucesso</h2><a href='./'>Voltar</a>")
    })

    app.get("/upd-promo", (req,res)=> {
        res.render(`adm/atualiza-promocoes`, {
            titulo: "Conheça nossos livros",
            promo: "Alugue com telas ilimitadas",
            livro: consulta,
            galeria: consultaLivros
    })
})


    app.get("/atualiza-promo", async (req,res)=> {
        let qs = url.parse(req.url,true).query
        await db.updatePromocoes(qs.promo, qs.id)
        res.send("<h2>Lista de promoções atualizada</h2><a href='/promocoes'>Voltar</a>")
    })

    app.get('/promocoes',async (req, res) => {
        const consultaPromo = await db.selectPromocoes()
        res.render(`promocoes`, {
            titulo: "Conheça nossos livros",
            promo: "Alugue com telas ilimitadas",
            livro: consulta,
            galeria: consultaPromo
    })
})

    app.get('/single-produto', async(req, res) => {
        let infoUrl = req.url
        let urlProp = url.parse(infoUrl, true)
        let q = urlProp.query
        const consultaSingle = await db.selectSingle(q.id)
        const consultaInit = await db.selectSingle(4)
        res.render(`single-produto`, {
            titulo: "Conheça nossos livros",
            promo: "Alugue com telas ilimitadas",
            livro: consulta,
            galeria: consultaSingle,
            inicio: consultaInit
        })
    })

    app.get('/contato', async(req, res) => {
        const consultaInit = await db.selectSingle(4)
        res.render(`contato`, {
            titulo: "Conheça nossos livros",
            promo: "Alugue com telas ilimitadas",
            livro: consulta,
            galeria: consultaInit,
        })
    })

    app.get('/cadastro', async(req, res) => {
        const consultaInit = await db.selectSingle(4)
        res.render(`cadastro`, {
            titulo: "Conheça nossos livros",
            promo: "Alugue com telas ilimitadas",
            livro: consulta,
            galeria: consultaInit,
        })
    })
    app.post('/cadastro', async(req, res) => {
        const info = req.body
        await db.insertUsuario({
            nome: info.nome,
            email: info.email,
            telefone: info.telefone,
            senha: info.senha,
            conf_senha: info.conf_senha
        })
        res.redirect("/promocoes")
    })

    app.get('/carrinho', (req, res) => {
        res.render(`carrinho`, {
            produtos: consultaProdutos
        })
    })

    app.post('/contato', async (req,res) => {
        const info = req.body
        await db.insertContato({
            nome: info.cad_nome,
            sobrenome: info.cad_sobrenome,
            email: info.cad_email,
            mensagem: info.cad_mensagem
        })
        res.redirect("/promocoes")
    })

    app.listen(port, () => console.log("Rodando com nodemon"))
})()