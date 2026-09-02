// document.addEventListener('DOMContentLoaded', () => {
//     const locationInput = document.getElementById('location');
//     let timeoutId;

//     // 1. Create a dropdown container for the suggestions
//     const suggestionBox = document.createElement('ul');
//     suggestionBox.className = 'list-group position-absolute w-100 shadow-sm';
//     suggestionBox.style.zIndex = '1050';
//     suggestionBox.style.display = 'none';
//     suggestionBox.style.top = '100%'; // Position directly below the input
//     suggestionBox.style.maxHeight = '250px';
//     suggestionBox.style.overflowY = 'auto';

//     // Append the suggestion box to the input group
//     locationInput.parentElement.appendChild(suggestionBox);

//     // 2. Listen for user input
//     locationInput.addEventListener('input', (e) => {
//         const query = e.target.value.trim();

//         // Hide box if query is too short
//         if (query.length < 3) {
//             suggestionBox.style.display = 'none';
//             suggestionBox.innerHTML = '';
//             return;
//         }

//         // Clear previous timeout to avoid spamming the API (Debounce)
//         clearTimeout(timeoutId);

//         // Wait 500ms after the user stops typing before calling the API
//         timeoutId = setTimeout(async () => {
//             try {
//                 // Nominatim API call (format=json is required)
//                 const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`;

//                 const response = await fetch(url, {
//                     headers: {
//                         'Accept-Language': 'en-US,en;q=0.9' // Optional: forces English results
//                     }
//                 });

//                 const data = await response.json();

//                 // Clear previous results
//                 suggestionBox.innerHTML = '';

//                 if (data && data.length > 0) {
//                     data.forEach(place => {
//                         // Create a list item for each result
//                         const li = document.createElement('li');
//                         li.className = 'list-group-item list-group-item-action text-truncate';
//                         li.style.cursor = 'pointer';
//                         li.style.fontSize = '14px';
//                         li.textContent = place.display_name;

//                         // Click event to select the location
//                         li.addEventListener('click', () => {
//                             locationInput.value = place.display_name;
//                             suggestionBox.style.display = 'none';
//                         });

//                         suggestionBox.appendChild(li);
//                     });

//                     suggestionBox.style.display = 'block';
//                 } else {
//                     suggestionBox.style.display = 'none';
//                 }
//             } catch (error) {
//                 console.error("Error fetching location data:", error);
//             }
//         }, 500);
//     });

//     // 3. Hide suggestion box when clicking anywhere else on the page
//     document.addEventListener('click', (e) => {
//         if (!locationInput.contains(e.target) && !suggestionBox.contains(e.target)) {
//             suggestionBox.style.display = 'none';
//         }
//     });
// });


document.addEventListener("DOMContentLoaded", () => {

    // 1. Payment Options Toggle
    // Highlights the selected payment method with the active class
    const paymentOptions = document.querySelectorAll('.payment-option');
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            // Remove active class from all options
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to the parent label of the checked radio
            if (e.target.checked) {
                e.target.closest('.payment-option').classList.add('active');
            }
        });
    });

    // 2. Drag & Drop File Upload UI
    // Handles clicking, dragging, and dropping a license file
    const uploadArea = document.querySelector('.upload-area');

    // Create a hidden file input element dynamically
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.jpg, .jpeg, .png, .pdf';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // Trigger file input when clicking the upload area
    uploadArea.addEventListener('click', () => fileInput.click());

    // Handle visual changes during drag events
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--brand-yellow)';
        uploadArea.style.backgroundColor = '#fffbeb';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#cbd5e1';
        uploadArea.style.backgroundColor = '#f8fafc';
    });

    // Update UI when a file is dropped
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#cbd5e1';
        uploadArea.style.backgroundColor = '#f8fafc';

        if (e.dataTransfer.files.length) {
            handleFileUpload(e.dataTransfer.files[0].name);
        }
    });

    // Update UI when a file is selected via click
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileUpload(e.target.files[0].name);
        }
    });

    function handleFileUpload(fileName) {
        uploadArea.innerHTML = `
            <i class="fa-solid fa-file-circle-check text-success fs-2 mb-2"></i>
            <div class="fw-semibold text-success">File Selected</div>
            <div class="small text-muted mt-1 text-truncate px-3">${fileName}</div>
        `;
    }

    // 3. Confirm Booking Button Animation & Validation
    const confirmBtn = document.querySelector('button.btn-brand.w-100');
    const termsCheck = document.getElementById('termsCheck');

    confirmBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Basic validation
        if (!termsCheck.checked) {
            alert("Please agree to the Terms & Conditions to proceed.");
            return;
        }

        // Save original button state
        const originalText = confirmBtn.innerHTML;

        // Set Loading state
        confirmBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        confirmBtn.disabled = true;

        // Simulate API call/Network request with setTimeout
        setTimeout(() => {
            // Success state
            confirmBtn.innerHTML = '<i class="fa-solid fa-check"></i> Booking Confirmed!';
            confirmBtn.style.backgroundColor = '#198754'; // Bootstrap success color
            confirmBtn.style.color = '#fff';

            // Reset button after 3 seconds (optional, usually you would redirect to a success page)
            setTimeout(() => {
                confirmBtn.innerHTML = originalText;
                confirmBtn.disabled = false;
                confirmBtn.style.backgroundColor = '';
                confirmBtn.style.color = '';
            }, 3000);

        }, 2000); // 2 second mock delay
    });

    // 4. Back to Top Button Logic
    const bttBtn = document.querySelector('footer .btn-brand.rounded-circle');

    // Initial styles for smooth fade in/out
    bttBtn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    bttBtn.style.opacity = '0';
    bttBtn.style.pointerEvents = 'none';

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            bttBtn.style.opacity = '1';
            bttBtn.style.pointerEvents = 'auto';
        } else {
            bttBtn.style.opacity = '0';
            bttBtn.style.pointerEvents = 'none';
        }
    });

    bttBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // // 5. Dark Mode Toggle (Visual Only for Icon)
    // // Toggles the moon/sun icon in the navbar. 
    // // You will need to add actual CSS variables for .dark-theme to fully implement this.
    // const themeIcon = document.querySelector('.bi-moon-fill');
    // if (themeIcon) {
    //     themeIcon.addEventListener('click', () => {
    //         if (themeIcon.classList.contains('bi-moon-fill')) {
    //             themeIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
    //             themeIcon.classList.replace('text-white', 'text-warning');
    //         } else {
    //             themeIcon.classList.replace('bi-sun-fill', 'bi-moon-fill');
    //             themeIcon.classList.replace('text-warning', 'text-white');
    //         }
    //     });
    // }
});


document.addEventListener("DOMContentLoaded", () => {
    const confirmBtn = document.querySelector('button.btn-brand.w-100');
    const termsCheck = document.getElementById('termsCheck');

    // Modal Elements
    const qrModalEl = document.getElementById('qrPaymentModal');
    const qrModal = new bootstrap.Modal(qrModalEl);
    const paymentView = document.getElementById('paymentView');
    const successView = document.getElementById('successView');
    const timerDisplay = document.getElementById('qrTimer');
    const fakeTxnId = document.getElementById('fakeTxnId');
    const txnDate = document.getElementById('txnDate');

    let timerInterval;

    confirmBtn.addEventListener('click', (e) => {
        e.preventDefault();

        if (!termsCheck.checked) {
            alert("Please agree to the Terms & Conditions to proceed.");
            return;
        }

        // Reset views before showing
        paymentView.classList.remove('d-none');
        successView.classList.add('d-none');

        // Start 5-minute countdown
        startTimer(5 * 60, timerDisplay);
        qrModal.show();

        // Simulate the user scanning the QR code after 4 seconds
        setTimeout(() => {
            clearInterval(timerInterval);
            processFakePayment();
        }, 4000);
    });

    function startTimer(duration, display) {
        let timer = duration, minutes, seconds;
        clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                timer = 0;
                clearInterval(timerInterval);
                display.textContent = "EXPIRED";
            }
        }, 1000);
    }

    function processFakePayment() {
        // Generate a fake alphanumeric bank ID (e.g., TXN8A9F321C)
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let randomID = 'TXN';
        for (let i = 0; i < 9; i++) {
            randomID += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        // Get current formatted date/time
        const now = new Date();
        const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };

        // Update the DOM
        fakeTxnId.textContent = randomID;
        txnDate.textContent = now.toLocaleDateString('en-IN', options);

        // Switch to success screen
        paymentView.classList.add('d-none');
        successView.classList.remove('d-none');

        // Update the main page button to reflect completion
        confirmBtn.innerHTML = '<i class="fa-solid fa-check"></i> Booking Complete';
        confirmBtn.disabled = true;
        confirmBtn.style.backgroundColor = '#198754';
        confirmBtn.style.color = '#fff';
    }
});