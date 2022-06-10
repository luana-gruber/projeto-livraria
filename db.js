async function conecta() {
    const mysql = require('mysql2/promise')
    const conn = await mysql.createConnection({
        host: "localhost",
        user: "l42",
        password: "Usuario@1992",
        database: "filmes"
    })
    global.connection = conn
    return connection
}
//conecta()

async function selectFilmes() {
    const conectado = await conecta()
    const [rows] = await conectado.query("SELECT f.titulo,f.genero,d.nome FROM videos as f INNER JOIN diretor as d ON f.diretor = d.diretor_id")
    return rows
}

async function selectLivros() {
    const conectado = await conecta()
    const [rows] = await conectado.query("SELECT * FROM livros ORDER BY livros_id DESC")
    return rows
}

async function selectProdutos() {
    const conectado = await conecta()
    const [rows] = await conectado.query("SELECT * FROM carrinho")
    return rows
}

async function selectSingle(id) {
    const conectado = await conecta()
    const values = [id]
    const [rows] = await conectado.query("SELECT * FROM livros WHERE livros_id=?", values)
    return rows
}

async function selectPromocoes() {
    const conectado = await conecta()
    const [rows] = await conectado.query("SELECT * FROM livros WHERE promo=1")
    return rows
}

async function updatePromocoes(promo, id) {
    const conectado = await conecta()
    const values = [promo, id]
    return await conectado.query("UPDATE livros SET promo=? WHERE livros_id=?", values)
}

async function insertLivro(livro) {
    const conectado = await conecta()
    const values = [livro.titulo, livro.resumo, livro.valor, livro.imagem]
    const [rows] = await conectado.query("INSERT INTO livros (titulo,resumo,valor,imagem) VALUES (?,?,?,?)", values)
    return rows
}

async function insertContato(contato) {
    const conectado = await conecta()
    const values = [contato.nome, contato.sobrenome, contato.email, contato.mensagem]
    const [rows] = await conectado.query("INSERT INTO contato (nome,sobrenome,email,mensagem) VALUES (?,?,?,?)", values)
    return rows
}

async function insertUsuario(usuario) {
    const conectado = await conecta()
    const values = [usuario.nome, usuario.email, usuario.telefone, usuario.senha, usuario.conf_senha]
    const [rows] = await conectado.query("INSERT INTO usuarios (nome,email,telefone,senha,conf_senha) VALUES (?,?,?,?,?)", values)
    return rows
}
//selectFilmes()
//insertContato({nome: "Albert", sobrenome:"Einsten", email: "einsten@gmail.com", mensagem:"lorem lorem lorem"})
module.exports = { 
    selectFilmes, 
    selectLivros, 
    selectProdutos, 
    selectSingle, 
    selectPromocoes, 
    insertLivro, 
    updatePromocoes,
    insertContato,
    insertUsuario
}