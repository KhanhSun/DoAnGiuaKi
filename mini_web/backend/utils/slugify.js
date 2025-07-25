const slugify = (text) => {
  return text
    .toString()
    .normalize("NFD") // tách chữ có dấu
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // khoảng trắng → -
    .replace(/[^\w\-]+/g, "") // bỏ ký tự đặc biệt
    .replace(/\-\-+/g, "-"); // bỏ nhiều dấu - liền nhau
};

module.exports = slugify;
