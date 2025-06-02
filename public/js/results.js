// Sample answer key data
const examData = {
  examInfo: {
    name: "JEE Main 7 April 2025 (Shift II - Evening)",
    date: "April 7, 2025",
    shift: "Evening Shift (6:00 PM - 9:00 PM)",
    totalQuestions: 75,
    totalMarks: 300,
    rollNumber: "JEE24051234",
  }
}
// Global variables
let currentTab = "overall"
let showingAllQuestions = false
let currentQuestions = []

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  initializePage()
  setupEventListeners()
})

function initializePage() {
  updateTabContent()
  loadQuestions()
  updateBreakdownStats()
}

function setupEventListeners() {
  // Tab buttons
  const tabButtons = document.querySelectorAll(".tab-btn")
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tab = this.getAttribute("data-tab")
      switchTab(tab)
    })
  })

  // Show more button
  const showMoreBtn = document.getElementById("showMoreBtn")
  if (showMoreBtn) {
    showMoreBtn.addEventListener("click", toggleShowAllQuestions)
  }

  // Modal close
  const modalOverlay = document.getElementById("questionModal")
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        closeModal()
      }
    })
  }

  // Action buttons
  const downloadBtn = document.querySelector(".action-btn.primary")
  const emailBtn = document.querySelector(".action-btn.secondary")

  if (downloadBtn) {
    downloadBtn.addEventListener("click", downloadScoreCard)
  }

  if (emailBtn) {
    emailBtn.addEventListener("click", emailResults)
  }
}

function switchTab(tab) {
  currentTab = tab

  // Update tab buttons
  const tabButtons = document.querySelectorAll(".tab-btn")
  tabButtons.forEach((button) => {
    button.classList.remove("active")
    if (button.getAttribute("data-tab") === tab) {
      button.classList.add("active")
    }
  })

  // Update tab content
  const tabContents = document.querySelectorAll(".tab-content")
  tabContents.forEach((content) => {
    content.classList.remove("active")
    if (content.id === tab) {
      content.classList.add("active")
    }
  })

  // Update questions and stats
  loadQuestions()
  updateBreakdownStats()
}

function updateTabContent() {
  // This function can be used to update tab-specific content
  // Currently, the content is static in HTML
}

function loadQuestions() {
  const questionsTable = document.getElementById("questionsTable")
  if (!questionsTable) return

  // Filter questions based on current tab
  let filteredQuestions = examData.questions
  if (currentTab !== "overall") {
    filteredQuestions = examData.questions.filter((q) => q.subject.toLowerCase() === currentTab.toLowerCase())
  }

  currentQuestions = filteredQuestions

  // Determine how many questions to show
  const questionsToShow = showingAllQuestions ? filteredQuestions : filteredQuestions.slice(0, 10)

  // Clear existing rows
  questionsTable.innerHTML = ""

  // Add question rows
  questionsToShow.forEach((question) => {
    const row = createQuestionRow(question)
    questionsTable.appendChild(row)
  })

  // Update show more button
  updateShowMoreButton()
}

function createQuestionRow(question) {
  const row = document.createElement("tr")
  row.addEventListener("click", () => viewQuestion(question))

  row.innerHTML = `
        <td><strong>${question.id}</strong></td>
        <td><span class="badge ${question.subject.toLowerCase()}">${question.subject}</span></td>
        <td>${question.type}</td>
        <td>${question.question}</td>
        <td>${question.userAnswer ? `<span class="badge answer">${question.userAnswer}</span>` : '<span style="color: var(--color-slate-400)">Not Answered</span>'}</td>
        <td><span class="badge answer">${question.correctAnswer}</span></td>
        <td>${question.status}</td>
        <td>${getEvaluationBadge(question.evaluation)}</td>
    `

  return row
}

function getEvaluationBadge(evaluation) {
  if (evaluation === "✓") {
    return '<span class="badge correct">✓</span>'
  } else if (evaluation === "×") {
    return '<span class="badge incorrect">×</span>'
  } else {
    return '<span style="color: var(--color-slate-400)">—</span>'
  }
}

function updateShowMoreButton() {
  const showMoreBtn = document.getElementById("showMoreBtn")
  if (!showMoreBtn) return

  if (currentQuestions.length <= 10) {
    showMoreBtn.style.display = "none"
    return
  }

  showMoreBtn.style.display = "inline-flex"

  if (showingAllQuestions) {
    showMoreBtn.innerHTML = `
            Show Less
            <i class="fas fa-chevron-up"></i>
        `
    showMoreBtn.classList.add("expanded")
  } else {
    showMoreBtn.innerHTML = `
            Show All Questions
            <i class="fas fa-chevron-down"></i>
        `
    showMoreBtn.classList.remove("expanded")
  }
}

function toggleShowAllQuestions() {
  showingAllQuestions = !showingAllQuestions
  loadQuestions()
}

function updateBreakdownStats() {
  let correct, incorrect, unattempted

  if (currentTab === "overall") {
    correct = examData.questions.filter((q) => q.evaluation === "✓").length
    incorrect = examData.questions.filter((q) => q.evaluation === "×").length
    unattempted = examData.questions.filter((q) => q.evaluation === "—").length

    document.getElementById("correctCount").textContent = `${correct}/75`
    document.getElementById("incorrectCount").textContent = `${incorrect}/75`
    document.getElementById("unattemptedCount").textContent = `${unattempted}/75`

    // Update circular progress
    updateCircularProgress("correct-circle", (correct / 75) * 100)
    updateCircularProgress("incorrect-circle", (incorrect / 75) * 100)
    updateCircularProgress("unattempted-circle", (unattempted / 75) * 100)
  } else {
    const subjectQuestions = examData.questions.filter((q) => q.subject.toLowerCase() === currentTab.toLowerCase())

    correct = subjectQuestions.filter((q) => q.evaluation === "✓").length
    incorrect = subjectQuestions.filter((q) => q.evaluation === "×").length
    unattempted = subjectQuestions.filter((q) => q.evaluation === "—").length

    document.getElementById("correctCount").textContent = `${correct}/25`
    document.getElementById("incorrectCount").textContent = `${incorrect}/25`
    document.getElementById("unattemptedCount").textContent = `${unattempted}/25`

    // Update circular progress
    updateCircularProgress("correct-circle", (correct / 25) * 100)
    updateCircularProgress("incorrect-circle", (incorrect / 25) * 100)
    updateCircularProgress("unattempted-circle", (unattempted / 25) * 100)
  }
}

function updateCircularProgress(className, percentage) {
  const circle = document.querySelector(`.${className}`)
  if (circle) {
    circle.style.strokeDasharray = `${percentage}, 100`
  }
}

function viewQuestion(question) {
  const modal = document.getElementById("questionModal")
  const modalQuestionNumber = document.getElementById("modalQuestionNumber")
  const questionImage = document.getElementById("questionImage")
  const userAnswerValue = document.getElementById("userAnswerValue")
  const correctAnswerValue = document.getElementById("correctAnswerValue")
  const statusValue = document.getElementById("statusValue")
  const subjectValue = document.getElementById("subjectValue")

  modalQuestionNumber.textContent = question.id
  questionImage.src = `/placeholder.svg?height=300&width=500&text=Question+${question.id}+${question.subject}`
  questionImage.alt = `Question ${question.id}`
  userAnswerValue.textContent = question.userAnswer || "Not Answered"
  correctAnswerValue.textContent = question.correctAnswer
  statusValue.textContent = question.status
  subjectValue.textContent = question.subject

  // Update styling based on evaluation
  userAnswerValue.className = "answer-value"
  if (question.evaluation === "✓") {
    userAnswerValue.classList.add("correct")
  }

  modal.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeModal() {
  const modal = document.getElementById("questionModal")
  modal.classList.remove("active")
  document.body.style.overflow = "auto"
}

function downloadScoreCard() {
  // Simulate download functionality
  alert("Score card download will be implemented here")
}

function emailResults() {
  // Simulate email functionality
  alert("Email results functionality will be implemented here")
}

// Close modal on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal()
  }
})

// Mobile menu functionality (if needed)
function toggleMobileMenu() {
  // Implementation for mobile menu toggle
  console.log("Mobile menu toggle")
}