const form = document.getElementById("registrationForm");
const tableBody = document.querySelector("#studentTable tbody");

displayStudents();

/* Show / Hide Password */

document.getElementById("showPassword").addEventListener("change", function () {

    const type = this.checked ? "text" : "password";

    document.getElementById("password").type = type;
    document.getElementById("confirmPassword").type = type;

});

/* Form Submit */

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const exam = document.getElementById("exam").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    /* Clear Errors */

    document.querySelectorAll(".error").forEach(error => error.textContent = "");
    document.getElementById("successMessage").textContent = "";

    let isValid = true;

    /* Name Validation */

    if (name === "") {
        document.getElementById("nameError").textContent = "Name is required";
        isValid = false;
    }

    /* Email Validation */

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        document.getElementById("emailError").textContent = "Enter a valid email";
        isValid = false;
    }

    /* Phone Validation */

    const phonePattern = /^[6-9]\d{9}$/;

    if (!phonePattern.test(phone)) {
        document.getElementById("phoneError").textContent =
            "Phone number must start with 6-9 and contain 10 digits";
        isValid = false;
    }

    /* DOB Validation */

    if (dob === "") {

        document.getElementById("dobError").textContent =
            "Date of Birth is required";

        isValid = false;

    } else {

        const birthDate = new Date(dob);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();

        const month = today.getMonth() - birthDate.getMonth();

        if (
            month < 0 ||
            (month === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        if (age < 18) {

            document.getElementById("dobError").textContent =
                "Minimum age is 18 years";

            isValid = false;

        }

    }

    /* Gender Validation */

    if (gender === "") {

        document.getElementById("genderError").textContent =
            "Please select gender";

        isValid = false;

    }

    /* Exam Validation */

    if (exam === "") {

        document.getElementById("examError").textContent =
            "Please select exam type";

        isValid = false;

    }

    /* Password Validation */

    if (password.length < 8) {

        document.getElementById("passwordError").textContent =
            "Password must contain at least 8 characters";

        isValid = false;

    }

    if (password !== confirmPassword) {

        document.getElementById("confirmPasswordError").textContent =
            "Passwords do not match";

        isValid = false;

    }

    /* Duplicate Email Check */

    let registrations =
        JSON.parse(localStorage.getItem("registrations")) || [];

    const alreadyExists = registrations.some(
        student => student.email.toLowerCase() === email.toLowerCase()
    );

    if (alreadyExists) {

        document.getElementById("emailError").textContent =
            "Email already registered";

        isValid = false;

    }

    if (!isValid) return;

    /* Save Student */

    const student = {

        name,
        email,
        phone,
        dob,
        gender,
        exam,
        password

    };

    registrations.push(student);

    localStorage.setItem(
        "registrations",
        JSON.stringify(registrations)
    );

    document.getElementById("successMessage").textContent =
        "Registration Successful!";

    form.reset();

    displayStudents();

});
/* Display Students */

function displayStudents() {

    let registrations = JSON.parse(localStorage.getItem("registrations")) || [];

    tableBody.innerHTML = "";

    if (registrations.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">No registrations found.</td>
            </tr>
        `;

        document.getElementById("totalStudents").textContent = 0;
        return;
    }

    document.getElementById("totalStudents").textContent = registrations.length;

    registrations.forEach((student, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${student.name}</td>

            <td>${student.email}</td>

            <td>${student.phone}</td>

            <td>${student.exam}</td>

            <td>
                <button
                    class="deleteBtn"
                    onclick="deleteStudent(${index})">
                    Delete
                </button>
            </td>

        `;

        tableBody.appendChild(row);

    });

}

/* Delete Student */

function deleteStudent(index) {

    let registrations = JSON.parse(localStorage.getItem("registrations")) || [];

    if(confirm("Delete this registration?")){

        registrations.splice(index,1);

        localStorage.setItem(
            "registrations",
            JSON.stringify(registrations)
        );

        displayStudents();

    }

}

/* Clear All Registrations */

function clearAllStudents(){

    if(confirm("Delete all registrations?")){

        localStorage.removeItem("registrations");

        displayStudents();

        document.getElementById("successMessage").textContent =
        "All registrations deleted.";

    }

}

displayStudents();

</script>

</body>
</html>
