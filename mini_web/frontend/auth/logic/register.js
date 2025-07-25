document
  .querySelector("#registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Đăng ký thành công!");
      window.location.href = "/auth/login.html";
    } else {
      alert(data.message);
    }
  });
