var mapping = {
  home: "pages/home.html",
  courses: "pages/courses.html",
  students: "pages/students.html",
  teachers: "pages/teachers.html",
  help: "pages/help.html",
  login: "pages/login.html",
  signup: "pages/signup.html",
  accounts: "pages/accounts.html",
  info: "pages/info.html"
};

var translations = {
  ar: {
    nav_home: "الرئيسية",
    nav_courses: "الدورات",
    nav_students: "الطلاب",
    nav_teachers: "المعلمون",
    nav_help: "المساعدة",
    nav_accounts: "إدارة الحسابات",
    search_placeholder: "ابحث عن الدورات أو المعلمين...",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    footer_copyright: "© 2026 عراق أكاديمي. جميع الحقوق محفوظة.",
    footer_tagline: "تعليم متميز للجميع",
    home_hero_title_1: "اصنع مستقبلك مع",
    home_hero_subtitle: "تعليم عالمي من أي مكان. انضم لآلاف الطلاب وتعلّم مع أفضل المدرسين في العراق.",
    home_explore_btn: "استكشاف الدورات",
    home_join_btn: "انضم مجانًا",
    home_features_title: "لماذا عراق أكاديمي؟",
    home_feature_1_title: "مدرسون خبراء",
    home_feature_1_desc: "تعلم مع مدرسين محترفين بخبرة عميقة في تخصصاتهم.",
    home_feature_2_title: "دروس تفاعلية",
    home_feature_2_desc: "محتوى فيديو عالي الجودة وتمارين تفاعلية مباشرة.",
    home_feature_3_title: "تقدم معتمد",
    home_feature_3_desc: "تابع تقدمك واحصل على شهادات تعزز مستقبلك.",
    home_cta_title: "جاهز لتبدأ التعلم؟",
    home_cta_subtitle: "أنشئ حسابك الآن واحصل على مكتبة دورات مجانية.",
    home_cta_btn: "سجّل الآن",
    courses_title: "الدورات المتاحة",
    courses_subtitle: "تصفح مجموعتنا الواسعة من الدورات التعليمية المتخصصة.",
    courses_cat_all: "كل التصنيفات",
    courses_cat_6: "سادس إعدادي",
    courses_cat_3: "ثالث متوسط",
    courses_cat_langs: "لغات",
    courses_cat_other: "أخرى",
    course_available: "متاح الآن",
    course_type: "دورة تدريبية",
    course_1_title: "الدورة المجانية",
    course_1_subtitle: "سادس إعدادي - حيدر كاظم القريشي",
    course_2_title: "الدورة التجريبية 2024",
    course_2_subtitle: "سادس إعدادي - حيدر ديوان",
    course_3_title: "الدورة التجريبية",
    course_3_subtitle: "سادس إعدادي - الأستاذ محمد العامري",
    students_title: "دليل الطلاب",
    students_subtitle: "إدارة وعرض جميع الطلاب المسجلين.",
    students_add_btn: "إضافة طالب جديد",
    students_th_student: "الطالب",
    students_th_email: "البريد الإلكتروني",
    students_th_courses: "الدورات المسجلة",
    students_th_status: "الحالة",
    students_th_actions: "الإجراءات",
    student_status_active: "نشط",
    student_status_inactive: "غير نشط",
    teachers_title: "كادرنا التدريسي المتميز",
    teachers_subtitle: "نخبة من أفضل الأساتذة في العراق بخبرات تعليمية طويلة لمساعدتكم في رحلتكم الدراسية."
  }
};

var currentLang = "ar";
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
  if (role === "owner") return "مالك";
  if (role === "admin") return "مشرف";
  if (role === "teacher") return "مدرس";
  return "طالب";
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
    if (frame) {
      frame.style.visibility = 'hidden';
    }
    checkAuthState().then(() => {
      updateNavAccess();
      var initial = normalizePage(getPageFromHash());
      var targetHash = "#/" + initial;
      if (location.hash !== targetHash) {
          location.hash = targetHash;
      } else {
          loadIntoFrame(initial);
      }
      if (frame) {
        frame.style.visibility = 'visible';
      }
    });
});
