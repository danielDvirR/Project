
const startProgram = function () {
    const joinClass = document.querySelector(".joinClass .openForm");
    const register = document.querySelector(".registration .openForm");
    const closeCode = document.querySelector(".joinClass button");
    const closeRegForm = document.querySelector(".registration button");
    const regForm = document.querySelector(".registration form");
    const codeForm = document.querySelector(".joinClass form");
    regForm.style.display = "none";
    codeForm.style.display = "none";
    joinClass.addEventListener("click", function () {
        codeForm.style.display = "block";
        joinClass.style.display = "none";
        if (regForm.style.display === "block") {
            regForm.style.display = "none";
            register.style.display = "block";
        }
    })
    register.addEventListener("click", function () {
        regForm.style.display = "block";
        register.style.display = "none";
        if (codeForm.style.display === "block") {
            codeForm.style.display = "none";
            joinClass.style.display = "block";
        }
    })
    closeCode.addEventListener("click", function () {
        codeForm.style.display = "none";
        joinClass.style.display = "block";
    })
    closeRegForm.addEventListener("click", function () {
        regForm.style.display = "none";
        register.style.display = "block";
    })
    regForm.addEventListener("submit", function (event) {
        console.log("Username:" + regForm.elements.Username.value);
        console.log("Password:" + regForm.elements.Password.value);
        console.log("Email:" + regForm.elements.Email.value);
        event.preventDefault();
    })
    codeForm.addEventListener("submit", function (e) {
        console.log("code:" + codeForm.elements.code.value);
        e.preventDefault();
    })
}

startProgram();