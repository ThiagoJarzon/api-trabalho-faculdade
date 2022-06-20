const express = require('express');
const db = require('../sql/MySqlite');
const router = express.Router();

router.post('/procurar', (req, res, next) => {
    const sql = 'SELECT endereco_id FROM tb_endereco WHERE endereco_cep = ? AND endereco_num = ? AND endereco_rua = ? AND endereco_uf = ?';
    const endereco = [req.body.cep, req.body.num, req.body.rua, req.body.uf];
    let result = [];
    db.all(sql, endereco, (err, rows) => {
        if(err){
            res.status(500).send({
                messagem: 'Erro ao procurar endereco',
                error: err,
                endereco: endereco,
                sql: sql
            })
        }
        rows.forEach((row) => {
            result.push(row.endereco_id);
        })
        if(result.length === 0){
            res.status(200).send({
                messagem: "Endereço não encontrado",
                retorno: "-1"
            })
        }else{
            res.status(200).send({
                messagem: "Endereço encontrado",
                retorno: result[0]
            })
        }
    });
});

router.post('/cadastrar', (req, res, next) => {
    const sql = 'INSERT INTO tb_Endereco (endereco_cep, endereco_num, endereco_rua, endereco_uf, endereco_complemento) VALUES (?, ?, ?, ?, ?)';
    const endereco = [req.body.cep, req.body.num, req.body.rua, req.body.uf, req.body.complemento]
    db.run(sql, endereco, err => {
        if(err){
            res.status(500).send({
                messagem: 'Erro ao cadastrar endereo',
                error: err
            })
        }
        res.status(200).send({
            messagem: 'Novo endereço inserido com sucesso'
        })
    })
});

module.exports = router;