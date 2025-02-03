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

// Get form elements
const loginForm = document.getElementById('loginForm');
const googleSignInBtn = document.getElementById('googleSignIn');
const loadingOverlay = document.getElementById('loadingOverlay');

// Show/hide loading functions
function showLoading() {
    loadingOverlay.style.display = 'block';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// Email/Password Sign In
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showLoading(); // Show loading overlay
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fullName = document.getElementById('fullName').value;
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Update profile with full name
            return userCredential.user.updateProfile({
                displayName: fullName
            });
        })
        .then(() => {
            window.location.href = 'jobListings.html';
        })
        .catch((error) => {
            // If user already exists, try to sign in instead
            if (error.code === 'auth/email-already-in-use') {
                return firebase.auth().signInWithEmailAndPassword(email, password)
                    .then(() => {
                        window.location.href = 'jobListings.html';
                    })
                    .catch((signInError) => {
                        hideLoading(); // Hide loading on error
                        alert(signInError.message);
                    });
            }
            hideLoading(); // Hide loading on error
            alert(error.message);
        });
});

// Google Sign In
googleSignInBtn.addEventListener('click', () => {
    showLoading(); // Show loading overlay
    const provider = new firebase.auth.GoogleAuthProvider();
    
    firebase.auth().signInWithPopup(provider)
        .then(() => {
            window.location.href = 'jobListings.html';
        })
        .catch((error) => {
            hideLoading(); // Hide loading on error
            alert(error.message);
        });
});