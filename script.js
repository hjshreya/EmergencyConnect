"use strict";

/* =========================================================
   EMERGENCY CONNECT
   Pure HTML + CSS + JavaScript
   Production-safe frontend version
   ========================================================= */


/* =========================================================
   1. STORAGE
   ========================================================= */

const STORAGE = {
    ROLE: "ec_role",
    SERVICES: "ec_services",
    REQUESTS: "ec_requests",
    CONTACTS: "ec_contacts"
};


function readStorage(key, fallback) {
    try {
        const raw = window.localStorage.getItem(key);

        if (raw === null) {
            return fallback;
        }

        return JSON.parse(raw);

    } catch (error) {
        console.error(
            `Error reading localStorage key "${key}":`,
            error
        );

        return fallback;
    }
}


function writeStorage(key, value) {
    try {
        window.localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {
        console.error(
            `Error writing localStorage key "${key}":`,
            error
        );

        return false;
    }
}


function removeStorage(key) {
    try {
        window.localStorage.removeItem(key);
    } catch (error) {
        console.error(
            `Error removing localStorage key "${key}":`,
            error
        );
    }
}


function generateId(prefix) {
    return (
        prefix +
        "_" +
        Date.now().toString(36) +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 9)
    );
}


/* =========================================================
   2. AUTH / ROLE
   ========================================================= */

function getRole() {
    return readStorage(
        STORAGE.ROLE,
        null
    );
}


function login(role) {

    if (
        role !== "user" &&
        role !== "admin"
    ) {
        return;
    }

    writeStorage(
        STORAGE.ROLE,
        role
    );

    if (role === "admin") {
        navigate("admin/dashboard");
    } else {
        navigate("user/dashboard");
    }
}


function logout() {

    removeStorage(
        STORAGE.ROLE
    );

    navigate("login");
}


/* =========================================================
   3. CATEGORIES
   ========================================================= */

const CATEGORIES = [

    {
        type: "hospital",
        label: "Hospital",
        icon: "🏥"
    },

    {
        type: "ambulance",
        label: "Ambulance",
        icon: "🚑"
    },

    {
        type: "police",
        label: "Police",
        icon: "👮"
    },

    {
        type: "fire",
        label: "Fire Station",
        icon: "🚒"
    },

    {
        type: "pharmacy",
        label: "Pharmacy",
        icon: "💊"
    },

    {
        type: "bloodbank",
        label: "Blood Bank",
        icon: "🩸"
    }

];


function getCategoryInfo(type) {

    return (
        CATEGORIES.find(
            category =>
                category.type === type
        ) || {

            type: type,

            label: type,

            icon: "🏢"

        }
    );
}


/* =========================================================
   4. DEFAULT SERVICES
   ========================================================= */

const DEFAULT_SERVICES = [

    {
        id: "hospital_1",
        name: "AIIMS Delhi",
        type: "hospital",
        phone: "+911126588500",
        address: "Ansari Nagar, New Delhi",
        lat: 28.5672,
        lng: 77.21
    },

    {
        id: "hospital_2",
        name: "Safdarjung Hospital",
        type: "hospital",
        phone: "+911126707444",
        address: "Ansari Nagar West, New Delhi",
        lat: 28.5685,
        lng: 77.2069
    },

    {
        id: "hospital_3",
        name: "Fortis Escorts",
        type: "hospital",
        phone: "+911147135000",
        address: "Okhla Road, New Delhi",
        lat: 28.5535,
        lng: 77.2588
    },

    {
        id: "ambulance_1",
        name: "CATS Ambulance Service",
        type: "ambulance",
        phone: "102",
        address: "Delhi NCR",
        lat: 28.6139,
        lng: 77.209
    },

    {
        id: "ambulance_2",
        name: "Emergency Ambulance",
        type: "ambulance",
        phone: "108",
        address: "Delhi NCR",
        lat: 28.6304,
        lng: 77.2177
    },

    {
        id: "police_1",
        name: "Connaught Place Police Station",
        type: "police",
        phone: "100",
        address: "Connaught Place, New Delhi",
        lat: 28.6315,
        lng: 77.2167
    },

    {
        id: "police_2",
        name: "Saket Police Station",
        type: "police",
        phone: "+911126562100",
        address: "Saket, New Delhi",
        lat: 28.5245,
        lng: 77.2066
    },

    {
        id: "fire_1",
        name: "Delhi Fire Service HQ",
        type: "fire",
        phone: "101",
        address: "Connaught Lane, New Delhi",
        lat: 28.6289,
        lng: 77.2196
    },

    {
        id: "fire_2",
        name: "Laxmi Nagar Fire Station",
        type: "fire",
        phone: "101",
        address: "Laxmi Nagar, Delhi",
        lat: 28.6358,
        lng: 77.2773
    },

    {
        id: "pharmacy_1",
        name: "Apollo Pharmacy",
        type: "pharmacy",
        phone: "+911860500500",
        address: "Karol Bagh, New Delhi",
        lat: 28.6519,
        lng: 77.1909
    },

    {
        id: "pharmacy_2",
        name: "1mg Pharmacy",
        type: "pharmacy",
        phone: "+919999999999",
        address: "Saket, New Delhi",
        lat: 28.528,
        lng: 77.2186
    },

    {
        id: "blood_1",
        name: "Red Cross Blood Bank",
        type: "bloodbank",
        phone: "+911123711551",
        address: "Red Cross Road, New Delhi",
        lat: 28.6189,
        lng: 77.2295
    },

    {
        id: "blood_2",
        name: "Rotary Blood Bank",
        type: "bloodbank",
        phone: "+911129849393",
        address: "Tughlakabad Institutional Area, Delhi",
        lat: 28.5161,
        lng: 77.2615
    }

];


function getServices() {

    let services = readStorage(
        STORAGE.SERVICES,
        null
    );


    if (
        !Array.isArray(services) ||
        services.length === 0
    ) {

        services = DEFAULT_SERVICES;

        writeStorage(
            STORAGE.SERVICES,
            services
        );
    }


    return services;
}


function addService(data) {

    const services =
        getServices();


    const service = {

        id: generateId("service"),

        name: data.name,

        type: data.type,

        phone: data.phone,

        address: data.address,

        lat: Number(data.lat),

        lng: Number(data.lng)

    };


    services.push(service);


    return writeStorage(
        STORAGE.SERVICES,
        services
    );
}


function updateService(
    id,
    data
) {

    const services =
        getServices();


    const index =
        services.findIndex(
            service =>
                service.id === id
        );


    if (index === -1) {
        return false;
    }


    services[index] = {

        ...services[index],

        name: data.name,

        type: data.type,

        phone: data.phone,

        address: data.address,

        lat: Number(data.lat),

        lng: Number(data.lng)

    };


    return writeStorage(
        STORAGE.SERVICES,
        services
    );
}


function deleteService(id) {

    const services =
        getServices();


    const filtered =
        services.filter(
            service =>
                service.id !== id
        );


    return writeStorage(
        STORAGE.SERVICES,
        filtered
    );
}


/* =========================================================
   5. REQUESTS
   ========================================================= */

const REQUEST_STATUSES = [

    "Pending",

    "Acknowledged",

    "In Progress",

    "Resolved"

];


function getRequests() {

    const requests =
        readStorage(
            STORAGE.REQUESTS,
            []
        );


    if (!Array.isArray(requests)) {
        return [];
    }


    return requests
        .slice()
        .sort(
            (a, b) =>
                Number(b.createdAt) -
                Number(a.createdAt)
        );
}


function createRequest(data) {

    const requests =
        getRequests();


    const now =
        Date.now();


    const request = {

        id: generateId("request"),

        category:
            data.category,

        name:
            data.name,

        phone:
            data.phone,

        description:
            data.description,

        lat:
            Number(data.lat),

        lng:
            Number(data.lng),

        status:
            "Pending",

        createdAt:
            now,

        updatedAt:
            now

    };


    requests.unshift(
        request
    );


    writeStorage(
        STORAGE.REQUESTS,
        requests
    );


    return request;
}


function updateRequestStatus(
    id,
    newStatus
) {

    if (
        !REQUEST_STATUSES.includes(
            newStatus
        )
    ) {
        return false;
    }


    const requests =
        getRequests();


    const index =
        requests.findIndex(
            request =>
                request.id === id
        );


    if (index === -1) {
        return false;
    }


    requests[index].status =
        newStatus;


    requests[index].updatedAt =
        Date.now();


    return writeStorage(
        STORAGE.REQUESTS,
        requests
    );
}


/* =========================================================
   6. CONTACTS
   ========================================================= */

function getContacts() {

    const contacts =
        readStorage(
            STORAGE.CONTACTS,
            []
        );


    return Array.isArray(
        contacts
    )
        ? contacts
        : [];
}


function addContact(
    name,
    phone
) {

    const contacts =
        getContacts();


    contacts.push({

        id:
            generateId("contact"),

        name:
            name,

        phone:
            phone

    });


    return writeStorage(
        STORAGE.CONTACTS,
        contacts
    );
}


function deleteContact(id) {

    const contacts =
        getContacts();


    const filtered =
        contacts.filter(
            contact =>
                contact.id !== id
        );


    return writeStorage(
        STORAGE.CONTACTS,
        filtered
    );
}


/* =========================================================
   7. GEOLOCATION
   ========================================================= */

const geo = {

    coords: null,

    loading: false,

    error: null

};


function requestLocation() {

    if (
        !("geolocation" in navigator)
    ) {

        geo.error =
            "Geolocation is not supported by your browser.";

        geo.loading = false;

        refreshCurrentPage();

        return;
    }


    geo.loading = true;

    geo.error = null;


    refreshCurrentPage();


    navigator.geolocation.getCurrentPosition(

        function (position) {

            geo.coords = {

                lat:
                    position.coords.latitude,

                lng:
                    position.coords.longitude

            };


            geo.loading = false;

            geo.error = null;


            refreshCurrentPage();

        },


        function (error) {

            geo.loading = false;


            switch (error.code) {

                case error.PERMISSION_DENIED:

                    geo.error =
                        "Location permission was denied.";

                    break;


                case error.POSITION_UNAVAILABLE:

                    geo.error =
                        "Location information is unavailable.";

                    break;


                case error.TIMEOUT:

                    geo.error =
                        "Location request timed out.";

                    break;


                default:

                    geo.error =
                        "Could not determine your location.";

            }


            refreshCurrentPage();

        },


        {

            enableHighAccuracy: true,

            timeout: 15000,

            maximumAge: 30000

        }

    );
}


/* =========================================================
   8. DISTANCE
   ========================================================= */

function distanceInKm(
    lat1,
    lng1,
    lat2,
    lng2
) {

    const R = 6371;


    const dLat =
        (
            lat2 - lat1
        ) *
        Math.PI /
        180;


    const dLng =
        (
            lng2 - lng1
        ) *
        Math.PI /
        180;


    const a =

        Math.sin(
            dLat / 2
        ) ** 2

        +

        Math.cos(
            lat1 *
            Math.PI /
            180
        )

        *

        Math.cos(
            lat2 *
            Math.PI /
            180
        )

        *

        Math.sin(
            dLng / 2
        ) ** 2;


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return R * c;
}


function formatDistance(km) {

    if (km < 1) {

        return (
            Math.round(
                km * 1000
            ) +
            " m"
        );

    }


    return (
        km.toFixed(1) +
        " km"
    );
}


/* =========================================================
   9. URL HELPERS
   ========================================================= */

function mapUrl(
    lat,
    lng
) {

    return (
        "https://www.google.com/maps/?q=" +
        encodeURIComponent(
            `${lat},${lng}`
        )
    );
}


function directionsUrl(
    lat,
    lng
) {

    return (
        "https://www.google.com/maps/dir/?api=1" +
        "&destination=" +
        encodeURIComponent(
            `${lat},${lng}`
        )
    );
}


function createSmsLink(
    phone,
    name,
    coords
) {

    let message =
        `SOS! ${name || "I"} need help.`;


    if (coords) {

        message +=

            ` My location: ` +

            `https://www.google.com/maps/?q=` +

            `${coords.lat},${coords.lng}`;

    }


    return (
        "sms:" +
        encodeURIComponent(phone) +
        "?body=" +
        encodeURIComponent(message)
    );
}


/* =========================================================
   10. SECURITY / FORMATTING HELPERS
   ========================================================= */

function escapeHtml(value) {

    return String(
        value ?? ""
    ).replace(
        /[&<>"']/g,
        function (character) {

            const map = {

                "&": "&amp;",

                "<": "&lt;",

                ">": "&gt;",

                '"': "&quot;",

                "'": "&#039;"

            };


            return map[
                character
            ];

        }
    );
}


function statusClass(status) {

    return String(status)

        .toLowerCase()

        .replace(
            /[^a-z0-9]+/g,
            "-"
        )

        .replace(
            /^-|-$/g,
            ""
        );
}


function formatDate(timestamp) {

    const date =
        new Date(timestamp);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Unknown date";

    }


    return date.toLocaleString(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );
}


/* =========================================================
   11. TOAST
   ========================================================= */

let toastTimer = null;


function showToast(
    message,
    isError = false
) {

    let toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "toast";

        toast.className =
            "toast";

        document.body.appendChild(
            toast
        );
    }


    toast.textContent =
        message;


    toast.className =
        isError
            ? "toast show error"
            : "toast show";


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            function () {

                toast.className =
                    "toast";

            },
            3000
        );
}


/* =========================================================
   12. ROUTING
   ========================================================= */

const routes = {

    "":
        renderLanding,

    "login":
        renderLogin,

    "user/dashboard":
        renderUserDashboard,

    "user/nearby":
        renderNearby,

    "user/raise":
        renderRaise,

    "user/requests":
        renderMyRequests,

    "user/sos":
        renderSos,

    "admin/dashboard":
        renderAdminDashboard,

    "admin/requests":
        renderAdminRequests,

    "admin/services":
        renderAdminServices

};


function parseRoute() {

    const hash =
        window.location.hash ||
        "#/";


    const raw =
        hash.replace(
            /^#\/?/,
            ""
        );


    const parts =
        raw.split("?");


    const path =
        parts[0] || "";


    const queryString =
        parts[1] || "";


    const params = {};


    if (queryString) {

        const searchParams =
            new URLSearchParams(
                queryString
            );


        searchParams.forEach(
            function (
                value,
                key
            ) {

                params[key] =
                    value;

            }
        );
    }


    return {

        path,

        params

    };
}


function navigate(
    path,
    params = {}
) {

    const searchParams =
        new URLSearchParams();


    Object.entries(
        params
    ).forEach(
        function (
            [key, value]
        ) {

            if (
                value !== null &&
                value !== undefined &&
                value !== ""
            ) {

                searchParams.set(
                    key,
                    value
                );

            }

        }
    );


    const query =
        searchParams.toString();


    const newHash =
        "#/" +
        path +
        (
            query
                ? "?" + query
                : ""
        );


    if (
        window.location.hash ===
        newHash
    ) {

        refreshCurrentPage();

    } else {

        window.location.hash =
            newHash;

    }
}


/* =========================================================
   13. HEADER
   ========================================================= */

function renderHeader(
    currentPath
) {

    const role =
        getRole();


    let navigation = "";


    if (role === "user") {

        navigation = `

            <a
                href="#/user/dashboard"
                class="${
                    currentPath ===
                    "user/dashboard"
                        ? "active"
                        : ""
                }"
            >
                Dashboard
            </a>


            <a
                href="#/user/nearby"
                class="${
                    currentPath ===
                    "user/nearby"
                        ? "active"
                        : ""
                }"
            >
                Nearby
            </a>


            <a
                href="#/user/raise"
                class="${
                    currentPath ===
                    "user/raise"
                        ? "active"
                        : ""
                }"
            >
                Raise Request
            </a>


            <a
                href="#/user/requests"
                class="${
                    currentPath ===
                    "user/requests"
                        ? "active"
                        : ""
                }"
            >
                Requests
            </a>


            <a
                href="#/user/sos"
                class="${
                    currentPath ===
                    "user/sos"
                        ? "active"
                        : ""
                }"
            >
                SOS
            </a>

        `;

    }


    if (role === "admin") {

        navigation = `

            <a
                href="#/admin/dashboard"
                class="${
                    currentPath ===
                    "admin/dashboard"
                        ? "active"
                        : ""
                }"
            >
                Dashboard
            </a>


            <a
                href="#/admin/requests"
                class="${
                    currentPath ===
                    "admin/requests"
                        ? "active"
                        : ""
                }"
            >
                Requests
            </a>


            <a
                href="#/admin/services"
                class="${
                    currentPath ===
                    "admin/services"
                        ? "active"
                        : ""
                }"
            >
                Services
            </a>

        `;
    }


    const accountHTML = role

        ? `

            <span class="role-chip">
                ${escapeHtml(role)}
            </span>


            <button
                id="logoutButton"
                class="btn btn-sm"
                type="button"
            >
                Logout
            </button>

        `

        : `

            <a
                class="btn btn-primary btn-sm"
                href="#/login"
            >
                Sign in
            </a>

        `;


    const headerHTML = `

        <header
            class="site-header"
            id="appHeader"
        >

            <div class="header-inner">


                <a
                    class="brand"
                    href="#/"
                >

                    <span class="brand-mark">
                        !
                    </span>

                    EmergencyConnect

                </a>


                <nav class="nav">

                    ${navigation}

                </nav>


                <div class="btn-row">

                    ${accountHTML}

                </div>


            </div>

        </header>

    `;


    const oldHeader =
        document.getElementById(
            "appHeader"
        );


    if (oldHeader) {

        oldHeader.outerHTML =
            headerHTML;

    } else {

        document.body.insertAdjacentHTML(
            "afterbegin",
            headerHTML
        );

    }


    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logout
        );

    }
}


/* =========================================================
   14. LOCATION UI
   ========================================================= */

function locationBar() {

    let text =
        "Location not shared";


    if (geo.loading) {

        text =
            "Detecting your location...";

    }

    else if (geo.coords) {

        text =

            `Location: ` +

            `${geo.coords.lat.toFixed(4)}, ` +

            `${geo.coords.lng.toFixed(4)}`;

    }

    else if (geo.error) {

        text =
            geo.error;

    }


    return `

        <div class="card location-bar">

            <div class="flex-between">


                <div>

                    📍

                    <strong>
                        ${escapeHtml(text)}
                    </strong>

                </div>


                <button
                    id="locationButton"
                    class="btn btn-sm"
                    type="button"
                >

                    ${
                        geo.coords
                            ? "Refresh location"
                            : "Get my location"
                    }

                </button>


            </div>

        </div>

    `;
}


function attachLocationButton() {

    const button =
        document.getElementById(
            "locationButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        requestLocation
    );
}


/* =========================================================
   15. LANDING
   ========================================================= */

function renderLanding() {

    const app =
        document.getElementById(
            "app"
        );


    if (!app) {
        return;
    }


    app.innerHTML = `

        <main class="page">

            <div class="container">


                <section class="hero">


                    <span class="badge">
                        🚨 Emergency response,
                        in your pocket
                    </span>


                    <h1>
                        Help is just a tap away.
                    </h1>


                    <p>

                        Find hospitals, ambulances,
                        police stations, fire stations,
                        pharmacies and blood banks
                        near you.

                    </p>


                    <div
                        class="btn-row"
                        style="justify-content:center"
                    >

                        <a
                            href="#/login"
                            class="btn btn-primary btn-lg"
                        >
                            Get Started
                        </a>


                        <a
                            href="#features"
                            class="btn btn-lg"
                        >
                            Learn More
                        </a>

                    </div>


                </section>


                <section
                    id="features"
                    style="margin-top:40px"
                >

                    <h2
                        style="text-align:center"
                    >
                        Built for moments that count
                    </h2>


                    <div class="features">


                        <div class="feature">

                            <div class="icon">
                                📍
                            </div>

                            <h3>
                                Nearby services
                            </h3>

                            <p class="muted">
                                Find emergency services
                                near your location.
                            </p>

                        </div>


                        <div class="feature">

                            <div class="icon">
                                🚨
                            </div>

                            <h3>
                                Emergency requests
                            </h3>

                            <p class="muted">
                                Raise and track emergency
                                requests.
                            </p>

                        </div>


                        <div class="feature">

                            <div class="icon">
                                📞
                            </div>

                            <h3>
                                Quick contact
                            </h3>

                            <p class="muted">
                                Call emergency services
                                directly.
                            </p>

                        </div>


                        <div class="feature">

                            <div class="icon">
                                📱
                            </div>

                            <h3>
                                SOS contacts
                            </h3>

                            <p class="muted">
                                Notify trusted contacts
                                with your location.
                            </p>

                        </div>


                        <div class="feature">

                            <div class="icon">
                                🛡️
                            </div>

                            <h3>
                                Admin dashboard
                            </h3>

                            <p class="muted">
                                Manage requests and
                                service listings.
                            </p>

                        </div>


                        <div class="feature">

                            <div class="icon">
                                💾
                            </div>

                            <h3>
                                Local storage
                            </h3>

                            <p class="muted">
                                Demo data is stored
                                directly in the browser.
                            </p>

                        </div>


                    </div>

                </section>


            </div>

        </main>

    `;
}


/* =========================================================
   16. LOGIN
   ========================================================= */

function renderLogin() {

    const app =
        document.getElementById(
            "app"
        );


    if (!app) {
        return;
    }


    app.innerHTML = `

        <main class="page">

            <div class="container">


                <div class="form-card">


                    <h1>
                        Choose your role
                    </h1>


                    <p class="sub">

                        Demo authentication using
                        localStorage.

                    </p>


                    <hr>


                    <div class="grid-2">


                        <button
                            id="userLogin"
                            class="btn btn-primary btn-lg"
                            type="button"
                        >

                            👤 Continue as User

                        </button>


                        <button
                            id="adminLogin"
                            class="btn btn-lg"
                            type="button"
                        >

                            🛡️ Continue as Admin

                        </button>


                    </div>


                </div>


            </div>

        </main>

    `;


    document
        .getElementById(
            "userLogin"
        )
        .addEventListener(
            "click",
            function () {

                login("user");

            }
        );


    document
        .getElementById(
            "adminLogin"
        )
        .addEventListener(
            "click",
            function () {

                login("admin");

            }
        );
}


/* =========================================================
   17. USER DASHBOARD
   ========================================================= */

function renderUserDashboard() {

    const app =
        document.getElementById(
            "app"
        );


    const requests =
        getRequests();


    app.innerHTML = `

        <main class="page">

            <div class="container">


                <div class="page-head">

                    <h1>
                        User Dashboard
                    </h1>

                    <p class="sub">

                        Quickly find help
                        or raise an emergency request.

                    </p>

                </div>


                <div class="grid-3">


                    <a
                        class="card"
                        href="#/user/nearby"
                    >

                        <h2>
                            📍 Nearby
                        </h2>

                        <p class="muted">

                            Find hospitals,
                            police, fire,
                            ambulance and more.

                        </p>

                    </a>


                    <a
                        class="card"
                        href="#/user/raise"
                    >

                        <h2>
                            🚨 Raise Request
                        </h2>

                        <p class="muted">

                            Send an emergency
                            request with your location.

                        </p>

                    </a>


                    <a
                        class="card"
                        href="#/user/sos"
                    >

                        <h2>
                            📱 SOS
                        </h2>

                        <p class="muted">

                            Manage your trusted
                            emergency contacts.

                        </p>

                    </a>


                </div>


                <div
                    class="card"
                    style="margin-top:18px"
                >

                    <div class="flex-between">


                        <div>

                            <h2>
                                Your requests
                            </h2>

                            <p class="muted">

                                ${requests.length}
                                request(s) stored locally.

                            </p>

                        </div>


                        <a
                            href="#/user/requests"
                            class="btn btn-sm"
                        >
                            View all
                        </a>


                    </div>

                </div>


            </div>

        </main>

    `;
}


/* =========================================================
   18. NEARBY SERVICES
   ========================================================= */

function renderNearby(
    params = {}
) {

    const app =
        document.getElementById(
            "app"
        );


    const selectedCategory =
        params.category || "";


    let services =
        getServices();


    if (selectedCategory) {

        services =
            services.filter(
                service =>
                    service.type ===
                    selectedCategory
            );

    }


    const items =
        services
            .map(
                service => {

                    let distance = null;


                    if (geo.coords) {

                        distance =
                            distanceInKm(

                                geo.coords.lat,

                                geo.coords.lng,

                                service.lat,

                                service.lng

                            );

                    }


                    return {

                        service,

                        distance

                    };

                }
            )
            .sort(
                (a, b) => {

                    if (
                        a.distance === null &&
                        b.distance === null
                    ) {

                        return 0;

                    }


                    if (
                        a.distance === null
                    ) {

                        return 1;

                    }


                    if (
                        b.distance === null
                    ) {

                        return -1;

                    }


                    return (
                        a.distance -
                        b.distance
                    );

                }
            );


    app.innerHTML = `

        <main class="page">

            <div class="container">


                <div class="page-head">

                    <h1>
                        Nearby Services
                    </h1>

                    <p class="sub">

                        Find emergency services
                        near you.

                    </p>

                </div>


                ${locationBar()}


                <div
                    class="pills"
                    style="margin-bottom:20px"
                >


                    <button
                        type="button"
                        class="pill ${
                            selectedCategory === ""
                                ? "active"
                                : ""
                        }"
                        data-category=""
                    >

                        All

                    </button>


                    ${

                        CATEGORIES
                            .map(
                                category => `

                                    <button
                                        type="button"
                                        class="pill ${
                                            selectedCategory ===
                                            category.type
                                                ? "active"
                                                : ""
                                        }"
                                        data-category="${category.type}"
                                    >

                                        ${
                                            category.icon
                                        }

                                        ${
                                            category.label
                                        }

                                    </button>

                                `
                            )
                            .join("")

                    }


                </div>


                <div class="service-grid">


                    ${
                        items.length === 0

                            ? `

                                <div class="empty">

                                    <div class="big-icon">
                                        📍
                                    </div>

                                    <h2>
                                        No services found
                                    </h2>

                                </div>

                            `

                            : items
                                .map(
                                    item =>
                                        renderServiceCard(
                                            item.service,
                                            item.distance
                                        )
                                )
                                .join("")
                    }


                </div>


            </div>

        </main>

    `;


    attachLocationButton();


    document
        .querySelectorAll(
            "[data-category]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        navigate(
                            "user/nearby",
                            {
                                category:
                                    button.dataset
                                        .category
                            }
                        );

                    }
                );

            }
        );
}


function renderServiceCard(
    service,
    distance
) {

    const category =
        getCategoryInfo(
            service.type
        );


    return `

        <article class="service">


            <div class="service-top">


                <div class="service-icon">

                    ${category.icon}

                </div>


                <div style="flex:1">


                    <div class="service-name">

                        ${escapeHtml(
                            service.name
                        )}

                    </div>


                    <div class="service-meta">

                        ${escapeHtml(
                            category.label
                        )}

                    </div>


                    <div class="service-meta">

                        ${escapeHtml(
                            service.address
                        )}

                    </div>


                    ${
                        distance !== null

                            ? `

                                <div class="distance">

                                    📍
                                    ${formatDistance(
                                        distance
                                    )}

                                </div>

                            `

                            : ""

                    }


                </div>


            </div>


            <div
                class="btn-row"
                style="margin-top:15px"
            >


                <a
                    href="tel:${encodeURIComponent(
                        service.phone
                    )}"
                    class="btn btn-primary btn-sm"
                >

                    📞 Call

                </a>


                <a
                    href="${directionsUrl(
                        service.lat,
                        service.lng
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-sm"
                >

                    🗺️ Directions

                </a>


                <a
                    href="${mapUrl(
                        service.lat,
                        service.lng
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-sm"
                >

                    📍 Map

                </a>


            </div>


        </article>

    `;
}


/* =========================================================
   19. RAISE REQUEST
   ========================================================= */

function renderRaise() {

    const app =
        document.getElementById(
            "app"
        );


    let selectedCategory =
        "ambulance";


    app.innerHTML = `

        <main class="page">

            <div class="container">


                <div class="form-card">


                    <h1>
                        Raise Emergency Request
                    </h1>


                    <p class="sub">

                        Your current location
                        will be attached to the request.

                    </p>


                    <hr>


                    <form id="requestForm">


                        <div class="field">

                            <label>
                                Emergency type
                            </label>


                            <div
                                class="pills"
                                id="requestCategories"
                            >

                                ${

                                    CATEGORIES
                                        .map(
                                            category => `

                                                <button
                                                    type="button"
                                                    class="pill ${
                                                        category.type ===
                                                        selectedCategory
                                                            ? "active"
                                                            : ""
                                                    }"
                                                    data-type="${category.type}"
                                                >

                                                    ${
                                                        category.icon
                                                    }

                                                    ${
                                                        category.label
                                                    }

                                                </button>

                                            `
                                        )
                                        .join("")

                                }

                            </div>

                        </div>


                        <div class="field">

                            <label
                                for="requestName"
                            >
                                Your name
                            </label>

                            <input
                                id="requestName"
                                required
                                maxlength="100"
                            >

                        </div>


                        <div class="field">

                            <label
                                for="requestPhone"
                            >
                                Phone
                            </label>

                            <input
                                id="requestPhone"
                                type="tel"
                                required
                                maxlength="30"
                            >

                        </div>


                        <div class="field">

                            <label
                                for="requestDescription"
                            >
                                Emergency description
                            </label>

                            <textarea
                                id="requestDescription"
                                maxlength="500"
                                placeholder="Briefly describe what is happening..."
                            ></textarea>

                        </div>


                        <div id="requestLocation">

                            ${locationBar()}

                        </div>


                        <button
                            class="btn btn-primary btn-lg btn-block"
                            type="submit"
                        >

                            🚨 Submit Emergency Request

                        </button>


                    </form>


                </div>


            </div>

        </main>

    `;


    attachLocationButton();


    document
        .querySelectorAll(
            "#requestCategories [data-type]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        selectedCategory =
                            button.dataset.type;


                        document
                            .querySelectorAll(
                                "#requestCategories [data-type]"
                            )
                            .forEach(
                                item => {

                                    item.classList.toggle(
                                        "active",
                                        item.dataset.type ===
                                        selectedCategory
                                    );

                                }
                            );

                    }
                );

            }
        );


    document
        .getElementById(
            "requestForm"
        )
        .addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                if (!geo.coords) {

                    showToast(
                        "Please share your location first.",
                        true
                    );

                    return;

                }


                const name =
                    document
                        .getElementById(
                            "requestName"
                        )
                        .value
                        .trim();


                const phone =
                    document
                        .getElementById(
                            "requestPhone"
                        )
                        .value
                        .trim();


                const description =
                    document
                        .getElementById(
                            "requestDescription"
                        )
                        .value
                        .trim();


                if (!name || !phone) {

                    showToast(
                        "Please enter your name and phone.",
                        true
                    );

                    return;

                }


                createRequest({

                    category:
                        selectedCategory,

                    name:
                        name,

                    phone:
                        phone,

                    description:
                        description,

                    lat:
                        geo.coords.lat,

                    lng:
                        geo.coords.lng

                });


                showToast(
                    "Emergency request created."
                );


                navigate(
                    "user/requests"
                );

            }
        );
}


/* =========================================================
   20. REQUEST TIMELINE
   ========================================================= */

function renderTimeline(
    currentStatus
) {

    const currentIndex =
        REQUEST_STATUSES.indexOf(
            currentStatus
        );


    return `

        <div class="timeline">

            ${

                REQUEST_STATUSES
                    .map(
                        (status, index) => {

                            const done =
                                index <=
                                currentIndex;


                            return `

                                <div class="step">


                                    <div
                                        class="dot ${
                                            done
                                                ? "done"
                                                : ""
                                        }"
                                    >

                                        ${
                                            done
                                                ? "✓"
                                                : index + 1
                                        }

                                    </div>


                                    <span>
                                        ${status}
                                    </span>


                                </div>


                                ${
                                    index <
                                    REQUEST_STATUSES.length - 1

                                        ? `

                                            <div
                                                class="timeline-bar ${
                                                    index <
                                                    currentIndex
                                                        ? "done"
                                                        : ""
                                                }"
                                            ></div>

                                        `

                                        : ""
                                }

                            `;

                        }
                    )
                    .join("")

            }

        </div>

    `;
}


/* =========================================================
   21. USER REQUESTS
   ========================================================= */

function renderMyRequests() {

    const app =
        document.getElementById(
            "app"
        );


    const requests =
        getRequests();


    app.innerHTML = `

        <main class="page">

            <div class="container">


                <div class="page-head">

                    <h1>
                        My Requests
                    </h1>

                    <p class="sub">
                        Track your emergency requests.
                    </p>

                </div>


                ${
                    requests.length === 0

                        ? `

                            <div class="empty">

                                <div class="big-icon">
                                    📥
                                </div>

                                <h2>
                                    No requests yet
                                </h2>

                                <p class="muted">
                                    Your requests will
                                    appear here.
                                </p>


                                <a
                                    href="#/user/raise"
                                    class="btn btn-primary"
                                    style="margin-top:15px"
                                >

                                    Raise Request

                                </a>

                            </div>

                        `

                        : `

                            <div class="stack">

                                ${

                                    requests
                                        .map(
                                            request => {

                                                const category =
                                                    getCategoryInfo(
                                                        request.category
                                                    );


                                                return `

                                                    <article class="card">


                                                        <div
                                                            class="flex-between"
                                                        >


                                                            <div>

                                                                <h2>

                                                                    ${
                                                                        category.icon
                                                                    }

                                                                    ${
                                                                        escapeHtml(
                                                                            category.label
                                                                        )
                                                                    }

                                                                </h2>


                                                                <div
                                                                    class="muted"
                                                                >

                                                                    ${
                                                                        formatDate(
                                                                            request.createdAt
                                                                        )
                                                                    }

                                                                </div>

                                                            </div>


                                                            <span
                                                                class="status ${statusClass(
                                                                    request.status
                                                                )}"
                                                            >

                                                                ${
                                                                    escapeHtml(
                                                                        request.status
                                                                    )
                                                                }

                                                            </span>


                                                        </div>


                                                        <p
                                                            style="margin-top:12px"
                                                        >

                                                            ${
                                                                escapeHtml(
                                                                    request.description ||
                                                                    "No description provided."
                                                                )
                                                            }

                                                        </p>


                                                        <p
                                                            class="muted"
                                                        >

                                                            Location:

                                                            ${
                                                                Number(
                                                                    request.lat
                                                                ).toFixed(4)
                                                            },

                                                            ${
                                                                Number(
                                                                    request.lng
                                                                ).toFixed(4)
                                                            }

                                                        </p>


                                                        ${renderTimeline(
                                                            request.status
                                                        )}


                                                    </article>

                                                `;

                                            }
                                        )
                                        .join("")

                                }

                            </div>

                        `
                }


            </div>

        </main>

    `;
}


/* =========================================================
   22. SOS
   ========================================================= */

function renderSos() {

    const app =
        document.getElementById(
            "app"
        );


    function paint() {

        const contacts =
            getContacts();


        app.innerHTML = `

            <main class="page">

                <div class="container">


                    <div class="page-head">

                        <h1>
                            Emergency SOS
                        </h1>

                        <p class="sub">

                            Save trusted contacts
                            and send your location.

                        </p>

                    </div>


                    <div class="grid-2">


                        <div
                            class="form-card"
                            style="margin:0"
                        >


                            <h2>
                                Add Trusted Contact
                            </h2>


                            <hr>


                            <form id="contactForm">


                                <div class="field">

                                    <label
                                        for="contactName"
                                    >
                                        Name
                                    </label>

                                    <input
                                        id="contactName"
                                        required
                                        maxlength="100"
                                    >

                                </div>


                                <div class="field">

                                    <label
                                        for="contactPhone"
                                    >
                                        Phone
                                    </label>

                                    <input
                                        id="contactPhone"
                                        type="tel"
                                        required
                                        maxlength="30"
                                    >

                                </div>


                                <button
                                    class="btn btn-primary"
                                    type="submit"
                                >

                                    Add Contact

                                </button>


                            </form>


                        </div>


                        <div>


                            ${locationBar()}


                            <h2>
                                Trusted Contacts
                            </h2>


                            <div
                                class="stack"
                                style="margin-top:12px"
                            >


                                ${
                                    contacts.length === 0

                                        ? `

                                            <div class="empty">

                                                <div class="big-icon">
                                                    📱
                                                </div>

                                                <p>
                                                    No trusted contacts yet.
                                                </p>

                                            </div>

                                        `

                                        : contacts
                                            .map(
                                                contact => `

                                                    <div
                                                        class="card"
                                                    >

                                                        <div
                                                            class="flex-between"
                                                        >

                                                            <div>

                                                                <strong>

                                                                    ${
                                                                        escapeHtml(
                                                                            contact.name
                                                                        )
                                                                    }

                                                                </strong>


                                                                <div
                                                                    class="muted"
                                                                >

                                                                    ${
                                                                        escapeHtml(
                                                                            contact.phone
                                                                        )
                                                                    }

                                                                </div>

                                                            </div>


                                                            <div
                                                                class="btn-row"
                                                            >

                                                                <a
                                                                    class="btn btn-primary btn-sm"
                                                                    href="${createSmsLink(
                                                                        contact.phone,
                                                                        contact.name,
                                                                        geo.coords
                                                                    )}"
                                                                >

                                                                    ✉ Send SOS

                                                                </a>


                                                                <button
                                                                    class="btn btn-danger btn-sm"
                                                                    type="button"
                                                                    data-delete-contact="${contact.id}"
                                                                >

                                                                    Delete

                                                                </button>

                                                            </div>

                                                        </div>

                                                    </div>

                                                `
                                            )
                                            .join("")
                                }


                            </div>


                        </div>


                    </div>


                </div>

            </main>

        `;


        attachLocationButton();


        const form =
            document.getElementById(
                "contactForm"
            );


        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    document
                        .getElementById(
                            "contactName"
                        )
                        .value
                        .trim();


                const phone =
                    document
                        .getElementById(
                            "contactPhone"
                        )
                        .value
                        .trim();


                if (!name || !phone) {

                    showToast(
                        "Please enter name and phone.",
                        true
                    );

                    return;

                }


                addContact(
                    name,
                    phone
                );


                showToast(
                    "Contact added."
                );


                paint();

            }
        );


        document
            .querySelectorAll(
                "[data-delete-contact]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        function () {

                            deleteContact(
                                button.dataset
                                    .deleteContact
                            );


                            showToast(
                                "Contact deleted."
                            );


                            paint();

                        }
                    );

                }
            );

    }


    paint();
}


/* =========================================================
   23. ADMIN DASHBOARD
   ========================================================= */

function renderAdminDashboard() {

    const app =
        document.getElementById(
            "app"
        );


    const requests =
        getRequests();


    const services =
        getServices();


    function countStatus(
        status
    ) {

        return requests.filter(
            request =>
                request.status ===
                status
        ).length;

    }


    app.innerHTML = `

        <main class="page">

            <div class="container">


                <div class="page-head">

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p class="sub">

                        Overview of EmergencyConnect.

                    </p>

                </div>


                <div class="stats">


                    <div class="stat">

                        <div class="number">
                            ${requests.length}
                        </div>

                        <div class="muted">
                            Total Requests
                        </div>

                    </div>


                    ${

                        REQUEST_STATUSES
                            .map(
                                status => `

                                    <div class="stat">

                                        <div class="number">
                                            ${countStatus(status)}
                                        </div>

                                        <span
                                            class="status ${statusClass(
                                                status
                                            )}"
                                        >

                                            ${status}

                                        </span>

                                    </div>

                                `
                            )
                            .join("")

                    }


                </div>


                <div
                    class="grid-2"
                    style="margin-top:20px"
                >


                    <a
                        href="#/admin/requests"
                        class="card"
                    >

                        <h2>
                            🚨 Manage Requests
                        </h2>

                        <p class="muted">

                            View and update
                            emergency requests.

                        </p>

                    </a>


                    <a
                        href="#/admin/services"
                        class="card"
                    >

                        <h2>
                            🏥 Manage Services
                        </h2>

                        <p class="muted">

                            ${services.length}
                            services currently available.

                        </p>

                    </a>


                </div>


            </div>

        </main>

    `;
}


/* =========================================================
   24. ADMIN REQUESTS
   ========================================================= */

function renderAdminRequests() {

    const app =
        document.getElementById(
            "app"
        );


    let filter =
        "All";


    function paint() {

        const allRequests =
            getRequests();


        const requests =
            filter === "All"

                ? allRequests

                : allRequests.filter(
                    request =>
                        request.status ===
                        filter
                );


        app.innerHTML = `

            <main class="page">

                <div class="container">


                    <div class="page-head">

                        <h1>
                            Emergency Requests
                        </h1>

                        <p class="sub">

                            Review and update
                            incoming requests.

                        </p>

                    </div>


                    <div
                        class="pills"
                        style="margin-bottom:20px"
                    >


                        <button
                            class="pill ${
                                filter === "All"
                                    ? "active"
                                    : ""
                            }"
                            type="button"
                            data-filter="All"
                        >
                            All
                        </button>


                        ${

                            REQUEST_STATUSES
                                .map(
                                    status => `

                                        <button
                                            class="pill ${
                                                filter ===
                                                status
                                                    ? "active"
                                                    : ""
                                            }"
                                            type="button"
                                            data-filter="${status}"
                                        >

                                            ${status}

                                        </button>

                                    `
                                )
                                .join("")

                        }


                    </div>


                    ${
                        requests.length === 0

                            ? `

                                <div class="empty">

                                    <div class="big-icon">
                                        📥
                                    </div>

                                    <h2>
                                        No requests
                                    </h2>

                                </div>

                            `

                            : `

                                <div class="stack">

                                    ${

                                        requests
                                            .map(
                                                request => {

                                                    const category =
                                                        getCategoryInfo(
                                                            request.category
                                                        );


                                                    return `

                                                        <article
                                                            class="card"
                                                        >


                                                            <div
                                                                class="flex-between"
                                                            >


                                                                <div>

                                                                    <h2>

                                                                        ${
                                                                            category.icon
                                                                        }

                                                                        ${
                                                                            escapeHtml(
                                                                                category.label
                                                                            )
                                                                        }

                                                                    </h2>


                                                                    <strong>

                                                                        ${
                                                                            escapeHtml(
                                                                                request.name
                                                                            )
                                                                        }

                                                                    </strong>


                                                                    <div
                                                                        class="muted"
                                                                    >

                                                                        ${
                                                                            escapeHtml(
                                                                                request.phone
                                                                            )
                                                                        }

                                                                    </div>


                                                                    <div
                                                                        class="muted"
                                                                    >

                                                                        ${
                                                                            formatDate(
                                                                                request.createdAt
                                                                            )
                                                                        }

                                                                    </div>

                                                                </div>


                                                                <select
                                                                    class="status-select"
                                                                    data-request-id="${request.id}"
                                                                >

                                                                    ${

                                                                        REQUEST_STATUSES
                                                                            .map(
                                                                                status => `

                                                                                    <option
                                                                                        value="${status}"
                                                                                        ${
                                                                                            request.status ===
                                                                                            status
                                                                                                ? "selected"
                                                                                                : ""
                                                                                        }
                                                                                    >

                                                                                        ${status}

                                                                                    </option>

                                                                                `
                                                                            )
                                                                            .join("")

                                                                    }

                                                                </select>


                                                            </div>


                                                            <p
                                                                style="margin-top:12px"
                                                            >

                                                                ${
                                                                    escapeHtml(
                                                                        request.description ||
                                                                        "No description provided."
                                                                    )
                                                                }

                                                            </p>


                                                            <div
                                                                class="btn-row"
                                                                style="margin-top:12px"
                                                            >


                                                                <a
                                                                    href="${mapUrl(
                                                                        request.lat,
                                                                        request.lng
                                                                    )}"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    class="btn btn-sm"
                                                                >

                                                                    📍 Location

                                                                </a>


                                                                <a
                                                                    href="tel:${encodeURIComponent(
                                                                        request.phone
                                                                    )}"
                                                                    class="btn btn-primary btn-sm"
                                                                >

                                                                    📞 Call User

                                                                </a>


                                                            </div>


                                                        </article>

                                                    `;

                                                }
                                            )
                                            .join("")

                                    }

                                </div>

                            `
                    }


                </div>

            </main>

        `;


        document
            .querySelectorAll(
                "[data-filter]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        function () {

                            filter =
                                button.dataset
                                    .filter;

                            paint();

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                "[data-request-id]"
            )
            .forEach(
                select => {

                    select.addEventListener(
                        "change",
                        function () {

                            updateRequestStatus(

                                select.dataset
                                    .requestId,

                                select.value

                            );


                            showToast(
                                "Request status updated."
                            );


                            paint();

                        }
                    );

                }
            );

    }


    paint();
}


/* =========================================================
   25. ADMIN SERVICES
   ========================================================= */

function renderAdminServices() {

    const app =
        document.getElementById(
            "app"
        );


    let editingId = null;


    function paint() {

        const services =
            getServices();


        app.innerHTML = `

            <main class="page">

                <div class="container">


                    <div
                        class="flex-between"
                        style="margin-bottom:20px"
                    >


                        <div>

                            <h1>
                                Manage Services
                            </h1>

                            <p class="sub">

                                Add, edit or delete
                                emergency service listings.

                            </p>

                        </div>


                        <button
                            id="newServiceButton"
                            class="btn btn-primary"
                            type="button"
                        >

                            + New Service

                        </button>


                    </div>


                    <div class="table-wrap">


                        <table>


                            <thead>

                                <tr>

                                    <th>
                                        Service
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Phone
                                    </th>

                                    <th>
                                        Coordinates
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>


                                ${

                                    services.length === 0

                                        ? `

                                            <tr>

                                                <td
                                                    colspan="5"
                                                >
                                                    No services found.
                                                </td>

                                            </tr>

                                        `

                                        : services
                                            .map(
                                                service => {

                                                    const category =
                                                        getCategoryInfo(
                                                            service.type
                                                        );


                                                    return `

                                                        <tr>


                                                            <td>

                                                                <strong>

                                                                    ${
                                                                        escapeHtml(
                                                                            service.name
                                                                        )
                                                                    }

                                                                </strong>


                                                                <div
                                                                    class="muted"
                                                                >

                                                                    ${
                                                                        escapeHtml(
                                                                            service.address
                                                                        )
                                                                    }

                                                                </div>

                                                            </td>


                                                            <td>

                                                                ${
                                                                    category.icon
                                                                }

                                                                ${
                                                                    escapeHtml(
                                                                        category.label
                                                                    )
                                                                }

                                                            </td>


                                                            <td>

                                                                ${
                                                                    escapeHtml(
                                                                        service.phone
                                                                    )
                                                                }

                                                            </td>


                                                            <td>

                                                                ${
                                                                    Number(
                                                                        service.lat
                                                                    ).toFixed(4)
                                                                },

                                                                ${
                                                                    Number(
                                                                        service.lng
                                                                    ).toFixed(4)
                                                                }

                                                            </td>


                                                            <td>

                                                                <div
                                                                    class="btn-row"
                                                                >

                                                                    <button
                                                                        class="btn btn-sm"
                                                                        type="button"
                                                                        data-edit-service="${service.id}"
                                                                    >

                                                                        Edit

                                                                    </button>


                                                                    <button
                                                                        class="btn btn-danger btn-sm"
                                                                        type="button"
                                                                        data-delete-service="${service.id}"
                                                                    >

                                                                        Delete

                                                                    </button>

                                                                </div>

                                                            </td>


                                                        </tr>

                                                    `;

                                                }
                                            )
                                            .join("")

                                }


                            </tbody>


                        </table>


                    </div>


                    ${
                        editingId !== null

                            ? renderServiceModal(
                                editingId === "new"
                                    ? null
                                    : services.find(
                                        service =>
                                            service.id ===
                                            editingId
                                    )
                            )

                            : ""
                    }


                </div>

            </main>

        `;


        document
            .getElementById(
                "newServiceButton"
            )
            .addEventListener(
                "click",
                function () {

                    editingId =
                        "new";

                    paint();

                }
            );


        document
            .querySelectorAll(
                "[data-edit-service]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        function () {

                            editingId =
                                button.dataset
                                    .editService;

                            paint();

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                "[data-delete-service]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        function () {

                            const confirmed =
                                window.confirm(
                                    "Delete this service?"
                                );


                            if (!confirmed) {
                                return;
                            }


                            deleteService(
                                button.dataset
                                    .deleteService
                            );


                            showToast(
                                "Service deleted."
                            );


                            paint();

                        }
                    );

                }
            );


        attachServiceModalEvents();

    }


    paint();


    function renderServiceModal(
        service
    ) {

        const isNew =
            !service;


        return `

            <div
                class="modal-backdrop"
                id="serviceModal"
            >

                <div class="modal">


                    <div
                        class="flex-between"
                    >

                        <h2>

                            ${
                                isNew
                                    ? "Add Service"
                                    : "Edit Service"
                            }

                        </h2>


                        <button
                            id="closeServiceModal"
                            class="btn btn-sm"
                            type="button"
                        >

                            ✕

                        </button>

                    </div>


                    <hr>


                    <form id="serviceForm">


                        <div class="field">

                            <label
                                for="serviceName"
                            >
                                Name
                            </label>

                            <input
                                id="serviceName"
                                required
                                maxlength="150"
                                value="${
                                    escapeHtml(
                                        service?.name ||
                                        ""
                                    )
                                }"
                            >

                        </div>


                        <div class="field">

                            <label
                                for="serviceType"
                            >
                                Category
                            </label>


                            <select
                                id="serviceType"
                            >

                                ${

                                    CATEGORIES
                                        .map(
                                            category => `

                                                <option
                                                    value="${category.type}"
                                                    ${
                                                        category.type ===
                                                        (
                                                            service?.type ||
                                                            "hospital"
                                                        )
                                                            ? "selected"
                                                            : ""
                                                    }
                                                >

                                                    ${
                                                        category.label
                                                    }

                                                </option>

                                            `
                                        )
                                        .join("")

                                }

                            </select>

                        </div>


                        <div class="field">

                            <label
                                for="servicePhone"
                            >
                                Phone
                            </label>

                            <input
                                id="servicePhone"
                                required
                                maxlength="50"
                                value="${
                                    escapeHtml(
                                        service?.phone ||
                                        ""
                                    )
                                }"
                            >

                        </div>


                        <div class="field">

                            <label
                                for="serviceAddress"
                            >
                                Address
                            </label>

                            <input
                                id="serviceAddress"
                                required
                                maxlength="250"
                                value="${
                                    escapeHtml(
                                        service?.address ||
                                        ""
                                    )
                                }"
                            >

                        </div>


                        <div class="grid-2">


                            <div class="field">

                                <label
                                    for="serviceLat"
                                >
                                    Latitude
                                </label>

                                <input
                                    id="serviceLat"
                                    type="number"
                                    step="any"
                                    min="-90"
                                    max="90"
                                    required
                                    value="${
                                        service?.lat ??
                                        ""
                                    }"
                                >

                            </div>


                            <div class="field">

                                <label
                                    for="serviceLng"
                                >
                                    Longitude
                                </label>

                                <input
                                    id="serviceLng"
                                    type="number"
                                    step="any"
                                    min="-180"
                                    max="180"
                                    required
                                    value="${
                                        service?.lng ??
                                        ""
                                    }"
                                >

                            </div>


                        </div>


                        <button
                            class="btn btn-primary btn-block"
                            type="submit"
                        >

                            ${
                                isNew
                                    ? "Add Service"
                                    : "Save Changes"
                            }

                        </button>


                    </form>


                </div>

            </div>

        `;
    }


    function attachServiceModalEvents() {

        const closeButton =
            document.getElementById(
                "closeServiceModal"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                function () {

                    editingId =
                        null;

                    paint();

                }
            );

        }


        const form =
            document.getElementById(
                "serviceForm"
            );


        if (!form) {
            return;
        }


        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const data = {

                    name:
                        document
                            .getElementById(
                                "serviceName"
                            )
                            .value
                            .trim(),

                    type:
                        document
                            .getElementById(
                                "serviceType"
                            )
                            .value,

                    phone:
                        document
                            .getElementById(
                                "servicePhone"
                            )
                            .value
                            .trim(),

                    address:
                        document
                            .getElementById(
                                "serviceAddress"
                            )
                            .value
                            .trim(),

                    lat:
                        Number(
                            document
                                .getElementById(
                                    "serviceLat"
                                )
                                .value
                        ),

                    lng:
                        Number(
                            document
                                .getElementById(
                                    "serviceLng"
                                )
                                .value
                        )

                };


                if (

                    !data.name ||

                    !data.type ||

                    !data.phone ||

                    !data.address ||

                    !Number.isFinite(
                        data.lat
                    ) ||

                    !Number.isFinite(
                        data.lng
                    )

                ) {

                    showToast(
                        "Please fill all fields correctly.",
                        true
                    );

                    return;
                }


                let success;


                if (
                    editingId === "new"
                ) {

                    success =
                        addService(
                            data
                        );

                } else {

                    success =
                        updateService(
                            editingId,
                            data
                        );

                }


                if (!success) {

                    showToast(
                        "Could not save service.",
                        true
                    );

                    return;

                }


                showToast(
                    editingId === "new"
                        ? "Service added."
                        : "Service updated."
                );


                editingId =
                    null;


                paint();

            }
        );

    }

}


/* =========================================================
   26. 404
   ========================================================= */

function renderNotFound() {

    const app =
        document.getElementById(
            "app"
        );


    app.innerHTML = `

        <main class="page">

            <div class="container">


                <div class="empty">

                    <div class="big-icon">
                        404
                    </div>


                    <h1>
                        Page Not Found
                    </h1>


                    <p class="muted">
                        The page you requested
                        does not exist.
                    </p>


                    <a
                        href="#/"
                        class="btn btn-primary"
                    >
                        Go Home
                    </a>


                </div>


            </div>

        </main>

    `;
}


/* =========================================================
   27. ROUTE PROTECTION
   ========================================================= */

function isProtectedRoute(
    path
) {

    return (

        path.startsWith(
            "user/"
        )

        ||

        path.startsWith(
            "admin/"
        )

    );
}


function canAccessRoute(
    path
) {

    const role =
        getRole();


    if (
        path.startsWith(
            "user/"
        )
    ) {

        return role === "user";

    }


    if (
        path.startsWith(
            "admin/"
        )
    ) {

        return role === "admin";

    }


    return true;
}


/* =========================================================
   28. MAIN ROUTER
   ========================================================= */

function refreshCurrentPage() {

    try {

        const {
            path,
            params
        } = parseRoute();


        renderHeader(
            path
        );


        if (
            isProtectedRoute(path) &&
            !canAccessRoute(path)
        ) {

            navigate("login");

            return;
        }


        const page =
            routes[path] ||
            renderNotFound;


        page(params);

    } catch (error) {

        console.error(
            "Application rendering error:",
            error
        );


        const app =
            document.getElementById(
                "app"
            );


        if (app) {

            app.innerHTML = `

                <main class="page">

                    <div class="container">


                        <div class="empty">

                            <div class="big-icon">
                                ⚠️
                            </div>


                            <h1>
                                Something went wrong
                            </h1>


                            <p class="muted">

                                The application
                                encountered an error.

                            </p>


                            <button
                                class="btn btn-primary"
                                type="button"
                                onclick="window.location.reload()"
                            >

                                Refresh

                            </button>


                        </div>


                    </div>

                </main>

            `;

        }

    }
}


/* =========================================================
   29. EVENTS
   ========================================================= */

window.addEventListener(
    "hashchange",
    refreshCurrentPage
);


/* =========================================================
   30. APPLICATION START
   ========================================================= */

function initApp() {

    try {

        // Initialize default service data.
        getServices();


        // Make sure a route exists.
        if (!window.location.hash) {

            window.location.hash =
                "#/";

            return;
        }


        // Render current route.
        refreshCurrentPage();

    } catch (error) {

        console.error(
            "EmergencyConnect startup failed:",
            error
        );

    }

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initApp
    );

} else {

    initApp();

}
