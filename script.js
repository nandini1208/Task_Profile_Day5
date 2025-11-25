// script.js

// ===== CONTACT MANAGER CLASS WITH AUTHENTICATION =====
class ContactManager {
  constructor() {
    this.storageKey = "portfolio_contacts";
    this.adminPassword = "ABc@123";
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  // Authentication method
  authenticate(password) {
    return password === this.adminPassword;
  }

  // Save contact (no auth needed - anyone can send messages)
  saveContact(name, email, message) {
    const contacts = this.getContactsWithoutAuth();
    const newContact = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      timestamp: new Date().toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "unread",
    };

    contacts.push(newContact);
    localStorage.setItem(this.storageKey, JSON.stringify(contacts));
    return newContact;
  }

  // Get contacts WITHOUT authentication (for counting)
  getContactsWithoutAuth() {
    return JSON.parse(localStorage.getItem(this.storageKey) || "[]");
  }

  // Get contacts WITH authentication (for viewing details)
  getContactsWithAuth(password) {
    if (!this.authenticate(password)) {
      throw new Error("Authentication required");
    }
    return this.getContactsWithoutAuth();
  }

  getContactCount() {
    const contacts = this.getContactsWithoutAuth();
    return contacts.length;
  }

  getUnreadCount() {
    const contacts = this.getContactsWithoutAuth();
    return contacts.filter((contact) => contact.status === "unread").length;
  }

  // Admin only methods
  markAsRead(contactId, password) {
    if (!this.authenticate(password)) return;

    const contacts = this.getContactsWithoutAuth();
    const updatedContacts = contacts.map((contact) =>
      contact.id === contactId ? { ...contact, status: "read" } : contact
    );
    localStorage.setItem(this.storageKey, JSON.stringify(updatedContacts));
  }

  deleteContact(contactId, password) {
    if (!this.authenticate(password)) return;

    const contacts = this.getContactsWithoutAuth();
    const filteredContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );
    localStorage.setItem(this.storageKey, JSON.stringify(filteredContacts));
    return filteredContacts;
  }
}

// ===== INITIALIZE MANAGERS =====
const contactManager = new ContactManager();

function initializeContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (!contactForm) return;

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    if (!validateForm(name, email, message)) {
      return;
    }

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
      const response = await emailjs.send(
        "YOUR_ACTUAL_SERVICE_ID",
        "YOUR_ACTUAL_TEMPLATE_ID",
        {
          from_name: name,
          from_email: email,
          message: message,
          to_name: "Nandini",
        }
      );

      if (response.status === 200) {
        showMessage(
          "Message sent successfully! I will get back to you soon.",
          "success"
        );
        contactForm.reset();

        contactManager.saveContact(name, email, message);
        updateContactStats();
        updateNavCounter();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      showMessage(
        "Error sending message. Please try again or email me directly.",
        "error"
      );
      contactManager.saveContact(name, email, message);
      showMessage(
        "Message sent successfully! I will get back to you soon.",
        "success",
        "info"
      );
      updateContactStats();
      updateNavCounter();
      contactForm.reset();
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // Real-time validation
  const inputs = contactForm.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });

    input.addEventListener("input", function () {
      if (this.value.trim()) {
        this.style.borderColor = "#00ff88";
      }
    });
  });
}

function validateField(field) {
  const value = field.value.trim();

  if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      field.style.borderColor = "#ff4444";
    } else {
      field.style.borderColor = "#00ff88";
    }
  }
}

function validateForm(name, email, message) {
  if (!name.trim() || !email.trim() || !message.trim()) {
    showMessage("Please fill in all fields.", "error");
    return false;
  }

  if (name.trim().length < 2) {
    showMessage("Please enter a valid name.", "error");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage("Please enter a valid email address.", "error");
    return false;
  }

  if (message.trim().length < 10) {
    showMessage("Message should be at least 10 characters long.", "error");
    return false;
  }

  return true;
}

function showMessage(text, type) {
  const formMessage = document.getElementById("formMessage");
  if (!formMessage) return;

  formMessage.textContent = text;
  formMessage.className = `message ${type}`;

  if (type === "success") {
    setTimeout(() => {
      formMessage.textContent = "";
      formMessage.className = "";
    }, 5000);
  }
}

function updateContactStats() {
  const messageCount = document.getElementById("messageCount");
  if (messageCount) {
    messageCount.textContent = contactManager.getContactCount();
  }
}

function updateNavCounter() {
  const contactLink = document.querySelector('a[href="#contact"]');
  if (!contactLink) return;

  let counter = contactLink.querySelector(".contact-counter");
  const contactCount = contactManager.getContactCount();

  if (contactCount > 0) {
    if (!counter) {
      counter = document.createElement("span");
      counter.className = "contact-counter";
      contactLink.appendChild(counter);
    }
    counter.textContent = contactCount;

    setTimeout(() => {
      if (counter && counter.parentNode) {
        counter.remove();
      }
    }, 5000);
  } else if (counter) {
    counter.remove();
  }
}

function initializeEnhancedNavHighlight() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll('.navbar a[href^="#"]');

  function updateActiveNav() {
    let current = "";
    const scrollPosition = window.scrollY + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav);
  window.addEventListener("load", updateActiveNav);
}

function initializeEnhancedSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbarHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition = targetElement.offsetTop - navbarHeight - 20;

        smoothScrollTo(targetPosition, 800);
        history.pushState(null, null, targetId);
      }
    });
  });
}

function smoothScrollTo(targetPosition, duration) {
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

// Enhanced Mobile Menu Functionality
// ===== MOBILE MENU FUNCTIONALITY =====
function initializeMobileMenu() {
  const navToggle = document.querySelector(".nav-toggle");
  const navUl = document.querySelector(".navbar ul");

  if (!navToggle || !navUl) {
    console.warn("Mobile menu elements not found");
    return;
  }

  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";

    navToggle.setAttribute("aria-expanded", String(!isExpanded));
    navToggle.classList.toggle("open");
    navUl.classList.toggle("open");

    // Prevent body scroll when menu is open
    document.body.style.overflow = navUl.classList.contains("open")
      ? "hidden"
      : "";
  });

  // Close menu when clicking on links
  navUl.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navUl.contains(e.target) && !navToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navUl.classList.contains("open")) {
      closeMobileMenu();
    }
  });

  function closeMobileMenu() {
    navUl.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
}

// ===== SKILLS ANIMATION =====
function initializeSkillsAnimation() {
  const skillLevels = document.querySelectorAll(".skill-level");
  const skillPercents = document.querySelectorAll(".skill-percent");

  if (skillLevels.length === 0) return;

  let animated = false;

  function animateSkills() {
    skillLevels.forEach((level, index) => {
      const levelValue = level.getAttribute("data-level");
      const percentElement = skillPercents[index];

      if (!levelValue || !percentElement) return;

      const targetPercent = parseInt(levelValue);
      let currentPercent = 0;
      const duration = 1500;
      const increment = targetPercent / (duration / 16);

      const animate = () => {
        if (currentPercent < targetPercent) {
          currentPercent += increment;
          percentElement.textContent = Math.round(currentPercent) + "%";
          level.style.width = currentPercent + "%";
          requestAnimationFrame(animate);
        } else {
          percentElement.textContent = targetPercent + "%";
          level.style.width = levelValue;
        }
      };

      animate();
    });
  }

  function checkSkillsVisibility() {
    const skillsSection = document.getElementById("skills");
    if (!animated && skillsSection) {
      const sectionTop = skillsSection.getBoundingClientRect().top;
      if (sectionTop < window.innerHeight - 100) {
        animateSkills();
        animated = true;
        window.removeEventListener("scroll", checkSkillsVisibility);
      }
    }
  }

  window.addEventListener("scroll", checkSkillsVisibility);
  checkSkillsVisibility(); // Check on load
}

// ===== PROJECT FILTERING =====
function initializeProjectFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectItems = document.querySelectorAll(".project-item");

  if (filterBtns.length === 0 || projectItems.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      filterBtns.forEach((b) => b.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      const filter = this.getAttribute("data-filter");
      filterProjects(filter, projectItems);
    });
  });
}

function filterProjects(filter, projectItems) {
  projectItems.forEach((item) => {
    const tech = item.getAttribute("data-tech");
    const shouldShow = filter === "all" || (tech && tech.includes(filter));

    if (shouldShow) {
      item.style.display = "block";
      // Force reflow
      void item.offsetHeight;
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    } else {
      item.style.opacity = "0";
      item.style.transform = "translateY(20px)";
      setTimeout(() => {
        if (item.style.opacity === "0") {
          item.style.display = "none";
        }
      }, 300);
    }
  });
}

// ===== SCROLL TO TOP =====
function initializeScrollToTop() {
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  if (!scrollTopBtn) return;

  function toggleScrollButton() {
    if (window.pageYOffset > 200) {
      scrollTopBtn.style.display = "block";
    } else {
      scrollTopBtn.style.display = "none";
    }
  }

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("scroll", toggleScrollButton);
  toggleScrollButton();
}

// ===== SCROLL PROGRESS =====
function initializeScrollProgress() {
  // Check if already exists
  if (document.querySelector(".scroll-progress")) return;

  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.appendChild(progressBar);

  const updateProgress = () => {
    const windowHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
  };

  window.addEventListener("scroll", updateProgress);
  updateProgress(); // Initial call
}

// ===== PASSWORD PROTECTED MESSAGES VIEW =====
function initializeMessagesModal() {
  const viewMessagesBtn = document.getElementById("viewMessagesBtn");
  if (viewMessagesBtn) {
    viewMessagesBtn.addEventListener("click", function () {
      showPasswordModal();
    });
  }
}

function showPasswordModal() {
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  modalOverlay.innerHTML = `
    <div class="modal-content">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="color: #00ff88; margin: 0;">Admin Access</h3>
        <button id="closeModal" style="background: none; border: none; color: #fff; font-size: 20px; cursor: pointer; padding: 5px; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">×</button>
      </div>
      <p style="margin-bottom: 20px; color: #ccc;">Enter admin password to view messages</p>
      <input type="password" id="adminPassword" placeholder="Enter admin password" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; color: white; margin-bottom: 15px;" />
      <button id="submitPassword" class="btn" style="width: 100%;">View Messages</button>
      <div id="passwordMessage" style="margin-top: 15px;"></div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  // Close modal
  document.getElementById("closeModal").addEventListener("click", function () {
    document.body.removeChild(modalOverlay);
  });

  // Submit password
  document
    .getElementById("submitPassword")
    .addEventListener("click", function () {
      const password = document.getElementById("adminPassword").value;
      const passwordMessage = document.getElementById("passwordMessage");

      if (!password) {
        passwordMessage.textContent = "Please enter password!";
        passwordMessage.className = "message error";
        return;
      }

      try {
        const contacts = contactManager.getContactsWithAuth(password);
        document.body.removeChild(modalOverlay);

        if (contacts.length === 0) {
          showMessage("No messages received yet.", "info");
        } else {
          showMessagesModal(contacts, password);
        }
      } catch (error) {
        passwordMessage.textContent = "Incorrect password!";
        passwordMessage.className = "message error";
        document.getElementById("adminPassword").value = "";
        document.getElementById("adminPassword").focus();
      }
    });

  // Close on overlay click
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      document.body.removeChild(modalOverlay);
    }
  });

  // Enter key support
  document
    .getElementById("adminPassword")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        document.getElementById("submitPassword").click();
      }
    });
}

// Updated showMessagesModal function with admin controls
function showMessagesModal(contacts, password) {
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  modalContent.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h3 style="color: #00ff88; margin: 0;">Received Messages (${
        contacts.length
      })</h3>
      <button id="closeModal" style="background: none; border: none; color: #fff; font-size: 20px; cursor: pointer; padding: 5px; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">×</button>
    </div>
    <div style="margin-bottom: 15px; color: #ccc; font-size: 14px;">
      Unread: ${contactManager.getUnreadCount()} | Total: ${contactManager.getContactCount()}
    </div>
    <div id="messagesList"></div>
  `;

  const messagesList = modalContent.querySelector("#messagesList");

  contacts.reverse().forEach((contact) => {
    const messageItem = document.createElement("div");
    messageItem.className = `message-item ${
      contact.status === "unread" ? "unread" : ""
    }`;
    messageItem.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <div>
          <strong style="color: #00ff88;">${contact.name}</strong>
          ${
            contact.status === "unread"
              ? '<span style="background: #00ff88; color: #061222; padding: 2px 8px; border-radius: 10px; font-size: 12px; margin-left: 10px;">NEW</span>'
              : ""
          }
        </div>
        <small style="color: #888;">${contact.timestamp}</small>
      </div>
      <div style="color: #ccc; font-size: 14px; margin-bottom: 5px;">${
        contact.email
      }</div>
      <div style="color: #fff; margin-top: 10px; line-height: 1.5;">${
        contact.message
      }</div>
      <div style="margin-top: 10px; display: flex; gap: 10px;">
        ${
          contact.status === "unread"
            ? `<button class="mark-read-btn" data-id="${contact.id}">Mark Read</button>`
            : ""
        }
        <button class="delete-btn" data-id="${
          contact.id
        }" style="color: #ff6b6b;">Delete</button>
      </div>
    `;

    messagesList.appendChild(messageItem);
  });

  // Close modal
  modalContent
    .querySelector("#closeModal")
    .addEventListener("click", function () {
      document.body.removeChild(modalOverlay);
      updateContactStats();
    });

  // Mark as read functionality
  modalContent.querySelectorAll(".mark-read-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const contactId = parseInt(this.getAttribute("data-id"));
      contactManager.markAsRead(contactId, password);
      this.closest(".message-item").classList.remove("unread");
      this.remove();
      updateContactStats();
    });
  });

  // Delete functionality
  modalContent.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const contactId = parseInt(this.getAttribute("data-id"));
      contactManager.deleteContact(contactId, password);
      this.closest(".message-item").remove();
      updateContactStats();

      // Update modal title with new count
      const remainingContacts = contactManager.getContactsWithAuth(password);
      modalContent.querySelector(
        "h3"
      ).textContent = `Received Messages (${remainingContacts.length})`;
    });
  });

  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      document.body.removeChild(modalOverlay);
      updateContactStats();
    }
  });

  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
}

// ===== PAGE LOAD ANIMATIONS =====
function initializePageAnimations() {
  document.body.classList.add("loaded");

  const animatedElements = document.querySelectorAll(".fade-in");
  animatedElements.forEach((element, index) => {
    setTimeout(() => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }, index * 200);
  });
}

// ===== CIRCLE ICONS ANIMATION =====
function initializeCircleIcons() {
  document.querySelectorAll(".icon").forEach((icon) => {
    icon.addEventListener("mouseover", () => {
      icon.style.transform = "scale(1.1)";
      icon.style.boxShadow = "0 0 25px #00ff88";
    });
    icon.addEventListener("mouseout", () => {
      icon.style.transform = "scale(1)";
      icon.style.boxShadow = "0 0 15px rgba(0,255,136,0.4)";
    });
  });
}

function initializeTypingAnimation() {
  const dynamicWords = document.querySelector(".dynamic-words");
  if (!dynamicWords) return;

  const words = ["Software Developer", "Problem Solver", "Full Stack Engineer"];
  let currentIndex = 0;

  // Set initial word with fade class
  dynamicWords.innerHTML = `<span class="fade-in-word">${words[0]}</span>`;

  function rotateWords() {
    const currentSpan = dynamicWords.querySelector("span");

    // Add fade out effect
    currentSpan.classList.remove("fade-in-word");
    currentSpan.classList.add("fade-out-word");

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % words.length;
      currentSpan.textContent = words[currentIndex];

      // Add fade in effect
      currentSpan.classList.remove("fade-out-word");
      currentSpan.classList.add("fade-in-word");
    }, 500);
  }

  // Change word every 2.5 seconds
  setInterval(rotateWords, 2500);
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all components
  initializeTheme();
  initializeMobileMenu();
  initializeEnhancedNavHighlight();
  initializeEnhancedSmoothScroll();
  initializeContactForm();
  initializeMessagesModal();
  updateContactStats();
  initializeSkillsAnimation();
  initializeProjectFilter();
  initializeScrollToTop();
  initializeScrollProgress();
  initializePageAnimations();
  initializeCircleIcons();
  initializeTypingAnimation();

  console.log("Portfolio initialized successfully!");
});

// ===== ERROR HANDLING =====
window.addEventListener("error", function (e) {
  console.error("JavaScript Error:", e.error);
});

// Initialize contact counter
updateNavCounter();

// Initialize contact counter
updateNavCounter();

// ===== THEME TOGGLE FUNCTIONALITY =====
function initializeTheme() {
  // Create theme toggle button
  const themeToggle = document.createElement("button");
  themeToggle.id = "themeToggle";
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  themeToggle.setAttribute("aria-label", "Toggle theme");
  themeToggle.title = "Toggle dark/light mode";
  document.body.appendChild(themeToggle);

  // Check for saved theme or prefer-color-scheme
  const savedTheme = localStorage.getItem("portfolio-theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  // Set initial theme
  if (savedTheme === "light" || (!savedTheme && !systemPrefersDark)) {
    document.body.classList.add("light-mode");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");

    themeToggle.innerHTML = isLight
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';

    localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
  });

  // Add scroll behavior for dark mode button
  initializeThemeButtonScroll();
}

// ===== DARK MODE BUTTON SCROLL BEHAVIOR =====
function initializeThemeButtonScroll() {
  const themeToggle = document.getElementById("themeToggle");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  if (!themeToggle) return;

  function toggleScrollButtons() {
    const scrollPosition = window.pageYOffset;

    // Show/hide both buttons at the same time
    if (scrollPosition > 200) {
      themeToggle.classList.add("show");
      if (scrollTopBtn) {
        scrollTopBtn.style.display = "block";
      }
    } else {
      themeToggle.classList.remove("show");
      if (scrollTopBtn) {
        scrollTopBtn.style.display = "none";
      }
    }
  }

  window.addEventListener("scroll", toggleScrollButtons);
  toggleScrollButtons(); // Initial check
}

// ===== FIXED MOBILE MENU FUNCTIONALITY =====
function initializeMobileMenu() {
  const navToggle = document.querySelector(".nav-toggle");
  const navUl = document.querySelector(".navbar ul");

  if (!navToggle || !navUl) {
    console.warn("Mobile menu elements not found");
    return;
  }

  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";

    navToggle.setAttribute("aria-expanded", String(!isExpanded));
    navToggle.classList.toggle("open");
    navUl.classList.toggle("open");

    // Prevent body scroll when menu is open
    document.body.style.overflow = navUl.classList.contains("open")
      ? "hidden"
      : "";
  });

  // Close menu when clicking on links
  navUl.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navUl.contains(e.target) && !navToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navUl.classList.contains("open")) {
      closeMobileMenu();
    }
  });

  function closeMobileMenu() {
    navUl.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
}

// ===== NAVIGATION TOGGLE SCROLL BEHAVIOR =====
function initializeNavToggleScroll() {
  const navToggle = document.querySelector(".nav-toggle");

  if (!navToggle) return;

  function toggleNavButton() {
    const scrollPosition = window.pageYOffset;

    // Show nav toggle on scroll (for mobile)
    if (window.innerWidth <= 880 && scrollPosition > 100) {
      navToggle.classList.add("show");
    } else {
      navToggle.classList.remove("show");
    }
  }

  window.addEventListener("scroll", toggleNavButton);
  window.addEventListener("resize", toggleNavButton);
  toggleNavButton(); // Initial check
}
