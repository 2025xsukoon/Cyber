// Function to display a custom message box instead of alert()
function showMessageBox(message) {
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--card-bg);
        color: var(--text-light);
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 20px var(--box-shadow-color);
        z-index: 9999;
        text-align: center;
        font-family: 'Inter', sans-serif;
        max-width: 80%;
        word-wrap: break-word;
        transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
    `;
    messageBox.innerHTML = `<p>${message}</p><button style="margin-top: 15px; padding: 8px 15px; background-color: var(--accent-blue); color: white; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease;">OK</button>`;
    document.body.appendChild(messageBox);

    // Close the message box when OK is clicked
    messageBox.querySelector('button').addEventListener('click', () => {
        document.body.removeChild(messageBox);
    });

    // Close the message box if clicked outside (optional)
    messageBox.addEventListener('click', (event) => {
        if (event.target === messageBox) {
            document.body.removeChild(messageBox);
        }
    });
}

// Global variables for page elements (will be assigned in DOMContentLoaded)
let loginPage;
let dashboardPage;
let dashboardUserName;
let dashboardUserPhoto;
let onlineCurrentUserPhoto;
let onlineCurrentUsername;
let logoutButton;
let themeToggle;
let themeToggleIcon;
let body;
let sidebarLinks;
let contentSections;

document.addEventListener('DOMContentLoaded', () => {
    // Get references to page elements
    loginPage = document.getElementById('login-page');
    dashboardPage = document.getElementById('dashboard-page');
    dashboardUserName = document.getElementById('dashboard-username');
    dashboardUserPhoto = document.getElementById('dashboard-user-photo');
    onlineCurrentUserPhoto = document.getElementById('online-current-user-photo');
    onlineCurrentUsername = document.getElementById('online-current-username');
    logoutButton = document.getElementById('logout-button');
    themeToggle = document.getElementById('theme-toggle');
    themeToggleIcon = themeToggle.querySelector('i');
    body = document.body;
    sidebarLinks = document.querySelectorAll('.sidebar-link');
    contentSections = document.querySelectorAll('.content-section');

    // Function to set the theme
    function setTheme(isLightMode) {
        if (isLightMode) {
            body.classList.add('light-mode');
            themeToggleIcon.classList.remove('fa-moon');
            themeToggleIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-mode');
            themeToggleIcon.classList.remove('fa-sun');
            themeToggleIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    }

    // Check for saved theme preference on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        setTheme(true);
    } else {
        setTheme(false); // Default to dark if no preference or 'dark'
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        setTheme(!body.classList.contains('light-mode'));
    });

    // Function to display a specific content section
    function showSection(sectionId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
        });

        document.getElementById(sectionId).classList.add('active');
        document.querySelector(`.sidebar-link[data-section="${sectionId}"]`).classList.add('active');
    }

    // Function to display the dashboard
    function displayDashboard(user) {
        // Populate user data on dashboard
        document.getElementById('welcome-user-name').textContent = user.first_name || 'Guest';
        dashboardUserName.textContent = user.username ? `@${user.username}` : user.first_name || 'User';
        if (user.photo_url) {
            dashboardUserPhoto.src = user.photo_url;
            onlineCurrentUserPhoto.src = user.photo_url;
        } else {
            // Fallback for user photo if not provided
            dashboardUserPhoto.src = `https://placehold.co/80x80/${body.classList.contains('light-mode') ? '0056b3' : '00bcd4'}/ffffff?text=${user.first_name ? user.first_name.charAt(0) : 'U'}`;
            onlineCurrentUserPhoto.src = `https://placehold.co/40x40/${body.classList.contains('light-mode') ? '0056b3' : '00bcd4'}/ffffff?text=${user.first_name ? user.first_name.charAt(0) : 'U'}`;
        }
        onlineCurrentUsername.textContent = user.username ? `@${user.username}` : user.first_name || 'User';


        // Simulate showing dashboard and hiding login
        loginPage.classList.add('hidden');
        dashboardPage.classList.add('visible');
        showSection('dashboard-content'); // Show the main dashboard content by default
    }

    // Function to display the login page
    function displayLogin() {
        dashboardPage.classList.remove('visible');
        loginPage.classList.remove('hidden');
    }

    // This function is called by the Telegram Login Widget upon successful authentication
    window.onTelegramAuth = function(user) {
        // In a real application, you would send this 'user' data to your backend
        // for hash verification and session management.
        // For now, we'll just display the user info and then show the dashboard.
        let userInfo = 'Logged in as ' + user.first_name;
        if (user.last_name) userInfo += ' ' + user.last_name;
        userInfo += ' (ID: ' + user.id;
        if (user.username) userInfo += ', @' + user.username;
        userInfo += ')';

        showMessageBox(userInfo + '<br><br>Now, this user data needs to be sent to your backend server for secure verification using your Bot Token.');

        // Simulate a delay for the message box to be seen, then transition to dashboard
        setTimeout(() => {
            displayDashboard(user);
        }, 1500); // Show dashboard after 1.5 seconds
    };

    // Event listener for sidebar links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            const sectionId = link.getAttribute('data-section');
            if (sectionId) {
                showSection(sectionId);
            }
        });
    });

    // Event listener for the Logout button
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            showMessageBox('Logging out...');
            setTimeout(() => {
                displayLogin();
            }, 1000); // Simulate logout and show login page after 1 second
        });
    }

    // Get references to the secondary buttons (on login page)
    const contactAdminBtn = document.querySelector('.btn-contact');
    const joinCommunityBtn = document.querySelector('.btn-community');

    // Add event listeners to the secondary buttons
    if (contactAdminBtn) {
        contactAdminBtn.addEventListener('click', () => {
            showMessageBox('Contact Admin functionality would go here. (e.g., open a contact form or email client)');
        });
    }

    if (joinCommunityBtn) {
        joinCommunityBtn.addEventListener('click', () => {
            showMessageBox('Join Community functionality would go here. (e.g., redirect to a Telegram group link)');
        });
    }

    // Initially ensure only the login page is visible
    displayLogin();
});

