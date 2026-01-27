const OWNER_EMAIL = 'iraqacademy@mesopost.com';

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
    const auth = window.firebaseAuth?.auth;
    if (!auth || !window.firebaseAuth?.onAuthStateChanged) {
        return Promise.resolve(null);
    }
    if (auth.currentUser) return Promise.resolve(auth.currentUser);
    return new Promise((resolve) => {
        const unsubscribe = window.firebaseAuth.onAuthStateChanged(auth, (user) => {
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
            const auth = window.firebaseAuth?.auth;
            const { createUserWithEmailAndPassword, updateProfile } = window.firebaseAuth || {};
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
            const auth = window.firebaseAuth?.auth;
            const { signInWithEmailAndPassword } = window.firebaseAuth || {};
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
            const auth = window.firebaseAuth?.auth;
            const { signInWithPopup, googleProvider, microsoftProvider } = window.firebaseAuth || {};
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
            const auth = window.firebaseAuth?.auth;
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

window.authClient = buildAuthClient();
window.authConfigError = '';

if (window.firebaseAuth?.onAuthStateChanged && window.firebaseAuth?.auth) {
    window.firebaseAuth.onAuthStateChanged(window.firebaseAuth.auth, async (fbUser) => {
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
