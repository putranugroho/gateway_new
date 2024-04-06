// Microtime
function convertmicrotime(microtime) {
  // Pastikan microtime berupa angka
  if (typeof microtime !== "number") {
    return "Invalid microtime";
  }

  // Buat objek Date dengan menggunakan microtime
  const date = new Date(microtime);

  // Dapatkan komponen tanggal, bulan, tahun, jam, menit, detik, dan milidetik
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Tambah 1 karena bulan dimulai dari 0
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);
  const milliseconds = ("00" + date.getMilliseconds()).slice(-3);

  // Format hasil ke dalam string
  const dateString = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  return dateString;
}

module.exports = { convertmicrotime };
