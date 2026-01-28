const OWNER_EMAIL = 'iraqacademy@mesopost.com';
const rootWindow = window.top || window;
const getFirebase = () => rootWindow.firebaseAuth || window.firebaseAuth || null;

const normalizeRole = (role) => {
    const value = String(role || '').toLowerCase();
    if (value === 'admin' || value === 'owner' || value === 'teacher' || value === 'student') {
        return value;
    }
    return 'student';
};

const buildFirebaseUserObject = (fbUser, roleOverride) => {
    if (!fbUser) return null;
    const email = fbUser.email || '';
    const role = email.toLowerCase() === OWNER_EMAIL ? 'owner' : normalizeRole(roleOverride);
    return {
        id: fbUser.uid,
        email,
        user_metadata: {
            full_name: fbUser.displayName || '',
            role
        },
        provider: (fbUser.providerData && fbUser.providerData[0]?.providerId) || 'password'
    };
};

const getAuthUser = () => {
    const firebase = getFirebase();
    const auth = firebase?.auth;
    if (!auth || !firebase?.onAuthStateChanged) {
        return Promise.resolve(null);
    }
    if (auth.currentUser) return Promise.resolve(auth.currentUser);
    return new Promise((resolve) => {
        const unsubscribe = firebase.onAuthStateChanged(auth, (user) => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
            resolve(user || null);
        });
    });
};

const buildAuthClient = () => ({
    auth: {
        async signUp({ email, password, options }) {
            const firebase = getFirebase();
            const auth = firebase?.auth;
            const { createUserWithEmailAndPassword, updateProfile } = firebase || {};
            if (!auth || !createUserWithEmailAndPassword) {
                return { data: null, error: { message: 'Authentication not configured.' } };
            }
            try {
                const cred = await createUserWithEmailAndPassword(auth, email, password);
                const fullName = options?.data?.full_name || '';
                if (fullName && updateProfile) {
                    await updateProfile(cred.user, { displayName: fullName });
                }
                const role = options?.data?.role;
                const user = buildFirebaseUserObject(cred.user, role);
                if (window.top?.iaStore && user) {
                    await window.top.iaStore.syncUser(user);
                }
                return { data: { user }, error: null };
            } catch (err) {
                return { data: null, error: { message: err?.message || 'Failed to sign up.' } };
            }
        },
        async signInWithPassword({ email, password }) {
            const firebase = getFirebase();
            const auth = firebase?.auth;
            const { signInWithEmailAndPassword } = firebase || {};
            if (!auth || !signInWithEmailAndPassword) {
                return { data: null, error: { message: 'Authentication not configured.' } };
            }
            try {
                const cred = await signInWithEmailAndPassword(auth, email, password);
                const user = buildFirebaseUserObject(cred.user);
                if (window.top?.iaStore && user) {
                    await window.top.iaStore.syncUser(user);
                }
                const session = { user };
                return { data: { session, user }, error: null };
            } catch (err) {
                return { data: null, error: { message: err?.message || 'Invalid login credentials.' } };
            }
        },
        async signIn({ email, password }) {
            return await this.signInWithPassword({ email, password });
        },
        async signInWithProvider({ provider }) {
            const firebase = getFirebase();
            const auth = firebase?.auth;
            const { signInWithPopup, googleProvider, microsoftProvider } = firebase || {};
            if (!auth || !signInWithPopup) {
                return { data: null, error: { message: 'Authentication not configured.' } };
            }
            try {
                let prov = null;
                if (provider === 'google') prov = googleProvider;
                if (provider === 'microsoft') prov = microsoftProvider;
                if (!prov) {
                    return { data: null, error: { message: 'Unsupported provider.' } };
                }
                const cred = await signInWithPopup(auth, prov);
                const user = buildFirebaseUserObject(cred.user);
                if (window.top?.iaStore && user) {
                    await window.top.iaStore.syncUser(user);
                }
                const session = { user };
                return { data: { session, user }, error: null };
            } catch (err) {
                return { data: null, error: { message: err?.message || 'Failed to sign in with provider.' } };
            }
        },
        async signOut() {
            const auth = getFirebase()?.auth;
            if (!auth) return { error: { message: 'Authentication not configured.' } };
            try {
                await auth.signOut();
                return { error: null };
            } catch (err) {
                return { error: { message: err?.message || 'Failed to sign out.' } };
            }
        },
        async getSession() {
            const fbUser = await getAuthUser();
            const user = buildFirebaseUserObject(fbUser);
            const session = user ? { user } : null;
            return { data: { session } };
        },
        async getUser() {
            const fbUser = await getAuthUser();
            const user = buildFirebaseUserObject(fbUser);
            return { data: { user } };
        }
    },
    metadata: {
        provider: 'firebase'
    }
});

if (window.top && window.top !== window && window.top.authClient) {
    window.authClient = window.top.authClient;
} else {
    window.authClient = buildAuthClient();
    if (window.top && window.top !== window) {
        window.top.authClient = window.authClient;
    }
}
window.authConfigError = '';

const firebase = getFirebase();
if (firebase?.onAuthStateChanged && firebase?.auth) {
    firebase.onAuthStateChanged(firebase.auth, async (fbUser) => {
        const user = buildFirebaseUserObject(fbUser);
        if (user && window.top?.iaStore) {
            await window.top.iaStore.syncUser(user);
        }
    });
}

async function signOut() {
    if (!window.authClient) return;
    const { error } = await window.authClient.auth.signOut();
    if (!error) {
        window.location.href = '/login';
    }
}
