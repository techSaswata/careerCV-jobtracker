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
const signupForm = document.getElementById('signupForm');
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

// Login Form Handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showLoading();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = 'jobListings.html';
        })
        .catch((error) => {
            hideLoading();
            alert('Account with this Email does not exists, Please Proceed with Sign Up');
            toggleForm();
        });
});

// Signup Form Handler
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showLoading();
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const fullName = document.getElementById('signupUsername').value;
    
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
            hideLoading();
            alert('Account with this Email already Exists, Please proceed with Login');
            toggleForm();
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