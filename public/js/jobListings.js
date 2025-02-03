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
            userNameElement.textContent = `Welcome, ${firstName || 'User'}!`;
        }
        
        // Update email
        if (userEmailElement && user.email) {
            const emailText = user.email;
            const userInitial = firstName 
                ? firstName.charAt(0).toUpperCase() 
                : user.email.charAt(0).toUpperCase();
                
            userEmailElement.setAttribute('data-initial', userInitial);

            // Insert actual content inside the element for better fallback
            userEmailElement.innerHTML = `
                <span class="email-initial">${userInitial}</span> 
                <span class="email-text">${emailText}</span>
            `;

            // Debugging: Log output
            console.log('User Initial:', userInitial);
            console.log('data-initial attribute:', userEmailElement.getAttribute('data-initial'));
        }
    } else {
        if (userNameElement) {
            userNameElement.textContent = 'Welcome, guest!';
        }
        if (userEmailElement) {
            userEmailElement.innerHTML = '<span class="email-text">Not signed in</span>';
        }
    }
});




const apiKey = '42688eee6fba686b21d7cea2865b4c36677be8b830aaef7aeae6ce923fc548e5';
const jobContainer = document.getElementById('jobContainer');
const searchBar = document.getElementById('searchBar');

// Function to check if a job has already been applied to
function hasApplied(jobUrl) {
    const savedApplications = JSON.parse(localStorage.getItem('jobApplications')) || [];
    return savedApplications.some(app => app.url === jobUrl);
}

async function fetchJobs() {
    try {
        const response = await fetch('https://api.apijobs.dev/v1/job/search', {
            method: 'POST',
            headers: {
                'apikey': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ q: "fullstack" })
        });
        const data = await response.json();
        console.log('API Response:', data);
        if (data.hits) {
            displayJobs(shuffleArray(data.hits));
        } else {
            console.error('No jobs found in the response');
        }
    } catch (error) {
        console.error('Error fetching jobs:', error);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// In the displayJobs function, modify the button onclick to use encodeURIComponent:
function applyJob(jobUrl, button) {
    // Get the job card data
    const jobCard = button.closest('.job-card');
    const domain = jobCard.querySelector('p').textContent.replace('Domain: ', '');
    
    // If URL is null or invalid, construct domain URL
    let redirectUrl = jobUrl;
    if (!jobUrl || jobUrl === 'undefined') {
        redirectUrl = `https://${domain}`;
    }

    const jobData = {
        title: jobCard.querySelector('h3').textContent,
        website_name: domain,
        city: jobCard.querySelectorAll('p')[1].textContent.replace('City: ', ''),
        url: redirectUrl,
        status: 'applied',
        appliedDate: new Date().toISOString()
    };
    
    console.log('Saving job application:', jobData);
    
    // Save to localStorage
    let savedApplications = JSON.parse(localStorage.getItem('jobApplications')) || [];
    if (!savedApplications.some(app => app.url === redirectUrl)) {
        savedApplications.push(jobData);
        localStorage.setItem('jobApplications', JSON.stringify(savedApplications));
        console.log('Updated applications:', savedApplications);
    }
    
    // Update button appearance
    button.textContent = 'Applied!';
    button.style.backgroundColor = 'green';
    button.disabled = true;
    
    // Open the URL
    window.open(redirectUrl, '_blank');
}

// Update displayJobs function to handle potential null URLs
function displayJobs(jobs) {
    jobContainer.innerHTML = '';
    jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        
        // Generate success rate
        const successRate = Math.floor(Math.random() * 66) + 20;
        let successColor = 'red';
        if (successRate > 30 && successRate <= 60) {
            successColor = 'rgb(255, 195, 0)';
        } else if (successRate > 60) {
            successColor = 'green';
        }
        
        // Check if the job has already been applied to
        const alreadyApplied = hasApplied(job.url);
        
        // Encode the URL if it exists, otherwise use empty string
        const encodedUrl = job.url ? encodeURIComponent(job.url) : '';
        
        jobCard.innerHTML = `
            <div class="job-info">
                <h3>${job.title}</h3>
                <p>Domain: ${job.website_name || 'Not specified'}</p>
                <p>City: ${job.city || 'Not specified'}</p>
                <p style="color: green;" class="status-paragraph">Status: ${job.status || 'Not specified'}</p>
                <p style="color: ${successColor};">Success Rate: ${successRate}%</p>
                <button class="apply-btn" data-url="${encodedUrl}" 
                    ${alreadyApplied ? 'disabled' : ''}>
                    ${alreadyApplied ? 'Applied!' : 'Apply'}
                </button>
            </div>
        `;
        
        if (alreadyApplied) {
            const applyBtn = jobCard.querySelector('.apply-btn');
            applyBtn.style.backgroundColor = 'green';
        }
        
        // Add click event listener
        const applyBtn = jobCard.querySelector('.apply-btn');
        applyBtn.addEventListener('click', function() {
            const url = this.dataset.url ? decodeURIComponent(this.dataset.url) : null;
            applyJob(url, this);
        });
        
        jobContainer.appendChild(jobCard);
    });
}

searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const jobCards = document.querySelectorAll('.job-card');
    jobCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = title.includes(searchTerm) ? 'block' : 'none';
    });
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    fetchJobs();
});