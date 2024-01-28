const express = require("express");
const router = express.Router();
const db = require("../../connection/index");
require('dotenv').config();
const axios = require('axios');
const { callAPI } = require('../../utils/execAPI');
const { split_sbb } = require("../../utils/splitgltrn");
const moment = require("moment");
const { insertlogGW } = require("../cms/insertlogcms");

async function transaksi_ppob(req) {
    let {
        nohp,
        bpr_id,
        norek,
        product_name,
        trx_code,
        trx_type,
        amount,
        mpin,
        fee,
        fee_bpr,
        tgl_trans,
        tgl_transmis,
        noreff
    } = req;
    let response
    let no_hp = nohp
    let no_rek = norek
    let trans_fee = fee
    let rrn = noreff
    const { CORE_URL, CMS_URL, API_KEY_CMS } = process.env;
    const url = CORE_URL;
    let responseApi
    let dataAPI = {}
    let header = {
        "api-key": API_KEY_CMS
    }
    amount = parseFloat(amount)
    fee = parseFloat(fee)
    fee_bpr = parseFloat(fee_bpr)
    let data = {
        bpr_id: bpr_id,
        no_hp: nohp,
        no_rek: norek
    }
    try {


        responseApi = await callAPI(CMS_URL, "gw/inq/validatenorekhp", data, header)

        let kode = responseApi.code
        if (kode == "000") {
            dataAPI = responseApi.data
            let status = dataAPI.status
            /**cek status akun */
            switch (status) {
                case '0':
                case '4':
                case '2':
                    response = {
                        code: stsrec === '2' ? '007' :
                            stsrec === '4' ? '004' :
                                stsrec === '0' ? '004' : '099',
                        status: 'gagal',
                        message: stsrec === '2' ? 'akun di blokir' :
                            stsrec === '4' ? 'akun ditutup' :
                                stsrec === '0' ? 'akun belum melakukan aktivasi' : 'akun tidak terdaftar atau sudah dihapus'

                    }
                    break
                case '1':
                    let resultmpin = dataAPI.mpin
                    let mpinsalah = dataAPI.mpin_salah
                    /** cek mpin  */
                    if (mpin !== resultmpin) {
                        mpinsalah++
                        if (mpinsalah >= 3) {
                            dataAPIbody = {
                                bpr_id: bpr_id,
                                no_hp: nohp,
                                no_rek: norek,
                                status: "2",
                                mpin_salah: mpinsalah
                            }
                            responseApi = await callAPI(CMS_URL, "gw/mpin/updatests", dataAPIbody, header)
                            if (responseApi.code == "000") {
                                response = {
                                    code: "007",
                                    status: "gagal",
                                    message: "mpin yang dimasukan salah 3X akun diblokir"
                                }
                            } else {
                                response = responseApi
                            }
                            return response
                        } else {
                            dataAPIbody = {
                                bpr_id: bpr_id,
                                no_hp: nohp,
                                no_rek: norek,
                                status: "1",
                                mpin_salah: mpinsalah
                            }
                            responseApi = await callAPI(CMS_URL, "gw/mpin/updatests", dataAPIbody, header)
                            if (responseApi.code == "000") {
                                response = {
                                    code: "007",
                                    status: "gagal",
                                    message: "mpin yang dimasukan salah"
                                }
                            } else {
                                response = responseApi
                            }
                            return response
                        }
                    } else {
                        dataAPIbody = {
                            bpr_id: bpr_id,
                            no_hp: nohp,
                            no_rek: norek,
                            status: "1",
                            mpin_salah: "0"
                        }
                        responseApi = await callAPI(CMS_URL, "gw/mpin/updatests", dataAPIbody, header)
                        if (responseApi.code !== "000") {
                            response = responseApi
                            return response
                        }

                        /**cek total transaksi melebihi lihit harian */
                        dataAPIbody = {
                            bpr_id: bpr_id,
                            acct_type: dataAPI.acct_type
                        }
                        responseApi = await callAPI(CMS_URL, "gw/inq/ceklimit", dataAPIbody, header)
                        if (responseApi.code !== "000") {
                            response = responseApi
                            return response
                        }
                        if (amount > parseFloat(responseApi.data.ppob_trx)) {
                            response = {
                                code: "009",
                                status: "gagal",
                                message: "transaksi gagal,melebihi limit pertransaksi"
                            }
                            return response
                        }
                        if (dataAPI.ppob + amount > parseFloat(responseApi.data.ppob_harian)) {
                            response = {
                                code: "009",
                                status: "gagal",
                                message: "transaksi gagal,melebihi limit harian"
                            }
                            return response
                        }
                        dataAPIbody = {
                            bpr_id: bpr_id,
                            tcode: trx_code
                        }
                        responseApi = await callAPI(CMS_URL, "gw/gl/sbbgltrans", dataAPIbody, header)
                        if (responseApi.code !== "000") {
                            response = {
                                code: "011",
                                status: "gagal",
                                message: "trx code tidak terdaftar di gl trans"
                            }
                            return response
                        }

                        let nosbb = await split_sbb(responseApi.data, trx_code)

                        let data_core
                        if (trx_type === "TRX") {
                            data_core = {
                                no_hp,
                                bpr_id,
                                no_rek,
                                trx_code,
                                trx_type,
                                amount: parseFloat(amount),
                                trans_fee: parseFloat(fee),
                                fee_bpr,
                                product_name,
                                token: "",
                                acq_id: "",
                                terminal_id: "",
                                lokasi: "",
                                tgl_trans,
                                tgl_transmis: moment().format('YYMMDDHHmmss'),
                                rrn: noreff,
                                data: {
                                    gl_rek_db_1: no_rek,
                                    gl_jns_db_1: nosbb.no_pokok.jns_sbb_db,
                                    gl_amount_db_1: parseFloat(amount),
                                    gl_rek_cr_1: nosbb.no_pokok.nosbb_cr,
                                    gl_jns_cr_1: nosbb.no_pokok.jns_sbb_cr,
                                    gl_amount_cr_1: parseFloat(amount),

                                    gl_rek_db_2: no_rek,
                                    gl_jns_db_2: nosbb.no_fee.jns_sbb_db,
                                    gl_amount_db_2: parseFloat(fee),
                                    gl_rek_cr_2: nosbb.no_fee.nosbb_cr,
                                    gl_jns_cr_2: nosbb.no_fee.jns_sbb_cr,
                                    gl_amount_cr_2: parseFloat(fee),

                                    gl_rek_db_3: nosbb.fee_bpr.nosbb_db,
                                    gl_jns_db_3: nosbb.fee_bpr.jns_sbb_db,
                                    gl_amount_db_3: parseFloat(fee_bpr),
                                    gl_rek_cr_3: nosbb.fee_bpr.nosbb_cr,
                                    gl_jns_cr_3: nosbb.fee_bpr.jns_sbb_cr,
                                    gl_amount_cr_3: parseFloat(fee_bpr),
                                }
                            }
                        } else if (trx_type === "REV") {
                            data_core = {
                                no_hp,
                                bpr_id,
                                no_rek,
                                trx_code,
                                trx_type,
                                amount: parseFloat(amount),
                                trans_fee: parseFloat(fee),
                                fee_bpr,
                                product_name,
                                token: "",
                                acq_id: "",
                                terminal_id: "",
                                lokasi: "",
                                tgl_trans,
                                tgl_transmis: moment().format('YYMMDDHHmmss'),
                                rrn: noreff,
                                data: {
                                    gl_rek_db_1: no_rek,
                                    gl_jns_db_1: nosbb.no_pokok.jns_sbb_db,
                                    gl_amount_db_1: parseFloat(amount),
                                    gl_rek_cr_1: nosbb.no_pokok.nosbb_cr,
                                    gl_jns_cr_1: nosbb.no_pokok.jns_sbb_cr,
                                    gl_amount_cr_1: parseFloat(amount),

                                    gl_rek_db_2: no_rek,
                                    gl_jns_db_2: nosbb.no_pokok.jns_sbb_db,
                                    gl_amount_db_2: parseFloat(fee),
                                    gl_rek_cr_2: nosbb.no_fee.nosbb_cr,
                                    gl_jns_cr_2: nosbb.no_fee.jns_sbb_cr,
                                    gl_amount_cr_2: parseFloat(fee),

                                    gl_rek_db_3: nosbb.fee_bpr.nosbb_db,
                                    gl_jns_db_3: nosbb.fee_bpr.jns_sbb_db,
                                    gl_amount_db_3: parseFloat(fee_bpr),
                                    gl_rek_cr_3: nosbb.fee_bpr.nosbb_cr,
                                    gl_jns_cr_3: nosbb.fee_bpr.jns_sbb_cr,
                                    gl_amount_cr_3: parseFloat(fee_bpr),
                                }
                            }
                        }
                        console.log(data_core)


                        response = await callAPI(url, "ppob", data_core, header)
                        //        insertlogGW(nosbb.no_pokok.nosbb_cr, bpr_id, trx_code, trx_type, tgl_trans, product_name, no_rek, amount + fee + fee_bpr, 0, noreff, '1', response.code)

                        if (response.code == "000") {
                            dataAPIbody = {
                                bpr_id,
                                amount,
                                trans_fee: fee,
                                no_rek: norek,
                                no_hp: nohp
                            }
                            if (trx_type == "TRX") {
                                callAPI(CMS_URL, "gw/update/ppobplus", dataAPIbody, header)
                            } else if (trx_type == "REV") {
                                callAPI(CMS_URL, "gw/update/ppobmin", dataAPIbody, header)
                            }
                        }
                    }

            }
        } else {
            response = {
                code: responseApi.code,
                status: responseApi.status,
                message: responseApi.message
            }

        }
    } catch (error) {
        response = {
            code: "099",
            status: "error",
            message: `terjadi kesalahan dalam memproses data ${error}`
        }
    }
    return response
};

module.exports = { transaksi_ppob }