document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.getElementById("login-link");
  const showSignupLink = document.getElementById("show-signup");
  const showLoginLink = document.getElementById("show-login");
  const authModal = document.getElementById("auth-modal");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  loginLink.addEventListener("click", () => {
    authModal.style.display = "block";
    loginForm.style.display = "block";
    signupForm.style.display = "none";
  });

  showSignupLink.addEventListener("click", () => {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
  });

  showLoginLink.addEventListener("click", () => {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
  });
});

function closeModal() {
  document.getElementById("auth-modal").style.display = "none";
}
