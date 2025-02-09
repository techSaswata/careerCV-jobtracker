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

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Function to get first name from full name
function getFirstName(fullName) {
    return fullName ? fullName.split(' ')[0] : '';
}

// Check authentication state and update UI
firebase.auth().onAuthStateChanged((user) => {
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    
    if (user) {
        // Update username
        const fullName = user.displayName;
        const firstName = getFirstName(fullName);
        if (userNameElement) {
            userNameElement.textContent = `${firstName || 'User'}!`;
        }
        
        // Update email
        if (userEmailElement && user.email) {
            userEmailElement.textContent = user.email;
        }
    } else {
        if (userNameElement) {
            userNameElement.textContent = 'Guest!';
        }
        if (userEmailElement) {
            userEmailElement.textContent = 'Not signed in';
        }
    }
});

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Load saved applications from localStorage
function loadApplications() {
    console.log('Loading applications...'); // Debug log
    const applicationContainer = document.getElementById('applicationContainer');
    
    if (!applicationContainer) {
        console.error('Application container not found!');
        return;
    }

    let savedApplications;
    try {
        savedApplications = JSON.parse(localStorage.getItem('jobApplications')) || [];
        console.log('Loaded applications:', savedApplications); // Debug log
    } catch (error) {
        console.error('Error parsing saved applications:', error);
        savedApplications = [];
    }

    if (savedApplications.length === 0) {
        applicationContainer.innerHTML = `
            <div class="no-applications" style="justify-content:center; align-items:center; margin-left: 44%; width: 100%; margin-bottom: 60px; margin-top: 60px">
                <p>No applications yet. Start applying to jobs!</p>
            </div>
        `;
        return;
    }

    // Sort applications by date (newest first)
    savedApplications.sort((a, b) => {
        return new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0);
    });

    applicationContainer.innerHTML = '';
    savedApplications.forEach(jobData => {
        console.log('Creating card for job:', jobData); // Debug log
        const applicationCard = createApplicationCard(jobData);
        applicationContainer.appendChild(applicationCard);
        
        // Restore the application status
        updateCardStatus(applicationCard, jobData.status);
    });
}

function createApplicationCard(jobData) {
    console.log('Creating application card with data:', jobData); // Debug log
    const applicationCard = document.createElement('div');
    applicationCard.className = 'application-card';
    applicationCard.innerHTML = `
        <div class="application-info" style="margin-bottom: 30px">
            <h3>${jobData.title}</h3>
            <p>Domain: ${jobData.website_name || 'Not specified'}</p>
            <p>City: ${jobData.city || 'Not specified'}</p>
            <p>Applied: ${jobData.appliedDate ? formatDate(jobData.appliedDate) : 'Recently'}</p>
            <div style="display: flex; justify-content: space-between;">
                <button class="status-btn" data-url="${jobData.url}" style="width: 48%;">${getStatusButtonText(jobData.status)}</button>
                <button onclick="window.open('${jobData.url}', '_blank')" class="status-btn" style="width: 48%; background-color: #2196F3;">View Website</button>
            </div>
        </div>

        <div class="action-container">
            <!-- Questions will be added here -->
        </div>
    `;
    
    // Add status-specific styling
    if (jobData.status === 'offered') {
        applicationCard.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
    }
    
    return applicationCard;
}

function getStatusButtonText(status) {
    switch (status) {
        case 'applied':
            return 'Applied';
        case 'scheduled':
            return 'Interview Scheduled';
        case 'interviewed':
            return 'Interview Done';
        case 'offered':
            return 'Offer Received!';
        default:
            return 'Applied';
    }
}

function updateCardStatus(card, status) {
    console.log('Updating card status to:', status); // Debug log
    
    switch (status) {
        case 'applied':
            scheduleInterview(card)
            break;
        case 'scheduled':
            showInterviewQuestion(card);
            break;
        case 'interviewed':
            showOfferQuestion(card);
            break;
        case 'offered':
            showCelebration(card);
            break;
    }
}

function scheduleInterview(card) {
    const actionContainer = card.querySelector('.action-container');
    const questionContainer = document.createElement('div');
    questionContainer.className = 'question-container';
    questionContainer.innerHTML = `
        <p>Schedule your Interview Now!</p>
        <button class="yes-btn" onclick="handleScheduleClick(this)">Schedule</button>
    `;
    actionContainer.innerHTML = '';
    actionContainer.appendChild(questionContainer);
}

// function to handle the Schedule button click
function handleScheduleClick(button) {
    window.open("https://calendar.google.com/", '_blank');
    showInterviewQuestion(button);
}

function showInterviewQuestion(sourceElement) {
    const applicationCard = sourceElement.closest('.application-card');
    const actionContainer = applicationCard.querySelector('.action-container');
    const statusBtn = applicationCard.querySelector('.status-btn');
    
    // Update status to 'scheduled'
    statusBtn.textContent = 'Interview Scheduled';
    updateApplicationStatus(applicationCard, 'scheduled');

    const questionContainer = document.createElement('div');
    questionContainer.className = 'question-container';
    questionContainer.innerHTML = `
        <p>Have you completed the interview?</p>
        <button class="yes-btn" onclick="handleInterviewSuccess(this)">Yes</button>
    `;
    actionContainer.innerHTML = '';
    actionContainer.appendChild(questionContainer);
}

function showOfferQuestion(card) {
    const actionContainer = card.querySelector('.action-container');
    const questionContainer = document.createElement('div');
    questionContainer.className = 'question-container';
    questionContainer.innerHTML = `
        <p>Have you received your offer letter?</p>
        <button class="yes-btn" onclick="handleOfferSuccess(this)">Yes</button>
    `;
    actionContainer.innerHTML = '';
    actionContainer.appendChild(questionContainer);
}

function handleInterviewSuccess(yesButton) {
    const applicationCard = yesButton.closest('.application-card');
    const statusBtn = applicationCard.querySelector('.status-btn');
    statusBtn.textContent = 'Interview Done';
    
    updateApplicationStatus(applicationCard, 'interviewed');
    showOfferQuestion(applicationCard);
}

function handleOfferSuccess(yesButton) {
    const applicationCard = yesButton.closest('.application-card');
    updateApplicationStatus(applicationCard, 'offered');
    showCelebration(applicationCard);
}

function showCelebration(card) {
    card.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
    const actionContainer = card.querySelector('.action-container');
    const statusBtn = card.querySelector('.status-btn');
    statusBtn.textContent = 'Offer Received!';
    
    const celebrationContainer = document.createElement('div');
    celebrationContainer.className = 'celebration-container';
    celebrationContainer.innerHTML = `
        <div class="celebration-emoji"> </div>
        <div class="celebration-text">Congratulations!</div>
        <div class="celebration-emoji">🎊</div>
    `;
    
    actionContainer.innerHTML = '';
    actionContainer.appendChild(celebrationContainer);
}

function updateApplicationStatus(card, status) {
    console.log('Updating application status:', status); // Debug log
    
    const jobData = {
        title: card.querySelector('h3').textContent,
        website_name: card.querySelector('p').textContent.replace('Domain: ', ''),
        city: card.querySelectorAll('p')[1].textContent.replace('City: ', ''),
        url: card.querySelector('.status-btn').dataset.url,
        status: status,
        appliedDate: new Date().toISOString()
    };
    
    try {
        // Update localStorage
        let savedApplications = JSON.parse(localStorage.getItem('jobApplications')) || [];
        const index = savedApplications.findIndex(app => app.url === jobData.url);
        
        if (index !== -1) {
            savedApplications[index] = { ...savedApplications[index], status };
            localStorage.setItem('jobApplications', JSON.stringify(savedApplications));
            console.log('Updated applications in localStorage:', savedApplications); // Debug log
        } else {
            console.error('Application not found in localStorage');
        }
    } catch (error) {
        console.error('Error updating application status:', error);
    }
}

// Function to check localStorage content
function checkLocalStorage() {
    const savedApplications = localStorage.getItem('jobApplications');
    console.log('Raw localStorage data:', savedApplications);
    console.log('Parsed applications:', JSON.parse(savedApplications || '[]'));
}

// Add button to go back to job search
function addNavigationButtons() {
    const buttonContainer = document.getElementById("buttonContainer");
    if (!buttonContainer) {
        console.error("Button container not found! Button placement failed.");
        return;
    }

    buttonContainer.innerHTML = `
        <div style="text-align: center; margin-top: 5px; margin-bottom: 2px;">
            <button onclick="window.location.href='jobListings.html'" class="status-btn" style="max-width: 200px;">
                Back to Job Search
            </button>
        </div>
    `;
}


// Initialize page
document.addEventListener("DOMContentLoaded", () => {
    console.log("Page loaded, initializing...");
    checkLocalStorage();
    loadApplications();
    addNavigationButtons(); // Ensure the button appears before the footer
});
