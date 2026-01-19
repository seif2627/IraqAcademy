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
  ar: {
    nav_home: "الرئيسية",
    nav_courses: "الدورات",
    nav_students: "الطلاب",
    nav_teachers: "الأساتذة",
    nav_help: "المساعدة",
    search_placeholder: "ابحث عن دورات، أساتذة...",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    cart_title: "عربة التسوق",
    cart_empty: "عربة التسوق فارغة",
    cart_checkout: "إتمام الشراء",
    cart_total: "المجموع الكلي",
    payment_title: "معلومات الدفع",
    payment_bank: "اسم المصرف",
    payment_owner: "اسم صاحب الحساب",
    payment_acc_no: "رقم الحساب",
    payment_iban: "رقم الآيبان",
    payment_swift: "السويفت",
    payment_currency: "العملة",
    add_to_cart: "إضافة إلى السلة",
    google_login: "تسجيل الدخول بواسطة Google",
    facebook_login: "تسجيل الدخول بواسطة Facebook",
    footer_copyright: "© 2026 IraqAcademy. جميع الحقوق محفوظة.",
    footer_tagline: "التميز التعليمي للجميع",
    lang_toggle: "English",
    // Home Page
    home_hero_title_1: "عزز مستقبلك مع",
    home_hero_subtitle: "احصل على تعليم عالمي المستوى من أي مكان. انضم إلى آلاف الطلاب الذين يتعلمون من أفضل الأساتذة في العراق.",
    home_explore_btn: "استكشف الدورات",
    home_join_btn: "انضم مجاناً",
    home_features_title: "لماذا تختار IraqAcademy؟",
    home_feature_1_title: "أفضل الأساتذة",
    home_feature_1_desc: "تعلم من مدرسين ذوي خبرة وخبراء في مجالاتهم المختلفة.",
    home_feature_2_title: "دروس تفاعلية",
    home_feature_2_desc: "تفاعل مع محتوى فيديو عالي الجودة وتمارين تفاعلية في الوقت الفعلي.",
    home_feature_3_title: "نمو موثق",
    home_feature_3_desc: "تتبع تقدمك واحصل على شهادات تعزز فرصك المهنية.",
    home_cta_title: "هل أنت مستعد لبدء التعلم؟",
    home_cta_subtitle: "أنشئ حساباً اليوم واحصل على إمكانية الوصول إلى مكتبتنا من الدورات المجانية.",
    home_cta_btn: "سجل الآن",
    // Courses Page
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
    course_2_title: "الدورة التجربية 2024",
    course_2_subtitle: "سادس إعدادي - حيدر ديوان",
    course_3_title: "الدورة التجربية",
    course_3_subtitle: "سادس إعدادي - الاستاذ محمد العامري",
    course_4_title: "الدورة التجربية 2024",
    course_4_subtitle: "سادس إعدادي - الأستاذ همام التميمي",
    course_5_title: "الدورة التجربية",
    course_5_subtitle: "سادس إعدادي - الاستاذ حيدر الحيدري",
    course_6_title: "الأعمال الإلكترونية",
    course_6_subtitle: "إدارة الأعمال",
    course_7_title: "الاول متوسط",
    course_7_subtitle: "الاول متوسط - الاستاذ عبدالوهاب عبدالكريم",
    course_8_title: "الرابع اعدادي",
    course_8_subtitle: "الرابع اعدادي - الاستاذ عبدالوهاب عبدالكريم",
    course_9_title: "الخامس اعدادي",
    course_9_subtitle: "الخامس اعدادي - الاستاذ عبدالوهاب عبدالكريم",
    course_10_title: "الدورة التجريبية 2025",
    course_10_subtitle: "سادس إعدادي - الاستاذ عمار فاضل",
    course_11_title: "الدورة التجربية",
    course_11_subtitle: "سادس إعدادي - غيداء الشمري",
    course_12_title: "الدورة المجانية",
    course_12_subtitle: "الهندسة المدني - محمد حسن",
    course_13_title: "الثالث متوسط 2025",
    course_13_subtitle: "ثالث متوسط",
    // Students Page
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
    // Teachers Page
    teachers_title: "كادرنا التدريسي المتميز",
    teachers_subtitle: "نخبة من أفضل الأساتذة في العراق بخبرات تعليمية طويلة لمساعدتكم في رحلتكم الدراسية.",
    teacher_1_name: "أكاديمية القمم الطبية",
    teacher_1_subject: "مدرس الدراسة الطبية",
    teacher_1_desc: "خبير في تدريس المواد الطبية مع سنوات طويلة من الخبرة في المناهج العراقية.",
    teacher_2_name: "المهندسة التدريسية علا الصراف",
    teacher_2_subject: "مدرس الرياضيات",
    teacher_2_desc: "خبير في تدريس الرياضيات مع سنوات طويلة من الخبرة في المناهج العراقية.",
    teacher_3_name: "اخلاص اكرم مهدي",
    teacher_3_subject: "مدرس اللغة الانكليزية",
    teacher_3_desc: "خبير في تدريس اللغة الإنجليزية مع سنوات طويلة من الخبرة في المناهج العراقية.",
    teacher_4_name: "الاستاذ محمد حسين",
    teacher_4_subject: "مدرس اللغة الانكليزية",
    teacher_4_desc: "خبير في تدريس اللغة الإنجليزية مع سنوات طويلة من الخبرة في المناهج العراقية.",
    teacher_5_name: "الاستاذ عبدالوهاب عبدالكريم",
    teacher_5_subject: "مدرس اللغة الفرنسية",
    teacher_5_desc: "خبير في تدريس اللغة الفرنسية مع سنوات طويلة من الخبرة في المناهج العراقية.",
    teacher_6_name: "علي فلاح الخاقاني",
    teacher_6_subject: "مدرس الفيزياء",
    teacher_6_desc: "خبير في تدريس مادة الفيزياء مع سنوات طويلة من الخبرة في المناهج العراقية.",
    teacher_7_name: "الأستاذ حيدر وليد",
    teacher_7_subject: "مدرس الرياضيات",
    teacher_7_desc: "خبير في تدريس مادة الرياضيات مع سنوات طويلة من الخبرة في المناهج العراقية.",
    teacher_8_name: "حسين حمزة",
    teacher_8_subject: "مدرس الكيمياء",
    teacher_8_desc: "خبير في تدريس مادة الكيمياء مع سنوات طويلة من الخبرة في المناهج العراقية.",
    teacher_9_name: "احمد فوزي",
    teacher_9_subject: "مدرس اللغة الانكليزية",
    teacher_9_desc: "خبير في تدريس مادة اللغة الانكليزية مع سنوات طويلة من الخبرة في المناهج العراقية.",
    teacher_10_name: "عصام الشمري",
    teacher_10_subject: "مدرس الفيزياء",
    teacher_10_desc: "خبير في تدريس مادة الفيزياء مع سنوات طويلة من الخبرة في المناهج العراقية.",
    teacher_11_name: "محمد حسن",
    teacher_11_subject: "مدرس الهندسة المدني",
    teacher_11_desc: "خبير في تدريس الهندسة المدنية مع سنوات طويلة من الخبرة في المناهج العراقية.",
    teacher_12_name: "وليد السبع",
    teacher_12_subject: "مدرس اللغة الانكليزية",
    teacher_12_desc: "خبير في تدريس مادة اللغة الانكليزية مع سنوات طويلة من الخبرة في المناهج العراقية.",
    teacher_13_name: "حيدر كاظم القريشي",
    teacher_13_subject: "مدرس اللغة الانكليزية",
    teacher_13_desc: "خبير في تدريس مادة اللغة الانكليزية مع سنوات طويلة من الخبرة في المناهج العراقية.",
    teacher_14_name: "فراس براق",
    teacher_14_subject: "مدرس الرياضيات",
    teacher_14_desc: "خبير في تدريس مادة الرياضيات مع سنوات طويلة من الخبرة في المناهج العراقية.",
    teacher_15_name: "الاستاذ محمد العنزي",
    teacher_15_subject: "مدرس الاحياء",
    teacher_15_desc: "خبير في تدريس مادة الاحياء مع سنوات طويلة من الخبرة في المناهج العراقية.",
    teacher_16_name: "الاستاذ فلاح الطائي",
    teacher_16_subject: "مدرس الفيزياء",
    teacher_16_desc: "خبير في تدريس مادة الفيزياء مع سنوات طويلة من الخبرة في المناهج العراقية.",
    teacher_17_name: "الأستاذ عمار السلامي",
    teacher_17_subject: "مدرس اللغة العربية",
    teacher_17_desc: "خبير في تدريس مادة اللغة العربية مع سنوات طويلة من الخبرة في المناهج العراقية.",
    teacher_18_name: "اشتر احمد",
    teacher_18_subject: "مدرس اللغة الانكليزية",
    teacher_18_desc: "خبير في تدريس مادة اللغة الانكليزية مع سنوات طويلة من الخبرة في المناهج العراقية.",
    teacher_19_name: "الاستاذ ادم ابراهيم",
    teacher_19_subject: "مدرس اللغة الانكليزية",
    teacher_19_desc: "خبير في تدريس مادة اللغة الانكليزية مع سنوات طويلة من الخبرة في المناهج العراقية.",
    teacher_20_name: "يوسف الجعفري",
    teacher_20_subject: "مدرس الرياضيات",
    teacher_20_desc: "خبير في تدريس مادة الرياضيات مع سنوات طويلة من الخبرة في المناهج العراقية.",
    // Help Page
    help_title: "مركز المساعدة",
    help_subtitle: "نحن هنا للإجابة على جميع استفساراتكم وضمان تجربة تعليمية سلسة وممتعة.",
    help_q1: "كيف أقوم بتفعيل كود الوصول الخاص بي؟",
    help_a1_p1: "بمجرد حصولك على كود الوصول الفريد الخاص بك، اتبع الخطوات التالية:",
    help_a1_li1: "توجه إلى بوت التلجرام الخاص بنا.",
    help_a1_li2: "قم بلصق الكود في الدردشة.",
    help_a1_li3: "سيتم ربط الكود فوراً بحسابك المسجل.",
    help_a1_li4: "ستتمكن من الوصول لجميع محتويات دورتك مباشرة.",
    help_q2: "أين يمكنني العثور على دوراتي المشتراة؟",
    help_a2: "جميع دوراتك النشطة متاحة في لوحة تحكم الطالب الخاصة بك. ببساطة قم بتسجيل الدخول وانتقل إلى \"دوراتي\" وستتمكن من رؤية تقدمك والمتابعة من حيث توقفت في أي وقت.",
    help_q3: "هل يمكنني الوصول إلى الأكاديمية عبر الهاتف؟",
    help_a3: "بالتأكيد! منصة IraqAcademy مصممة لتعمل بكفاءة عالية على جميع الأجهزة. سواء كنت تستخدم هاتفاً ذكياً، جهازاً لوحياً، أو حاسوباً، ستحصل على تجربة تعليمية متكاملة وسلسة.",
    help_cta_title: "ما زال لديك أسئلة؟",
    help_cta_subtitle: "فريق الدعم الفني متواجد دائماً لمساعدتك في حل أي مشكلة تواجهك.",
    help_btn_email: "تواصل معنا عبر البريد",
    help_btn_chat: "الدردشة المباشرة",
    help_back_home: "العودة للرئيسية",
    // Login & Signup
    login_title: "أهلاً بك مجدداً",
    login_subtitle: "سجل الدخول إلى حسابك في IraqAcademy",
    login_email: "البريد الإلكتروني",
    login_password: "كلمة المرور",
    login_forgot: "نسيت كلمة المرور؟",
    login_remember: "تذكرني",
    login_btn: "تسجيل الدخول",
    login_no_account: "ليس لديك حساب؟",
    login_signup_link: "أنشئ حساباً مجانياً",
    signup_title: "إنشاء حساب",
    signup_subtitle: "انضم إلى IraqAcademy وابدأ رحلتك التعليمية",
    signup_name: "الاسم الكامل",
    signup_confirm_password: "تأكيد كلمة المرور",
    signup_agree: "أوافق على",
    signup_and: "و",
    signup_terms: "شروط الخدمة",
    signup_privacy: "سياسة الخصوصية",
    signup_btn: "إنشاء حساب",
    signup_have_account: "لديك حساب بالفعل؟",
    signup_login_link: "سجل الدخول من هنا",
    placeholder_email: "name@example.com",
    placeholder_password: "••••••••",
    placeholder_name: "أحمد محمد",
    google: "Google",
    facebook: "Facebook",
    or_continue_with: "أو الاستمرار بواسطة",
    // Checkout Page
    checkout_title: "إتمام الطلب - أكاديمية العراق",
    checkout_heading: "إتمام الطلب والدفع",
    checkout_subheading: "يرجى تحويل المبلغ الإجمالي إلى حسابنا المصرفي وإرفاق صورة الوصل لإكمال عملية التفعيل.",
    bank_details_title: "تفاصيل المصرف (ADIB)",
    bank_details_subtitle: "مصرف أبوظبي الإسلامي - العراق",
    account_name: "اسم الحساب",
    account_number: "رقم الحساب",
    iban: "IBAN",
    upload_receipt_title: "تأكيد الدفع",
    full_name_label: "الاسم الكامل",
    phone_label: "رقم الهاتف",
    receipt_image_label: "صورة الوصل",
    upload_file: "ارفع ملفاً",
    drag_drop: "أو اسحب وأفلت هنا",
    confirm_order: "تأكيد الطلب",
    order_summary_title: "ملخص الطلب",
    subtotal: "المجموع الفرعي",
    fees: "رسوم المعالجة",
    total: "الإجمالي",
    activation_notice: "بعد تأكيد الطلب، سيتم مراجعة الوصل وتفعيل الدورات في حسابك خلال أقل من 24 ساعة."
  },
  en: {
    nav_home: "Home",
    nav_courses: "Courses",
    nav_students: "Students",
    nav_teachers: "Teachers",
    nav_help: "Help",
    search_placeholder: "Search for courses, teachers...",
    login: "Login",
    signup: "Sign Up",
    cart_title: "Shopping Cart",
    cart_empty: "Shopping cart is empty",
    cart_checkout: "Checkout",
    cart_total: "Total Amount",
    payment_title: "Payment Information",
    payment_bank: "Bank Name",
    payment_owner: "Account Owner",
    payment_acc_no: "Account Number",
    payment_iban: "IBAN",
    payment_swift: "Swift Code",
    payment_currency: "Currency",
    add_to_cart: "Add to Cart",
    google_login: "Login with Google",
    facebook_login: "Login with Facebook",
    footer_copyright: "© 2026 IraqAcademy. All rights reserved.",
    footer_tagline: "Educational Excellence for All",
    lang_toggle: "العربية",
    // Home Page
    home_hero_title_1: "Boost your future with",
    home_hero_subtitle: "Get world-class education from anywhere. Join thousands of students learning from the best teachers in Iraq.",
    home_explore_btn: "Explore Courses",
    home_join_btn: "Join for Free",
    home_features_title: "Why Choose IraqAcademy?",
    home_feature_1_title: "Best Teachers",
    home_feature_1_desc: "Learn from experienced teachers and experts in various fields.",
    home_feature_2_title: "Interactive Lessons",
    home_feature_2_desc: "Interact with high-quality video content and real-time interactive exercises.",
    home_feature_3_title: "Certified Growth",
    home_feature_3_desc: "Track your progress and get certificates that boost your career opportunities.",
    home_cta_title: "Ready to start learning?",
    home_cta_subtitle: "Create an account today and get access to our library of free courses.",
    home_cta_btn: "Sign Up Now",
    // Courses Page
    courses_title: "Available Courses",
    courses_subtitle: "Browse our wide range of specialized educational courses.",
    courses_cat_all: "All Categories",
    courses_cat_6: "6th Grade",
    courses_cat_3: "3rd Intermediate",
    courses_cat_langs: "Languages",
    courses_cat_other: "Other",
    course_available: "Available Now",
    course_type: "Training Course",
    course_1_title: "Free Course",
    course_1_subtitle: "6th Grade - Hayder Kadhim Al-Quraishi",
    course_2_title: "Trial Course 2024",
    course_2_subtitle: "6th Grade - Haidar Diwan",
    course_3_title: "Trial Course",
    course_3_subtitle: "6th Grade - Mr. Mohammed Al-Ameri",
    course_4_title: "Trial Course 2024",
    course_4_subtitle: "6th Grade - Mr. Humam Al-Tamimi",
    course_5_title: "Trial Course",
    course_5_subtitle: "6th Grade - Mr. Haidar Al-Haidari",
    course_6_title: "E-Business",
    course_6_subtitle: "Business Management",
    course_7_title: "1st Intermediate",
    course_7_subtitle: "1st Intermediate - Mr. Abdulwahab Abdulkareem",
    course_8_title: "4th Preparatory",
    course_8_subtitle: "4th Preparatory - Mr. Abdulwahab Abdulkareem",
    course_9_title: "5th Preparatory",
    course_9_subtitle: "5th Preparatory - Mr. Abdulwahab Abdulkareem",
    course_10_title: "Trial Course 2025",
    course_10_subtitle: "6th Grade - Mr. Ammar Fadel",
    course_11_title: "Trial Course",
    course_11_subtitle: "6th Grade - Ghaida Al-Shammari",
    course_12_title: "Free Course",
    course_12_subtitle: "Civil Engineering - Mohammed Hassan",
    course_13_title: "3rd Intermediate 2025",
    course_13_subtitle: "3rd Intermediate - Mr. Haider Walid",
    course_14_title: "Focused Review (Free)",
    course_14_subtitle: "6th Grade - Ikhlas Akram Mahdi",
    course_15_title: "English Course for 3rd Intermediate",
    course_15_subtitle: "3rd Intermediate - Ikhlas Akram Mahdi",
    course_16_title: "Trial Course 2025",
    course_16_subtitle: "6th Grade - Ikhlas Akram Mahdi",
    course_17_title: "6th Grade Trial Course",
    course_17_subtitle: "6th Grade - Mr. Abdul Wahab Abdul Karim",
    course_18_title: "Trial Lectures",
    course_18_subtitle: "6th Grade - Mr. Ahmed Al-Nuaimi",
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
    teachers_subtitle: "A selection of the best teachers in Iraq with long educational experience to help you in your academic journey.",
    teacher_1_name: "Medical Peaks Academy",
    teacher_1_subject: "Medical Studies Teacher",
    teacher_1_desc: "Expert in teaching medical subjects with many years of experience in the Iraqi curriculum.",
    teacher_2_name: "Eng. Ola Al-Sarraf",
    teacher_2_subject: "Mathematics Teacher",
    teacher_2_desc: "Expert in teaching mathematics with many years of experience in the Iraqi curriculum.",
    teacher_3_name: "Ikhlas Akram Mahdi",
    teacher_3_subject: "English Language Teacher",
    teacher_3_desc: "Expert in teaching English with many years of experience in the Iraqi curriculum.",
    teacher_4_name: "Mr. Mohammed Hussein",
    teacher_4_subject: "English Language Teacher",
    teacher_4_desc: "Expert in teaching English with many years of experience in the Iraqi curriculum.",
    teacher_5_name: "Mr. Abdulwahab Abdulkareem",
    teacher_5_subject: "French Language Teacher",
    teacher_5_desc: "Expert in teaching French with many years of experience in the Iraqi curriculum.",
    teacher_6_name: "Ali Fallah Al-Khaqani",
    teacher_6_subject: "Physics Teacher",
    teacher_6_desc: "Expert in teaching physics with many years of experience in the Iraqi curriculum.",
    teacher_7_name: "Mr. Haidar Waleed",
    teacher_7_subject: "Mathematics Teacher",
    teacher_7_desc: "Expert in teaching mathematics with many years of experience in the Iraqi curriculum.",
    teacher_8_name: "Hussein Hamza",
    teacher_8_subject: "Chemistry Teacher",
    teacher_8_desc: "Expert in teaching chemistry with many years of experience in the Iraqi curriculum.",
    teacher_9_name: "Ahmed Fawzi",
    teacher_9_subject: "English Language Teacher",
    teacher_9_desc: "Expert in teaching English with many years of experience in the Iraqi curriculum.",
    teacher_10_name: "Essam Al-Shammari",
    teacher_10_subject: "Physics Teacher",
    teacher_10_desc: "Expert in teaching physics with many years of experience in the Iraqi curriculum.",
    teacher_11_name: "Mohammed Hassan",
    teacher_11_subject: "Civil Engineering Teacher",
    teacher_11_desc: "Expert in teaching civil engineering with many years of experience in the Iraqi curriculum.",
    teacher_12_name: "Walid Al-Sabaa",
    teacher_12_subject: "English Language Teacher",
    teacher_12_desc: "Expert in teaching English with many years of experience in the Iraqi curriculum.",
    teacher_13_name: "Hayder Kadhim Al-Quraishi",
    teacher_13_subject: "English Language Teacher",
    teacher_13_desc: "Expert in teaching English with many years of experience in the Iraqi curriculum.",
    teacher_14_name: "Firas Buraq",
    teacher_14_subject: "Mathematics Teacher",
    teacher_14_desc: "Expert in teaching mathematics with many years of experience in the Iraqi curriculum.",
    teacher_15_name: "Mr. Mohammed Al-Anzi",
    teacher_15_subject: "Biology Teacher",
    teacher_15_desc: "Expert in teaching biology with many years of experience in the Iraqi curriculum.",
    teacher_16_name: "Mr. Fallah Al-Taie",
    teacher_16_subject: "Physics Teacher",
    teacher_16_desc: "Expert in teaching physics with many years of experience in the Iraqi curriculum.",
    teacher_17_name: "Mr. Ammar Al-Salami",
    teacher_17_subject: "Arabic Language Teacher",
    teacher_17_desc: "Expert in teaching Arabic with many years of experience in the Iraqi curriculum.",
    teacher_18_name: "Ashtar Ahmed",
    teacher_18_subject: "English Language Teacher",
    teacher_18_desc: "Expert in teaching English with many years of experience in the Iraqi curriculum.",
    teacher_19_name: "Mr. Adam Ibrahim",
    teacher_19_subject: "English Language Teacher",
    teacher_19_desc: "Expert in teaching English with many years of experience in the Iraqi curriculum.",
    teacher_20_name: "Youssef Al-Jaafari",
    teacher_20_subject: "Mathematics Teacher",
    teacher_20_desc: "Expert in teaching mathematics with many years of experience in the Iraqi curriculum.",
    // Help Page
    help_title: "Help Center",
    help_subtitle: "We are here to answer all your inquiries and ensure a smooth and enjoyable educational experience.",
    help_q1: "How do I activate my access code?",
    help_a1_p1: "Once you have your unique access code, follow these steps:",
    help_a1_li1: "Go to our Telegram bot.",
    help_a1_li2: "Paste the code in the chat.",
    help_a1_li3: "The code will be immediately linked to your registered account.",
    help_a1_li4: "You will be able to access all your course content directly.",
    help_q2: "Where can I find my purchased courses?",
    help_a2: "All your active courses are available in your student dashboard. Simply log in and go to \"My Courses\" and you will be able to see your progress and continue where you left off at any time.",
    help_q3: "Can I access the academy via phone?",
    help_a3: "Certainly! IraqAcademy platform is designed to work efficiently on all devices. Whether you are using a smartphone, tablet, or computer, you will get a complete and smooth educational experience.",
    help_cta_title: "Still have questions?",
    help_cta_subtitle: "Our technical support team is always available to help you solve any problem you face.",
    help_btn_email: "Contact us via Email",
    help_btn_chat: "Live Chat",
    help_back_home: "Back to Home",
    // Login & Signup
    login_title: "Welcome Back",
    login_subtitle: "Log in to your IraqAcademy account",
    login_email: "Email Address",
    login_password: "Password",
    login_forgot: "Forgot Password?",
    login_remember: "Remember me",
    login_btn: "Log In",
    login_no_account: "Don't have an account?",
    login_signup_link: "Create a free account",
    signup_title: "Create Account",
    signup_subtitle: "Join IraqAcademy and start your educational journey",
    signup_name: "Full Name",
    signup_confirm_password: "Confirm Password",
    signup_agree: "I agree to the",
    signup_and: "and",
    signup_terms: "Terms of Service",
    signup_privacy: "Privacy Policy",
    signup_btn: "Create Account",
    signup_have_account: "Already have an account?",
    signup_login_link: "Log in from here",
    placeholder_email: "name@example.com",
    placeholder_password: "••••••••",
    placeholder_name: "Ahmed Mohammed",
    // Checkout Page
    checkout_title: "Checkout - IraqAcademy",
    checkout_heading: "Checkout and Payment",
    checkout_subheading: "Please transfer the total amount to our bank account and attach the receipt image to complete the activation process.",
    bank_details_title: "Bank Details (ADIB)",
    bank_details_subtitle: "Abu Dhabi Islamic Bank - Iraq",
    account_name: "Account Name",
    account_number: "Account Number",
    iban: "IBAN",
    upload_receipt_title: "Payment Confirmation",
    full_name_label: "Full Name",
    phone_label: "Phone Number",
    receipt_image_label: "Receipt Image",
    upload_file: "Upload a file",
    drag_drop: "or drag and drop here",
    confirm_order: "Confirm Order",
    order_summary_title: "Order Summary",
    subtotal: "Subtotal",
    fees: "Processing Fees",
    total: "Total",
    activation_notice: "After confirming the order, the receipt will be reviewed and courses will be activated in your account within less than 24 hours."
  }
};

// Cart Logic
var cart = {
  items: JSON.parse(localStorage.getItem("cart") || "[]"),
  add: function(item) {
    this.items.push(item);
    this.save();
    this.updateUI();
  },
  remove: function(id) {
    this.items = this.items.filter(function(i) { return i.id !== id; });
    this.save();
    this.updateUI();
  },
  save: function() {
    localStorage.setItem("cart", JSON.stringify(this.items));
  },
  updateUI: function() {
    var countEl = document.getElementById("cartCount");
    if (countEl) {
      countEl.textContent = this.items.length;
    }
  },
  clear: function() {
    this.items = [];
    this.save();
    this.updateUI();
  }
};

// Handle messages from iframe
window.addEventListener("message", function(event) {
  if (event.data.type === "ADD_TO_CART") {
    cart.add(event.data.item);
  } else if (event.data.type === "GET_CART") {
    frame.contentWindow.postMessage({ type: "CART_DATA", items: cart.items }, "*");
  } else if (event.data.type === "CLEAR_CART") {
    cart.clear();
  } else if (event.data.type === "AUTH_SUCCESS") {
    // Handle successful authentication from iframe
    console.log("Authenticated user:", event.data.user);
    // You could update UI here, e.g., show user profile or hide login buttons
    // For now, we'll just store the user session info if needed
    localStorage.setItem("ia-user", JSON.stringify(event.data.user));
  }
});

var currentLang = localStorage.getItem("ia-lang") || "ar";

function applyTranslations(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  
  // Translate shell elements
  var elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(function(el) {
    var key = el.getAttribute("data-i18n");
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  var placeholders = document.querySelectorAll("[data-i18n-placeholder]");
  placeholders.forEach(function(el) {
    var key = el.getAttribute("data-i18n-placeholder");
    if (translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  var langLabel = document.getElementById("langLabel");
  if (langLabel) {
    langLabel.textContent = translations[lang].lang_toggle;
  }

  // Update iframe language, direction, and translate content
  if (frame && frame.contentDocument && frame.contentDocument.documentElement) {
    try {
      var iframeDoc = frame.contentDocument;
      iframeDoc.documentElement.lang = lang;
      iframeDoc.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      
      // Translate elements inside iframe
      var iframeElements = iframeDoc.querySelectorAll("[data-i18n]");
      iframeElements.forEach(function(el) {
        var key = el.getAttribute("data-i18n");
        if (translations[lang][key]) {
          el.textContent = translations[lang][key];
        }
      });
      
      var iframePlaceholders = iframeDoc.querySelectorAll("[data-i18n-placeholder]");
      iframePlaceholders.forEach(function(el) {
        var key = el.getAttribute("data-i18n-placeholder");
        if (translations[lang][key]) {
          el.placeholder = translations[lang][key];
        }
      });
    } catch (e) {
      // Cross-origin or other iframe issues
    }
  }
}

var frame = document.getElementById("pageFrame");
var navButtons = Array.prototype.slice.call(
  document.querySelectorAll('.nav-link[data-page], .nav-auth a[href^="#/"]')
);
var searchInput = document.querySelector(".nav-search-input");
var langToggle = document.getElementById("langToggle");

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
  
  // Wait for iframe to load before applying translations
  frame.onload = function() {
    applyTranslations(currentLang);
  };
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

function performSearch(query) {
  if (!query) {
    return;
  }
  if (!frame || !frame.contentWindow) {
    return;
  }
  var targetWindow = frame.contentWindow;
  try {
    targetWindow.getSelection().removeAllRanges();
    if (typeof targetWindow.find === "function") {
      var found = targetWindow.find(query, false, false, true, false, false, false);
      if (!found) {
        targetWindow.find(query, false, false, true, false, false, true);
      }
    }
  } catch (e) {}
}

if (searchInput) {
  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch(searchInput.value.trim());
    }
  });
}

if (langToggle) {
  langToggle.addEventListener("click", function() {
    currentLang = currentLang === "ar" ? "en" : "ar";
    localStorage.setItem("ia-lang", currentLang);
    applyTranslations(currentLang);
  });
}

navButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    var page = btn.getAttribute("data-page");
    navigateTo(page);
  });
});

window.addEventListener("hashchange", function () {
  loadIntoFrame(getPageFromHash());
});

(function init() {
  applyTranslations(currentLang);
  var initial = normalizePage(getPageFromHash());
  var targetHash = "#/" + initial;
  if (location.hash !== targetHash) {
    location.hash = targetHash;
  } else {
    loadIntoFrame(initial);
  }
})();
