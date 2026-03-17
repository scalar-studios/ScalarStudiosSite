class CustomNavBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = 
        `
        <ul class="navbar">
            <li><a href="index.html">Home</a></li>
            <li><a href="projects.html">Projects</a></li>
            <li class="dropdown">
                <a href="mods.html" class="dropbtn">Mods</a>
                <ul class="dropdown-content">
                    <li><a href="modjams.html">Mod Jams</a></li>
                    <li><a href="modpack_mods.html">Modpack Mods</a></li>
                </ul>
            </li>
            <li><a href="social_media.html">Social Media</a></li>
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
            <li><a href="../projects.html">Projects</a></li>
            <li class="dropdown">
                <a href="../mods.html" class="dropbtn">Mods</a>
                <ul class="dropdown-content">
                    <li><a href="../modjams.html">Mod Jams</a></li>
                </ul>
            </li>
            <li><a href="../social_media.html">Social Media</a></li>
            <li><a href="../wikis.html">Wikis</a></li>
            <li><a href="../external_pages.html">External Pages</a></li>
        </ul>
        `
    }
}

customElements.define('custom-navbar', CustomNavBar)
customElements.define('custom-navbar-indented', CustomNavBarIndented);
