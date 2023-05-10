const express   = require('express');
const router    = express.Router();
const mysql     = require('mysql');

const conn = require('../config/db');

router.get('/', (req,res) => {
    let kode = req.query.kode;
    let code = 200;
    let data = {
        data: [],
        status: true,
        msg: '',
    }
    
    let query = `SELECT * FROM tenda ORDER BY kode`;
    if(kode && kode != 'undefined'){
        query = `SELECT * FROM tenda WHERE kode = '${kode}' ORDER BY kode`;
    }
    console.log(req.query);
    conn.query(query, (err, result, fields) => {
        try{
            if(err) throw err;
            if(result && result.length > 0){
                data.data   = result;
                data.msg    = 'get data success';                
            }
            else{                
                data.msg    = 'Data tidak ditemukan';
                code        = 404;
            }
            return res.status(code).send(data);
        }
        catch(e){
            data.data   = e;
            data.status = false;
            code        = 400;
            return res.status(code).send(data);
        }
    });
});

router.post('/add', (req,res) => {
    let code     = 200;
    let kode     = req.body.kode;
    let tgl_jadi = req.body.tgl_jadi;
    let stok     = req.body.stok;
    let data     = {
        data    : [],
        status  : true,
        msg     : '',
    };
    console.log('add');
    console.log(req.body);

    if(!kode || !tgl_jadi || !stok){
        data.status = false;
        data.msg    = 'Harap mengisi semua pengisian secara lengkap!';
        code        = 400;
        return res.status(code).send(data);
    }
    else{
        let query = `SELECT COUNT(*) as count FROM tenda WHERE kode = '${kode}'`;
        conn.query(query, (err, result, fields) => {
            try{
                if(err) throw err;
                if(result && result[0].count <= 0){
                    query = `INSERT INTO tenda (kode, tgl_jadi, stok) VALUES ('${kode}', '${tgl_jadi}', '${stok}')`;            
                    conn.query(query, (err, result, fields) => {
                        try{
                            if(err) throw err;
                            if(result || result.length > 0){
                                data.data   = result;
                                data.msg    = 'insert data success';
                                code        = 201;
                                return res.status(code).send(data);
                            }
                        }
                        catch(e){                
                            data.data   = e;
                            data.status = false;
                            data.msg    = 'insert data failed';
                            code        = 400;
                            return res.status(code).send(data);
                        }
                    });
                }
                else{
                    data.msg    = 'Kode sudah pernah digunakan';
                    data.status = false;
                    code        = 400;
                    return res.status(code).send(data);
                }
            }
            catch(e){                
                data.data   = e;
                data.status = false;
                data.msg    = 'Gagal melakukan pengecekan';
                code        = 400;
                return res.status(code).send(data);
            }
        });        
    }
});

router.post('/edit', (req,res) => {
    let code     = 200;
    let id       = req.body.id;
    let kode     = req.body.kode;
    let tgl_jadi = req.body.tgl_jadi;
    let stok     = req.body.stok;
    let data     = {
        data    : [],
        status  : true,
        msg     : '',
    };

    console.log('add');
    console.log(req.body);

    if(!id || !kode || !tgl_jadi || !stok){
        data.msg    = 'Harap lengkapi semua pengisian!';
        data.status = false;
        code        = 400;
        return res.status(code).send(data);
    }
    else{
        let query = `SELECT COUNT(*) as count FROM tenda WHERE kode = '${kode}' AND id != '${id}'`;
        conn.query(query, (err, result, fields) => {
            try{
                if(err) throw err;
                if(result && result[0].count <= 0){                    
                    query = `UPDATE tenda SET kode = '${kode}', tgl_jadi = '${tgl_jadi}', stok = '${stok}' WHERE id = '${id}'`;
                    conn.query(query, (err, result, fields) => {
                        try{
                            if(err) throw err;
                            if(result || result.length > 0){
                                data.data   = result;
                                data.msg    = 'update data success';
                                return res.status(code).send(data);
                            }
                        }
                        catch(e){                
                            data.data   = e;
                            data.status = false;
                            data.msg    = 'update data failed';
                            code        = 400;
                            return res.status(code).send(data);
                        }
                    });
                }
                else{
                    data.msg    = 'Kode sudah pernah digunakan';
                    data.status = false;
                    code        = 400;
                    return res.status(code).send(data);
                }
            }
            catch(e){
                data.data   = e;
                data.status = false;
                data.msg    = 'Gagal melakukan pengecekan';
                code        = 400;
                return res.status(code).send(data);
            }
        });
    }
});

router.post('/delete', (req,res) => {
    let code     = 200;
    let id       = req.body.id;    
    let data     = {
        data    : [],
        status  : true,
        msg     : '',
    };

    if(!id){
        data.msg    = 'Harap lengkapi semua pengisian!';
        data.status = false;
        code        = 400;
        return res.status(code).send(data);
    }
    else{
        let query = `DELETE FROM tenda WHERE id = '${id}'`;
        conn.query(query, (err, result, fields) => {
            try{
                if(err) throw err;
                if(result || result.length > 0){
                    data.data   = result;
                    data.msg    = 'delete data success';
                    return res.status(code).send(data);
                }
            }
            catch(e){                
                data.data   = e;
                data.status = false;
                data.msg    = 'delete data failed';
                code        = 400;
                return res.status(code).send(data);
            }
        });
    }
});

module.exports = router;