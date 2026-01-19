var mapping = {
  home: "pages/home.html",
  courses: "pages/courses.html",
  students: "pages/students.html",
  teachers: "pages/teachers.html",
  help: "pages/help.html",
  login: "pages/login.html",
  signup: "pages/signup.html"
};

var translations = {
  en: {
    nav_home: "Home",
    nav_courses: "Courses",
    nav_students: "Students",
    nav_teachers: "Teachers",
    nav_help: "Help",
    search_placeholder: "Search courses, teachers...",
    login: "Login",
    signup: "Sign Up",
    footer_copyright: "© 2026 IraqAcademy. All rights reserved.",
    footer_tagline: "Educational Excellence for All",
    // Home Page
    home_hero_title_1: "Empower Your Future with",
    home_hero_subtitle: "Get world-class education from anywhere. Join thousands of students learning from the best teachers in Iraq.",
    home_explore_btn: "Explore Courses",
    home_join_btn: "Join for Free",
    home_features_title: "Why Choose IraqAcademy?",
    home_feature_1_title: "Expert Teachers",
    home_feature_1_desc: "Learn from experienced educators who are experts in their fields.",
    home_feature_2_title: "Interactive Lessons",
    home_feature_2_desc: "Engage with high-quality video content and real-time interactive exercises.",
    home_feature_3_title: "Certified Growth",
    home_feature_3_desc: "Track your progress and earn certificates to boost your career.",
    home_cta_title: "Ready to Start Learning?",
    home_cta_subtitle: "Create an account today and get access to our library of free courses.",
    home_cta_btn: "Register Now",
    // Courses Page
    courses_title: "Available Courses",
    courses_subtitle: "Browse our wide range of specialized educational courses.",
    courses_cat_all: "All Categories",
    courses_cat_6: "6th Grade",
    courses_cat_3: "3rd Intermediate",
    courses_cat_langs: "Languages",
    courses_cat_other: "Others",
    course_available: "Available Now",
    course_type: "Training Course",
    course_1_title: "Free Course",
    course_1_subtitle: "6th Grade - Haider Kadhim Al-Quraishi",
    course_2_title: "2024 Prep Course",
    course_2_subtitle: "6th Grade - Haider Diwan",
    course_3_title: "General Prep",
    course_3_subtitle: "6th Grade - Prof. Mohammed Al-Amiri",
    // Students Page
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
    // Teachers Page
    teachers_title: "Our Distinguished Teaching Staff",
    teachers_subtitle: "A group of the best teachers in Iraq with long educational experience to help you in your study journey.",
    teacher_1_name: "Medical Summits Academy",
    teacher_1_subject: "Medical Studies Teacher",
    teacher_1_desc: "Expert in teaching medical subjects with years of experience in Iraqi curricula.",
    teacher_2_name: "Eng. Ola Al-Saraf",
    teacher_2_subject: "Mathematics Teacher",
    teacher_2_desc: "Expert in teaching mathematics with years of experience in Iraqi curricula."
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

function getPageFromHash() {
  return normalizePage(location.hash.replace(/^#\/?/, ""));
}

function loadIntoFrame(page) {
  page = normalizePage(page);
  frame.src = mapping[page];
  setActiveNav(page);
}

function navigateTo(page) {
  page = normalizePage(page);
  var targetHash = "#/" + page;
  if (location.hash !== targetHash) {
    location.hash = targetHash;
    return;
  }
  loadIntoFrame(page);
}

// Auth State Handling
async function checkAuthState() {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    const loginBtn = document.querySelector('.btn-login[data-i18n="login"]');
    const signupBtn = document.querySelector('.btn-signup[data-i18n="signup"]');
    const logoutBtn = document.getElementById('logoutBtn');

    if (session) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (logoutBtn) {
            logoutBtn.style.display = 'block';
            logoutBtn.onclick = async () => {
                await window.supabaseClient.auth.signOut();
                window.location.reload();
            };
        }
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (signupBtn) signupBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

// Event Listeners
navButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    var page = btn.getAttribute("data-page");
    if (page) navigateTo(page);
  });
});

window.addEventListener("hashchange", function () {
  loadIntoFrame(getPageFromHash());
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    updateUI();
    checkAuthState();
    var initial = normalizePage(getPageFromHash());
    var targetHash = "#/" + initial;
    if (location.hash !== targetHash) {
        location.hash = targetHash;
    } else {
        loadIntoFrame(initial);
    }
});
