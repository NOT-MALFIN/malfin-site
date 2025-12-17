async function loadWebsiteContent() {
    try {
        // Fetch the JSON file you've been editing on GitHub
        const response = await fetch('assets/data/content.json');
        
        if (!response.ok) {
            throw new Error("Could not find the content.json file");
        }

        const data = await response.json();
        const content = data.content;

        // 1. Update the Logo (Matches your 'Logo.jpg')
        const logoElement = document.getElementById('site-logo');
        if (content.logo_path) {
            logoElement.src = content.logo_path;
        }

        // 2. Update About Section
        document.getElementById('about-title').innerText = content.about_title;
        document.getElementById('about-content').innerHTML = `
            <div class="about-text">${content.about_text}</div>
            <div class="about-img-wrapper">
                <img src="${content.about_image}" alt="Business Concept">
            </div>
        `;

        // 3. Load Services
        const servicesContainer = document.getElementById('services-container');
        servicesContainer.innerHTML = ''; // Clear placeholder
        content.services.forEach(service => {
            servicesContainer.innerHTML += `
                <div class="service-card">
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                </div>
            `;
        });

        // 4. Load Portfolio (This fixes the broken project images)
        const portfolioContainer = document.getElementById('portfolio-container');
        portfolioContainer.innerHTML = ''; // Clear placeholder
        
        content.portfolio.forEach(project => {
            portfolioContainer.innerHTML += `
                <div class="portfolio-card">
                    <div class="portfolio-img-container">
                        <img src="${project.image}" alt="${project.title}" loading="lazy">
                    </div>
                    <div class="portfolio-info">
                        <h3>${project.title}</h3>
                    </div>
                </div>
            `;
        });

        console.log("Site content loaded successfully!");

    } catch (error) {
        console.error("Critical Error loading the site:", error);
        document.body.innerHTML += '<div class="error-msg">Failed to load content. Check console.</div>';
    }
}

// Start the loading process when the page is ready
document.addEventListener('DOMContentLoaded', loadWebsiteContent);
