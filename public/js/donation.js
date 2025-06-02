// Global variables
let selectedAmount = 5
let isCustomAmount = false

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  initializePage()
  setupEventListeners()
})

function initializePage() {
  updateSelectedAmount(5)

  // Set default amount button as active
  const defaultBtn = document.querySelector('[data-amount="500"]')
  if (defaultBtn) {
    defaultBtn.classList.add("active")
  }
}

function setupEventListeners() {
  // Amount buttons
  const amountButtons = document.querySelectorAll(".amount-btn")
  amountButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const amount = this.getAttribute("data-amount")
      handleAmountSelection(amount, this)
    })
  })

  // Custom amount input
  const customAmountInput = document.getElementById("customAmount")
  if (customAmountInput) {
    customAmountInput.addEventListener("input", handleCustomAmountInput)
  }

  // Form submission
  const donationForm = document.getElementById("donationForm")
  if (donationForm) {
    donationForm.addEventListener("submit", handleFormSubmission)
  }

  // Form inputs for validation
  const formInputs = document.querySelectorAll(".form-input")
  formInputs.forEach((input) => {
    input.addEventListener("blur", validateInput)
  })
}

function handleAmountSelection(amount, button) {
  // Remove active class from all buttons
  document.querySelectorAll(".amount-btn").forEach((btn) => {
    btn.classList.remove("active")
  })

  // Add active class to clicked button
  button.classList.add("active")

  if (amount === "custom") {
    // Show custom amount input
    const customWrapper = document.getElementById("customAmountWrapper")
    const customInput = document.getElementById("customAmount")

    customWrapper.style.display = "block"
    customInput.focus()
    isCustomAmount = true

    if (customInput.value) {
      updateSelectedAmount(Number.parseInt(customInput.value))
    } else {
      updateSelectedAmount(10)
    }
  } else {
    // Hide custom amount input
    const customWrapper = document.getElementById("customAmountWrapper")
    customWrapper.style.display = "none"
    isCustomAmount = false

    updateSelectedAmount(Number.parseInt(amount))
  }
}

function handleCustomAmountInput(event) {
  const value = Number.parseInt(event.target.value)
  if (value && value >= 100) {
    updateSelectedAmount(value)
  }
}

function updateSelectedAmount(amount) {
  selectedAmount = amount

  // Update button text
  const btnAmount = document.getElementById("btnAmount")
  if (btnAmount) {
    btnAmount.textContent = `₹${amount.toLocaleString()}`
  }
}

function validateInput(event) {
  const input = event.target
  const value = input.value.trim()

  // Clear previous errors
  input.classList.remove("error")
  const errorElement = input.parentElement.querySelector(".error-message")
  if (errorElement) {
    errorElement.remove()
  }

  // Validate based on input type
  if (input.type === "email" && value && !isValidEmail(value)) {
    showValidationError(input, "Please enter a valid email address")
  } else if (input.required && !value) {
    showValidationError(input, "This field is required")
  }
}

function showValidationError(input, message) {
  input.classList.add("error")

  const errorElement = document.createElement("div")
  errorElement.className = "error-message"
  errorElement.textContent = message
  errorElement.style.color = "#dc2626"
  errorElement.style.fontSize = "0.75rem"
  errorElement.style.marginTop = "0.25rem"

  input.parentElement.appendChild(errorElement)
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function handleFormSubmission(event) {
  event.preventDefault()

  // Validate form
  if (!validateForm()) {
    return
  }

  // Show loading state
  const submitBtn = document.getElementById("donateBtn")
  const originalText = submitBtn.innerHTML

  submitBtn.innerHTML = `
    <i class="fas fa-spinner fa-spin"></i>
    <span class="btn-text">Processing...</span>
  `
  submitBtn.disabled = true

  // Simulate payment processing
  setTimeout(() => {
    // Reset button
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false

    // Show success modal
    showSuccessModal()

    // Reset form
    resetForm()
  }, 2000)
}

function validateForm() {
  const requiredFields = document.querySelectorAll("input[required]")
  let isValid = true

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      showValidationError(field, "This field is required")
      isValid = false
    }
  })

  // Validate email
  const emailField = document.getElementById("email")
  if (emailField.value && !isValidEmail(emailField.value)) {
    showValidationError(emailField, "Please enter a valid email address")
    isValid = false
  }

  // Validate privacy checkbox
  const privacyCheckbox = document.getElementById("privacy")
  if (!privacyCheckbox.checked) {
    isValid = false
    alert("Please accept the privacy policy and terms of service")
  }

  // Validate custom amount
  if (isCustomAmount) {
    const customAmount = document.getElementById("customAmount")
    const amount = Number.parseInt(customAmount.value)
    if (!amount || amount < 100) {
      showValidationError(customAmount, "Minimum donation amount is ₹100")
      isValid = false
    }
  }

  return isValid
}

function showSuccessModal() {
  const modal = document.getElementById("successModal")
  const successAmount = document.getElementById("successAmount")

  if (successAmount) {
    successAmount.textContent = `₹${selectedAmount.toLocaleString()}`
  }

  modal.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeSuccessModal() {
  const modal = document.getElementById("successModal")
  modal.classList.remove("active")
  document.body.style.overflow = "auto"
}

function resetForm() {
  const form = document.getElementById("donationForm")
  if (form) {
    form.reset()
  }

  // Reset amount selection
  document.querySelectorAll(".amount-btn").forEach((btn) => {
    btn.classList.remove("active")
  })

  const defaultBtn = document.querySelector('[data-amount="500"]')
  if (defaultBtn) {
    defaultBtn.classList.add("active")
  }

  // Hide custom amount input
  const customWrapper = document.getElementById("customAmountWrapper")
  if (customWrapper) {
    customWrapper.style.display = "none"
  }

  // Reset variables
  selectedAmount = 500
  isCustomAmount = false
  updateSelectedAmount(500)
}

// Close modal on escape key or overlay click
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSuccessModal()
  }
})

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    closeSuccessModal()
  }
})

// Add error styling
const style = document.createElement("style")
style.textContent = `
  .form-input.error {
    border-color: #dc2626;
    background-color: #fef2f2;
  }
  
  .error-message {
    color: #dc2626;
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
`
document.head.appendChild(style)
