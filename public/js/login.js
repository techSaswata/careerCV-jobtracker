// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCUma6HrkeX6QRXN5av9zl0V3jSTrUsXss",
    authDomain: "careercv-b7da3.firebaseapp.com",
    projectId: "careercv-b7da3",
    storageBucket: "careercv-b7da3.firebasestorage.app",
    messagingSenderId: "695083891030",
    appId: "1:695083891030:web:035d39d436291946dd3ef7",
    measurementId: "G-M4LM6RP86V"
};

firebase.initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('loginForm');
    const googleSignInBtn = document.getElementById('googleSignIn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const wrapper = document.querySelector('.wrapper');
    const switchFormLink = document.getElementById('switchFormLink');

    // Show/hide loading functions
    function showLoading() {
        if (loadingOverlay) loadingOverlay.style.display = 'block';
    }

    function hideLoading() {
        if (loadingOverlay) loadingOverlay.style.display = 'none';
    }

    // Global toggle function accessible to onclick
    window.toggleForm = function(e) {
        if (e) e.preventDefault();
        if (wrapper) wrapper.classList.toggle('active');
    };

    // Attach toggle form event listener if link exists
    if (switchFormLink) {
        switchFormLink.addEventListener('click', window.toggleForm);
    }

    // Email/Password Sign Up/In
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const fullNameInput = document.getElementById('fullName');

            if (!emailInput || !passwordInput || !fullNameInput) {
                alert('Please ensure all form fields are present');
                return;
            }

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const fullName = fullNameInput.value.trim();

            if (!email || !password || !fullName) {
                alert('Please fill in all fields');
                return;
            }

            showLoading();
            
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    return userCredential.user.updateProfile({
                        displayName: fullName
                    });
                })
                .then(() => {
                    window.location.href = 'jobListings.html';
                })
                .catch((error) => {
                    if (error.code === 'auth/email-already-in-use') {
                        return firebase.auth().signInWithEmailAndPassword(email, password)
                            .then(() => {
                                window.location.href = 'jobListings.html';
                            })
                            .catch((signInError) => {
                                hideLoading();
                                alert(signInError.message);
                            });
                    }
                    hideLoading();
                    alert(error.message);
                });
        });
    }

    // Google Sign In
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', () => {
            showLoading();
            const provider = new firebase.auth.GoogleAuthProvider();
            
            firebase.auth().signInWithPopup(provider)
                .then(() => {
                    window.location.href = 'jobListings.html';
                })
                .catch((error) => {
                    hideLoading();
                    alert(error.message);
                });
        });
    }
});