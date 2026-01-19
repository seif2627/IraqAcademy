// Supabase Configuration
// When using the Netlify Supabase extension, these values are typically 
// provided via environment variables. For this demo, you can replace them
// with your project details from the Supabase dashboard.

const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other scripts
window.supabaseClient = supabase;

async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

async function getProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    return data;
}

async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        window.location.hash = '#/login';
        window.location.reload();
    }
}
