function split_sbb(data, tcode) {
  let no_pokok = {};
  let no_fee = {};
  let tagihan = {};
  if (tcode == "1100") {
    for (let i = 0; i < data.length; i++) {
      // console.log(data[i]);
      if (data[i].ket_tcode == "Issuer") {
        tagihan = data[i];
      } else if (data[i].ket_tcode == "Acquirer") {
        if (data[i].jns_gl == "0") {
          no_pokok["Acquirer"] = data[i];
        } else if (data[i].jns_gl == "1") {
          no_fee["Acquirer"] = data[i];
        }
      } else if (data[i].ket_tcode == "On-Us") {
        if (data[i].jns_gl == "0") {
          no_pokok["On_Us"] = data[i];
        } else if (data[i].jns_gl == "1") {
          no_fee["On_Us"] = data[i];
        }
      }
    }
    return { no_pokok, no_fee, tagihan };
  } else {
    if (data[0].jns_gl == "0") {
      if (data.length > 1) {
        no_pokok = data[0];
        no_fee = data[1];
        fee_bpr = data[2];
      } else {
        return data[0];
      }
    } else if (data[0].jns_gl == "1") {
      if (data.length > 1) {
        no_pokok = data[1];
        no_fee = data[0];
        fee_bpr = data[2];
      } else {
        return data[0];
      }
    } else if (data[0].jns_gl == "2") {
      if (data.length > 1) {
        no_pokok = data[0];
        no_fee = data[1];
        fee_bpr = data[2];
      } else {
        return data[0];
      }
    }
    return { no_pokok, no_fee, tagihan, fee_bpr };
  }
}
module.exports = { split_sbb };
