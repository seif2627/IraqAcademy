var mapping = {
  home: "pages/home.html",
  courses: "pages/courses.html",
  students: "pages/students.html",
  teachers: "pages/teachers.html",
  help: "pages/help.html",
  login: "pages/login.html",
  signup: "pages/signup.html",
  enrollments: "pages/enrollments.html",
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
var pageLoader = document.getElementById("pageLoader");
var loaderTimer = null;
var searchInput = document.querySelector(".nav-search-input");
var searchIcon = document.querySelector(".nav-search-icon");

function showPageLoader() {
  if (!pageLoader) return;
  if (loaderTimer) clearTimeout(loaderTimer);
  pageLoader.classList.add("is-visible");
  pageLoader.setAttribute("aria-hidden", "false");
}

function hidePageLoader() {
  if (!pageLoader) return;
  if (loaderTimer) clearTimeout(loaderTimer);
  pageLoader.classList.remove("is-visible");
  pageLoader.setAttribute("aria-hidden", "true");
}

function setAuthNotice(message, tone) {
  try {
    sessionStorage.setItem("iaAuthNotice", JSON.stringify({
      message: message || "",
      tone: tone || "info",
      ts: Date.now()
    }));
  } catch (error) {
    // ignore storage failures
  }
}

function getRoleLandingPage(role) {
  if (role === "teacher") return "teachers";
  if (role === "admin" || role === "owner") return "accounts";
  return "students";
}

function getInitials(name, email) {
  var source = String(name || "").trim();
  if (!source && email) {
    source = String(email).split("@")[0] || "";
  }
  if (!source) return "U";
  var parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

async function resolveUserRole(session) {
  var role = session?.user?.user_metadata?.role || "student";
  var convex = window.convexClient || window.top?.convexClient;
  if (!convex || !session?.user?.id) return role;
  try {
    var user = await convex.query("users:getByUserId", { userId: session.user.id });
    if (user?.role) {
      return user.role;
    }
  } catch (error) {
    return role;
  }
  return role;
}

function isProfileComplete(profile) {
  if (!profile) return false;
  var fullName = String(profile.fullName || "").trim();
  var nameParts = fullName.split(/\s+/).filter(Boolean);
  if (nameParts.length < 3) return false;
  if (!String(profile.phone || "").trim()) return false;
  if (!String(profile.birthDate || "").trim()) return false;
  if (!String(profile.idNumber || "").trim()) return false;
  if (!String(profile.address || "").trim()) return false;
  if (!String(profile.city || "").trim()) return false;
  if (!String(profile.governorate || "").trim()) return false;
  return true;
}

async function needsOnboarding(session) {
  var convex = window.convexClient || window.top?.convexClient;
  if (!session?.user?.id) return false;
  try {
    if (window.top?.iaAuthReady) {
      try {
        await window.top.iaAuthReady;
      } catch (error) {
        // ignore auth readiness failures
      }
    }
    if (window.top?.iaConvexAuthReady) {
      try {
        await Promise.race([
          window.top.iaConvexAuthReady,
          new Promise((resolve) => setTimeout(resolve, 1500))
        ]);
      } catch (error) {
        // ignore convex auth readiness failures
      }
    }
    if (convex) {
      var profile = await convex.query("profiles:get", { userId: session.user.id });
      return !isProfileComplete(profile);
    }
    if (window.iaStore?.getProfile) {
      var localProfile = await window.iaStore.getProfile();
      return !isProfileComplete(localProfile);
    }
    return true;
  } catch (error) {
    if (window.iaStore?.getProfile) {
      try {
        var fallbackProfile = await window.iaStore.getProfile();
        return !isProfileComplete(fallbackProfile);
      } catch (innerError) {
        return true;
      }
    }
    return true;
  }
}

async function updateProfileAvatar(session) {
  var profileButton = document.getElementById("profileButton");
  var avatarImage = document.getElementById("profileAvatarImage");
  var avatarFallback = document.getElementById("profileAvatarFallback");
  if (!profileButton || !avatarFallback) return;
  if (!session) {
    profileButton.style.display = "none";
    if (avatarImage) avatarImage.style.display = "none";
    avatarFallback.style.display = "inline-flex";
    avatarFallback.innerHTML = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"w-4 h-4\"><path d=\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\"></path><circle cx=\"12\" cy=\"7\" r=\"4\"></circle></svg>";
    return;
  }
  profileButton.style.display = "inline-flex";
  avatarFallback.style.display = "inline-flex";
  avatarFallback.innerHTML = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"w-4 h-4\"><path d=\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\"></path><circle cx=\"12\" cy=\"7\" r=\"4\"></circle></svg>";
  if (avatarImage) {
    avatarImage.src = "";
    avatarImage.style.display = "none";
  }
}

function updateProfileMenu(session, role) {
  var menu = document.getElementById("profileMenu");
  if (!menu) return;
  var nameEl = document.getElementById("profileMenuName");
  var emailEl = document.getElementById("profileMenuEmail");
  if (!session) {
    menu.classList.add("hidden");
    menu.setAttribute("aria-hidden", "true");
    if (nameEl) nameEl.textContent = "Account";
    if (emailEl) emailEl.textContent = "";
    return;
  }
  var fullName = session.user?.user_metadata?.full_name || "";
  var email = session.user?.email || "";
  if (nameEl) nameEl.textContent = fullName || (getRoleLabel(role) + " Account");
  if (emailEl) emailEl.textContent = email || "";

  var items = menu.querySelectorAll(".profile-menu-item");
  items.forEach(function (item) {
    var roles = String(item.getAttribute("data-roles") || "all").toLowerCase();
    if (roles === "all") {
      item.style.display = "flex";
      return;
    }
    var allowed = roles.split(",").map(function (value) { return value.trim(); }).includes(String(role || "").toLowerCase());
    item.style.display = allowed ? "flex" : "none";
  });

  menu.querySelectorAll(".profile-menu-section").forEach(function (section) {
    var hasVisibleItems = Array.from(section.querySelectorAll(".profile-menu-item"))
      .some(function (item) { return item.style.display !== "none"; });
    section.style.display = hasVisibleItems ? "flex" : "none";
  });
}

async function cleanupOnboardingAccount() {
  var client = window.authClient;
  var convex = window.convexClient || window.top?.convexClient;
  if (!client) return;
  var sessionData = await client.auth.getSession();
  var session = sessionData?.data?.session || null;
  if (session?.user?.id && convex) {
    try {
      await convex.mutation("users:cleanupOnboarding", { userId: session.user.id });
    } catch (error) {
      // best-effort cleanup
    }
  }
  if (window.firebaseAuth?.auth?.currentUser && window.firebaseAuth?.deleteUser) {
    try {
      await window.firebaseAuth.deleteUser(window.firebaseAuth.auth.currentUser);
    } catch (error) {
      // ignore delete failures
    }
  }
  await client.auth.signOut();
}

function closeProfileMenu() {
  var menu = document.getElementById("profileMenu");
  var button = document.getElementById("profileButton");
  if (!menu) return;
  menu.classList.add("hidden");
  menu.setAttribute("aria-hidden", "true");
  if (button) button.setAttribute("aria-expanded", "false");
}

function toggleProfileMenu() {
  var menu = document.getElementById("profileMenu");
  var button = document.getElementById("profileButton");
  if (!menu || !button) return;
  var isHidden = menu.classList.contains("hidden");
  if (isHidden) {
    menu.classList.remove("hidden");
    menu.setAttribute("aria-hidden", "false");
    button.setAttribute("aria-expanded", "true");
  } else {
    closeProfileMenu();
  }
}

async function handleProfileMenuAction(action) {
  if (!action) return;
  if (window.onboardingRequired && action !== "settings" && action !== "logout") {
    navigateTo("info");
    return;
  }
  if (action === "profile") {
    navigateTo(getRoleLandingPage(window.currentUserRole || "student"));
    return;
  }
  if (action === "settings") {
    navigateTo("info");
    return;
  }
  if (action === "switch-account") {
    if (window.authClient) {
      await window.authClient.auth.signOut();
    }
    window.location.href = "/login";
    return;
  }
  if (action === "logout") {
    if (window.authClient) {
      await window.authClient.auth.signOut();
    }
    window.location.href = "/home";
    return;
  }
  if (action === "student-courses") {
    navigateTo("courses");
    return;
  }
  if (action === "student-enrollments") {
    navigateTo("enrollments");
    return;
  }
  if (action === "teacher-courses" || action === "teacher-management" || action === "teacher-profile") {
    navigateTo("teachers");
    return;
  }
  if (action === "admin-dashboard" || action === "admin-users") {
    navigateTo("accounts");
    return;
  }
  if (action === "admin-courses") {
    navigateTo("teachers");
    return;
  }
  if (action === "owner-settings") {
    navigateTo("accounts");
  }
}

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

function getSearchTermFromUrl() {
  var params = new URLSearchParams(window.location.search);
  return params.get("search") || "";
}

function syncSearchInput() {
  if (!searchInput) return;
  searchInput.value = getSearchTermFromUrl();
}

function runSearch(term) {
  if (window.onboardingRequired || window.emailVerificationRequired) {
    return;
  }
  term = String(term || "").trim();
  var page = getPageFromUrl();
  if (page !== "courses" && page !== "teachers") {
    page = "courses";
  }
  var params = new URLSearchParams();
  if (term) params.set("search", term);
  var url = "/" + page + (params.toString() ? "?" + params.toString() : "");
  history.pushState(null, "", url);
  syncSearchInput();
  loadIntoFrame(page);
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

  if (window.emailVerificationRequired && page !== "login") {
    page = "login";
    history.replaceState(null, "", "/login");
  }

  if (window.onboardingRequired && page !== "info") {
    page = "info";
    history.replaceState(null, "", "/info");
  }
  if (window.emailVerificationRequired || window.onboardingRequired) {
    setNavLocked(true);
  }

  if (window.isAuthenticated && (page === "login" || page === "signup")) {
    page = getRoleLandingPage(window.currentUserRole || "student");
  }
  if (page === "students" && !canAccessStudents()) {
    page = "home";
  }
  if (page === "accounts" && !canAccessAccounts()) {
    page = "home";
  }
  
  if (!mapping[page]) return;
  syncSearchInput();

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
    showPageLoader();
    // Add cache buster and preserve query params (e.g., checkout session_id)
    var params = new URLSearchParams(window.location.search);
    params.set("v", Date.now().toString());
    frame.src = mapping[page] + "?" + params.toString();
    frame.onload = function () {
      frame.removeAttribute('data-loading');
      hidePageLoader();
    };
    frame.onerror = function () {
      frame.removeAttribute('data-loading');
      hidePageLoader();
    };
  }
}

function navigateTo(page) {
  page = normalizePage(page);
  if (window.emailVerificationRequired && page !== "login") {
    page = "login";
  }
  if (window.onboardingRequired && page !== "info") {
    page = "info";
  }
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
    const roleBadge = document.getElementById('roleBadge');
    const profileButton = document.getElementById('profileButton');

    const firebaseUser = await getFirebaseUser();
    const needsVerification = requiresEmailVerification(firebaseUser);
    const isVerified = !needsVerification || firebaseUser?.emailVerified === true;

    if (session && needsVerification && !isVerified) {
        window.emailVerificationRequired = true;
        window.isAuthenticated = false;
        window.currentUserRole = 'student';
        window.onboardingRequired = false;
        if (roleBadge) roleBadge.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'block';
        if (signupBtn) signupBtn.style.display = 'block';
        if (profileButton) profileButton.style.display = 'none';
        await updateProfileAvatar(null);
        updateProfileMenu(null, "student");
        closeProfileMenu();
        setNavLocked(true);
        setAuthNotice("Please verify your email to finish setup, then sign in.", "info");
        if (window.authClient?.auth?.signOut) {
          await window.authClient.auth.signOut();
        }
        return;
    }

    window.emailVerificationRequired = false;

    if (session) {
        window.isAuthenticated = true;
        if (window.iaStore?.syncUser && session.user) {
          try {
            await window.iaStore.syncUser(session.user);
          } catch (error) {
            // ignore sync failures
          }
        }
        window.currentUserRole = await resolveUserRole(session);
        window.onboardingRequired = await needsOnboarding(session);
        if (roleBadge) {
          roleBadge.textContent = getRoleLabel(window.currentUserRole);
          roleBadge.style.display = 'inline-flex';
        }
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (profileButton) {
          profileButton.style.display = 'inline-flex';
          profileButton.onclick = (event) => {
            event.stopPropagation();
            toggleProfileMenu();
          };
        }
        await updateProfileAvatar(session);
        updateProfileMenu(session, window.currentUserRole);
        setNavLocked(window.onboardingRequired);
    } else {
        window.isAuthenticated = false;
        window.currentUserRole = 'student';
        window.onboardingRequired = false;
        window.emailVerificationRequired = false;
        if (roleBadge) roleBadge.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'block';
        if (signupBtn) signupBtn.style.display = 'block';
        if (profileButton) profileButton.style.display = 'none';
        await updateProfileAvatar(null);
        updateProfileMenu(null, "student");
        closeProfileMenu();
        setNavLocked(false);
    }
}

function canAccessStudents() {
  return window.isAuthenticated === true;
}

function canAccessAccounts() {
  return window.currentUserRole === "owner" || window.currentUserRole === "admin";
}

function getRoleLabel(role) {
  if (role === "owner") return "Owner";
  if (role === "admin") return "Admin";
  if (role === "teacher") return "Teacher";
  return "Student";
}

function requiresEmailVerification(user) {
  if (!user) return false;
  var providers = Array.isArray(user.providerData)
    ? user.providerData.map(function (entry) { return entry?.providerId; })
    : [];
  var hasPassword = providers.includes("password");
  var hasOAuth = providers.includes("google.com") || providers.includes("microsoft.com");
  return hasPassword && !hasOAuth;
}

async function getFirebaseUser() {
  var auth = window.firebaseAuth?.auth;
  if (!auth) return null;
  if (auth.currentUser) return auth.currentUser;
  if (!window.firebaseAuth?.onAuthStateChanged) return null;
  return new Promise((resolve) => {
    var settled = false;
    var timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve(auth.currentUser || null);
    }, 2000);
    var unsubscribe = window.firebaseAuth.onAuthStateChanged(auth, function (user) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (typeof unsubscribe === "function") unsubscribe();
      resolve(user || null);
    });
  });
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

function setNavLocked(isLocked) {
  navButtons.forEach(function (btn) {
    if (btn.tagName === "BUTTON") {
      btn.disabled = isLocked;
    } else {
      btn.setAttribute("aria-disabled", isLocked ? "true" : "false");
      btn.style.pointerEvents = isLocked ? "none" : "";
    }
    btn.style.opacity = isLocked ? "0.6" : "";
  });
  if (searchInput) {
    searchInput.disabled = isLocked;
    searchInput.style.opacity = isLocked ? "0.6" : "";
  }
  if (searchIcon) {
    searchIcon.style.pointerEvents = isLocked ? "none" : "";
    searchIcon.style.opacity = isLocked ? "0.6" : "";
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
  syncSearchInput();
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
      syncSearchInput();
      
      if (frame) {
        frame.style.visibility = 'visible';
      }
    });

    if (window.firebaseAuth?.onAuthStateChanged && window.firebaseAuth?.auth) {
      window.firebaseAuth.onAuthStateChanged(window.firebaseAuth.auth, async () => {
        await checkAuthState();
        updateNavAccess();
        loadIntoFrame(getPageFromUrl());
        syncSearchInput();
      });
    }

    if (searchInput) {
      searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          runSearch(searchInput.value);
        }
      });
    }
    if (searchIcon) {
      searchIcon.addEventListener("click", function () {
        if (!searchInput) return;
        runSearch(searchInput.value);
      });
    }

    const profileMenu = document.getElementById('profileMenu');
    if (profileMenu) {
      profileMenu.addEventListener('click', (event) => {
        event.stopPropagation();
        const item = event.target.closest('.profile-menu-item');
        if (!item) return;
        const action = item.getAttribute('data-action');
        closeProfileMenu();
        handleProfileMenuAction(action);
      });
    }

    document.addEventListener('click', () => {
      closeProfileMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeProfileMenu();
      }
    });
});

window.checkAuthState = checkAuthState;
