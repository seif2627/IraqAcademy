const ENV = window.ENV || window.top?.ENV || {};
const CONVEX_URL = ENV.CONVEX_URL || ENV.PUBLIC_CONVEX_URL || '';
const USERS_KEY = 'ia_users';
const SESSION_KEY = 'ia_session';

const safeParse = (value, fallback) => {
    try {
        return JSON.parse(value);
    } catch (error) {
        return fallback;
    }
};

const loadUsers = () => safeParse(localStorage.getItem(USERS_KEY), []);
const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));
const loadSession = () => safeParse(localStorage.getItem(SESSION_KEY), null);
const saveSession = (session) => localStorage.setItem(SESSION_KEY, JSON.stringify(session));
const clearSession = () => localStorage.removeItem(SESSION_KEY);

const createId = () => {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `user_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const normalizeRole = (role) => {
    const value = String(role || '').toLowerCase();
    if (value === 'admin' || value === 'owner' || value === 'teacher' || value === 'student') {
        return value;
    }
    return 'student';
};

const buildAuthClient = () => ({
    auth: {
        async signUp({ email, password, options }) {
            const users = loadUsers();
            const existing = users.find((user) => user.email === email);
            if (existing) {
                return { data: null, error: { message: 'البريد الإلكتروني مستخدم مسبقًا.' } };
            }
            const user = {
                id: createId(),
                email,
                password,
                user_metadata: {
                    full_name: options?.data?.full_name || '',
                    role: normalizeRole(options?.data?.role)
                }
            };
            users.push(user);
            saveUsers(users);
            return { data: { user }, error: null };
        },
        async signInWithPassword({ email, password }) {
            const users = loadUsers();
            const user = users.find((item) => item.email === email);
            if (!user || user.password !== password) {
                return { data: null, error: { message: 'بيانات الدخول غير صحيحة.' } };
            }
            const session = { user };
            saveSession(session);
            return { data: { session, user }, error: null };
        },
        async signOut() {
            clearSession();
            return { error: null };
        },
        async getSession() {
            const session = loadSession();
            return { data: { session } };
        },
        async getUser() {
            const session = loadSession();
            return { data: { user: session?.user || null } };
        }
    },
    metadata: {
        provider: 'convex',
        convexUrl: CONVEX_URL
    }
});

let storageReady = true;
try {
    localStorage.setItem('__ia_test', '1');
    localStorage.removeItem('__ia_test');
} catch (error) {
    storageReady = false;
}

if (!storageReady) {
    window.authClient = null;
    window.authConfigError = 'التخزين المحلي غير متاح. تسجيل الدخول متوقف.';
} else {
    window.authClient = buildAuthClient();
    window.authConfigError = CONVEX_URL ? '' : 'لم يتم إعداد Convex بعد.';
}

async function getCurrentUser() {
    if (!window.authClient) return null;
    const { data: { user } } = await window.authClient.auth.getUser();
    return user;
}

async function getProfile(userId) {
    if (!window.authClient) return null;
    const users = loadUsers();
    return users.find((user) => user.id === userId) || null;
}

async function signOut() {
    if (!window.authClient) return;
    const { error } = await window.authClient.auth.signOut();
    if (!error) {
        window.location.hash = '#/login';
        window.location.reload();
    }
}
