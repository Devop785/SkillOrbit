
const internships = [
  {
    id: 1, company: "Northstar Labs", initial: "N",
    role: "Frontend Developer Intern", category: "Full Stack",
    location: "Remote · India", duration: "8 weeks",
    stipend: "To be confirmed", status: "Featured",
    skills: ["HTML", "CSS", "JavaScript"],
    description: "Practise responsive UI development, accessible HTML, CSS layouts and JavaScript interactions."
  },
  {
    id: 2, company: "DataSpring Studio", initial: "D",
    role: "Data Science Intern", category: "Data Science",
    location: "Hybrid · Hyderabad", duration: "12 weeks",
    stipend: "Project-based", status: "Remote",
    skills: ["Python", "Pandas", "SQL"],
    description: "Explore data cleaning, exploratory data analysis and communicating insights through visualisations."
  },
  {
    id: 3, company: "PyWorks Collective", initial: "P",
    role: "Python Developer Intern", category: "Python",
    location: "Remote · India", duration: "10 weeks",
    stipend: "To be confirmed", status: "New",
    skills: ["Python", "APIs", "Git"],
    description: "Practise Python programming, API integration and writing maintainable code."
  },
  {
    id: 4, company: "NeuralNest", initial: "N",
    role: "Machine Learning Intern", category: "AI/ML",
    location: "Remote · India", duration: "12 weeks",
    stipend: "Project-based", status: "Popular",
    skills: ["Python", "Machine Learning", "NumPy"],
    description: "Learn data preparation, model evaluation and documenting machine learning experiments."
  },
  {
    id: 5, company: "Pixel & Pattern", initial: "P",
    role: "UI/UX Design Intern", category: "Design",
    location: "Remote · India", duration: "8 weeks",
    stipend: "To be confirmed", status: "Featured",
    skills: ["Figma", "Wireframes", "UI Design"],
    description: "Practise user flows, wireframes and designing clear, accessible digital experiences."
  },
  {
    id: 6, company: "WebFoundry", initial: "W",
    role: "Full Stack Developer Intern", category: "Full Stack",
    location: "Hybrid · Hyderabad", duration: "12 weeks",
    stipend: "To be confirmed", status: "New",
    skills: ["JavaScript", "Node.js", "SQL"],
    description: "Build full-stack features, connect REST APIs and practise testing and documentation."
  }
];

// These are fictional demonstration listings, not verified vacancies.
const grid = document.querySelector("#internship-grid");
const searchInput = document.querySelector("#search-input");
const resultsCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const savedToggle = document.querySelector("#saved-toggle");
const savedCount = document.querySelector("#saved-count");
const dialog = document.querySelector("#details-dialog");
const toast = document.querySelector("#toast");

let activeCategory = "All";
let savedIds = new Set();
let savedOnly = false;
let activeInternship = null;
let toastTimer;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2300);
}

function getFilteredInternships() {
  const query = searchInput.value.trim().toLowerCase();

  return internships.filter(item => {
    const searchable = [
      item.company,
      item.role,
      item.category,
      item.location,
      ...item.skills
    ].join(" ").toLowerCase();

    const matchesSearch = searchable.includes(query);

    const matchesCategory =
      activeCategory === "All" ||
      item.category === activeCategory ||
      item.skills.some(skill =>
        skill.toLowerCase() === activeCategory.toLowerCase()
      );

    const matchesSaved = !savedOnly || savedIds.has(item.id);

    return matchesSearch && matchesCategory && matchesSaved;
  });
}

function renderInternships() {
  const results = getFilteredInternships();

  resultsCount.textContent =
    `${results.length} of ${internships.length} sample opportunities`;

  grid.innerHTML = results.map(item => {
    const isSaved = savedIds.has(item.id);

    const pillClass = item.status === "Featured"
      ? "green"
      : item.status === "New"
        ? "amber"
        : "";

    return `
      <article class="internship-card">
        <div class="card-top">
          <span class="pill ${pillClass}">
            ${escapeHTML(item.status)}
          </span>

          <button
            class="save-button"
            type="button"
            data-save="${item.id}"
            aria-pressed="${isSaved}"
            aria-label="${isSaved ? "Unsave" : "Save"} ${escapeHTML(item.role)}">
            ${isSaved ? "♥" : "♡"}
          </button>
        </div>

        <div class="company-row">
          <span class="company-logo" aria-hidden="true">
            ${escapeHTML(item.initial)}
          </span>
          <div>
            <p class="company-name">${escapeHTML(item.company)}</p>
            <h3 class="role-title">${escapeHTML(item.role)}</h3>
          </div>
        </div>

        <p class="location">⌖ ${escapeHTML(item.location)}</p>

        <div class="tag-list">
          ${item.skills.map(skill =>
            `<span class="tag">${escapeHTML(skill)}</span>`
          ).join("")}
        </div>

        <div class="card-meta">
          <span>◷ ${escapeHTML(item.duration)}</span>
          <span>${escapeHTML(item.stipend)}</span>
        </div>

        <div class="card-actions">
          <button class="button button-outline"
            type="button" data-details="${item.id}">
            View details →
          </button>
        </div>
      </article>
    `;
  }).join("");

  grid.hidden = results.length === 0;
  emptyState.hidden = results.length !== 0;

  savedCount.textContent = savedIds.size;
  savedToggle.innerHTML =
    `${savedOnly ? "♥ Saved" : "♡ Saved"} <span id="saved-count">${savedIds.size}</span>`;
  savedToggle.setAttribute("aria-pressed", String(savedOnly));
}

function setCategory(category) {
  activeCategory = category;

  document.querySelectorAll("[data-category]").forEach(button => {
    const selected = button.dataset.category === category;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  renderInternships();
}

function toggleSaved(id) {
  if (savedIds.has(id)) {
    savedIds.delete(id);
    showToast("Removed from saved internships.");
  } else {
    savedIds.add(id);
    showToast("Internship saved.");
  }

  renderInternships();
  updateDialogSaveButton();
}

function openDetails(id) {
  activeInternship = internships.find(item => item.id === id);
  if (!activeInternship) return;

  document.querySelector("#dialog-title").textContent =
    activeInternship.role;

  document.querySelector("#dialog-company").textContent =
    `${activeInternship.company} · ${activeInternship.location}`;

  document.querySelector("#dialog-tags").innerHTML =
    activeInternship.skills.map(skill =>
      `<span class="tag">${escapeHTML(skill)}</span>`
    ).join("");

  document.querySelector("#dialog-description").textContent =
    activeInternship.description;

  document.querySelector("#dialog-meta").textContent =
    `Duration: ${activeInternship.duration} · Stipend: ${activeInternship.stipend}`;

  updateDialogSaveButton();
  dialog.showModal();
}

function updateDialogSaveButton() {
  if (!activeInternship) return;

  const button = document.querySelector("#dialog-save");
  const isSaved = savedIds.has(activeInternship.id);

  button.textContent = isSaved
    ? "♥ Saved — remove"
    : "♡ Save opportunity";

  button.setAttribute("aria-pressed", String(isSaved));
}

// Search
document.querySelector("#search-form").addEventListener("submit", event => {
  event.preventDefault();
  renderInternships();
  document.querySelector("#internships").scrollIntoView({
    behavior: "smooth"
  });
});

searchInput.addEventListener("input", renderInternships);

// Quick-search buttons
document.querySelectorAll("[data-quick-search]").forEach(button => {
  button.addEventListener("click", () => {
    searchInput.value = button.dataset.quickSearch;
    setCategory("All");
    document.querySelector("#internships").scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Category filters
document.querySelectorAll("[data-category]").forEach(button => {
  button.addEventListener("click", () => {
    setCategory(button.dataset.category);
  });
});

// Card actions
grid.addEventListener("click", event => {
  const saveButton = event.target.closest("[data-save]");
  const detailsButton = event.target.closest("[data-details]");

  if (saveButton) {
    toggleSaved(Number(saveButton.dataset.save));
  }

  if (detailsButton) {
    openDetails(Number(detailsButton.dataset.details));
  }
});

// Saved-only view
savedToggle.addEventListener("click", () => {
  savedOnly = !savedOnly;
  renderInternships();
});

// Reset filters
function clearFilters() {
  searchInput.value = "";
  savedOnly = false;
  setCategory("All");
  renderInternships();
}

document.querySelector("#clear-filters").addEventListener("click", clearFilters);
document.querySelector("#empty-clear").addEventListener("click", clearFilters);

// Dialog save button
document.querySelector("#dialog-save").addEventListener("click", () => {
  if (activeInternship) toggleSaved(activeInternship.id);
});

// Close dialog by clicking outside its panel
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

// Mobile navigation
const menuToggle = document.querySelector("#menu-toggle");
const nav = document.querySelector("#nav");

menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label",
    open ? "Close navigation" : "Open navigation");
});

nav.addEventListener("click", event => {
  if (event.target.closest("a")) {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

// Initial render
renderInternships();
