console.log("✅ categories.js được sử dụng");

// Không cần DOMContentLoaded nữa
const form = document.getElementById("createCategoryForm");
const nameInput = document.getElementById("nameInput");
const slugInput = document.getElementById("slugInput");
const categoryList = document.getElementById("categoryList");

if (!form || !nameInput || !slugInput || !categoryList) {
  console.error("❌ Không tìm thấy phần tử form hoặc input hoặc danh sách");
} else {
  // Tải danh sách category từ server
  const loadCategories = async () => {
    console.log("📥 Gọi API GET /categories...");
    categoryList.innerHTML = "";

    try {
      const res = await fetch("/categories", { credentials: "include" });
      console.log("📡 Kết quả fetch:", res.status);

      if (!res.ok) throw new Error("Không thể tải danh mục");

      const data = await res.json();
      console.log("📦 Dữ liệu trả về:", data);

      if (!Array.isArray(data)) throw new Error("❌ Dữ liệu không phải mảng");

      if (data.length === 0) {
        console.log("📭 Không có danh mục nào");
        categoryList.innerHTML =
          "<li class='list-group-item'>Chưa có danh mục nào.</li>";
        return;
      }

      data.forEach((cat) => {
        console.log("📝 Hiển thị danh mục:", cat);
        const li = document.createElement("li");
        li.className =
          "list-group-item d-flex justify-content-between align-items-center";
        li.textContent = `${cat.name} (${cat.slug})`;

        li.addEventListener("click", () => {
          if (typeof loadItemsByCategory === "function") {
            console.log("📦 Gọi loadItemsByCategory cho category:", cat.id);
            loadItemsByCategory(cat.id);
          } else {
            console.warn("⚠️ Hàm loadItemsByCategory chưa sẵn sàng!");
          }
        });

        categoryList.appendChild(li);
      });
    } catch (err) {
      console.error("❌ Lỗi khi tải danh mục:", err);
      categoryList.innerHTML =
        "<li class='list-group-item list-group-item-danger'>Không thể tải danh mục</li>";
    }
  };

  // Gửi form tạo danh mục
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const slug = slugInput.value.trim();
    console.log("📨 Gửi form:", { name, slug });

    if (!name) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }

    try {
      const res = await fetch("/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, slug }),
      });

      console.log("🧾 Kết quả POST:", res.status);

      if (!res.ok) {
        const data = await res.json();
        alert("Lỗi: " + (data.message || "Không thể tạo danh mục"));
        return;
      }

      nameInput.value = "";
      slugInput.value = "";
      await loadCategories();
    } catch (err) {
      console.error("❌ Lỗi khi tạo danh mục:", err);
      alert("Lỗi máy chủ");
    }
  });

  loadCategories(); // gọi lần đầu
}
