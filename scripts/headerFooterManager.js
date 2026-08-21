class CustomNavBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = 
        `
        <ul class="navbar">
            <li><a href="index.html">Home</a></li>
            <li class="dropdown">
                <a href="games.html">Games</a>
                <div class="dropdown-content">
                    <a href="vinland1000.html">Vinland: 1000</a>
                </div>
            </li>
            <li class="dropdown">
                <span class="dropdown-label">Other Software</span>
                <div class="dropdown-content">
                    <a href="projects.html">Projects</a>
                    <a href="mods.html">Mods</a>
                </div>
            </li>
            <li><a href="wikis.html">Wikis</a></li>
            <li><a href="external_pages.html">External Pages</a></li>
        </ul>
        `
    }
}

class CustomNavBarIndented extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
        `
        <ul class="navbar">
            <li><a href="../index.html">Home</a></li>
            <li class="dropdown">
                <a href="../games.html">Games</a>
                <div class="dropdown-content">
                    <a href="../vinland1000.html">Vinland: 1000</a>
                </div>
            </li>
            <li class="dropdown">
                <span class="dropdown-label">Other Software</span>
                <div class="dropdown-content">
                    <a href="../projects.html">Projects</a>
                    <a href="../mods.html">Mods</a>
                </div>
            </li>
            <li><a href="../wikis.html">Wikis</a></li>
            <li><a href="../external_pages.html">External Pages</a></li>
        </ul>
        `
    }
}

customElements.define('custom-navbar', CustomNavBar)
customElements.define('custom-navbar-indented', CustomNavBarIndented);
