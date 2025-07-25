document.querySelector("#loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;

  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });

  const data = await res.json();
  if (res.ok) {
    alert("Đăng nhập thành công!");
    window.location.href = "/";
  } else {
    alert(data.message);
  }
});
