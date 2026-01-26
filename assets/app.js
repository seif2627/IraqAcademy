var mapping = {
  home: "pages/home.html",
  courses: "pages/courses.html",
  students: "pages/students.html",
  teachers: "pages/teachers.html",
  help: "pages/help.html",
  login: "pages/login.html",
  signup: "pages/signup.html",
  accounts: "pages/accounts.html",
  info: "pages/info.html",
  privacy: "pages/privacy.html",
  terms: "pages/terms.html"
};

var translations = {
  en: {
    nav_home: "Home",
    nav_courses: "Courses",
    nav_students: "Students",
    nav_teachers: "Teachers",
    nav_help: "Help",
    nav_accounts: "Manage Accounts",
    search_placeholder: "Search courses or teachers...",
    login: "Log In",
    signup: "Sign Up",
    footer_copyright: "© 2026 Iraq Academy. All rights reserved.",
    footer_tagline: "Excellence in Education",
    home_hero_title_1: "Build Your Future With",
    home_hero_subtitle: "World-class education from anywhere. Join thousands of students and learn with the best teachers in Iraq.",
    home_explore_btn: "Explore Courses",
    home_join_btn: "Join for Free",
    home_features_title: "Why Iraq Academy?",
    home_feature_1_title: "Expert Teachers",
    home_feature_1_desc: "Learn with professional teachers with deep experience in their fields.",
    home_feature_2_title: "Interactive Lessons",
    home_feature_2_desc: "High-quality video content and live interactive exercises.",
    home_feature_3_title: "Certified Progress",
    home_feature_3_desc: "Track your progress and earn certificates to boost your future.",
    home_cta_title: "Ready to Start Learning?",
    home_cta_subtitle: "Create your account now and get access to a library of free courses.",
    home_cta_btn: "Register Now",
    courses_title: "Available Courses",
    courses_subtitle: "Browse our wide range of specialized educational courses.",
    courses_cat_all: "All Categories",
    courses_cat_6: "6th Preparatory",
    courses_cat_3: "3rd Intermediate",
    courses_cat_langs: "Languages",
    courses_cat_other: "Other",
    course_available: "Available Now",
    course_type: "Training Course",
    course_1_title: "Free Course",
    course_1_subtitle: "6th Preparatory - Haider Kazem Al-Quraishi",
    course_2_title: "Experimental Course 2024",
    course_2_subtitle: "6th Preparatory - Haider Diwan",
    course_3_title: "Experimental Course",
    course_3_subtitle: "6th Preparatory - Professor Muhammad Al-Amri",
    students_title: "Student Directory",
    students_subtitle: "Manage and view all registered students.",
    students_add_btn: "Add New Student",
    students_th_student: "Student",
    students_th_email: "Email",
    students_th_courses: "Enrolled Courses",
    students_th_status: "Status",
    students_th_actions: "Actions",
    student_status_active: "Active",
    student_status_inactive: "Inactive",
    teachers_title: "Our Distinguished Faculty",
    teachers_subtitle: "An elite group of the best professors in Iraq with long educational experience to help you in your academic journey.",
    help_title: "Help Center",
    help_subtitle: "We are here to answer all your inquiries and ensure a smooth and enjoyable learning experience.",
    help_q1: "How do I activate my access code?",
    help_a1_p1: "Once you have your unique access code, follow these steps:",
    help_a1_li1: "Go to our Telegram bot.",
    help_a1_li2: "Paste the code into the chat.",
    help_a1_li3: "The code will be immediately linked to your registered account.",
    help_a1_li4: "You will be able to access all your course content directly.",
    help_q2: "Where can I find my purchased courses?",
    help_a2: "All your active courses are available in your student dashboard. Simply log in and go to 'My Courses' to see your progress and continue where you left off at any time.",
    help_q3: "Can I access the academy via phone?",
    help_a3: "Absolutely! The IraqAcademy platform is designed to work efficiently on all devices. Whether you are using a smartphone, tablet, or computer, you will get a seamless and integrated learning experience.",
    help_cta_title: "Still have questions?",
    help_cta_subtitle: "Our technical support team is always available to help you resolve any issue you encounter.",
    help_btn_email: "Contact us via Email",
    help_btn_chat: "Live Chat",
    help_back_home: "Back to Home"
  }
};

var currentLang = "en";
var frame = document.getElementById("pageFrame");
var navButtons = document.querySelectorAll('.nav-link[data-page], .nav-auth a[href^="#/"]');

function updateUI() {
  var elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(function(el) {
    var key = el.getAttribute("data-i18n");
    if (translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });

  var placeholders = document.querySelectorAll("[data-i18n-placeholder]");
  placeholders.forEach(function(el) {
    var key = el.getAttribute("data-i18n-placeholder");
    if (translations[currentLang][key]) {
      el.placeholder = translations[currentLang][key];
    }
  });
}

function setActiveNav(page) {
  navButtons.forEach(function (btn) {
    var btnPage = btn.getAttribute("data-page");
    if (!btnPage) {
      var href = btn.getAttribute("href");
      if (href) {
        btnPage = normalizePage(href.replace(/^#\/?/, ""));
      }
    }
    
    if (btnPage === page) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function normalizePage(page) {
  page = String(page || "").trim();
  page = page.replace(/^\/+/, "").replace(/\/+$/, "");
  page = page.split(/[/?#]/)[0];

  if (!mapping[page]) page = "home";
  return page;
}

function getPageFromUrl() {
  let page = location.pathname.substring(1);
  if (!page || page === "index.html") {
    page = location.hash.replace(/^#\/?/, "");
  }
  return normalizePage(page);
}

function loadIntoFrame(page) {
  page = normalizePage(page);
  
  if (page === "students" && !canAccessStudents()) {
    page = "home";
  }
  if (page === "accounts" && !canAccessAccounts()) {
    page = "home";
  }
  
  if (!mapping[page]) return;

  // Update active state in nav
  document.querySelectorAll(".nav-link").forEach(function (btn) {
    if (btn.getAttribute("data-page") === page) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  if (frame) {
    if (frame.getAttribute('data-loading') === '1') return;
    frame.setAttribute('data-loading', '1');
    frame.src = mapping[page];
    frame.onload = function () {
      frame.removeAttribute('data-loading');
    };
  }
}

function navigateTo(page) {
  page = normalizePage(page);
  if (location.pathname.substring(1) !== page) {
    history.pushState(null, "", "/" + page);
  }
  loadIntoFrame(page);
}

// Auth State Handling
async function checkAuthState() {
    if (!window.authClient) return;
    const { data: { session } } = await window.authClient.auth.getSession();
    const loginBtn = document.querySelector('.btn-login[data-i18n="login"]');
    const signupBtn = document.querySelector('.btn-signup[data-i18n="signup"]');
    const logoutBtn = document.getElementById('logoutBtn');
    const roleBadge = document.getElementById('roleBadge');

    if (session) {
        window.currentUserRole = session.user?.user_metadata?.role || 'student';
        if (roleBadge) {
          roleBadge.textContent = getRoleLabel(window.currentUserRole);
          roleBadge.style.display = 'inline-flex';
        }
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (logoutBtn) {
            logoutBtn.style.display = 'block';
            logoutBtn.onclick = async () => {
            await window.authClient.auth.signOut();
            navigateTo('login');
        };
        }
    } else {
        window.currentUserRole = 'student';
        if (roleBadge) roleBadge.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'block';
        if (signupBtn) signupBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

function canAccessStudents() {
  return window.currentUserRole === "admin" || window.currentUserRole === "owner";
}

function canAccessAccounts() {
  return window.currentUserRole === "owner";
}

function getRoleLabel(role) {
  if (role === "owner") return "Owner";
  if (role === "admin") return "Admin";
  if (role === "teacher") return "Teacher";
  return "Student";
}

function updateNavAccess() {
  var studentsBtn = document.querySelector('.nav-link[data-page="students"]');
  if (studentsBtn) {
    studentsBtn.style.display = canAccessStudents() ? 'inline-flex' : 'none';
  }
  var accountsBtn = document.querySelector('.nav-link[data-page="accounts"]');
  if (accountsBtn) {
    accountsBtn.style.display = canAccessAccounts() ? 'inline-flex' : 'none';
  }
}

// Event Listeners
navButtons.forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    var page = btn.getAttribute("data-page");
    if (!page) {
      // Try to get page from href
      var href = btn.getAttribute("href");
      if (href) {
        page = normalizePage(href.replace(/^\//, ""));
      }
    }
    
    if (page) {
      e.preventDefault();
      navigateTo(page);
    }
  });
});

window.addEventListener("popstate", function () {
  loadIntoFrame(getPageFromUrl());
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    updateUI();
    if (frame) {
      frame.style.visibility = 'hidden';
    }
    checkAuthState().then(() => {
      updateNavAccess();
      var initial = getPageFromUrl();
      // Ensure we have a valid initial page, default to home if empty/root
      if (!initial || initial === "") initial = "home";
      
      // Update URL if it was just /
      if (location.pathname === "/" || location.pathname === "/index.html") {
        history.replaceState(null, "", "/home");
      }
      
      loadIntoFrame(initial);
      
      if (frame) {
        frame.style.visibility = 'visible';
      }
    });
});
