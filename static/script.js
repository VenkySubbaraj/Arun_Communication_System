document.addEventListener("DOMContentLoaded", function () {
    const inquirySelect = document.getElementById("inquiry");
    const messageField = document.getElementById("message");

    // Preset messages for each inquiry type
    const inquiryMessages = {
        complaint: "I have a complaint regarding your service.",
        new_connection: "I would like to request a new connection.",
        feedback: "",
        other: "" // Allow manual input
    };

    // Update message field and disable/enable input based on selection
    inquirySelect.addEventListener("change", function () {
        const selectedValue = inquirySelect.value;
        messageField.value = inquiryMessages[selectedValue] || "";

        if (selectedValue === "feedback" || selectedValue === "other") {
            messageField.removeAttribute("disabled"); // Enable input
        } else {
            messageField.setAttribute("disabled", "true"); // Disable input
        }
    });

    document.getElementById("showToast").addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Collect form data
        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("Address").value.trim();
        const inquiry = document.getElementById("inquiry").value.trim();
        const message = document.getElementById("message").value.trim();

        // Validate phone number (only numbers, exactly 10 digits)
        const phoneRegex = /^(?!([0-9])\1{9})[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            showToast("Invalid phone number", "danger");
            return;
        }

        // Ensure message is not empty for required cases
        if (message === "" && inquiry !== "other") {
            showToast("Message cannot be empty.", "danger");
            return;
        }

        const formData = { name, phone, address, inquiry, message };
        console.log("Submitting data:", formData); // Debugging

        fetch("/", {  // 🔹 FIXED URL
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Server error");
            }
            return response.json();
        })
        .then(data => {
            showToast("Form submitted successfully!", "success");
            clearForm();
        })
        .catch(error => {
            console.error("Error:", error);
            showToast("Submission failed. Try again.", "danger");
        });
    });

    function clearForm() {
        document.getElementById("contactForm").reset();
        messageField.setAttribute("disabled", "true"); // Reset message field state
    }

    function showToast(message, type = "success") {
        let toastContainer = document.getElementById("toastContainer");
        if (!toastContainer) {
            toastContainer = document.createElement("div");
            toastContainer.id = "toastContainer";
            toastContainer.className = "position-fixed top-0 end-0 p-3";
            toastContainer.style.zIndex = "1050";
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement("div");
        toast.className = `toast align-items-center text-bg-${type} border-0 show`;
        toast.setAttribute("role", "alert");
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        toastContainer.appendChild(toast);
        new bootstrap.Toast(toast).show();
        toast.addEventListener("hidden.bs.toast", () => toast.remove());
    }
});
