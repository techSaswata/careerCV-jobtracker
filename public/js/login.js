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
const authForm = document.getElementById('loginForm');
const googleSignInBtn = document.getElementById('googleSignIn');
const loadingOverlay = document.getElementById('loadingOverlay');
const wrapper = document.querySelector('.wrapper');
const switchFormLink = document.getElementById('switchFormLink');

// Show/hide loading functions
function showLoading() {
    loadingOverlay.style.display = 'block';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// Form Toggle Function
function toggleForm() {
    if (wrapper) {
        wrapper.classList.toggle('active');
    }
}

// Attach toggle form event listener
if (switchFormLink) {
    switchFormLink.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default link behavior
        toggleForm();
    });
}

// Email/Password Sign Up/In
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showLoading();
    
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
                        hideLoading();
                        alert(signInError.message);
                    });
            }
            hideLoading();
            alert(error.message);
        });
});

// Google Sign In
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