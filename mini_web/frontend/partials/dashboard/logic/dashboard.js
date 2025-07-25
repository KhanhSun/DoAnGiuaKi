console.log("🚀 dashboard.js đang hoạt động");

const form = document.getElementById("createCategoryForm");
const nameInput = document.getElementById("nameInput");
const slugInput = document.getElementById("slugInput");
const categoryList = document.getElementById("categoryList");
const itemsList = document.getElementById("itemsList");

// ✅ Hàm gọi API lấy danh sách item
const loadItemsByCategory = async (category_Id) => {
  console.log("📥 Gọi loadItemsByCategory với categoryId =", category_Id);

  itemsList.innerHTML = "<li class='list-group-item'>Đang tải...</li>";

  try {
    const res = await fetch(`/items?category_id=${category_Id}`, {
      credentials: "include",
    });
    console.log("📡 Kết quả fetch items:", res.status);

    if (!res.ok) throw new Error("Không thể tải item");

    const data = await res.json();
    console.log("📦 Dữ liệu item trả về:", data);

    if (!Array.isArray(data)) throw new Error("❌ Dữ liệu không phải mảng");

    if (data.length === 0) {
      itemsList.innerHTML =
        "<li class='list-group-item'>Không có item nào</li>";
      return;
    }

    itemsList.innerHTML = "";
    data.forEach((item) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <div>
          <strong>${item.title}</strong><br>${item.content || ""}
        </div>
        <div>
        <button class="btn btn-warning btn-sm edit-item-btn mx-1" data-id="${item.id}">Sửa</button>
        <button class="btn btn-danger btn-sm delete-item-btn" data-id="${item.id}">Xóa</button>
        </div>
        `;
      itemsList.appendChild(li);
    });
    // Gắn sự kiện xóa cho từng nút sửa xóa của item sau khi load danh sách
    attachEditEventForItemButtons(category_Id);
    attachDeleteEventForItemButtons(category_Id);

  } catch (err) {
    console.error("❌ Lỗi khi tải item:", err);
    itemsList.innerHTML =
      "<li class='list-group-item list-group-item-danger'>Không thể tải dữ liệu</li>";
  }
};

// ✅ Hàm gọi API lấy danh mục
const loadCategories = async () => {
  console.log("📥 Bắt đầu loadCategories");

  try {
    const res = await fetch("/categories", { credentials: "include" });
    console.log("📡 Kết quả fetch categories:", res.status);

    const data = await res.json();
    console.log("📦 Dữ liệu categories:", data);

    categoryList.innerHTML = "";

    if (!Array.isArray(data)) throw new Error("❌ Dữ liệu không phải mảng");

    if (data.length === 0) {
      categoryList.innerHTML =
        "<li class='list-group-item'>Chưa có danh mục nào.</li>";
      return;
    }

    data.forEach((cat) => {
      console.log("📁 Danh mục:", cat);
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = `${cat.name} (${cat.slug})`;

      li.addEventListener("click", () => {
        console.log("🖱️ Click vào danh mục:", cat);
        loadItemsByCategory(cat.id);
      });
      categoryList.appendChild(li);
    });
  } catch (err) {
    console.error("❌ Lỗi khi tải danh mục:", err);
  }
};

// ✅ Gửi form tạo danh mục
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const slug = slugInput.value.trim();

  console.log("📨 Gửi form tạo danh mục:", { name, slug });

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

    console.log("🧾 Kết quả POST tạo danh mục:", res.status);

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

// ✅ Tải danh mục lần đầu
loadCategories();

// Tự động load lại danh mục vừa thêm sau khi reload
const lastCategoryId = localStorage.getItem("lastCategoryId");
if (lastCategoryId) {
  loadItemsByCategory(lastCategoryId);
  localStorage.removeItem("lastCategoryId");
}

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
        li.innerHTML = `<strong>${item.title}</strong><br>${item.content || ""
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

// Thêm sự kiện cho nút Thêm
const addItemBtn = document.getElementById("addItemBtn");
addItemBtn.addEventListener("click", async () => {
  // Lấy danh sách categories từ API
  let categories = [];
  try {
    const res = await fetch("/categories", { credentials: "include" });
    if (res.ok) {
      categories = await res.json();
    }
  } catch (err) {
    alert("Không thể tải danh mục");
    return;
  }

  const optionsHtml = categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join("");
  const formHtml = `
    <div id="itemModal" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;z-index:9999;">
      <form id="newItemForm" style="background:#fff;padding:20px;border-radius:8px;min-width:300px;">
        <h5>Thêm Item mới</h5>
        <select id="itemCategory" class="form-control mb-2" required>
          <option value="">Chọn danh mục</option>
          ${optionsHtml}
        </select>
        <input type="text" id="itemTitle" class="form-control mb-2" placeholder="Tiêu đề" required />
        <button type="submit" class="btn btn-primary">Lưu</button>
        <button type="button" id="closeModalBtn" class="btn btn-secondary">Đóng</button>
      </form>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", formHtml);

  document.getElementById("closeModalBtn").onclick = () => {
    document.getElementById("itemModal").remove();
  };

  document.getElementById("newItemForm").onsubmit = async (e) => {
    e.preventDefault();
    const category_Id = document.getElementById("itemCategory").value;
    const title_content = document.getElementById("itemTitle").value.trim();
    if (!category_Id || !title_content) {
      alert("Vui lòng chọn danh mục và nhập tiêu đề");
      return;
    }

    // Kiểm tra trùng lặp tiêu đề trong danh mục đã chọn
    try {
      const resCheck = await fetch(`/items?category_id=${category_Id}`, { credentials: "include" });
      if (resCheck.ok) {
        const items = await resCheck.json();
        const isDuplicate = items.some(item => item.title.trim().toLowerCase() === title_content.toLowerCase());
        if (isDuplicate) {
          alert("Đã tồn tại");
          return;
        }
      }
    } catch (err) {
      alert("Lỗi kiểm tra trùng lặp");
      return;
    }

    try {
      const res = await fetch("/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ category_id: category_Id, title: title_content }),
      });
      if (!res.ok) {
        alert("Lỗi khi thêm item");
        return;
      }
      document.getElementById("itemModal").remove();
      localStorage.setItem("lastCategoryId", category_Id);
      window.location.reload();
      const lastCategoryId = localStorage.getItem("lastCategoryId");
    } catch (err) {
      return;
    }
  };
});

// Gắn sự kiện xóa cho từng nút xóa của item sau khi load danh sách
function attachDeleteEventForItemButtons(categoryId) {
  document.querySelectorAll(".delete-item-btn").forEach(btn => {
    btn.onclick = async () => {
      const itemId = btn.getAttribute("data-id");
      if (!itemId) return;
      if (!confirm("Bạn có chắc muốn xóa item này?")) return;
      try {
        const res = await fetch(`/items/${itemId}`, {
          method: "DELETE",
          credentials: "include"
        });
        if (!res.ok) {
          alert("Lỗi khi xóa item");
          return;
        }
        localStorage.setItem("lastCategoryId", categoryId);
        window.location.reload();
      } catch (err) {
        alert("Lỗi máy chủ");
      }
    };
  });
}

function attachEditEventForItemButtons(categoryId) {
  document.querySelectorAll(".edit-item-btn").forEach(btn => {
    btn.onclick = async () => {
      const itemId = btn.getAttribute("data-id");
      if (!itemId) return;

      // Lấy thông tin item hiện tại
      let itemData = null;
      try {
        const res = await fetch(`/items/${itemId}`, { credentials: "include" });
        if (res.ok) {
          itemData = await res.json();
        }
      } catch (err) {
        alert("Không thể tải thông tin item");
        return;
      }
      if (!itemData) {
        alert("Không tìm thấy item");
        return;
      }

      // Hiển thị modal sửa
      const formHtml = `
        <div id="editItemModal" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;z-index:9999;">
          <form id="editItemForm" style="background:#fff;padding:20px;border-radius:8px;min-width:300px;">
            <h5>Sửa Item</h5>
            <input type="text" id="editItemTitle" class="form-control mb-2" placeholder="Tiêu đề" value="${itemData.title || ""}" required />
            <textarea id="editItemContent" class="form-control mb-2" placeholder="Nội dung">${itemData.content || ""}</textarea>
            <button type="submit" class="btn btn-primary">Lưu</button>
            <button type="button" id="closeEditModalBtn" class="btn btn-secondary">Đóng</button>
          </form>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", formHtml);

      document.getElementById("closeEditModalBtn").onclick = () => {
        document.getElementById("editItemModal").remove();
      };

      document.getElementById("editItemForm").onsubmit = async (e) => {
        e.preventDefault();
        const newTitle = document.getElementById("editItemTitle").value.trim();
        const newContent = document.getElementById("editItemContent").value.trim();
        if (!newTitle) {
          alert("Vui lòng nhập tiêu đề");
          return;
        }
        try {
          const res = await fetch(`/items/${itemId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ title: newTitle, content: newContent, category_id: categoryId }),
          });
          if (!res.ok) {
            alert("Lỗi khi sửa item");
            return;
          }
          document.getElementById("editItemModal").remove();
          localStorage.setItem("lastCategoryId", categoryId);
          window.location.reload();
        } catch (err) {
          alert("Lỗi máy chủ");
        }
      };
    };
  });
}