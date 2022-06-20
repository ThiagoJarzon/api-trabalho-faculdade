const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const db = require('../sql/MySqlite');
const router = express.Router();
const loguin = require('../middleware/loguin');

router.get('/:id_protocolo', (req, res, next) => {
    const protocolo = req.params.id_protocolo;
    const sql = 'SELECT descricao, endereco, status FROM tb_Denuncia WHERE protocolo = ?';
    let result = [];
    db.all(sql, protocolo, (err, rows) => {
        if(err){
            res.status(500).send({
                messagem: 'Erro ao procurar a denuncia',
                error: err
            })
        }
        rows.forEach((row) => {
            result.push(row);
        })
        if(result.length === 0){
            res.status(200).send({
                messagem: "Denúncia não encontrado"
            })
        }else{
            res.status(200).send({
                messagem: "Denúncia encontrado",
                retorno: result[0]
            })
        }
    });
});

router.get('/buscar/uf', loguin.obrigatorio ,(req, res, next) => {
    const uf = req.orgao.uf;
    const sql = 'SELECT descricao, endereco_cep, endereco_num, endereco_rua, endereco_uf, status FROM tb_Denuncia INNER JOIN tb_Endereco ON tb_Endereco.endereco_uf = ? AND tb_Denuncia.status = "Não Verificado"';
    let result = [];
    db.all(sql, uf, (err, rows) => {
        if(err){
            res.status(500).send({
                messagem: 'Erro ao procurar a denuncia',
                error: err
            })
        }
        rows.forEach((row) => {
            result.push(row);
        })
        if(result.length === 0){
            res.status(200).send({
                messagem: "Denúncia não encontrado",
                uf: uf
            })
        }else{
            res.status(200).send({
                messagem: "Denúncia encontrado",
                retorno: result
            })
        }
    });
});

router.put('/status/:EnderecoID', loguin.obrigatorio, (req, res, next) => {
    const sql = 'UPDATE tb_Denuncia set status = "Verificado" WHERE endereco = ? AND status = ?';
    const parametros = [req.params.EnderecoID, "Não Verificado"]
    db.run(sql, parametros, err => {
        if(err){
            res.status(500).send({
                messagem: "Erro ao alterar denúncias"
            })
        }
        res.status(200).send({
            messagem: "Alteração da denúncia realizada com sucesso para " + parametros[1]
        })
    });
    
})

router.post('/cadastrar', (req, res, next) => {
    const sql = 'INSERT INTO tb_Denuncia (descricao, endereco, protocolo, status) VALUES (?, ?, ?, ?)';
    const denuncia = [req.body.descricao, req.body.endereco, req.body.protocolo, "Não Verificado"];
    db.run(sql, denuncia, err => {
        if(err){
            res.status(500).send({
                messagem: 'Erro ao realizar nova denúncia',
                error: err
            })
        }
        res.status(200).send({
            messagem: 'Nova denúncia realizada com sucesso'
        })
    })
});
module.exports = router;