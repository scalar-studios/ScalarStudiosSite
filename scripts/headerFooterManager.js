class CustomNavBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = 
        `
        <ul class="navbar">
            <li><a href="index.html">Home</a></li>
            <li><a href="projects.html">Projects</a></li>
            <li><a href="social_media.html">Social Media</a></li>
            <li><a href="wikis.html">Wikis</a></li>
            <li><a href="external_pages.html">External Pages</a></li>
        </ul>
        `
    }
}

customElements.define('custom-navbar', CustomNavBar)