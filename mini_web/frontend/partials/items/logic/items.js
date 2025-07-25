console.log("✅ items.js được load");

document.addEventListener("DOMContentLoaded", () => {
  // Tạo hàm toàn cục để gọi từ categories.js
  window.loadItemsByCategory = async (categoryId) => {
    const itemsList = document.getElementById("itemsList");
    itemsList.innerHTML = "<li class='list-group-item'>Đang tải...</li>";

    try {
      const res = await fetch(`/items?category_id=${categoryId}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Lỗi khi tải item");

      const items = await res.json();

      if (items.length === 0) {
        itemsList.innerHTML =
          "<li class='list-group-item'>Không có item nào</li>";
        return;
      }

      itemsList.innerHTML = ""; // Xóa loading

      items.forEach((item) => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.innerHTML = `<strong>${item.title}</strong><br>${
          item.content || ""
        }`;
        itemsList.appendChild(li);
      });
    } catch (err) {
      console.error("❌ Lỗi khi tải items:", err);
      itemsList.innerHTML =
        "<li class='list-group-item text-danger'>Không thể tải dữ liệu</li>";
    }
  };
});
