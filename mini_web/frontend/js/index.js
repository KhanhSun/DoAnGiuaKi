document.addEventListener("DOMContentLoaded", async () => {
  const userView = document.getElementById("userView");
  const guestView = document.getElementById("guestView");
  const usernameDisplay = document.getElementById("usernameDisplay");

  try {
    const res = await fetch("/auth/me", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      usernameDisplay.textContent = data.user.username;
      userView.classList.remove("d-none");
      guestView.classList.add("d-none");

      const dashboardRes = await fetch("/partials/dashboard/dashboard.html");
      const dashboardHtml = await dashboardRes.text();
      document.getElementById("categoriesSection").innerHTML = dashboardHtml;

      const dashboardScript = document.createElement("script");
      dashboardScript.src = "/partials/dashboard/logic/dashboard.js";
      document.body.appendChild(dashboardScript);

      // // items.html
      // const itemsRes = await fetch("/partials/items/items.html");
      // const itemsHtml = await itemsRes.text();
      // document.getElementById("itemsSectionContainer").innerHTML = itemsHtml;

      // const itemsScript = document.createElement("script");
      // itemsScript.src = "/partials/items/logic/items.js";
      // document.body.appendChild(itemsScript);
    }
  } catch (err) {
    console.error("Không kiểm tra được phiên:", err);
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      const res = await fetch("/auth/logout", { method: "POST" });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("Đăng xuất thất bại");
      }
    });
  }
});
