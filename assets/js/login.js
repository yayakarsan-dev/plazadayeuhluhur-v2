/* =====================================================
   PLAZA DAYEUHLUHUR
   LOGIN ADMIN PROTOTYPE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        const form =
            document.getElementById(
                "loginForm"
            );


        const username =
            document.getElementById(
                "username"
            );


        const password =
            document.getElementById(
                "password"
            );


        const errorBox =
            document.getElementById(
                "loginError"
            );


        const togglePassword =
            document.getElementById(
                "togglePassword"
            );


        /* =============================================
           TOGGLE PASSWORD
        ============================================= */

        togglePassword.addEventListener(
            "click",
            () => {

                const isPassword =
                    password.type === "password";


                password.type =
                    isPassword
                        ? "text"
                        : "password";


                togglePassword.innerHTML =
                    isPassword

                        ? '<i class="fa-solid fa-eye-slash"></i>'

                        : '<i class="fa-solid fa-eye"></i>';

            }
        );


        /* =============================================
           LOGIN
        ============================================= */

        form.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const user =
                    username.value.trim();


                const pass =
                    password.value;


                /*
                   PROTOTYPE ONLY

                   Jangan gunakan password ini
                   untuk website production.
                */

                const validUser =
                    user === "admin";


                const validPassword =
                    pass === "admin123";


                if (
                    validUser &&
                    validPassword
                ) {


                    sessionStorage.setItem(
                        "plazaAdminLogin",
                        "true"
                    );


                    sessionStorage.setItem(
                        "plazaAdminName",
                        "Administrator"
                    );


                    window.location.href =
                        "dashboard.html";


                }

                else {

                    errorBox.classList.add(
                        "show"
                    );

                    password.value = "";

                    password.focus();

                }

            }
        );


        /* =============================================
           HAPUS ERROR SAAT MENGETIK
        ============================================= */

        username.addEventListener(
            "input",
            () => {

                errorBox.classList.remove(
                    "show"
                );

            }
        );


        password.addEventListener(
            "input",
            () => {

                errorBox.classList.remove(
                    "show"
                );

            }
        );

    }
);