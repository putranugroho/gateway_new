const axios = require("axios").default;
const router = require('express').Router()
const schedule = require('node-schedule');
const {
    encryptStringWithRsaPublicKey,
    decryptStringWithRsaPrivateKey,
} = require("../utility/encrypt");
const db = require("../connection");
const moment = require("moment");
const { request } = require("https");
const { promiseHooks } = require("v8");
moment.locale("id");

const url_core = process.env.CORE_URL
const url_cms = process.env.CMS_URL

// Generate random ref number
function generateString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    // const characters ='0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

const connect_axios = async (url, api, route, data) => {
    try {
        let Result = ""
        console.log(`${url}${route}`);
        console.log(`DATA API ${api} BANKING`);
        console.log(data);
        let headers
        if (api === 'CMS') {
            headers = {
                "Content-Type": "application/json",
                "api-key": process.env.API_KEY
            }
        } else if (api === 'CORE') {
            headers = {
                "Content-Type": "application/json",
            }
        }
        await axios({
            headers,
            method: 'post',
            url: `${url}${route.toLowerCase()}`,
            timeout: 25000, //milisecond
            data
        }).then(res => {
            Result = res.data
        }).catch(error => {
            console.log(`error ${api}`);
            // console.log(error);
            if (error.code == 'ECONNABORTED') {
                Result = {
                    code: "088",
                    status: "ECONNABORTED",
                    message: `${api} Connection Timeout`
                }
            } else {
                Result = {
                    code: "099",
                    status: "CONNECTION FAILED",
                    message: error
                }
            }
        });
        console.log(Result);
        return Result
    } catch (error) {
        console.log(error);
        return error
    }
}

const connect_keeping = async (url, route, data) => {
    try {
        let Result = ""
        console.log(`${url}${route}`);
        console.log("DATA API KEEPING");
        console.log(data);
        await axios({
            headers: {
                "Content-Type": "application/json",
            },
            method: 'post',
            url: `${url}${route}`,
            timeout: 25000, //milisecond
            data
        }).then(res => {
            Result = res.data
        }).catch(error => {
            console.log("error Core");
            // console.log(error);
            if (error.code == 'ECONNABORTED') {
                Result = {
                    code: "088",
                    status: "ECONNABORTED",
                    message: "Core Connection Timeout"
                }
            } else {
                Result = error
            }
        });
        return Result
    } catch (error) {
        console.log(error);
        return error
    }
}

async function update_gl_oy_kredit(
    amount,
    trans_fee,
    bpr_id,
    trx_code,
    no_rek_pokok,
    no_rek_fee,
    nama_rek_pokok,
    nama_rek_fee,
    detail_trans) {
    let data_trans
    console.log(trx_code);
    if (trx_code === "2100") {
        data_trans = `${detail_trans.nama_tujuan} ${detail_trans.rek_tujuan}`
    } else if (trx_code === "2300") {
        data_trans = `${detail_trans.nama_tujuan} ${detail_trans.rek_tujuan}`
        trx_code = detail_trans.trx_code
    } else {
        data_trans = `${detail_trans.nama_rek} ${detail_trans.no_rek}`
    }
    console.log(data_trans);
    if (trx_code !== "2300") {
        let [res_log_pokok, meta_log_pokok] = await db.sequelize.query(
            `INSERT INTO log_core(nosbb,bpr_id,trx_code,trx_type,tgl_trans,ket_trans,data_trans,amount_db,amount_cr,rrn,status,noreff,rcode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            {
                replacements: [
                    no_rek_pokok,
                    bpr_id,
                    trx_code,
                    detail_trans.trx_type,
                    detail_trans.tgl_trans,
                    detail_trans.keterangan,
                    data_trans,
                    0,
                    amount,
                    detail_trans.rrn,
                    detail_trans.status,
                    detail_trans.noreff,
                    detail_trans.tcode
                ],
            }
        );
    }
    if (trans_fee !== 0) {
        let [res_log_fee, meta_log_fee] = await db.sequelize.query(
            `INSERT INTO log_core(nosbb,bpr_id,trx_code,trx_type,tgl_trans,ket_trans,data_trans,amount_db,amount_cr,rrn,status,noreff,rcode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            {
                replacements: [
                    no_rek_fee,
                    bpr_id,
                    trx_code,
                    detail_trans.trx_type,
                    detail_trans.tgl_trans,
                    detail_trans.keterangan,
                    data_trans,
                    0,
                    trans_fee,
                    detail_trans.rrn,
                    detail_trans.status,
                    detail_trans.noreff,
                    detail_trans.tcode
                ],
            }
        );
    }
}

async function update_gl_oy_debet(
    amount,
    trans_fee,
    bpr_id,
    trx_code,
    no_rek_pokok,
    no_rek_fee,
    nama_rek_pokok,
    nama_rek_fee,
    detail_trans) {
    let nominal = amount + trans_fee
    let data_trans
    if (detail_trans.trx_type == "TRX") {
        data_trans = `${detail_trans.bpr_id} ${detail_trans.no_rek}`
    } else {
        data_trans = `${detail_trans.nama_rek} ${detail_trans.no_rek}`
    }
    if (trx_code == "2200") {
        let [res_log_pokok, meta_log_pokok] = await db.sequelize.query(
            `INSERT INTO log_core(nosbb,bpr_id,trx_code,trx_type,tgl_trans,ket_trans,data_trans,amount_db,amount_cr,rrn,status,rcode,noreff) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            {
                replacements: [
                    no_rek_pokok,
                    bpr_id,
                    trx_code,
                    detail_trans.trx_type,
                    detail_trans.tgl_trans,
                    detail_trans.keterangan,
                    data_trans,
                    nominal,
                    0,
                    detail_trans.rrn,
                    detail_trans.status,
                    detail_trans.tcode,
                    detail_trans.noreff
                ],
            }
        )
    } else {
        let [res_log_pokok, meta_log_pokok] = await db.sequelize.query(
            `INSERT INTO log_core(nosbb,bpr_id,trx_code,trx_type,tgl_trans,ket_trans,data_trans,amount_db,amount_cr,rrn,status,noreff,rcode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            {
                replacements: [
                    no_rek_pokok,
                    bpr_id,
                    trx_code,
                    detail_trans.trx_type,
                    detail_trans.tgl_trans,
                    detail_trans.keterangan,
                    data_trans,
                    amount,
                    0,
                    detail_trans.rrn,
                    detail_trans.status,
                    detail_trans.noreff,
                    detail_trans.tcode
                ],
            }
        );
        if (trans_fee !== 0) {
            let [res_log_fee, meta_log_fee] = await db.sequelize.query(
                `INSERT INTO log_core(nosbb,bpr_id,trx_code,trx_type,tgl_trans,ket_trans,data_trans,amount_db,amount_cr,rrn,status,noreff,rcode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                {
                    replacements: [
                        no_rek_fee,
                        bpr_id,
                        trx_code,
                        detail_trans.trx_type,
                        detail_trans.tgl_trans,
                        detail_trans.keterangan,
                        data_trans,
                        trans_fee,
                        0,
                        detail_trans.rrn,
                        detail_trans.status,
                        detail_trans.noreff,
                        detail_trans.tcode
                    ],
                }
            );
        }
    }
    // if (meta_pokok && meta_fee) {
    //     return true
    // } else {
    //     return false
    // }
}

async function update_gl_oy_db_cr(data_db, data_cr, detail_trans) {
    if (data_db.no_rek_pokok === "101208") {
        const nominal = data_db.amount + data_db.trans_fee
        let [res_log_pokok_db, meta_log_pokok_db] = await db.sequelize.query(
            `INSERT INTO log_core(nosbb,bpr_id,trx_code,trx_type,tgl_trans,ket_trans,data_trans,amount_db,amount_cr,rrn,status,noreff,rcode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            {
                replacements: [
                    data_db.no_rek_pokok,
                    data_db.bpr_id,
                    data_db.trx_code,
                    detail_trans.trx_type,
                    detail_trans.tgl_trans,
                    detail_trans.keterangan,
                    `${detail_trans.nama_rek} ${detail_trans.no_rek}`,
                    nominal,
                    0,
                    detail_trans.rrn,
                    detail_trans.status,
                    detail_trans.noreff,
                    detail_trans.tcode
                ],
            }
        );
    } else {
        let [res_log_pokok_db, meta_log_pokok_db] = await db.sequelize.query(
            `INSERT INTO log_core(nosbb,bpr_id,trx_code,trx_type,tgl_trans,ket_trans,data_trans,amount_db,amount_cr,rrn,status,noreff,rcode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            {
                replacements: [
                    data_db.no_rek_pokok,
                    data_db.bpr_id,
                    data_db.trx_code,
                    detail_trans.trx_type,
                    detail_trans.tgl_trans,
                    detail_trans.keterangan,
                    `${detail_trans.nama_rek} ${detail_trans.no_rek}`,
                    data_db.amount,
                    0,
                    detail_trans.rrn,
                    detail_trans.status,
                    detail_trans.noreff,
                    detail_trans.tcode
                ],
            }
        );
        if (data_db.trans_fee !== 0) {
            let [res_log_fee_db, meta_log_fee_db] = await db.sequelize.query(
                `INSERT INTO log_core(nosbb,bpr_id,trx_code,trx_type,tgl_trans,ket_trans,data_trans,amount_db,amount_cr,rrn,status,noreff,rcode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                {
                    replacements: [
                        data_db.no_rek_fee,
                        data_db.bpr_id,
                        data_db.trx_code,
                        detail_trans.trx_type,
                        detail_trans.tgl_trans,
                        detail_trans.keterangan,
                        `${detail_trans.nama_rek} ${detail_trans.no_rek}`,
                        data_db.trans_fee,
                        0,
                        detail_trans.rrn,
                        detail_trans.status,
                        detail_trans.noreff,
                        detail_trans.tcode
                    ],
                }
            );
        }
    }
    if (data_cr.no_rek_pokok === "101209") {
        const nominal = data_cr.amount + data_cr.trans_fee
        let [res_log_pokok_cr, meta_log_pokok_cr] = await db.sequelize.query(
            `INSERT INTO log_core(nosbb,bpr_id,trx_code,trx_type,tgl_trans,ket_trans,data_trans,amount_db,amount_cr,rrn,status,noreff,rcode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            {
                replacements: [
                    data_cr.no_rek_pokok,
                    data_cr.bpr_id,
                    data_cr.trx_code,
                    detail_trans.trx_type,
                    detail_trans.tgl_trans,
                    detail_trans.keterangan,
                    `${detail_trans.nama_rek} ${detail_trans.no_rek}`,
                    0,
                    nominal,
                    detail_trans.rrn,
                    detail_trans.status,
                    detail_trans.noreff,
                    detail_trans.tcode
                ],
            }
        );
    } else {
        let [res_log_pokok_cr, meta_log_pokok_cr] = await db.sequelize.query(
            `INSERT INTO log_core(nosbb,bpr_id,trx_code,trx_type,tgl_trans,ket_trans,data_trans,amount_db,amount_cr,rrn,status,noreff,rcode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            {
                replacements: [
                    data_cr.no_rek_pokok,
                    data_cr.bpr_id,
                    data_cr.trx_code,
                    detail_trans.trx_type,
                    detail_trans.tgl_trans,
                    detail_trans.keterangan,
                    `${detail_trans.nama_rek} ${detail_trans.no_rek}`,
                    0,
                    data_cr.amount,
                    detail_trans.rrn,
                    detail_trans.status,
                    detail_trans.noreff,
                    detail_trans.tcode
                ],
            }
        );
        if (data_cr.trans_fee !== 0) {
            let [res_log_fee_cr, meta_log_fee_cr] = await db.sequelize.query(
                `INSERT INTO log_core(nosbb,bpr_id,trx_code,trx_type,tgl_trans,ket_trans,data_trans,amount_db,amount_cr,rrn,status,noreff,rcode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                {
                    replacements: [
                        data_cr.no_rek_fee,
                        data_cr.bpr_id,
                        data_cr.trx_code,
                        detail_trans.trx_type,
                        detail_trans.tgl_trans,
                        detail_trans.keterangan,
                        `${detail_trans.nama_rek} ${detail_trans.no_rek}`,
                        0,
                        data_cr.trans_fee,
                        detail_trans.rrn,
                        detail_trans.status,
                        detail_trans.noreff,
                        detail_trans.tcode
                    ],
                }
            );
        }
    }
    // if (meta_pokok_db && meta_fee_db && meta_pokok_cr && meta_fee_cr) {
    //     return true
    // } else {
    //     return false
    // }
}

function split_sbb(data, tcode) {
    // console.log("data split sbb");
    // console.log(data);
    let no_pokok = {}
    let no_fee = {}
    let tagihan = {}
    let fee_bpr = {}
    if (tcode == "1100") {
        for (let i = 0; i < data.length; i++) {
            // console.log(data[i]);
            if (data[i].ket_tcode == "Issuer") {
                if (data[i].jns_gl == "0") {
                    tagihan = data[i]
                } else if (data[i].jns_gl == "2") {
                    fee_bpr['Issuer'] = data[i]
                }
                tagihan = data[i]
            } else if (data[i].ket_tcode == "Acquirer") {
                if (data[i].jns_gl == "0") {
                    no_pokok['Acquirer'] = data[i]
                } else if (data[i].jns_gl == "1") {
                    no_fee['Acquirer'] = data[i]
                } else if (data[i].jns_gl == "2") {
                    fee_bpr['Acquirer'] = data[i]
                }
            } else if (data[i].ket_tcode == "On-Us") {
                if (data[i].jns_gl == "0") {
                    no_pokok['On_Us'] = data[i]
                } else if (data[i].jns_gl == "1") {
                    no_fee['On_Us'] = data[i]
                } else if (data[i].jns_gl == "2") {
                    fee_bpr['On_Us'] = data[i]
                }
            }
        }
        console.log("return");
        // console.log(no_pokok,);
        // console.log(no_fee);
        // console.log(tagihan);
        // console.log(fee_bpr);
        return { no_pokok, no_fee, tagihan, fee_bpr }
    } else {
        for (let i = 0; i < data.length; i++) {
            if (data[i].jns_gl == "0") {
                no_pokok = data[i]
            } else if (data[i].jns_gl == "1") {
                no_fee = data[i]
            } else if (data[i].jns_gl == "2") {
                fee_bpr = data[i]
            }
        }
        console.log("return");
        // console.log(no_pokok,);
        // console.log(no_fee);
        // console.log(tagihan);
        // console.log(fee_bpr);
        return { no_pokok, no_fee, tagihan, fee_bpr }
    }
}

// API untuk Inquiry Account
const inquiry_account = async (req, res) => {
    let { no_ktp, no_hp, no_rek, bpr_id, trx_code, trx_type, status, pin, tgl_trans, user_id, password, tgl_transmis, rrn, xusername, xpassword } = req.body;
    try {
        console.log("REQ INQ ACC GW");
        console.log(req.body);
        // let [res_log_pokok, meta_log_pokok] = await db.sequelize.query(
        //     `INSERT INTO log_gateway(no_ktp, no_hp, no_rek, bpr_id, trx_code, trx_type, tgl_trans, rrn, messages_type) VALUES (?,?,?,?,?,?,?,?,'REQUEST')`,
        //     {
        //         replacements: [
        //             no_ktp, no_hp, no_rek, bpr_id, trx_code, trx_type, tgl_trans, rrn
        //         ],
        //     }
        // );
        if (trx_code == "0100") {
            console.log("REQ INQUIRY ACCOUNT");
            let data_cms = { bpr_id, no_hp, no_rek }
            console.log(data_cms);
            let request_acct = await connect_axios(url_cms, 'CMS', 'gw/inq/acct', data_cms)
            if (request_acct.code !== "000" && request_acct.data === null) {
                console.log(request_acct);
                res.status(200).send(request_acct);
            } else {
                request_acct.data["tgl_trans"] = tgl_trans
                request_acct.data["tgl_transmis"] = moment().format('YYMMDDHHmmss')
                request_acct.data["rrn"] = rrn
                let res_send = {
                    code: "000",
                    status: "ok",
                    message: "Success",
                    rrn: rrn,
                    data: request_acct.data,
                }
                console.log(res_send);
                res.status(200).send(res_send);
            }
        } else if (trx_code == "0200") {
            console.log("REQ ACTIVATE ACCOUNT");
            const data_core = {
                bpr_id,
                trx_code,
                trx_type: "TRX",
                tgl_trans,
                tgl_transmis: moment().format('YYMMDDHHmmss'),
                rrn,
                no_rek,
                gl_jns: "2"
            }
            let hasil = await connect_axios(url_core, 'CORE', 'inquiry', data_core)
            res.status(200).send(hasil)
        } else if (trx_code == "0300") {
            console.log("REQ SALDO GL");
            let data_cms = { bpr_id }
            let request_gl = await connect_axios(url_cms, 'CMS', 'gw/gl/kdacc', data_cms)
            if (request_gl.code !== "000" && request_gl.data === null) {
                console.log(request_gl);
                res.status(200).send(request_gl);
            } else {
                const data_core = {
                    bpr_id,
                    trx_code,
                    trx_type,
                    tgl_trans,
                    tgl_transmis: moment().format('YYMMDDHHmmss'),
                    rrn,
                    data: request_gl.data
                }
                const request = await connect_axios(url_core, 'CORE', "Inquiry", data_core)
                let res_send = {
                    code: "000",
                    status: "ok",
                    message: "Success",
                    data: request.data,
                }
                console.log(res_send);
                res.status(200).send(res_send);
            }
        } else if (trx_code == "0400") {
            console.log("REQ VALIDATE NO_REK");
            let data_cms = { bpr_id, no_rek }
            // let request_acct = await connect_axios(url_cms, 'CMS', 'trx/inquiry/validatenorek', data_cms)
            let request_acct = await connect_axios(url_cms, 'CMS', 'gw/inq/validatenorek', data_cms)
            if (request_acct.code !== "000" && request_acct.data === null) {
                console.log(request_acct);
                res.status(200).send(request_acct);
            } else {
                if (request_acct.data.status == "1") {
                    const data_core = {
                        // no_hp:rekening[0].no_hp,
                        bpr_id,
                        trx_code: "0300",
                        trx_type,
                        tgl_trans,
                        tgl_transmis: moment().format('YYMMDDHHmmss'),
                        rrn,
                        data: [{
                            no_rek,
                            gl_jns: "2",
                        }]
                    }
                    const request = await connect_axios(url_core, 'CORE', "Inquiry", data_core)
                    if (request.code !== "000") {
                        console.log(request);
                        res.status(200).send(request);
                    } else {
                        if (request.data[0].status_rek == "AKTIF") {
                            let res_send = {
                                code: "000",
                                status: "ok",
                                message: "Success",
                                rrn: rrn,
                                data: [
                                    {
                                        no_rek,
                                        nama_rek: request.data[0].nama,
                                        saldoakhir: `${parseInt(request.data[0].saldoakhir)}`,
                                        saldoeff: `${parseInt(request.data[0].saldoeff)}`,
                                    }
                                ],
                            }
                            console.log(res_send);
                            res.status(200).send(res_send);
                        } else {
                            let res_send = {
                                code: "008",
                                status: "Failed",
                                message: request.data[0].status_rek,
                                rrn: rrn,
                                data: [
                                    {
                                        no_rek,
                                        nama_rek: "",
                                        saldo: "0",
                                        saldo_blokir: "0",
                                        saldo_min: "0",
                                    }
                                ],
                            }
                            console.log(res_send);
                            res.status(200).send(res_send);
                        }
                    }
                } else {
                    let res_send = {
                        code: "000",
                        status: "ok",
                        message: "Success",
                        rrn: rrn,
                        data: [
                            {
                                no_rek,
                                nama_rek: "",
                                saldo: "0",
                                saldo_blokir: "0",
                                saldo_min: "0",
                            }
                        ],
                    }
                    console.log(res_send);
                    res.status(200).send(res_send);
                }
            }
        } else if (trx_code == "0500") {
            console.log("REQ VALIDATE NO_HP");
            let data_cms = { bpr_id, no_hp }
            let request_acct = await connect_axios(url_cms, 'CMS', 'gw/inq/validatenohp', data_cms)
            if (request_acct.code !== "000" && request_acct.data === null) {
                console.log(request_acct);
                res.status(200).send(request_acct);
            } else {
                let res_send = {
                    code: "000",
                    status: "ok",
                    message: "Success",
                    rrn: rrn,
                    data: request_acct.data,
                }
                console.log(res_send);
                res.status(200).send(res_send);
            }
        } else if (trx_code == "0600") {
            console.log("REQ UPDATE MPIN");
            let data_cms = { no_hp, no_rek }
            let request_acct = await connect_axios(url_cms, 'CMS', 'gw/inq/validatenorekhp', data_cms)
            if (request_acct.code !== "000" && request_acct.data === null) {
                console.log(request_acct);
                res.status(200).send(request_acct);
            } else {
                data_cms = { pin, no_hp, no_rek }
                let update_mpin = await connect_axios(url_cms, 'CMS', 'gw/mpin/updatests', data_cms)
                if (update_mpin.code !== "000" && update_mpin.data === null) {
                    console.log(update_mpin);
                    res.status(200).send(update_mpin);
                } else {
                    let res_send = {
                        code: "000",
                        status: "ok",
                        message: "Success",
                        rrn: rrn,
                        data: request_acct.data,
                    }
                    console.log(res_send);
                    res.status(200).send(res_send);
                }
            }
        } else if (trx_code == "0700") {
            console.log("REQ VALIDATE NO_HP AND NO_REK");
            let data_cms = { no_hp, no_rek }
            let request_acct = await connect_axios(url_cms, 'CMS', 'gw/inq/validatenorekhp', data_cms)
            if (request_acct.code !== "000" && request_acct.data === null) {
                console.log(request_acct);
                res.status(200).send(request_acct);
            } else {
                if (request_acct.data.mpin === pin) {
                    let res_send = {
                        code: "000",
                        status: "ok",
                        message: "Success",
                        rrn: rrn,
                        data: request_acct.data,
                    }
                    console.log(res_send);
                    res.status(200).send(res_send);
                } else {
                    let res_send = {
                        code: "003",
                        status: "Failed",
                        message: "Gagal, MPin Salah",
                        rrn: rrn,
                        data: null,
                    }
                    console.log(res_send);
                    res.status(200).send(res_send);
                }
            }
        } else if (trx_code == "0800") {
            console.log("REQ VALIDATE NO_KTP");
            let data_inq = { bpr_id, no_hp, no_rek, no_ktp }
            let inquiry_ktp = await connect_axios(url_cms, 'CMS', 'gw/inq/validatekeeping', data_inq)
            if (inquiry_ktp.code !== "000" && inquiry_ktp.data === null) {
                console.log(inquiry_ktp);
                res.status(200).send(inquiry_ktp);
            } else {
                let res_send = {
                    code: "000",
                    status: "ok",
                    message: "Success",
                    data: inquiry_ktp.data,
                }
                console.log(res_send);
                res.status(200).send(res_send);
            }
        } else if (trx_code == "0900") {
            console.log("REQ ACTIVATE ACCOUNT KEEPING");
            console.log("tanggal lahir, gender, email");
            let data_inq = { bpr_id, no_hp, no_rek, no_ktp }
            let request_acct = await connect_axios(url_cms, 'CMS', 'gw/inq/validatekeeping', data_inq)
            if (request_acct.code !== "000" && request_acct.data === null) {
                console.log(request_acct);
                res.status(200).send(request_acct);
            } else {
                let mpin_salah = parseInt(request_acct.data.mpin_salah)
                let res_send
                if (mpin_salah == 3 && request_acct.data.status == 2) {
                    res_send = {
                        code: "007",
                        status: "Failed",
                        message: "Gagal, mPIN Terblokir!!!",
                        data: null,
                    }
                    console.log("mpin terblokir");
                    console.log(res_send);
                    res.status(200).send(res_send);
                } else if (mpin_salah != 3 && request_acct.data.status == 2) {
                    res_send = {
                        code: "007",
                        status: "Failed",
                        message: "Gagal, Akun Anda Telah diBlokir!!!",
                        data: null,
                    }
                    console.log("akun atau kartu terblokir");
                    console.log(res_send);
                    res.status(200).send(res_send);
                } else if (request_acct.data.mpin == pin) {
                    let data_status_mpin = { status, mpin_salah: "0", no_rek, no_hp, bpr_id }
                    let update_status_mpin = await connect_axios(url_cms, 'CMS', 'gw/mpin/updatests', data_status_mpin)
                    console.log("update status mpin");
                    console.log(update_status_mpin);
                    res_send = {
                        code: "000",
                        status: "ok",
                        message: "Success",
                        rrn: rrn,
                        data: request_acct.data,
                    }
                    console.log(res_send);
                    res.status(200).send(res_send);
                } else {
                    mpin_salah = mpin_salah + 1
                    if (mpin_salah >= 3) {
                        let data_status_mpin = { status: "2", mpin_salah, no_rek, no_hp, bpr_id }
                        let update_status_mpin = await connect_axios(url_cms, 'CMS', 'gw/mpin/updatests', data_status_mpin)
                        if (update_status_mpin.code !== "000" && update_status_mpin.data === null) {
                            console.log(update_status_mpin);
                            res.status(200).send(update_status_mpin);
                        } else {
                            res_send = {
                                code: "007",
                                status: "Failed",
                                message: "Gagal, mPIN Terblokir!!!",
                                data: null,
                            }
                            console.log("mpin akan terblokir");
                            console.log(res_send);
                            res.status(200).send(res_send);
                        }
                    } else {
                        let data_status_mpin = { status: request_acct.data.status, mpin_salah, no_rek, no_hp, bpr_id }
                        let update_status_mpin = await connect_axios(url_cms, 'CMS', 'gw/mpin/updatests', data_status_mpin)
                        if (update_status_mpin.code !== "000" && update_status_mpin.data === null) {
                            console.log(update_status_mpin);
                            res.status(200).send(update_status_mpin);
                        } else {
                            res_send = {
                                code: "003",
                                status: "Failed",
                                message: "Gagal, Pin Anda Salah!!!",
                                data: null,
                            }
                            console.log("mpin salah, counter mpin bertambah");
                            console.log(res_send);
                            res.status(200).send(res_send);
                        }
                    }
                }
            }
        }
    } catch (error) {
        //--error server--//
        console.log("erro get product", error);
        res.status(200).send({
            code: "099",
            status: "Failed",
            message: "INVALID REQ DATA TRANSACTION",
            data: error,
        })
    }
};

// API untuk Transfer Proses
const transfer = async (req, res) => {
    let {
        no_hp,
        bpr_id,
        no_rek,
        bank_tujuan,
        rek_tujuan,
        nama_tujuan,
        amount,
        trans_fee,
        fee_bpr,
        xusername,
        xpassword,
        token,
        trx_code,
        trx_type,
        keterangan,
        tgl_trans,
        pin,
        rrn } = req.body;
    try {
        let [res_log_pokok, meta_log_pokok] = await db.sequelize.query(
            `INSERT INTO log_gateway(no_hp,bpr_id,no_rek,bank_tujuan,rek_tujuan,nama_tujuan,amount,trans_fee,trx_code,trx_type,tgl_trans,keterangan,rrn, messages_type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,'REQUEST')`,
            {
                replacements: [
                    no_hp, bpr_id, no_rek, bank_tujuan, rek_tujuan, nama_tujuan, amount, trans_fee, trx_code, trx_type, tgl_trans, keterangan, rrn,
                ],
            }
        );
        if (trx_code == "2100") {
            let data_cms = { bpr_id, no_hp, no_rek }
            let request_acct = await connect_axios(url_cms, 'CMS', 'gw/inq/acct', data_cms)
            if (request_acct.code !== "000" && request_acct.data === null) {
                console.log(request_acct);
                res.status(200).send(request_acct);
            } else {
                let mpin_salah = parseInt(request_acct.data.mpin_salah)

                if (request_acct.data.status != 2 && request_acct.data.status != 1) {
                    res.status(200).send({
                        code: "007",
                        status: "Failed",
                        message: "Gagal, Akun Tidak Dapat Digunakan!!!",
                        data: null,
                    });
                } else if (mpin_salah == 3 && request_acct.data.status == 2) {
                    res.status(200).send({
                        code: "007",
                        status: "Failed",
                        message: "Gagal, mPIN Terblokir!!!",
                        data: null,
                    });
                } else if (mpin_salah != 3 && request_acct.data.status == 2) {
                    res.status(200).send({
                        code: "007",
                        status: "Failed",
                        message: "Gagal, Akun Anda Telah diBlokir!!!",
                        data: null,
                    });
                } else if ((request_acct.data.mpin == pin || trx_type === "REV") && request_acct.data.status == 1) {
                    let data_sbb = { bpr_id, tcode: trx_code }
                    let get_nosbb = await connect_axios(url_cms, 'CMS', 'gw/gl/sbbgltrans', data_sbb)
                    if (get_nosbb.code !== "000" && get_nosbb.data === null) {
                        console.log(get_nosbb);
                        res.status(200).send(get_nosbb);
                    } else {
                        if (trx_type === "TRX") {
                            let data_status_core = { bpr_id }
                            let status_core = await connect_axios(url_cms, 'CMS', 'gw/inq/stscore', data_status_core)
                            if (status_core.data.status == "0") {
                                res_send = {
                                    code: "099",
                                    status: "Failed",
                                    message: "Gagal, Core SIGN OFF!!!",
                                    data: null,
                                }
                                console.log(res_send);
                                res.status(200).send(res_send);
                            } else {
                                let nosbb = await split_sbb(get_nosbb.data, trx_code)
                                const data_core = {
                                    no_hp,
                                    bpr_id,
                                    no_rek,
                                    nama_rek: request_acct.data.nama_rek,
                                    // nama_rek,
                                    bank_tujuan,
                                    nama_bank_tujuan: "",
                                    rek_tujuan,
                                    nama_tujuan,
                                    amount,
                                    trans_fee,
                                    fee_bpr,
                                    trx_code,
                                    trx_type,
                                    keterangan,
                                    lokasi: "",
                                    tgl_trans,
                                    tgl_transmis: moment().format('YYMMDDHHmmss'),
                                    rrn,
                                    data: {
                                        gl_rek_db_1: no_rek,
                                        gl_jns_db_1: "2",
                                        gl_amount_db_1: amount,
                                        gl_rek_cr_1: nosbb.no_pokok.nosbb_cr,
                                        gl_jns_cr_1: nosbb.no_pokok.jns_sbb_cr,
                                        gl_amount_cr_1: amount,
                                        gl_rek_db_2: no_rek,
                                        gl_jns_db_2: "2",
                                        gl_amount_db_2: trans_fee,
                                        gl_rek_cr_2: nosbb.no_fee.nosbb_cr,
                                        gl_jns_cr_2: nosbb.no_fee.jns_sbb_cr,
                                        gl_amount_cr_2: trans_fee,
                                        gl_rek_db_3: nosbb.fee_bpr.nosbb_db,
                                        gl_jns_db_3: nosbb.fee_bpr.jns_sbb_db,
                                        gl_amount_db_3: fee_bpr,
                                        gl_rek_cr_3: nosbb.fee_bpr.nosbb_cr,
                                        gl_jns_cr_3: nosbb.fee_bpr.jns_sbb_cr,
                                        gl_amount_cr_3: fee_bpr,
                                    }
                                }
                                const request = await connect_axios(url_core, 'CORE', "transfer", data_core)
                                let [results, metadata] = await db.sequelize.query(
                                    `UPDATE log_gateway SET messages_type = 'RESPONSE', rcode = ?, messages = ? WHERE no_rek = ? AND no_hp = ? AND bpr_id = ? AND amount = ? AND trans_fee = ? AND tgl_trans = ? AND rrn = ?`,
                                    {
                                        replacements: [request.code, request.message, no_rek, no_hp, bpr_id, amount, trans_fee, tgl_trans, rrn],
                                    }
                                );
                                if (request.code !== "000") {
                                    console.log("failed gateway");
                                    console.log(request);
                                    res.status(200).send(request);
                                } else {
                                    const data = {
                                        token,
                                        account_number: rek_tujuan,
                                        bank_code: bank_tujuan,
                                        amount,
                                        remark: "saldo keeping",
                                        beneficiary_email: "nugrohopnn@gmail.com",
                                        recipient_city: "391",
                                        xusername,
                                        xpassword
                                    };
                                    console.log("data request keeping");
                                    console.log(data);
                                    const request_keeping = await connect_keeping(
                                        "https://core.metimes.id",
                                        "/transfer-mtd",
                                        data
                                    );
                                    console.log("hasil request keeping");
                                    console.log(request_keeping);
                                    if (request_keeping.message !== "Berhasil" && request_keeping.value !== "1") {
                                        const data_core_rev = {
                                            no_hp,
                                            bpr_id,
                                            no_rek,
                                            nama_rek: request_acct.data.nama_rek,
                                            // nama_rek,
                                            bank_tujuan,
                                            nama_bank_tujuan: "",
                                            rek_tujuan,
                                            nama_tujuan,
                                            amount,
                                            trans_fee,
                                            fee_bpr,
                                            trx_code,
                                            trx_type: "REV",
                                            keterangan,
                                            lokasi: "",
                                            tgl_trans,
                                            tgl_transmis: moment().format('YYMMDDHHmmss'),
                                            rrn,
                                            data: {
                                                gl_rek_db_1: nosbb.no_pokok.nosbb_cr,
                                                gl_jns_db_1: nosbb.no_pokok.jns_sbb_cr,
                                                gl_amount_db_1: amount,
                                                gl_rek_cr_1: no_rek,
                                                gl_jns_cr_1: "2",
                                                gl_amount_cr_1: amount,
                                                gl_rek_db_2: nosbb.no_fee.nosbb_cr,
                                                gl_jns_db_2: nosbb.no_fee.jns_sbb_cr,
                                                gl_amount_db_2: trans_fee,
                                                gl_rek_cr_2: no_rek,
                                                gl_jns_cr_2: "2",
                                                gl_amount_cr_2: trans_fee,
                                                gl_rek_db_3: nosbb.fee_bpr.nosbb_cr,
                                                gl_jns_db_3: nosbb.fee_bpr.jns_sbb_cr,
                                                gl_amount_db_3: fee_bpr,
                                                gl_rek_cr_3: nosbb.fee_bpr.nosbb_db,
                                                gl_jns_cr_3: nosbb.fee_bpr.jns_sbb_db,
                                                gl_amount_cr_3: fee_bpr,
                                            }
                                        }
                                        const request_reversal_keeping = await connect_axios(url_core, 'CORE', "transfer", data_core_rev)
                                        if (request_reversal_keeping.code !== "000") {
                                            console.log("failed reversal keeping");
                                            console.log(request_reversal_keeping);
                                            request_reversal_keeping.data_keeping = {
                                                value: 0,
                                                message: "Gagal reversal ke Core"
                                            }
                                            res.status(200).send(request_reversal_keeping);
                                        } else {
                                            //--berhasil dapat list product update atau insert ke db --//
                                            console.log("Reversal Success");
                                            res_send = {
                                                code: "000",
                                                status: "ok",
                                                message: "Reversal Success",
                                                data: request_reversal_keeping.data,
                                                data_keeping: request_keeping,
                                            }
                                            console.log(res_send);
                                            res.status(200).send(res_send);
                                        }
                                    } else {
                                        const detail_trans = {
                                            no_rek,
                                            nama_rek: request_acct.data.nama_rek,
                                            // nama_rek,
                                            no_hp,
                                            bank_tujuan,
                                            rek_tujuan,
                                            nama_tujuan,
                                            keterangan,
                                            tgl_trans: moment().format('YYYY-MM-DD HH:mm:ss'),
                                            trx_type,
                                            status: "1",
                                            tcode: "000",
                                            noreff: request.data.noreff,
                                            rrn
                                        }
                                        await update_gl_oy_kredit(
                                            amount,
                                            trans_fee,
                                            bpr_id,
                                            trx_code,
                                            nosbb.no_pokok.nosbb_cr,
                                            nosbb.no_fee.nosbb_cr,
                                            nosbb.no_pokok.nmsbb_cr,
                                            nosbb.no_fee.nmsbb_cr,
                                            detail_trans
                                        )

                                        let data_transfer = { amount, trans_fee, no_rek, no_hp, bpr_id }
                                        let request_transfer_plus = await connect_axios(url_cms, 'CMS', 'gw/update/trfplus', data_transfer)
                                        console.log("Tambah Transfer Harian");
                                        console.log(request_transfer_plus);

                                        request.data['keterangan'] = keterangan
                                        console.log("Success");
                                        res_send = {
                                            code: "000",
                                            status: "ok",
                                            message: "Success",
                                            data: request.data,
                                            data_keeping: request_keeping,
                                        }
                                        console.log(res_send);
                                        res.status(200).send(res_send);
                                    }
                                }
                            }
                        } else if (trx_type === "REV") {
                            let nosbb = await split_sbb(get_nosbb.data, trx_code)
                            const data_core = {
                                no_hp,
                                bpr_id,
                                no_rek,
                                nama_rek: request_acct.data.nama_rek,
                                // nama_rek,
                                bank_tujuan,
                                nama_bank_tujuan: "",
                                rek_tujuan,
                                nama_tujuan,
                                amount,
                                trans_fee,
                                fee_bpr,
                                trx_code,
                                trx_type,
                                keterangan,
                                lokasi: "",
                                tgl_trans,
                                tgl_transmis: moment().format('YYMMDDHHmmss'),
                                rrn,
                                data: {
                                    gl_rek_db_1: nosbb.no_pokok.nosbb_cr,
                                    gl_jns_db_1: nosbb.no_pokok.jns_sbb_cr,
                                    gl_amount_db_1: amount,
                                    gl_rek_cr_1: no_rek,
                                    gl_jns_cr_1: "2",
                                    gl_amount_cr_1: amount,
                                    gl_rek_db_2: nosbb.no_fee.nosbb_cr,
                                    gl_jns_db_2: nosbb.no_fee.jns_sbb_cr,
                                    gl_amount_db_2: trans_fee,
                                    gl_rek_cr_2: no_rek,
                                    gl_jns_cr_2: "2",
                                    gl_amount_cr_2: trans_fee,
                                    gl_rek_db_3: nosbb.fee_bpr.nosbb_cr,
                                    gl_jns_db_3: nosbb.fee_bpr.jns_sbb_cr,
                                    gl_amount_db_3: fee_bpr,
                                    gl_rek_cr_3: nosbb.fee_bpr.nosbb_db,
                                    gl_jns_cr_3: nosbb.fee_bpr.jns_sbb_db,
                                    gl_amount_cr_3: fee_bpr,
                                }
                            }
                            let data_status_core = { bpr_id }
                            let status_core = await connect_axios(url_cms, 'CMS', 'gw/inq/stscore', data_status_core)
                            if (status_core.data.status == "0") {

                                let data_hold_trans = { bpr_id, data: JSON.stringify(data_core) }
                                let hold_transaction = await connect_axios(url_cms, 'CMS', 'gw/log/holdtransaction', data_hold_trans)
                                console.log("hold transaction");
                                console.log(hold_transaction);

                                res_send = {
                                    code: "099",
                                    status: "Failed",
                                    message: "Gagal, Core SIGN OFF!!!",
                                    data: null,
                                }
                                console.log(res_send);
                                res.status(200).send(res_send);
                            } else {
                                const request = await connect_axios(url_core, 'CORE', "transfer", data_core)
                                if (request.code !== "000") {
                                    console.log("failed gateway");
                                    console.log(request);
                                    res.status(200).send(request);
                                } else {
                                    const detail_trans = {
                                        no_rek,
                                        nama_rek: request_acct.data.nama_rek,
                                        // nama_rek,
                                        no_hp,
                                        bank_tujuan,
                                        rek_tujuan,
                                        nama_tujuan,
                                        keterangan,
                                        tgl_trans: moment().format('YYYY-MM-DD HH:mm:ss'),
                                        trx_type,
                                        status: "R",
                                        tcode: "000",
                                        noreff: request.data.noreff,
                                        rrn
                                    }
                                    await update_gl_oy_debet(
                                        amount,
                                        trans_fee,
                                        bpr_id,
                                        trx_code,
                                        nosbb.no_pokok.nosbb_cr,
                                        nosbb.no_fee.nosbb_cr,
                                        nosbb.no_pokok.nmsbb_cr,
                                        nosbb.no_fee.nmsbb_cr,
                                        detail_trans
                                    )

                                    let data_transfer = { amount, trans_fee, no_rek, no_hp, bpr_id }
                                    let request_transfer_min = await connect_axios(url_cms, 'CMS', 'gw/update/trfmin', data_transfer)
                                    console.log("Kurang Transfer Harian");
                                    console.log(request_transfer_min);

                                    request.data['keterangan'] = keterangan
                                    console.log("Success");
                                    res_send = {
                                        code: "000",
                                        status: "ok",
                                        message: "Success",
                                        data: request.data
                                    }
                                    console.log(res_send);
                                    res.status(200).send(res_send);
                                }
                            }
                        }
                    }
                } else {
                    mpin_salah = mpin_salah + 1
                    if (mpin_salah >= 3) {
                        let data_status_mpin = { status: "2", mpin_salah, no_rek, no_hp, bpr_id }
                        let update_status_mpin = await connect_axios(url_cms, 'CMS', 'gw/mpin/updatests', data_status_mpin)
                        if (update_status_mpin.code !== "000" && update_status_mpin.data === null) {
                            console.log(update_status_mpin);
                            res.status(200).send(update_status_mpin);
                        } else {
                            res_send = {
                                code: "007",
                                status: "Failed",
                                message: "Gagal, mPIN Terblokir!!!",
                                data: null,
                            }
                            console.log("mpin akan terblokir");
                            console.log(res_send);
                            res.status(200).send(res_send);
                        }
                    } else {
                        let data_status_mpin = { status: request_acct.data.status, mpin_salah, no_rek, no_hp, bpr_id }
                        let update_status_mpin = await connect_axios(url_cms, 'CMS', 'gw/mpin/updatests', data_status_mpin)
                        if (update_status_mpin.code !== "000" && update_status_mpin.data === null) {
                            console.log(update_status_mpin);
                            res.status(200).send(update_status_mpin);
                        } else {
                            res_send = {
                                code: "003",
                                status: "Failed",
                                message: "Gagal, Pin Anda Salah!!!",
                                data: null,
                            }
                            console.log("mpin salah, counter mpin bertambah");
                            console.log(res_send);
                            res.status(200).send(res_send);
                        }
                    }
                }
            }
        } else if (trx_code == "2200") {
            if (trx_type == "TRX") {
                let data_status_core = { bpr_id }
                let status_core = await connect_axios(url_cms, 'CMS', 'gw/inq/stscore', data_status_core)
                if (status_core.data.status == "0") {
                    res_send = {
                        code: "099",
                        status: "Failed",
                        message: "Gagal, Core SIGN OFF!!!",
                        data: null,
                    }
                    console.log(res_send);
                    res.status(200).send(res_send);
                } else {
                    let data_sbb = { bpr_id: bank_tujuan, tcode: trx_code }
                    let get_nosbb = await connect_axios(url_cms, 'CMS', 'gw/gl/sbbgltrans', data_sbb)
                    if (get_nosbb.code !== "000" && get_nosbb.data === null) {
                        console.log(get_nosbb);
                        res.status(200).send(get_nosbb);
                    } else {
                        let nosbb = await split_sbb(get_nosbb.data, trx_code)
                        const data_core = {
                            no_hp,
                            bpr_id,
                            no_rek,
                            nama_rek: "",
                            // nama_rek,
                            bank_tujuan,
                            nama_bank_tujuan: "",
                            rek_tujuan,
                            nama_tujuan,
                            amount,
                            trans_fee,
                            fee_bpr,
                            trx_code,
                            trx_type,
                            keterangan,
                            lokasi: "",
                            tgl_trans,
                            tgl_transmis: moment().format('YYMMDDHHmmss'),
                            rrn,
                            data: {
                                gl_rek_db_1: nosbb.no_pokok.nosbb_db,
                                gl_jns_db_1: nosbb.no_pokok.jns_sbb_db,
                                gl_amount_db_1: amount,
                                gl_rek_cr_1: rek_tujuan,
                                gl_jns_cr_1: "2",
                                gl_amount_cr_1: amount,
                                gl_rek_db_2: nosbb.no_fee.nosbb_db,
                                gl_jns_db_2: nosbb.no_fee.jns_sbb_db,
                                gl_amount_db_2: trans_fee,
                                gl_rek_cr_2: nosbb.no_fee.nosbb_cr,
                                gl_jns_cr_2: nosbb.no_fee.jns_sbb_cr,
                                gl_amount_cr_2: trans_fee,
                                gl_rek_db_3: nosbb.fee_bpr.nosbb_db,
                                gl_jns_db_3: nosbb.fee_bpr.jns_sbb_db,
                                gl_amount_db_3: fee_bpr,
                                gl_rek_cr_3: nosbb.fee_bpr.nosbb_cr,
                                gl_jns_cr_3: nosbb.fee_bpr.jns_sbb_cr,
                                gl_amount_cr_3: fee_bpr,
                            }
                        }
                        const request = await connect_axios(url_core, 'CORE', "transfer", data_core)
                        let [results, metadata] = await db.sequelize.query(
                            `UPDATE log_gateway SET messages_type = 'RESPONSE', rcode = ?, messages = ? WHERE no_rek = ? AND no_hp = ? AND bpr_id = ? AND amount = ? AND trans_fee = ? AND tgl_trans = ? AND rrn = ?`,
                            {
                                replacements: [request.code, request.message, no_rek, no_hp, bpr_id, amount, trans_fee, tgl_trans, rrn],
                            }
                        );
                        if (request.code !== "000") {
                            console.log("failed gateway");
                            console.log(request);
                            res.status(200).send(request);
                        } else {
                            const detail_trans = {
                                bpr_id,
                                no_rek,
                                no_hp,
                                // nama_rek,
                                bank_tujuan,
                                rek_tujuan,
                                nama_tujuan,
                                keterangan,
                                tgl_trans: moment().format('YYYY-MM-DD HH:mm:ss'),
                                trx_type,
                                status: "1",
                                tcode: "000",
                                noreff: request.data.noreff,
                                rrn
                            }
                            await update_gl_oy_debet(
                                amount,
                                trans_fee,
                                bank_tujuan,
                                trx_code,
                                get_nosbb[0].nosbb_db,
                                get_nosbb[0].nosbb_db,
                                get_nosbb[0].nmsbb_db,
                                get_nosbb[0].nmsbb_db,
                                detail_trans
                            )
                            //--berhasil dapat list product update atau insert ke db --//
                            console.log("Success");
                            res_send = {
                                code: "000",
                                status: "ok",
                                message: "Success",
                                data: request.data,
                            }
                            console.log(res_send);
                            res.status(200).send(res_send);
                            // }
                        }
                    }
                }
            } else if (trx_type == "REV") {
                let data_status_core = { bpr_id }
                let status_core = await connect_axios(url_cms, 'CMS', 'gw/inq/stscore', data_status_core)
                if (status_core.data.status == "0") {
                    res_send = {
                        code: "099",
                        status: "Failed",
                        message: "Gagal, Core SIGN OFF!!!",
                        data: null,
                    }
                    console.log(res_send);
                    res.status(200).send(res_send);
                } else {
                    let data_sbb = { bpr_id, tcode: trx_code }
                    let get_nosbb = await connect_axios(url_cms, 'CMS', 'gw/gl/sbbgltrans', data_sbb)
                    if (get_nosbb.code !== "000" && get_nosbb.data === null) {
                        console.log(get_nosbb);
                        res.status(200).send(get_nosbb);
                    } else {
                        let nosbb = await split_sbb(get_nosbb.data, trx_code)
                        const data_core = {
                            no_hp,
                            bpr_id,
                            no_rek,
                            nama_rek: "",
                            // nama_rek,
                            bank_tujuan,
                            nama_bank_tujuan: "",
                            rek_tujuan,
                            nama_tujuan,
                            amount,
                            trans_fee,
                            fee_bpr,
                            trx_code,
                            trx_type,
                            keterangan,
                            lokasi: "",
                            tgl_trans,
                            tgl_transmis: moment().format('YYMMDDHHmmss'),
                            rrn,
                            data: {
                                gl_rek_db_1: rek_tujuan,
                                gl_jns_db_1: "2",
                                gl_amount_db_1: amount,
                                gl_rek_cr_1: nosbb.no_pokok.nosbb_db,
                                gl_jns_cr_1: nosbb.no_pokok.jns_sbb_db,
                                gl_amount_cr_1: amount,
                                gl_rek_db_2: nosbb.no_fee.nosbb_cr,
                                gl_jns_db_2: nosbb.no_fee.jns_sbb_cr,
                                gl_amount_db_2: trans_fee,
                                gl_rek_cr_2: nosbb.no_fee.nosbb_db,
                                gl_jns_cr_2: nosbb.no_fee.jns_sbb_db,
                                gl_amount_cr_2: trans_fee,
                                gl_rek_db_3: nosbb.fee_bpr.nosbb_cr,
                                gl_jns_db_3: nosbb.fee_bpr.jns_sbb_cr,
                                gl_amount_db_3: fee_bpr,
                                gl_rek_cr_3: nosbb.fee_bpr.nosbb_db,
                                gl_jns_cr_3: nosbb.fee_bpr.jns_sbb_db,
                                gl_amount_cr_3: fee_bpr,
                            }
                        }
                        const request = await connect_axios(url_core, 'CORE', "transfer", data_core)
                        let [results, metadata] = await db.sequelize.query(
                            `UPDATE log_gateway SET messages_type = 'RESPONSE', rcode = ?, messages = ? WHERE no_rek = ? AND no_hp = ? AND bpr_id = ? AND amount = ? AND trans_fee = ? AND tgl_trans = ? AND rrn = ?`,
                            {
                                replacements: [request.code, request.message, no_rek, no_hp, bpr_id, amount, trans_fee, tgl_trans, rrn],
                            }
                        );
                        if (request.code !== "000") {
                            console.log("failed gateway");
                            console.log(request);
                            res.status(200).send(request);
                            // }
                        } else {
                            const detail_trans = {
                                bpr_id,
                                no_rek,
                                no_hp,
                                // nama_rek,
                                bank_tujuan,
                                rek_tujuan,
                                nama_tujuan,
                                keterangan,
                                tgl_trans: moment().format('YYYY-MM-DD HH:mm:ss'),
                                trx_type,
                                status: "1",
                                tcode: "000",
                                noreff: request.data.noreff,
                                rrn
                            }
                            await update_gl_oy_debet(
                                amount,
                                trans_fee,
                                bank_tujuan,
                                trx_code,
                                get_nosbb[0].nosbb_db,
                                get_nosbb[0].nosbb_db,
                                get_nosbb[0].nmsbb_db,
                                get_nosbb[0].nmsbb_db,
                                detail_trans
                            )
                            //--berhasil dapat list product update atau insert ke db --//
                            console.log("Success");
                            res_send = {
                                code: "000",
                                status: "ok",
                                message: "Success",
                                data: request.data,
                            }
                            console.log(res_send);
                            res.status(200).send(res_send);
                            // }
                        }
                    }
                }
            }
        } else if (trx_code == "2300") {
            let data_acct = { bpr_id, no_hp, no_rek }
            let request_acct = await connect_axios(url_cms, 'CMS', 'gw/inq/acct', data_acct)
            if (request_acct.code !== "000" && request_acct.data === null) {
                console.log(request_acct);
                res.status(200).send(request_acct);
            } else {
                let mpin_salah = parseInt(request_acct.data.mpin_salah)

                if (request_acct.data.status != 2 && request_acct.data.status != 1) {
                    res.status(200).send({
                        code: "007",
                        status: "Failed",
                        message: "Gagal, Akun Tidak Dapat Digunakan!!!",
                        data: null,
                    });
                } else if (mpin_salah == 3 && request_acct.data.status == 2) {
                    res.status(200).send({
                        code: "007",
                        status: "Failed",
                        message: "Gagal, mPIN Terblokir!!!",
                        data: null,
                    });
                } else if (mpin_salah != 3 && request_acct.data.status == 2) {
                    res.status(200).send({
                        code: "007",
                        status: "Failed",
                        message: "Gagal, Akun Anda Telah diBlokir!!!",
                        data: null,
                    });
                } else if ((request_acct.data.mpin == pin || trx_type === "REV") && request_acct.data.status == 1) {
                    if (trx_type === "TRX") {
                        let data_status_core = { bpr_id }
                        let status_core = await connect_axios(url_cms, 'CMS', 'gw/inq/stscore', data_status_core)
                        if (status_core.data.status == "0") {
                            res_send = {
                                code: "099",
                                status: "Failed",
                                message: "Gagal, Core SIGN OFF!!!",
                                data: null,
                            }
                            console.log(res_send);
                            res.status(200).send(res_send);
                        } else {
                            let data_sbb = { bpr_id: bank_tujuan, tcode: trx_code }
                            let get_nosbb = await connect_axios(url_cms, 'CMS', 'gw/gl/sbbgltrans', data_sbb)
                            if (get_nosbb.code !== "000" && get_nosbb.data === null) {
                                console.log(get_nosbb);
                                res.status(200).send(get_nosbb);
                            } else {
                                let nosbb = await split_sbb(get_nosbb.data, trx_code)
                                const data_core = {
                                    no_hp,
                                    bpr_id,
                                    no_rek,
                                    nama_rek: request_acct.data.nama_rek,
                                    // nama_rek,
                                    bank_tujuan,
                                    nama_bank_tujuan: "",
                                    rek_tujuan,
                                    nama_tujuan,
                                    amount,
                                    trans_fee,
                                    fee_bpr,
                                    trx_code,
                                    trx_type,
                                    keterangan,
                                    lokasi: "",
                                    tgl_trans,
                                    tgl_transmis: moment().format('YYMMDDHHmmss'),
                                    rrn,
                                    data: {
                                        gl_rek_db_1: no_rek,
                                        gl_jns_db_1: "2",
                                        gl_amount_db_1: amount,
                                        gl_rek_db_2: no_rek,
                                        gl_jns_db_2: "2",
                                        gl_amount_db_2: trans_fee,
                                        gl_rek_cr_1: rek_tujuan,
                                        gl_jns_cr_1: "2",
                                        gl_amount_cr_1: amount,
                                        gl_rek_cr_2: nosbb.no_fee.nosbb_cr,
                                        gl_jns_cr_2: nosbb.no_fee.jns_sbb_cr,
                                        gl_amount_cr_2: trans_fee,
                                    }
                                }
                                const request = await connect_axios(url_core, 'CORE', "transfer", data_core)
                                let [results, metadata] = await db.sequelize.query(
                                    `UPDATE log_gateway SET messages_type = 'RESPONSE', rcode = ?, messages = ? WHERE no_rek = ? AND no_hp = ? AND bpr_id = ? AND amount = ? AND trans_fee = ? AND tgl_trans = ? AND rrn = ?`,
                                    {
                                        replacements: [request.code, request.message, no_rek, no_hp, bpr_id, amount, trans_fee, tgl_trans, rrn],
                                    }
                                );
                                if (request.code !== "000") {
                                    console.log("failed gateway");
                                    console.log(request);
                                    request.data_keeping = {
                                        value: 0,
                                        message: "Gagal ke Core"
                                    }
                                    res.status(200).send(request);
                                } else {

                                    let data_transfer = { amount, trans_fee, no_rek, no_hp, bpr_id }
                                    let request_transfer_plus = await connect_axios(url_cms, 'CMS', 'gw/update/trfplus', data_transfer)
                                    console.log("Tambah Transfer Harian");
                                    console.log(request_transfer_plus);

                                    //--berhasil dapat list product update atau insert ke db --//
                                    console.log("Success");
                                    res_send = {
                                        code: "000",
                                        status: "ok",
                                        message: "Success",
                                        data: request.data,
                                    }
                                    console.log(res_send);
                                    res.status(200).send(res_send);
                                }
                            }
                        }
                    } else if (trx_type === "REV") {
                        let data_sbb = { bpr_id, tcode: trx_code }
                        let get_nosbb = await connect_axios(url_cms, 'CMS', 'gw/gl/sbbgltrans', data_sbb)
                        if (get_nosbb.code !== "000" && get_nosbb.data === null) {
                            console.log(get_nosbb);
                            res.status(200).send(get_nosbb);
                        } else {
                            let nosbb = await split_sbb(get_nosbb.data, trx_code)
                            const data_core = {
                                no_hp,
                                bpr_id,
                                no_rek,
                                nama_rek: request_acct.data.nama_rek,
                                // nama_rek,
                                bank_tujuan,
                                nama_bank_tujuan: "",
                                rek_tujuan,
                                nama_tujuan,
                                amount,
                                trans_fee,
                                fee_bpr,
                                trx_code,
                                trx_type,
                                keterangan,
                                lokasi: "",
                                tgl_trans,
                                tgl_transmis: moment().format('YYMMDDHHmmss'),
                                rrn,
                                data: {
                                    gl_rek_db_1: rek_tujuan,
                                    gl_jns_db_1: "2",
                                    gl_amount_db_1: amount,
                                    gl_rek_db_2: nosbb.no_fee.nosbb_cr,
                                    gl_jns_db_2: nosbb.no_fee.jns_sbb_cr,
                                    gl_amount_db_2: trans_fee,
                                    gl_rek_cr_1: no_rek,
                                    gl_jns_cr_1: "2",
                                    gl_amount_cr_1: amount,
                                    gl_rek_cr_2: no_rek,
                                    gl_jns_cr_2: "2",
                                    gl_amount_cr_2: trans_fee,
                                }
                            }
                            let data_status_core = { bpr_id }
                            let status_core = await connect_axios(url_cms, 'CMS', 'gw/inq/stscore', data_status_core)
                            if (status_core.data.status == "0") {

                                let data_hold_trans = { bpr_id, data: JSON.stringify(data_core) }
                                let hold_transaction = await connect_axios(url_cms, 'CMS', 'gw/log/holdtransaction', data_hold_trans)
                                console.log("hold transaction");
                                console.log(hold_transaction);

                                res_send = {
                                    code: "099",
                                    status: "Failed",
                                    message: "Gagal, Core SIGN OFF!!!",
                                    data: null,
                                }
                                console.log(res_send);
                                res.status(200).send(res_send);
                            } else {
                                const request = await connect_axios(url_core, 'CORE', "transfer", data_core)
                                let [results, metadata] = await db.sequelize.query(
                                    `UPDATE log_gateway SET messages_type = 'RESPONSE', rcode = ?, messages = ? WHERE no_rek = ? AND no_hp = ? AND bpr_id = ? AND amount = ? AND trans_fee = ? AND tgl_trans = ? AND rrn = ?`,
                                    {
                                        replacements: [request.code, request.message, no_rek, no_hp, bpr_id, amount, trans_fee, tgl_trans, rrn],
                                    }
                                );
                                if (request.code !== "000") {
                                    console.log("failed gateway");
                                    console.log(request);
                                    res.status(200).send(request);
                                } else {
                                    let data_transfer = { amount, trans_fee, no_rek, no_hp, bpr_id }
                                    let request_transfer_min = await connect_axios(url_cms, 'CMS', 'gw/update/trfmin', data_transfer)
                                    console.log("Kurang Transfer Harian");
                                    console.log(request_transfer_min);

                                    //--berhasil dapat list product update atau insert ke db --//
                                    console.log("Success");
                                    res_send = {
                                        code: "000",
                                        status: "ok",
                                        message: "Success",
                                        data: request.data,
                                    }
                                    console.log(res_send);
                                    res.status(200).send(res_send);
                                }
                            }
                        }
                    }
                } else {
                    mpin_salah = mpin_salah + 1
                    if (mpin_salah >= 3) {
                        let data_status_mpin = { status: "2", mpin_salah, no_rek, no_hp, bpr_id }
                        let update_status_mpin = await connect_axios(url_cms, 'CMS', 'gw/mpin/updatests', data_status_mpin)
                        if (update_status_mpin.code !== "000" && update_status_mpin.data === null) {
                            console.log(update_status_mpin);
                            res.status(200).send(update_status_mpin);
                        } else {
                            res_send = {
                                code: "007",
                                status: "Failed",
                                message: "Gagal, mPIN Terblokir!!!",
                                data: null,
                            }
                            console.log("mpin akan terblokir");
                            console.log(res_send);
                            res.status(200).send(res_send);
                        }
                    } else {
                        let data_status_mpin = { status: request_acct.data.status, mpin_salah, no_rek, no_hp, bpr_id }
                        let update_status_mpin = await connect_axios(url_cms, 'CMS', 'gw/mpin/updatests', data_status_mpin)
                        if (update_status_mpin.code !== "000" && update_status_mpin.data === null) {
                            console.log(update_status_mpin);
                            res.status(200).send(update_status_mpin);
                        } else {
                            res_send = {
                                code: "003",
                                status: "Failed",
                                message: "Gagal, Pin Anda Salah!!!",
                                data: null,
                            }
                            console.log("mpin salah, counter mpin bertambah");
                            console.log(res_send);
                            res.status(200).send(res_send);
                        }
                    }
                }
            }
        }
    } catch (error) {
        //--error server--//
        console.log("erro get product", error);
        res.status(200).send({
            code: "099",
            status: "Failed",
            message: "INVALID REQ DATA TRANSACTION",
            data: error,
        })
    }
};

// API untuk Withdrawal Proses
const withdrawal = async (req, res) => {
    let {
        no_hp,
        bpr_id,
        no_rek,
        nama_rek,
        amount,
        trans_fee,
        fee_bpr,
        pin,
        trx_code,
        trx_type,
        keterangan,
        acq_id,
        terminal_id,
        token,
        lokasi,
        tgl_trans,
        tgl_transmis,
        rrn } = req.body;
    try {
        console.log("REQ GATEWAY WITHDRAWAL");
        console.log(req.body);
        let [res_log_pokok, meta_log_pokok] = await db.sequelize.query(
            `INSERT INTO log_gateway(no_hp, bpr_id, no_rek, nama_rek, amount, trans_fee, pin, trx_code, trx_type, keterangan, acq_id, terminal_id, token, lokasi, tgl_trans, rrn, messages_type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'REQUEST')`,
            {
                replacements: [
                    no_hp,
                    bpr_id,
                    no_rek,
                    nama_rek,
                    amount,
                    trans_fee,
                    pin,
                    trx_code,
                    trx_type,
                    keterangan,
                    acq_id,
                    terminal_id,
                    token,
                    lokasi,
                    tgl_trans,
                    rrn
                ],
            }
        );
        if (trx_code == "1000") {
            let res_send
            console.log("CREATE TOKEN");
            let data_acct = { bpr_id, no_hp, no_rek }
            let request_acct = await connect_axios(url_cms, 'CMS', 'gw/inq/acct', data_acct)
            if (request_acct.code !== "000" && request_acct.data === null) {
                console.log(request_acct);
                res.status(200).send(request_acct);
            } else {
                let mpin_salah = parseInt(request_acct.data.mpin_salah)

                if (request_acct.data.status != 2 && request_acct.data.status != 1) {
                    res.status(200).send({
                        code: "007",
                        status: "Failed",
                        message: "Gagal, Akun Tidak Dapat Digunakan!!!",
                        data: null,
                    });
                } else if (mpin_salah == 3 && request_acct.data.status == 2) {
                    res.status(200).send({
                        code: "007",
                        status: "Failed",
                        message: "Gagal, mPIN Terblokir!!!",
                        data: null,
                    });
                } else if (mpin_salah != 3 && request_acct.data.status == 2) {
                    res_send = {
                        code: "007",
                        status: "Failed",
                        message: "Gagal, Akun Anda Telah diBlokir!!!",
                        data: null,
                    }
                    console.log(res_send);
                    res.status(200).send(res_send);
                } else if ((request_acct.data.mpin == pin || trx_type === "REV") && request_acct.data.status == 1) {

                    let data_status_mpin = { status: request_acct.data.status, mpin_salah: "0", no_rek, no_hp, bpr_id }
                    let update_status_mpin = await connect_axios(url_cms, 'CMS', 'gw/mpin/updatests', data_status_mpin)
                    console.log("update status mpin");
                    console.log(update_status_mpin);

                    let data_limit = { bpr_id, acct_type: request_acct.data.acct_type }
                    let check_limit = await connect_axios(url_cms, 'CMS', 'gw/inq/ceklimit', data_limit)
                    if (check_limit.code !== "000" && check_limit.data === null) {
                        console.log(check_limit);
                        res.status(200).send(check_limit);
                    } else {
                        let limit_trx, limit_harian, counter_transaksi
                        // let trx_amount, trx_trans_fee = 0
                        limit_trx = parseInt(check_limit.data.trk_tunai_trx)
                        limit_harian = parseInt(check_limit.data.trk_tunai_harian)
                        counter_transaksi = parseInt(request_acct.data.tariktunai)
                        if (amount == undefined) amount = 0
                        if (trans_fee == undefined) trans_fee = 0
                        const total = parseInt(trans_fee) + parseInt(amount)

                        if (trx_type == "TRX") {
                            if (total > limit_trx) {
                                res_send = {
                                    code: "009",
                                    status: "Failed",
                                    message: "Gagal, Nominal Melebihi Limit Transaksi!!!",
                                    data: null,
                                }
                                console.log(res_send);
                                res.status(200).send(res_send);
                            } else {
                                if (counter_transaksi + total > limit_harian) {
                                    res_send = {
                                        code: "009",
                                        status: "Failed",
                                        message: "Gagal, Transaksi Sudah Melebihi Limit Harian!!!",
                                        data: null,
                                    }
                                    console.log(res_send);
                                    res.status(200).send(res_send);
                                } else {
                                    let data_sbb = { bpr_id, tcode: trx_code }
                                    let get_nosbb = await connect_axios(url_cms, 'CMS', 'gw/gl/sbbgltrans', data_sbb)
                                    if (get_nosbb.code !== "000" && get_nosbb.data === null) {
                                        console.log(get_nosbb);
                                        res.status(200).send(get_nosbb);
                                    } else {
                                        let nosbb = await split_sbb(get_nosbb.data, trx_code)
                                        console.log(keterangan);
                                        const data_core = {
                                            no_hp,
                                            bpr_id,
                                            no_rek,
                                            trx_code,
                                            trx_type,
                                            amount,
                                            trans_fee,
                                            fee_bpr,
                                            keterangan,
                                            token: "",
                                            acq_id: "",
                                            terminal_id: "",
                                            lokasi: "",
                                            tgl_trans,
                                            tgl_transmis: moment().format('YYMMDDHHmmss'),
                                            rrn,
                                            data: {
                                                gl_rek_db_1: no_rek,
                                                gl_jns_db_1: "2",
                                                gl_amount_db_1: amount,
                                                gl_rek_cr_1: nosbb.no_pokok.nosbb_cr,
                                                gl_jns_cr_1: nosbb.no_pokok.jns_sbb_cr,
                                                gl_amount_cr_1: amount,
                                                gl_rek_db_2: no_rek,
                                                gl_jns_db_2: "2",
                                                gl_amount_db_2: trans_fee,
                                                gl_rek_cr_2: nosbb.no_fee.nosbb_cr,
                                                gl_jns_cr_2: nosbb.no_fee.jns_sbb_cr,
                                                gl_amount_cr_2: trans_fee,
                                                gl_rek_db_3: nosbb.fee_bpr.nosbb_db,
                                                gl_jns_db_3: nosbb.fee_bpr.jns_sbb_db,
                                                gl_amount_db_3: fee_bpr,
                                                gl_rek_cr_3: nosbb.fee_bpr.nosbb_cr,
                                                gl_jns_cr_3: nosbb.fee_bpr.jns_sbb_cr,
                                                gl_amount_cr_3: fee_bpr,
                                            }
                                        }
                                        let data_status_core = { bpr_id }
                                        let status_core = await connect_axios(url_cms, 'CMS', 'gw/inq/stscore', data_status_core)
                                        if (status_core.data.status == "0") {
                                            res_send = {
                                                code: "099",
                                                status: "Failed",
                                                message: "Gagal, Core SIGN OFF!!!",
                                                data: null,
                                            }
                                            console.log(res_send);
                                            res.status(200).send(res_send);
                                        } else {
                                            const request = await connect_axios(url_core, 'CORE', "tariktunai", data_core)
                                            let [results, metadata] = await db.sequelize.query(
                                                `UPDATE log_gateway SET messages_type = 'RESPONSE', rcode = ?, messages = ? WHERE no_rek = ? AND no_hp = ? AND bpr_id = ? AND amount = ? AND trans_fee = ? AND tgl_trans = ? AND rrn = ?`,
                                                {
                                                    replacements: [request.code, request.message, no_rek, no_hp, bpr_id, amount, trans_fee, tgl_trans, rrn],
                                                }
                                            );
                                            if (request.code !== "000") {
                                                console.log(request);
                                                res.status(200).send(request);
                                            } else {
                                                const detail_trans = {
                                                    no_rek,
                                                    nama_rek: request_acct.data.nama_rek,
                                                    no_hp,
                                                    keterangan,
                                                    tgl_trans: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                    trx_type,
                                                    status: "1",
                                                    tcode: "000",
                                                    noreff: request.data.noreff,
                                                    rrn
                                                }
                                                await update_gl_oy_kredit(
                                                    amount,
                                                    trans_fee,
                                                    bpr_id,
                                                    trx_code,
                                                    nosbb.no_pokok.nosbb_cr,
                                                    nosbb.no_fee.nosbb_cr,
                                                    nosbb.no_pokok.nmsbb_cr,
                                                    nosbb.no_fee.nmsbb_cr,
                                                    detail_trans
                                                )

                                                let data_tarik_tunai = { amount, trans_fee, no_rek, no_hp, bpr_id }
                                                let request_tartun_plus = await connect_axios(url_cms, 'CMS', 'gw/update/tartunplus', data_tarik_tunai)
                                                console.log("Tambah Tartun Harian");
                                                console.log(request_tartun_plus);

                                                request.data['keterangan'] = keterangan
                                                console.log("Success");
                                                res_send = {
                                                    code: "000",
                                                    status: "ok",
                                                    message: "Success",
                                                    data: request.data,
                                                }
                                                console.log(res_send);
                                                res.status(200).send(res_send);
                                            }
                                        }
                                    }
                                }
                            }
                        } else if (trx_type === "REV") {
                            let data_sbb = { bpr_id, tcode: trx_code }
                            let get_nosbb = await connect_axios(url_cms, 'CMS', 'gw/gl/sbbgltrans', data_sbb)
                            if (get_nosbb.code !== "000" && get_nosbb.data === null) {
                                console.log(get_nosbb);
                                res.status(200).send(get_nosbb);
                            } else {
                                let nosbb = await split_sbb(get_nosbb.data, trx_code)
                                console.log(keterangan);
                                const data_core = {
                                    no_hp,
                                    bpr_id,
                                    no_rek,
                                    trx_code,
                                    trx_type,
                                    amount,
                                    trans_fee,
                                    fee_bpr,
                                    keterangan,
                                    token: "",
                                    acq_id: "",
                                    terminal_id: "",
                                    lokasi: "",
                                    tgl_trans,
                                    tgl_transmis: moment().format('YYMMDDHHmmss'),
                                    rrn,
                                    data: {
                                        gl_rek_db_1: nosbb.no_pokok.nosbb_cr,
                                        gl_jns_db_1: nosbb.no_pokok.jns_sbb_cr,
                                        gl_amount_db_1: amount,
                                        gl_rek_cr_1: no_rek,
                                        gl_jns_cr_1: "2",
                                        gl_amount_cr_1: amount,
                                        gl_rek_db_2: nosbb.no_fee.nosbb_cr,
                                        gl_jns_db_2: nosbb.no_fee.jns_sbb_cr,
                                        gl_amount_db_2: trans_fee,
                                        gl_rek_cr_2: no_rek,
                                        gl_jns_cr_2: "2",
                                        gl_amount_cr_2: trans_fee,
                                        gl_rek_db_3: nosbb.fee_bpr.nosbb_cr,
                                        gl_jns_db_3: nosbb.fee_bpr.jns_sbb_cr,
                                        gl_amount_db_3: fee_bpr,
                                        gl_rek_cr_3: nosbb.fee_bpr.nosbb_db,
                                        gl_jns_cr_3: nosbb.fee_bpr.jns_sbb_db,
                                        gl_amount_cr_3: fee_bpr,
                                    }
                                }
                                let data_status_core = { bpr_id }
                                let status_core = await connect_axios(url_cms, 'CMS', 'gw/inq/stscore', data_status_core)
                                if (status_core.data.status == "0") {
                                    let data_hold_trans = { bpr_id, data: JSON.stringify(data_core) }
                                    let hold_transaction = await connect_axios(url_cms, 'CMS', 'gw/log/holdtransaction', data_hold_trans)
                                    console.log("hold transaction");
                                    console.log(hold_transaction);

                                    res_send = {
                                        code: "099",
                                        status: "Failed",
                                        message: "Gagal, Core SIGN OFF!!!",
                                        data: null,
                                    }
                                    console.log(res_send);
                                    res.status(200).send(res_send);
                                } else {
                                    const request = await connect_axios(url_core, 'CORE', "tariktunai", data_core)
                                    let [results, metadata] = await db.sequelize.query(
                                        `UPDATE log_gateway SET messages_type = 'RESPONSE', rcode = ?, messages = ? WHERE no_rek = ? AND no_hp = ? AND bpr_id = ? AND amount = ? AND trans_fee = ? AND tgl_trans = ? AND rrn = ?`,
                                        {
                                            replacements: [request.code, request.message, no_rek, no_hp, bpr_id, amount, trans_fee, tgl_trans, rrn],
                                        }
                                    );
                                    if (request.code !== "000") {
                                        console.log(request);
                                        res.status(200).send(request);
                                    } else {
                                        const detail_trans = {
                                            no_rek,
                                            nama_rek,
                                            no_hp,
                                            keterangan,
                                            tgl_trans: moment().format('YYYY-MM-DD HH:mm:ss'),
                                            trx_type,
                                            status: "R",
                                            tcode: "000",
                                            noreff: request.data.noreff,
                                            rrn
                                        }
                                        await update_gl_oy_debet(
                                            amount,
                                            trans_fee,
                                            bpr_id,
                                            trx_code,
                                            nosbb.no_pokok.nosbb_cr,
                                            nosbb.no_fee.nosbb_cr,
                                            nosbb.no_pokok.nmsbb_cr,
                                            nosbb.no_fee.nmsbb_cr,
                                            detail_trans
                                        )

                                        let data_tarik_tunai = { amount, trans_fee, no_rek, no_hp, bpr_id }
                                        let request_tartun_minus = await connect_axios(url_cms, 'CMS', 'gw/update/tartunmin', data_tarik_tunai)
                                        console.log("Kurang Tartun Harian");
                                        console.log(request_tartun_minus);

                                        request.data['keterangan'] = keterangan
                                        console.log("Success");
                                        res_send = {
                                            code: "000",
                                            status: "ok",
                                            message: "Success",
                                            data: request.data,
                                        }
                                        console.log(res_send);
                                        res.status(200).send(res_send);
                                    }
                                }
                            }
                        }
                    }
                } else {
                    mpin_salah = mpin_salah + 1
                    if (mpin_salah >= 3) {
                        let data_status_mpin = { status: "2", mpin_salah, no_rek, no_hp, bpr_id }
                        let update_status_mpin = await connect_axios(url_cms, 'CMS', 'gw/mpin/updatests', data_status_mpin)
                        if (update_status_mpin.code !== "000" && update_status_mpin.data === null) {
                            console.log(update_status_mpin);
                            res.status(200).send(update_status_mpin);
                        } else {
                            res_send = {
                                code: "007",
                                status: "Failed",
                                message: "Gagal, mPIN Terblokir!!!",
                                data: null,
                            }
                            console.log("mpin akan terblokir");
                            console.log(res_send);
                            res.status(200).send(res_send);
                        }
                    } else {
                        let data_status_mpin = { status: request_acct.data.status, mpin_salah, no_rek, no_hp, bpr_id }
                        let update_status_mpin = await connect_axios(url_cms, 'CMS', 'gw/mpin/updatests', data_status_mpin)
                        if (update_status_mpin.code !== "000" && update_status_mpin.data === null) {
                            console.log(update_status_mpin);
                            res.status(200).send(update_status_mpin);
                        } else {
                            res_send = {
                                code: "003",
                                status: "Failed",
                                message: "Gagal, Pin Anda Salah!!!",
                                data: null,
                            }
                            console.log("mpin salah, counter mpin bertambah");
                            console.log(res_send);
                            res.status(200).send(res_send);
                        }
                    }
                }
            }
        } else if (trx_code == "1100") {
            let jurnal_bpr
            if (keterangan == "acquirer") {
                jurnal_bpr = acq_id
            } else {
                jurnal_bpr = bpr_id
            }
            let data_sbb = { bpr_id, tcode: "1100" }
            let get_nosbb = await connect_axios(url_cms, 'CMS', 'gw/gl/sbbgltrans', data_sbb)
            if (get_nosbb.code !== "000" && get_nosbb.data === null) {
                console.log(get_nosbb);
                res.status(200).send(get_nosbb);
            } else {
                let nosbb = await split_sbb(get_nosbb.data, "1100")
                let on_us = {}, issuer = {}, acquirer = {}
                if (trx_type === "TRX") {
                    console.log("TARIK TUNAI ATM TRX");
                    let data_status_core = { bpr_id }
                    let status_core = await connect_axios(url_cms, 'CMS', 'gw/inq/stscore', data_status_core)
                    if (status_core.data.status == "0") {
                        res_send = {
                            code: "099",
                            status: "Failed",
                            message: "Gagal, Core SIGN OFF!!!",
                            data: null,
                        }
                        console.log(res_send);
                        res.status(200).send(res_send);
                    } else {
                        if (keterangan == "on_us") {
                            on_us = {
                                gl_rek_db_1: nosbb.no_pokok.On_Us.nosbb_db,
                                gl_jns_db_1: nosbb.no_pokok.On_Us.jns_sbb_db,
                                gl_amount_db_1: amount,
                                gl_rek_cr_1: nosbb.no_pokok.On_Us.nosbb_cr,
                                gl_jns_cr_1: "2",
                                gl_amount_cr_1: amount,
                                gl_rek_db_2: nosbb.no_fee.On_Us.nosbb_db,
                                gl_jns_db_2: nosbb.no_fee.On_Us.jns_sbb_db,
                                gl_amount_db_2: trans_fee,
                                gl_rek_cr_2: nosbb.no_fee.On_Us.nosbb_cr,
                                gl_jns_cr_2: "2",
                                gl_amount_cr_2: trans_fee,
                                gl_rek_db_3: nosbb.fee_bpr.On_Us.nosbb_db,
                                gl_jns_db_3: nosbb.fee_bpr.On_Us.jns_sbb_db,
                                gl_amount_db_3: 0,
                                gl_rek_cr_3: nosbb.fee_bpr.On_Us.nosbb_cr,
                                gl_jns_cr_3: nosbb.fee_bpr.On_Us.jns_sbb_cr,
                                gl_amount_cr_3: 0,
                            }
                        } else if (keterangan == "issuer") {
                            issuer = {
                                gl_rek_db_1: nosbb.no_pokok.On_Us.nosbb_db,
                                gl_jns_db_1: nosbb.no_pokok.On_Us.jns_sbb_db,
                                gl_amount_db_1: amount,
                                gl_rek_cr_1: nosbb.tagihan.nosbb_cr,
                                gl_jns_cr_1: nosbb.tagihan.jns_sbb_cr,
                                gl_amount_cr_1: amount,
                                gl_rek_db_2: nosbb.no_fee.On_Us.nosbb_db,
                                gl_jns_db_2: nosbb.no_fee.On_Us.jns_sbb_db,
                                gl_amount_db_2: trans_fee,
                                gl_rek_cr_2: nosbb.tagihan.nosbb_cr,
                                gl_jns_cr_2: nosbb.tagihan.jns_sbb_cr,
                                gl_amount_cr_2: trans_fee,
                                gl_rek_db_3: nosbb.fee_bpr.nosbb_db,
                                gl_jns_db_3: nosbb.fee_bpr.jns_sbb_db,
                                gl_amount_db_3: 0,
                                gl_rek_cr_3: nosbb.fee_bpr.nosbb_cr,
                                gl_jns_cr_3: nosbb.fee_bpr.jns_sbb_cr,
                                gl_amount_cr_3: 0,
                                gl_rek_db_3: nosbb.fee_bpr.Issuer.nosbb_db,
                                gl_jns_db_3: nosbb.fee_bpr.Issuer.jns_sbb_db,
                                gl_amount_db_3: fee_bpr,
                                gl_rek_cr_3: nosbb.fee_bpr.Issuer.nosbb_cr,
                                gl_jns_cr_3: nosbb.fee_bpr.Issuer.jns_sbb_cr,
                                gl_amount_cr_3: fee_bpr,
                            }
                        } else if (keterangan == "acquirer") {
                            acquirer = {
                                gl_rek_db_1: nosbb.no_pokok.Acquirer.nosbb_db,
                                gl_jns_db_1: nosbb.no_pokok.Acquirer.jns_sbb_db,
                                gl_amount_db_1: amount,
                                gl_rek_cr_1: nosbb.no_pokok.Acquirer.nosbb_cr,
                                gl_jns_cr_1: "2",
                                gl_amount_cr_1: amount,
                                gl_rek_db_2: nosbb.no_pokok.Acquirer.nosbb_db,
                                gl_jns_db_2: nosbb.no_pokok.Acquirer.jns_sbb_db,
                                gl_amount_db_2: trans_fee,
                                gl_rek_cr_2: nosbb.no_fee.Acquirer.nosbb_cr,
                                gl_jns_cr_2: "2",
                                gl_amount_cr_2: trans_fee,
                                gl_rek_db_3: nosbb.fee_bpr.Acquirer.nosbb_db,
                                gl_jns_db_3: nosbb.fee_bpr.Acquirer.jns_sbb_db,
                                gl_amount_db_3: 0,
                                gl_rek_cr_3: nosbb.fee_bpr.Acquirer.nosbb_cr,
                                gl_jns_cr_3: nosbb.fee_bpr.Acquirer.jns_sbb_cr,
                                gl_amount_cr_3: 0,
                            }
                        }
                        // const data_gateway = {no_hp, bpr_id, no_rek:data_nasabah.data.nama_rek, trx_code, trx_type, amount, trans_fee, token, keterangan, terminal_id, lokasi, tgl_trans, tgl_transmis, rrn}
                        const data_core = {
                            no_hp,
                            bpr_id,
                            no_rek,
                            trx_code: "1100",
                            trx_type: "TRX",
                            amount,
                            trans_fee,
                            fee_bpr,
                            acq_id,
                            terminal_id,
                            token,
                            keterangan,
                            lokasi,
                            tgl_trans,
                            tgl_transmis: moment().format('YYMMDDHHmmss'),
                            rrn,
                            data: {
                                on_us,
                                issuer,
                                acquirer,
                            }
                        }
                        const request = await connect_axios(url_core, 'CORE', "tariktunai", data_core)
                        let [results, metadata] = await db.sequelize.query(
                            `UPDATE log_gateway SET messages_type = 'RESPONSE', rcode = ?, messages = ? WHERE no_rek = ? AND no_hp = ? AND bpr_id = ? AND amount = ? AND trans_fee = ? AND tgl_trans = ? AND rrn = ?`,
                            {
                                replacements: [request.code, request.message, no_rek, no_hp, bpr_id, amount, trans_fee, tgl_trans, rrn],
                            }
                        );
                        if (request.code !== "000") {
                            console.log(request)
                            res.status(200).send(request);
                        } else {
                            const detail_trans = {
                                no_rek,
                                nama_rek,
                                keterangan,
                                tgl_trans: moment().format('YYYY-MM-DD HH:mm:ss'),
                                trx_type,
                                status: "1",
                                tcode: "000",
                                noreff: request.data.noreff,
                                rrn
                            }
                            let nosbb = await split_sbb(get_nosbb.data, trx_code)
                            let data_db, data_cr = {}
                            if (keterangan === "on_us") {
                                data_db = {
                                    amount,
                                    trans_fee,
                                    bpr_id,
                                    trx_code: "1000",
                                    no_rek_pokok: nosbb.no_pokok.On_Us.nosbb_db,
                                    no_rek_fee: nosbb.no_fee.On_Us.nosbb_db,
                                    nama_rek_pokok: nosbb.no_pokok.On_Us.nmsbb_db,
                                    nama_rek_fee: nosbb.no_fee.On_Us.nmsbb_db
                                }
                                data_cr = {
                                    amount,
                                    trans_fee,
                                    bpr_id,
                                    trx_code,
                                    no_rek_pokok: nosbb.no_pokok.On_Us.nosbb_cr,
                                    no_rek_fee: nosbb.no_fee.On_Us.nosbb_cr,
                                    nama_rek_pokok: nosbb.no_pokok.On_Us.nmsbb_cr,
                                    nama_rek_fee: nosbb.no_fee.On_Us.nmsbb_cr
                                }
                            } else if (keterangan === "issuer") {
                                data_db = {
                                    amount,
                                    trans_fee,
                                    bpr_id,
                                    trx_code: "1000",
                                    no_rek_pokok: nosbb.no_pokok.On_Us.nosbb_db,
                                    no_rek_fee: nosbb.no_fee.On_Us.nosbb_db,
                                    nama_rek_pokok: nosbb.no_pokok.On_Us.nmsbb_db,
                                    nama_rek_fee: nosbb.no_fee.On_Us.nmsbb_db
                                }
                                data_cr = {
                                    amount,
                                    trans_fee,
                                    bpr_id,
                                    trx_code,
                                    no_rek_pokok: nosbb.tagihan.nosbb_cr,
                                    no_rek_fee: nosbb.tagihan.nosbb_cr,
                                    nama_rek_pokok: nosbb.tagihan.nmsbb_cr,
                                    nama_rek_fee: nosbb.tagihan.nmsbb_cr
                                }
                            } else if (keterangan === "acquirer") {
                                data_db = {
                                    amount,
                                    trans_fee,
                                    bpr_id: acq_id,
                                    trx_code,
                                    no_rek_pokok: nosbb.no_pokok.Acquirer.nosbb_db,
                                    no_rek_fee: nosbb.no_fee.Acquirer.nosbb_db,
                                    nama_rek_pokok: nosbb.no_pokok.Acquirer.nmsbb_db,
                                    nama_rek_fee: nosbb.no_fee.Acquirer.nmsbb_db
                                }
                                data_cr = {
                                    amount,
                                    trans_fee,
                                    bpr_id: acq_id,
                                    trx_code,
                                    no_rek_pokok: nosbb.no_pokok.Acquirer.nosbb_cr,
                                    no_rek_fee: nosbb.no_fee.Acquirer.nosbb_cr,
                                    nama_rek_pokok: nosbb.no_pokok.Acquirer.nmsbb_cr,
                                    nama_rek_fee: nosbb.no_fee.Acquirer.nmsbb_cr
                                }
                            }
                            await update_gl_oy_db_cr(data_db, data_cr, detail_trans)
                            request.data['terminal_id'] = terminal_id
                            //--berhasil dapat list product update atau insert ke db --//
                            console.log("Success");
                            res_send = {
                                code: "000",
                                status: "ok",
                                message: "Success",
                                data: request.data,
                            }
                            console.log(res_send);
                            res.status(200).send(res_send);
                        }
                    }
                } else if (trx_type === "REV") {
                    console.log("TARIK TUNAI ATM REV");
                    if (keterangan == "on_us") {
                        on_us = {
                            gl_rek_db_1: nosbb.no_pokok.On_Us.nosbb_cr,
                            gl_jns_db_1: nosbb.no_pokok.On_Us.jns_sbb_cr,
                            gl_amount_db_1: amount,
                            gl_rek_cr_1: nosbb.no_pokok.On_Us.nosbb_db,
                            gl_jns_cr_1: nosbb.no_pokok.On_Us.jns_sbb_db,
                            gl_amount_cr_1: amount,
                            gl_rek_db_2: nosbb.no_fee.On_Us.nosbb_cr,
                            gl_jns_db_2: nosbb.no_fee.On_Us.jns_sbb_cr,
                            gl_amount_db_2: trans_fee,
                            gl_rek_cr_2: nosbb.no_fee.On_Us.nosbb_db,
                            gl_jns_cr_2: nosbb.no_fee.On_Us.jns_sbb_db,
                            gl_amount_cr_2: trans_fee,
                            gl_rek_db_3: nosbb.fee_bpr.On_Us.nosbb_cr,
                            gl_jns_db_3: nosbb.fee_bpr.On_Us.jns_sbb_cr,
                            gl_amount_db_3: 0,
                            gl_rek_cr_3: nosbb.fee_bpr.On_Us.nosbb_db,
                            gl_jns_cr_3: nosbb.fee_bpr.On_Us.jns_sbb_db,
                            gl_amount_cr_3: 0,
                        }
                    } else if (keterangan == "issuer") {
                        issuer = {
                            gl_rek_db_1: nosbb.tagihan.nosbb_cr,
                            gl_jns_db_1: nosbb.tagihan.jns_sbb_cr,
                            gl_amount_db_1: amount,
                            gl_rek_db_2: nosbb.tagihan.nosbb_cr,
                            gl_jns_db_2: nosbb.tagihan.jns_sbb_cr,
                            gl_amount_db_2: trans_fee,
                            gl_rek_cr_1: nosbb.no_pokok.On_Us.nosbb_db,
                            gl_jns_cr_1: nosbb.no_pokok.On_Us.jns_sbb_db,
                            gl_amount_cr_1: amount,
                            gl_rek_cr_2: nosbb.no_fee.On_Us.nosbb_db,
                            gl_jns_cr_2: nosbb.no_fee.On_Us.jns_sbb_db,
                            gl_amount_cr_2: trans_fee,
                            gl_rek_db_3: nosbb.fee_bpr.nosbb_cr,
                            gl_jns_db_3: nosbb.fee_bpr.jns_sbb_cr,
                            gl_amount_db_3: 0,
                            gl_rek_cr_3: nosbb.fee_bpr.nosbb_db,
                            gl_jns_cr_3: nosbb.fee_bpr.jns_sbb_db,
                            gl_amount_cr_3: 0,
                            gl_rek_db_3: nosbb.fee_bpr.Issuer.nosbb_cr,
                            gl_jns_db_3: nosbb.fee_bpr.Issuer.jns_sbb_cr,
                            gl_amount_db_3: fee_bpr,
                            gl_rek_cr_3: nosbb.fee_bpr.Issuer.nosbb_db,
                            gl_jns_cr_3: nosbb.fee_bpr.Issuer.jns_sbb_db,
                            gl_amount_cr_3: fee_bpr,
                        }
                    } else if (keterangan == "acquirer") {
                        acquirer = {
                            gl_rek_db_1: nosbb.no_pokok.Acquirer.nosbb_cr,
                            gl_jns_db_1: "2",
                            gl_amount_db_1: amount,
                            gl_rek_cr_1: nosbb.no_pokok.Acquirer.nosbb_db,
                            gl_jns_cr_1: nosbb.no_pokok.Acquirer.jns_sbb_db,
                            gl_amount_cr_1: amount,
                            gl_rek_db_2: nosbb.no_fee.Acquirer.nosbb_cr,
                            gl_jns_db_2: "2",
                            gl_amount_db_2: trans_fee,
                            gl_rek_cr_2: nosbb.no_pokok.Acquirer.nosbb_db,
                            gl_jns_cr_2: nosbb.no_pokok.Acquirer.jns_sbb_db,
                            gl_amount_cr_2: trans_fee,
                            gl_rek_db_3: nosbb.fee_bpr.Acquirer.nosbb_cr,
                            gl_jns_db_3: nosbb.fee_bpr.Acquirer.jns_sbb_cr,
                            gl_amount_db_3: 0,
                            gl_rek_cr_3: nosbb.fee_bpr.Acquirer.nosbb_db,
                            gl_jns_cr_3: nosbb.fee_bpr.Acquirer.jns_sbb_db,
                            gl_amount_cr_3: 0,
                        }
                    }
                    // const data_gateway = {no_hp, bpr_id, no_rek:data_nasabah.data.nama_rek, trx_code, trx_type, amount, trans_fee, token, keterangan, terminal_id, lokasi, tgl_trans, tgl_transmis, rrn}
                    const data_core = {
                        no_hp,
                        bpr_id,
                        no_rek,
                        trx_code: "1100",
                        trx_type,
                        amount,
                        trans_fee,
                        fee_bpr,
                        acq_id,
                        terminal_id,
                        token,
                        keterangan,
                        lokasi,
                        tgl_trans,
                        tgl_transmis: moment().format('YYMMDDHHmmss'),
                        rrn,
                        data: {
                            on_us,
                            issuer,
                            acquirer,
                        }
                    }
                    let data_status_core = { bpr_id }
                    let status_core = await connect_axios(url_cms, 'CMS', 'gw/inq/stscore', data_status_core)
                    if (status_core.data.status == "0") {

                        let data_hold_trans = { bpr_id, data: JSON.stringify(data_core) }
                        let hold_transaction = await connect_axios(url_cms, 'CMS', 'gw/log/holdtransaction', data_hold_trans)
                        console.log("hold transaction");
                        console.log(hold_transaction);

                        res_send = {
                            code: "099",
                            status: "Failed",
                            message: "Gagal, Core SIGN OFF!!!",
                            data: null,
                        }
                        console.log(res_send);
                        res.status(200).send(res_send);
                    } else {
                        const request = await connect_axios(url_core, 'CORE', "tariktunai", data_core)
                        console.log("REV ATM " + keterangan);
                        let [results, metadata] = await db.sequelize.query(
                            `UPDATE log_gateway SET messages_type = 'RESPONSE', rcode = ?, messages = ? WHERE no_rek = ? AND no_hp = ? AND bpr_id = ? AND amount = ? AND trans_fee = ? AND tgl_trans = ? AND rrn = ?`,
                            {
                                replacements: [request.code, request.message, no_rek, no_hp, bpr_id, amount, trans_fee, tgl_trans, rrn],
                            }
                        );
                        if (request.code !== "000") {
                            console.log(request);
                            res.status(200).send(request);
                        } else {
                            const detail_trans = {
                                no_rek,
                                nama_rek,
                                keterangan,
                                tgl_trans: moment().format('YYYY-MM-DD HH:mm:ss'),
                                trx_type,
                                status: "R",
                                tcode: "000",
                                noreff: request.data.noreff,
                                rrn
                            }
                            let nosbb = await split_sbb(get_nosbb.data, trx_code)
                            let data_db, data_cr = {}
                            if (keterangan === "on_us") {
                                await update_gl_oy_debet(
                                    amount,
                                    trans_fee,
                                    bpr_id,
                                    trx_code,
                                    nosbb.no_pokok.On_Us.nosbb_cr,
                                    nosbb.no_fee.On_Us.nosbb_cr,
                                    nosbb.no_pokok.On_Us.nmsbb_cr,
                                    nosbb.no_fee.On_Us.nmsbb_cr,
                                    detail_trans
                                )

                                let data_tarik_tunai = { amount, trans_fee, no_rek, no_hp, bpr_id }
                                let request_tartun_minus = await connect_axios(url_cms, 'CMS', 'gw/update/tartunmin', data_tarik_tunai)
                                console.log("Kurang Tartun Harian");
                                console.log(request_tartun_minus);

                                request.data['terminal_id'] = terminal_id
                                console.log("Success");
                                res_send = {
                                    code: "000",
                                    status: "ok",
                                    message: "Success",
                                    data: request.data,
                                }
                                console.log(res_send);
                                res.status(200).send(res_send);
                            } else if (keterangan === "issuer") {
                                await update_gl_oy_debet(
                                    amount,
                                    trans_fee,
                                    bpr_id,
                                    trx_code,
                                    nosbb.tagihan.nosbb_cr,
                                    nosbb.tagihan.nosbb_cr,
                                    nosbb.tagihan.nmsbb_cr,
                                    nosbb.tagihan.nmsbb_cr,
                                    detail_trans
                                )
                                request.data['terminal_id'] = terminal_id
                                //--berhasil dapat list product update atau insert ke db --//
                                console.log("Success");
                                res.status(200).send({
                                    code: "000",
                                    status: "ok",
                                    message: "Success",
                                    data: request,
                                });
                            } else if (keterangan === "acquirer") {
                                data_cr = {
                                    amount,
                                    trans_fee,
                                    bpr_id: acq_id,
                                    trx_code,
                                    no_rek_pokok: nosbb.no_pokok.Acquirer.nosbb_db,
                                    no_rek_fee: nosbb.no_fee.Acquirer.nosbb_db,
                                    nama_rek_pokok: nosbb.no_pokok.Acquirer.nmsbb_db,
                                    nama_rek_fee: nosbb.no_fee.Acquirer.nmsbb_db
                                }
                                data_db = {
                                    amount,
                                    trans_fee,
                                    bpr_id: acq_id,
                                    trx_code,
                                    no_rek_pokok: nosbb.no_pokok.Acquirer.nosbb_cr,
                                    no_rek_fee: nosbb.no_fee.Acquirer.nosbb_cr,
                                    nama_rek_pokok: nosbb.no_pokok.Acquirer.nmsbb_cr,
                                    nama_rek_fee: nosbb.no_fee.Acquirer.nmsbb_cr
                                }
                                await update_gl_oy_db_cr(data_db, data_cr, detail_trans)

                                let data_tarik_tunai = { amount, trans_fee, no_rek, no_hp, bpr_id }
                                let request_tartun_minus = await connect_axios(url_cms, 'CMS', 'gw/update/tartunmin', data_tarik_tunai)
                                console.log("Kurang Tartun Harian");
                                console.log(request_tartun_minus);

                                request.data['terminal_id'] = terminal_id
                                console.log("Success");
                                res_send = {
                                    code: "000",
                                    status: "ok",
                                    message: "Success",
                                    data: request.data,
                                }
                                console.log(res_send);
                                res.status(200).send(res_send);
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        //--error server--//
        console.log("erro get product", error);
        res.status(200).send({
            code: "099",
            status: "Failed",
            message: "INVALID REQ DATA TRANSACTION",
            data: error,
        })
    }
};

// API untuk PPOB
const ppob = async (req, res) => {
    let {
        no_hp,
        bpr_id,
        no_rek,
        product_name,
        trx_code,
        trx_type,
        amount,
        trans_fee,
        tgl_trans,
        tgl_transmis,
        rrn
    } = req.body;
    try {
        let [res_log_pokok, meta_log_pokok] = await db.sequelize.query(
            `INSERT INTO log_gateway(no_hp,bpr_id,no_rek,amount,trans_fee,trx_code,trx_type,tgl_trans,tgl_transmis,keterangan,rrn) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
            {
                replacements: [
                    no_hp, bpr_id, no_rek, amount, trans_fee, trx_code, trx_type, tgl_trans, moment().format('YYMMDDHHmmss'), product_name, rrn,
                ],
            }
        );
        let acct = await db.sequelize.query(
            `SELECT * FROM cms_acct_ebpr WHERE bpr_id = ? AND no_hp = ? AND no_rek = ? AND status != '6'`,
            {
                replacements: [bpr_id, no_hp, no_rek],
                type: db.sequelize.QueryTypes.SELECT,
            }
        )
        if (!acct.length) {
            res.status(200).send({
                code: "003",
                status: "Failed",
                message: "Gagal, Akun Belum Terdaftar",
                data: null,
            });
        } else {
            if (acct[0].status == "1") {
                let get_nosbb = await db.sequelize.query(
                    `SELECT * FROM gl_trans WHERE tcode = ? AND bpr_id = ?`,
                    {
                        replacements: [trx_code, bpr_id],
                        type: db.sequelize.QueryTypes.SELECT,
                    }
                );
                if (!get_nosbb.length) {
                    res.status(200).send({
                        code: "004",
                        status: "Failed",
                        message: "Gagal, Terjadi Kesalahan Pencarian Ledger!!!",
                        data: null,
                    });
                } else {
                    if (trx_type === "TRX") {
                        let status_core = await db.sequelize.query(
                            `SELECT * FROM status_core WHERE bpr_id = ?`,
                            {
                                replacements: [bpr_id],
                                type: db.sequelize.QueryTypes.SELECT,
                            }
                        );
                        if (status_core[0].status == "0") {
                            res.status(200).send({
                                code: "099",
                                status: "Failed",
                                message: "Gagal, Core SIGN OFF!!!",
                                data: null,
                            });
                        } else {
                            const nosbb = await split_sbb(get_nosbb.data, trx_code)
                            const data_core = {
                                no_hp,
                                bpr_id,
                                no_rek,
                                product_name,
                                trx_code,
                                trx_type,
                                amount,
                                trans_fee,
                                tgl_trans,
                                tgl_transmis,
                                rrn,
                                data: {
                                    gl_rek_db_1: no_rek,
                                    gl_jns_db_1: "2",
                                    gl_amount_db_1: amount,
                                    gl_rek_cr_1: nosbb.no_pokok.nosbb_cr,
                                    gl_jns_cr_1: nosbb.no_pokok.jns_sbb_cr,
                                    gl_amount_cr_1: amount,
                                    gl_rek_db_2: no_rek,
                                    gl_jns_db_2: "2",
                                    gl_amount_db_2: trans_fee,
                                    gl_rek_cr_2: nosbb.no_fee.nosbb_cr,
                                    gl_jns_cr_2: nosbb.no_fee.jns_sbb_cr,
                                    gl_amount_cr_2: trans_fee,
                                    gl_rek_db_3: nosbb.fee_bpr.nosbb_db,
                                    gl_jns_db_3: nosbb.fee_bpr.jns_sbb_db,
                                    gl_amount_db_3: fee_bpr,
                                    gl_rek_cr_3: nosbb.fee_bpr.nosbb_cr,
                                    gl_jns_cr_3: nosbb.fee_bpr.jns_sbb_cr,
                                    gl_amount_cr_3: fee_bpr,
                                }
                            }
                            const request = await connect_axios(url_core, 'CORE', "ppob", data_core)
                            let [results, metadata] = await db.sequelize.query(
                                `UPDATE log_gateway SET messages_type = 'RESPONSE', rcode = ?, messages = ? WHERE no_rek = ? AND no_hp = ? AND bpr_id = ? AND amount = ? AND trans_fee = ? AND tgl_trans = ? AND rrn = ?`,
                                {
                                    replacements: [request.code, request.message, no_rek, no_hp, bpr_id, amount, trans_fee, tgl_trans, rrn],
                                }
                            );
                            if (request.code !== "000") {
                                console.log(request);
                                res.status(200).send(request);
                            } else {
                                const detail_trans = {
                                    no_rek,
                                    nama_rek: acct[0].nama_rek,
                                    no_hp,
                                    keterangan: product_name,
                                    tgl_trans: moment().format('YYYY-MM-DD HH:mm:ss'),
                                    trx_type,
                                    status: "1",
                                    tcode: "000",
                                    noreff: request.data.noreff,
                                    rrn
                                }
                                await update_gl_oy_kredit(
                                    amount,
                                    trans_fee,
                                    bpr_id,
                                    trx_code,
                                    nosbb.no_pokok.nosbb_cr,
                                    nosbb.no_fee.nosbb_cr,
                                    nosbb.no_pokok.nmsbb_cr,
                                    nosbb.no_fee.nmsbb_cr,
                                    detail_trans
                                )
                                let [results, metadata] = await db.sequelize.query(
                                    `UPDATE cms_acct_ebpr SET ppob = ppob + ? + ? WHERE no_rek = ? AND no_hp = ? AND bpr_id = ?`,
                                    {
                                        replacements: [amount, trans_fee, no_rek, no_hp, bpr_id],
                                    }
                                );
                                if (!metadata) {
                                    res.status(200).send({
                                        code: "001",
                                        status: "Failed",
                                        message: "Gagal, Terjadi Kesalahan Update Counter Transaksi!!!",
                                        data: null,
                                    });
                                } else {
                                    //--berhasil dapat list product update atau insert ke db --//
                                    console.log("Success");
                                    res.status(200).send({
                                        code: "000",
                                        status: "ok",
                                        message: "Success",
                                        data: request.data,
                                    });
                                }
                            }
                        }
                    } else if (trx_type === "REV") {
                        let status_core = await db.sequelize.query(
                            `SELECT * FROM status_core WHERE bpr_id = ?`,
                            {
                                replacements: [bpr_id],
                                type: db.sequelize.QueryTypes.SELECT,
                            }
                        );
                        const nosbb = await split_sbb(get_nosbb, trx_code)
                        const data_core = {
                            no_hp,
                            bpr_id,
                            no_rek,
                            product_name,
                            token_mpin,
                            trx_code,
                            trx_type,
                            amount,
                            trans_fee,
                            tgl_trans,
                            tgl_transmis,
                            rrn,
                            data: {
                                gl_rek_db_1: nosbb.no_pokok.nosbb_cr,
                                gl_jns_db_1: nosbb.no_pokok.jns_sbb_cr,
                                gl_amount_db_1: amount,
                                gl_rek_cr_1: no_rek,
                                gl_jns_cr_1: "2",
                                gl_amount_cr_1: amount,
                                gl_rek_db_2: nosbb.no_fee.nosbb_cr,
                                gl_jns_db_2: nosbb.no_fee.jns_sbb_cr,
                                gl_amount_db_2: trans_fee,
                                gl_rek_cr_2: no_rek,
                                gl_jns_cr_2: "2",
                                gl_amount_cr_2: trans_fee,
                                gl_rek_db_3: nosbb.fee_bpr.nosbb_cr,
                                gl_jns_db_3: nosbb.fee_bpr.jns_sbb_cr,
                                gl_amount_db_3: fee_bpr,
                                gl_rek_cr_3: nosbb.fee_bpr.nosbb_db,
                                gl_jns_cr_3: nosbb.fee_bpr.jns_sbb_db,
                                gl_amount_cr_3: fee_bpr,
                            }
                        }
                        if (status_core[0].status == "0") {
                            let [res_log_pokok, meta_log_pokok] = await db.sequelize.query(
                                `INSERT INTO hold_transaction (data) VALUES (?)`,
                                {
                                    replacements: [
                                        JSON.stringify(data_core),
                                    ],
                                }
                            );
                            console.log("Success");
                            res.status(200).send({
                                code: "000",
                                status: "ok",
                                message: "Success",
                                data: req.body,
                            });
                        } else {
                            const request = await connect_axios(url_core, 'CORE', "ppob", data_core)
                            let [results, metadata] = await db.sequelize.query(
                                `UPDATE log_gateway SET messages_type = 'RESPONSE', rcode = ?, messages = ? WHERE no_rek = ? AND no_hp = ? AND bpr_id = ? AND amount = ? AND trans_fee = ? AND tgl_trans = ? AND rrn = ?`,
                                {
                                    replacements: [request.code, request.message, no_rek, no_hp, bpr_id, amount, trans_fee, tgl_trans, rrn],
                                }
                            );
                            console.log(request);
                            if (request.code !== "000") {
                                console.log(request);
                                res.status(200).send(request);
                            } else {
                                const detail_trans = {
                                    no_rek,
                                    nama_rek: acct[0].nama_rek,
                                    no_hp,
                                    keterangan: product_name,
                                    tgl_trans: moment().format('YYYY-MM-DD HH:mm:ss'),
                                    trx_type,
                                    status: "R",
                                    tcode: "000",
                                    noreff: request.data.noreff,
                                    rrn
                                }
                                await update_gl_oy_debet(
                                    amount,
                                    trans_fee,
                                    bpr_id,
                                    trx_code,
                                    nosbb.no_pokok.nosbb_cr,
                                    nosbb.no_fee.nosbb_cr,
                                    nosbb.no_pokok.nmsbb_cr,
                                    nosbb.no_fee.nmsbb_cr,
                                    detail_trans
                                )
                                let [results, metadata] = await db.sequelize.query(
                                    `UPDATE cms_acct_ebpr SET ppob = ppob - ? - ? WHERE no_rek = ? AND no_hp = ? AND bpr_id = ?`,
                                    {
                                        replacements: [amount, trans_fee, no_rek, no_hp, bpr_id],
                                    }
                                );
                                if (!metadata) {
                                    res.status(200).send({
                                        code: "001",
                                        status: "Failed",
                                        message: "Gagal, Terjadi Kesalahan Update Counter Transaksi!!!",
                                        data: null,
                                    });
                                } else {
                                    // let response = {
                                    //     no_hp,
                                    //     bpr_id,
                                    //     no_rek,
                                    //     nama_rek: check_saldo[0].nama_rek,
                                    //     product_name,
                                    //     amount,
                                    //     trans_fee,
                                    //     trx_code,
                                    //     trx_type,
                                    //     reff: check_transaksi[0].reff,
                                    //     token: token_mpin,
                                    //     reference_number: check_transaksi[0].reference_number,
                                    //     tgl_trans: check_transaksi[0].tgl_trans,
                                    //     tgl_transmis : moment().format('YYMMDDHHmmss'),
                                    //     rrn
                                    // }
                                    //--berhasil dapat list product update atau insert ke db --//
                                    console.log("Success");
                                    res.status(200).send({
                                        code: "000",
                                        status: "ok",
                                        message: "Success",
                                        data: request.data,
                                    });
                                }
                            }
                        }
                    }
                }
            } else {
                res.status(200).send({
                    code: "009",
                    status: "Failed",
                    message: "Gagal, Akun Tidak Dapat Digunakan!!!",
                    data: null,
                })
            }
        }
    } catch (error) {
        //--error server--//
        console.log("error inquiry", error);
        res.status(200).send({
            code: "099",
            status: "error",
            message: error.message,
            data: null,
        });
    }
};

//API untuk Sign In Sign Off
const sign_in_off = async (req, res) => {
    let { bpr_id, status, tgl_trans } = req.body;
    try {
        if (status == "1") {
            let [results, metadata] = await db.sequelize.query(
                `UPDATE status_core SET status = ?, tgl_sign_in = ? WHERE bpr_id = ?`,
                {
                    replacements: [status, tgl_trans, bpr_id],
                }
            );
            if (!metadata) {
                console.log({
                    code: "001",
                    status: "Failed",
                    message: "Gagal, Terjadi Kesalahan Update Status Core!!!",
                    data: null,
                });
                res.status(200).send({
                    code: "001",
                    status: "Failed",
                    message: "Gagal, Terjadi Kesalahan Update Status Core!!!",
                    data: null,
                });
            } else {
                console.log({
                    code: "000",
                    status: "Success",
                    message: "Success!!!",
                    data: null,
                });
                res.status(200).send({
                    code: "000",
                    status: "Success",
                    message: "Success!!!",
                    data: null,
                });
            }
        } else if (status == "0") {
            let [results, metadata] = await db.sequelize.query(
                `UPDATE status_core SET status = ?, tgl_sign_off = ? WHERE bpr_id = ?`,
                {
                    replacements: [status, tgl_trans, bpr_id],
                }
            );
            if (!metadata) {
                console.log({
                    code: "001",
                    status: "Failed",
                    message: "Gagal, Terjadi Kesalahan Update Status Core!!!",
                    data: null,
                });
                res.status(200).send({
                    code: "001",
                    status: "Failed",
                    message: "Gagal, Terjadi Kesalahan Update Status Core!!!",
                    data: null,
                });
            } else {
                console.log({
                    code: "000",
                    status: "Success",
                    message: "Success!!!",
                    data: null,
                });
                res.status(200).send({
                    code: "000",
                    status: "Success",
                    message: "Success!!!",
                    data: null,
                });
            }
        }

    } catch (error) {
        //--error server--//
        console.log("erro get product", error);
        res.send(error);
    }
}

const list_log_gateway = async (req, res) => {
    let { no_hp, tgl_start, tgl_end } = req.body;
    try {
        let res_send
        let response = await db.sequelize.query(
            `SELECT * FROM log_gateway WHERE no_hp = ? AND tgl_trans BETWEEN ? AND ?`,
            {
                replacements: [no_hp, tgl_start, tgl_end],
                type: db.sequelize.QueryTypes.SELECT,
            }
        );
        if (!response.length) {
            res_send = {
                code: "002",
                status: "Failed",
                message: "Gagal Mencari Log Gateway",
                data: null,
            }
            console.log(res_send);
            res.status(200).send(res_send);
        } else {
            res_send = {
                code: "000",
                status: "ok",
                message: "Success",
                data: response,
            }
            console.log(res_send);
            res.status(200).send(res_send);
        }
    } catch (error) {
        //--error server--//
        console.log("erro get product", error);
        res.send(error);
    }
};

const list_log_core = async (req, res) => {
    let { nosbb, bpr_id, trx_code, tgl_start, tgl_end } = req.body;
    try {
        let res_send
        let response = await db.sequelize.query(
            `SELECT * FROM log_core WHERE nosbb = ? AND bpr_id = ? AND trx_code = ?`,
            {
                replacements: [nosbb, bpr_id, trx_code],
                type: db.sequelize.QueryTypes.SELECT,
            }
        );
        if (!response.length) {
            res_send = {
                code: "002",
                status: "Failed",
                message: "Gagal Mencari Log Core",
                data: null,
            }
            console.log(res_send);
            res.status(200).send(res_send);
        } else {
            res_send = {
                code: "000",
                status: "ok",
                message: "Success",
                data: response,
            }
            console.log(res_send);
            res.status(200).send(res_send);
        }
    } catch (error) {
        //--error server--//
        console.log("erro get product", error);
        res.send(error);
    }
};

module.exports = {
    inquiry_account,
    transfer,
    withdrawal,
    ppob,
    sign_in_off,
    list_log_gateway,
    list_log_core
};