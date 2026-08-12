/* =========================================================
   EmergencyConnect
   Pure JavaScript
   - No framework
   - No npm
   - No TypeScript
   - localStorage
   - Geolocation API
   - Hash routing
   ========================================================= */

"use strict";


/* =========================================================
   1. LOCAL STORAGE
   ========================================================= */

const STORAGE = {
    ROLE: "ec_role",
    SERVICES: "ec_services",
    REQUESTS: "ec_requests",
    CONTACTS: "ec_contacts"
};


function readStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);

        if (value === null) {
            return fallback;
        }

        return JSON.parse(value);

    } catch (error) {
        console.error("Could not read localStorage:", error);
        return fallback;
    }
}


function writeStorage(key, value) {
    try {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    } catch (error) {
        console.error("Could not write localStorage:", error);
        showToast("Could not save data.", true);
    }
}


function removeStorage(key) {
    localStorage.removeItem(key);
}


function makeId(prefix) {
    return (
        prefix +
        Math.random().toString(36).slice(2, 9) +
        Date.now().toString(36).slice(-5)
    );
}


/* =========================================================
   2. AUTHENTICATION
   ========================================================= */

function getRole() {
    return readStorage(STORAGE.ROLE, null);
}


function login(role) {
    writeStorage(STORAGE.ROLE, role);

    if (role === "admin") {
        navigate("admin/dashboard");
    } else {
        navigate("user/dashboard");
    }
}


function logout() {
    removeStorage(STORAGE.ROLE);
    navigate("login");
}


/* =========================================================
   3. EMERGENCY CATEGORIES
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


function categoryInfo(type) {

    return (
        CATEGORIES.find(
            category => category.type === type
        ) || {
            type,
            label: type,
            icon: "🏢"
        }
    );
}


/* =========================================================
   4. DEFAULT SERVICE DATA
   ========================================================= */

const DEFAULT_SERVICES = [

    {
        id: "h1",
        name: "AIIMS Delhi",
        type: "hospital",
        phone: "+911126588500",
        address: "Ansari Nagar, New Delhi",
        lat: 28.5672,
        lng: 77.21
    },

    {
        id: "h2",
        name: "Safdarjung Hospital",
        type: "hospital",
        phone: "+911126707444",
        address: "Ansari Nagar West, New Delhi",
        lat: 28.5685,
        lng: 77.2069
    },

    {
        id: "h3",
        name: "Fortis Escorts",
        type: "hospital",
        phone: "+911147135000",
        address: "Okhla Road, New Delhi",
        lat: 28.5535,
        lng: 77.2588
    },

    {
        id: "a1",
        name: "CATS Ambulance Service",
        type: "ambulance",
        phone: "102",
        address: "Citywide, Delhi NCR",
        lat: 28.6139,
        lng: 77.209
    },

    {
        id: "a2",
        name: "Dial 108 Ambulance",
        type: "ambulance",
        phone: "108",
        address: "Emergency Response",
        lat: 28.6304,
        lng: 77.2177
    },

    {
        id: "p1",
        name: "Connaught Place Police Station",
        type: "police",
        phone: "100",
        address: "Connaught Place, New Delhi",
        lat: 28.6315,
        lng: 77.2167
    },

    {
        id: "p2",
        name: "Saket Police Station",
        type: "police",
        phone: "+911126562100",
        address: "Saket, New Delhi",
        lat: 28.5245,
        lng: 77.2066
    },

    {
        id: "f1",
        name: "Delhi Fire Service HQ",
        type: "fire",
        phone: "101",
        address: "Connaught Lane, New Delhi",
        lat: 28.6289,
        lng: 77.2196
    },

    {
        id: "f2",
        name: "Laxmi Nagar Fire Station",
        type: "fire",
        phone: "101",
        address: "Laxmi Nagar, Delhi",
        lat: 28.6358,
        lng: 77.2773
    },

    {
        id: "ph1",
        name: "Apollo Pharmacy",
        type: "pharmacy",
        phone: "+911860500500",
        address: "Karol Bagh, New Delhi",
        lat: 28.6519,
        lng: 77.1909
    },

    {
        id: "ph2",
        name: "1mg Pharmacy",
        type: "pharmacy",
        phone: "+919999999999",
        address: "Saket, New Delhi",
        lat: 28.528,
        lng: 77.2186
    },

    {
        id: "b1",
        name: "Red Cross Blood Bank",
        type: "bloodbank",
        phone: "+911123711551",
        address: "Red Cross Road, New Delhi",
        lat: 28.6189,
        lng: 77.2295
    },

    {
        id: "b2",
        name: "Rotary Blood Bank",
        type: "bloodbank",
        phone: "+911129849393",
        address: "Tughlakabad Institutional Area, Delhi",
        lat: 28.5161,
        lng: 77.2615
    }

];


function getServices() {

    let services =
        readStorage(
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


function addService(service) {

    const services = getServices();

    const newService = {

        ...service,

        id: makeId("service_"),

        lat: Number(service.lat),

        lng: Number(service.lng)

    };

    writeStorage(
        STORAGE.SERVICES,
        [
            newService,
            ...services
        ]
    );
}


function updateService(id, changes) {

    const services =
        getServices().map(service => {

            if (service.id === id) {

                return {
                    ...service,
                    ...changes,
                    lat: Number(changes.lat),
                    lng: Number(changes.lng)
                };

            }

            return service;
        });

    writeStorage(
        STORAGE.SERVICES,
        services
    );
}


function deleteService(id) {

    const services =
        getServices().filter(
            service => service.id !== id
        );

    writeStorage(
        STORAGE.SERVICES,
        services
    );
}


/* =========================================================
   5. EMERGENCY REQUESTS
   ========================================================= */

const REQUEST_STATUSES = [
    "Pending",
    "Acknowledged",
    "In Progress",
    "Resolved"
];


function getRequests() {

    return readStorage(
        STORAGE.REQUESTS,
        []
    )
    .slice()
    .sort(
        (a, b) =>
            b.createdAt - a.createdAt
    );
}


function createRequest(data) {

    const requests =
        getRequests();

    const now = Date.now();

    const request = {

        ...data,

        id: makeId("request_"),

        status: "Pending",

        createdAt: now,

        updatedAt: now
    };

    writeStorage(
        STORAGE.REQUESTS,
        [
            request,
            ...requests
        ]
    );

    return request;
}


function updateRequestStatus(
    id,
    status
) {

    const requests =
        readStorage(
            STORAGE.REQUESTS,
            []
        ).map(request => {

            if (request.id === id) {

                return {

                    ...request,

                    status,

                    updatedAt: Date.now()

                };
            }

            return request;
        });

    writeStorage(
        STORAGE.REQUESTS,
        requests
    );
}


/* =========================================================
   6. TRUSTED CONTACTS
   ========================================================= */

function getContacts() {

    return readStorage(
        STORAGE.CONTACTS,
        []
    );
}


function addContact(
    name,
    phone
) {

    const contacts =
        getContacts();

    contacts.push({

        id: makeId("contact_"),

        name,

        phone

    });

    writeStorage(
        STORAGE.CONTACTS,
        contacts
    );
}


function deleteContact(id) {

    writeStorage(

        STORAGE.CONTACTS,

        getContacts().filter(
            contact =>
                contact.id !== id
        )

    );
}


function createSmsLink(
    phone,
    name,
    coords
) {

    let location = "";

    if (coords) {

        location =
            ` My location: ` +
            `https://www.google.com/maps/?q=` +
            `${coords.lat},${coords.lng}`;
    }

    const message =
        `SOS! This is ${name || "a contact"}. ` +
        `I need help.` +
        location;

    return (
        `sms:${phone}?body=` +
        encodeURIComponent(message)
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

    if (!navigator.geolocation) {

        geo.error =
            "Geolocation is not supported by this browser.";

        geo.loading = false;

        refreshCurrentPage();

        return;
    }

    geo.loading = true;

    geo.error = null;

    refreshCurrentPage();


    navigator.geolocation.getCurrentPosition(

        position => {

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

        error => {

            geo.loading = false;

            geo.error =
                error.message ||
                "Unable to get your location.";

            refreshCurrentPage();

        },

        {

            enableHighAccuracy: true,

            timeout: 10000

        }

    );
}


/* =========================================================
   8. DISTANCE CALCULATION
   Haversine Formula
   ========================================================= */

function distanceInKm(
    lat1,
    lng1,
    lat2,
    lng2
) {

    const earthRadius = 6371;


    const toRadians =
        degrees =>
            degrees *
            Math.PI /
            180;


    const dLat =
        toRadians(
            lat2 - lat1
        );


    const dLng =
        toRadians(
            lng2 - lng1
        );


    const a =

        Math.sin(
            dLat / 2
        ) ** 2

        +

        Math.cos(
            toRadians(lat1)
        )

        *

        Math.cos(
            toRadians(lat2)
        )

        *

        Math.sin(
            dLng / 2
        ) ** 2;


    return (

        earthRadius *

        2 *

        Math.atan2(

            Math.sqrt(a),

            Math.sqrt(1 - a)

        )

    );
}


function formatDistance(km) {

    if (km < 1) {

        return (
            Math.round(
                km * 1000
            ) + " m"
        );

    }

    return (
        km.toFixed(1) +
        " km"
    );
}


function mapsDirections(
    lat,
    lng
) {

    return (
        `https://www.google.com/maps/dir/?api=1` +
        `&destination=${lat},${lng}`
    );
}


function mapsLocation(
    lat,
    lng
) {

    return (
        `https://www.google.com/maps/?q=` +
        `${lat},${lng}`
    );
}


/* =========================================================
   9. UI HELPERS
   ========================================================= */

function escapeHtml(value) {

    return String(
        value ?? ""
    ).replace(
        /[&<>"']/g,
        char => {

            const map = {

                "&": "&amp;",

                "<": "&lt;",

                ">": "&gt;",

                '"': "&quot;",

                "'": "&#39;"

            };

            return map[char];
        }
    );
}


function formatDate(timestamp) {

    return new Date(
        timestamp
    ).toLocaleString();
}


let toastTimer;


function showToast(
    message,
    error = false
) {

    const toast =
        document.getElementById(
            "toast"
        );

    toast.textContent =
        message;

    toast.className =
        `toast show${error ? " error" : ""}`;

    clearTimeout(
        toastTimer
    );

    toastTimer =
        setTimeout(
            () => {

                toast.className =
                    "toast";

            },
            2500
        );
}


/* =========================================================
   10. ROUTER
   ========================================================= */

const routes = {

    "": renderLanding,

    "login": renderLogin,

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

    const raw =
        location.hash.replace(
            /^#\/?/,
            ""
        );


    const [
        path,
        queryString
    ] = raw.split("?");


    const params = {};


    if (queryString) {

        queryString
            .split("&")
            .forEach(pair => {

                const [
                    key,
                    value = ""
                ] = pair.split("=");


                if (key) {

                    params[
                        decodeURIComponent(key)
                    ] =
                        decodeURIComponent(
                            value
                        );

                }

            });
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

    const query =
        new URLSearchParams(
            params
        ).toString();


    location.hash =
        "#/" +
        path +
        (
            query
                ? `?${query}`
                : ""
        );
}


function refreshCurrentPage() {

    const {
        path,
        params
    } = parseRoute();


    renderHeader(path);


    const page =
        routes[path] ||
        renderNotFound;


    page(params);
}


window.addEventListener(
    "hashchange",
    refreshCurrentPage
);


/* =========================================================
   11. HEADER
   ========================================================= */

function renderHeader(path) {

    const role =
        getRole();


    let nav = "";


    if (role === "user") {

        nav = `

            <a
                href="#/user/dashboard"
                class="${path === "user/dashboard" ? "active" : ""}"
            >
                Dashboard
            </a>


            <a
                href="#/user/nearby"
                class="${path === "user/nearby" ? "active" : ""}"
            >
                Nearby
            </a>


            <a
                href="#/user/raise"
                class="${path === "user/raise" ? "active" : ""}"
            >
                Raise Request
            </a>


            <a
                href="#/user/requests"
                class="${path === "user/requests" ? "active" : ""}"
            >
                Requests
            </a>


            <a
                href="#/user/sos"
                class="${path === "user/sos" ? "active" : ""}"
            >
                SOS
            </a>

        `;
    }


    if (role === "admin") {

        nav = `

            <a
                href="#/admin/dashboard"
                class="${path === "admin/dashboard" ? "active" : ""}"
            >
                Dashboard
            </a>


            <a
                href="#/admin/requests"
                class="${path === "admin/requests" ? "active" : ""}"
            >
                Requests
            </a>


            <a
                href="#/admin/services"
                class="${path === "admin/services" ? "active" : ""}"
            >
                Services
            </a>

        `;
    }


    const account = role

        ? `

            <span class="role-chip">
                ${escapeHtml(role)}
            </span>

            <button
                class="btn btn-sm"
                id="logoutButton"
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


    document.getElementById(
        "appHeader"
    ).outerHTML = `

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
                    ${nav}
                </nav>


                <div class="btn-row">
                    ${account}
                </div>


            </div>

        </header>

    `;


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
   12. LANDING PAGE
   ========================================================= */

function renderLanding() {

    document.getElementById(
        "app"
    ).innerHTML = `

        <div class="page">

            <div class="container">


                <section class="hero">


                    <span class="badge">

                        ! Emergency response,
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

                        Raise emergency requests
                        and contact trusted people quickly.

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
                            Learn more
                        </a>

                    </div>


                </section>


                <h2
                    id="features"
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
                            and sort them by distance.

                        </p>

                    </div>


                    <div class="feature">

                        <div class="icon">
                            ⚠️
                        </div>

                        <h3>
                            Raise a request
                        </h3>

                        <p class="muted">

                            Submit an emergency
                            request with your location.

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

                            Call services or open
                            directions immediately.

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

                            Send your location
                            to trusted contacts.

                        </p>

                    </div>


                    <div class="feature">

                        <div class="icon">
                            🛡️
                        </div>

                        <h3>
                            Admin controls
                        </h3>

                        <p class="muted">

                            Manage emergency
                            requests and services.

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

                            Demo data remains
                            in this browser.

                        </p>

                    </div>


                </div>

            </div>

        </div>

    `;
}


/* =========================================================
   13. LOGIN
   ========================================================= */

function renderLogin() {

    document.getElementById(
        "app"
    ).innerHTML = `

        <div class="page">

            <div class="container">


                <div class="form-card">


                    <h1>
                        Choose a role
                    </h1>


                    <p class="sub">

                        This is a demo login.
                        No real password or
                        backend is used.

                    </p>


                    <hr>


                    <div class="grid-2">


                        <button
                            class="btn btn-primary btn-lg"
                            id="userLogin"
                        >

                            👤 Continue as User

                        </button>


                        <button
                            class="btn btn-lg"
                            id="adminLogin"
                        >

                            🛡️ Continue as Admin

                        </button>


                    </div>


                </div>


            </div>

        </div>

    `;


    document
        .getElementById("userLogin")
        .addEventListener(
            "click",
            () => login("user")
        );


    document
        .getElementById("adminLogin")
        .addEventListener(
            "click",
            () => login("admin")
        );
}


/* =========================================================
   14. USER DASHBOARD
   ========================================================= */

function renderUserDashboard() {

    const requests =
        getRequests();


    document.getElementById(
        "app"
    ).innerHTML = `

        <div class="page">

            <div class="container">


                <div class="page-head">

                    <h1>
                        User Dashboard
                    </h1>

                    <div class="sub">

                        Quickly find help
                        or raise an emergency request.

                    </div>

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

                            Manage trusted contacts
                            and send SOS messages.

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
                                request(s)
                                saved locally.

                            </p>

                        </div>


                        <a
                            class="btn btn-sm"
                            href="#/user/requests"
                        >
                            View all
                        </a>


                    </div>

                </div>


            </div>

        </div>

    `;
}


/* =========================================================
   15. LOCATION BAR
   ========================================================= */

function locationBar() {

    let message =
        "Location not shared.";


    if (geo.loading) {

        message =
            "Detecting your location...";

    }

    else if (geo.coords) {

        message =
            `Location: ` +
            `${geo.coords.lat.toFixed(4)}, ` +
            `${geo.coords.lng.toFixed(4)}`;

    }

    else if (geo.error) {

        message =
            geo.error;

    }


    return `

        <div class="card location-bar">

            <div class="flex-between">


                <div>

                    📍

                    <strong>
                        ${escapeHtml(message)}
                    </strong>

                </div>


                <button
                    class="btn btn-sm"
                    id="locationButton"
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


    if (button) {

        button.addEventListener(
            "click",
            requestLocation
        );

    }
}


/* =========================================================
   16. NEARBY SERVICES
   ========================================================= */

function renderNearby(
    params = {}
) {

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


    let items =
        services.map(service => {

            const distance =
                geo.coords

                    ? distanceInKm(

                        geo.coords.lat,

                        geo.coords.lng,

                        service.lat,

                        service.lng

                    )

                    : null;


            return {

                service,

                distance

            };

        });


    if (geo.coords) {

        items.sort(

            (a, b) =>

                (a.distance ?? Infinity) -

                (b.distance ?? Infinity)

        );

    }


    document.getElementById(
        "app"
    ).innerHTML = `

        <div class="page">

            <div class="container">


                <div class="page-head">

                    <h1>
                        Nearby services
                    </h1>

                    <div class="sub">

                        ${
                            geo.coords

                                ? "Results are sorted by distance."

                                : "Share your location to sort results by distance."
                        }

                    </div>

                </div>


                ${locationBar()}


                <div
                    class="pills"
                    style="margin-bottom:15px"
                >


                    <button
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
                                    class="pill ${
                                        selectedCategory ===
                                        category.type
                                            ? "active"
                                            : ""
                                    }"
                                    data-category="${category.type}"
                                >

                                    ${category.icon}
                                    ${category.label}

                                </button>

                            `
                            )
                            .join("")

                    }


                </div>


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

                                <p class="muted">
                                    Try another category.
                                </p>

                            </div>

                        `

                        : `

                            <div class="service-grid">

                                ${

                                    items
                                        .map(
                                            ({ service, distance }) =>
                                                serviceCard(
                                                    service,
                                                    distance
                                                )
                                        )
                                        .join("")

                                }

                            </div>

                        `

                }


            </div>

        </div>

    `;


    attachLocationButton();


    document
        .querySelectorAll(
            "[data-category]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    navigate(
                        "user/nearby",
                        {
                            category:
                                button.dataset.category
                        }
                    );

                }
            );

        });


    if (
        !geo.coords &&
        !geo.loading &&
        !geo.error
    ) {

        requestLocation();

    }
}


function serviceCard(
    service,
    distance
) {

    const info =
        categoryInfo(
            service.type
        );


    return `

        <article class="service">


            <div class="service-top">


                <div class="service-icon">

                    ${info.icon}

                </div>


                <div style="flex:1">


                    <div class="service-name">

                        ${escapeHtml(
                            service.name
                        )}

                    </div>


                    <div class="service-meta">

                        ${escapeHtml(
                            info.label
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
                                    away

                                </div>

                            `

                            : ""

                    }


                </div>


            </div>


            <div
                class="btn-row"
                style="margin-top:14px"
            >


                <a
                    class="btn btn-primary btn-sm"
                    href="tel:${escapeHtml(
                        service.phone
                    )}"
                >

                    📞 Call

                </a>


                <a
                    class="btn btn-sm"
                    target="_blank"
                    rel="noopener"
                    href="${mapsDirections(
                        service.lat,
                        service.lng
                    )}"
                >

                    🗺️ Directions

                </a>


                <a
                    class="btn btn-sm"
                    target="_blank"
                    rel="noopener"
                    href="${mapsLocation(
                        service.lat,
                        service.lng
                    )}"
                >

                    📍 Map

                </a>


            </div>


        </article>

    `;
}


/* =========================================================
   17. RAISE EMERGENCY REQUEST
   ========================================================= */

function renderRaise() {

    let selectedCategory =
        "ambulance";


    document.getElementById(
        "app"
    ).innerHTML = `

        <div class="page">

            <div class="container">


                <div class="form-card">


                    <h1>
                        Raise emergency request
                    </h1>


                    <p class="sub">

                        Your browser location
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

                                                ${category.icon}
                                                ${category.label}

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
                            >

                        </div>


                        <div class="field">

                            <label
                                for="requestDescription"
                            >
                                What's happening?
                            </label>


                            <textarea
                                id="requestDescription"
                                maxlength="500"
                                placeholder="Briefly describe the emergency..."
                            ></textarea>


                        </div>


                        <div id="requestLocation">

                            ${locationBar()}

                        </div>


                        <button
                            class="btn btn-primary btn-lg btn-block"
                            type="submit"
                        >

                            🚨 Submit request

                        </button>


                    </form>


                </div>


            </div>

        </div>

    `;


    attachLocationButton();


    document
        .querySelectorAll(
            "#requestCategories [data-type]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    selectedCategory =
                        button.dataset.type;


                    document
                        .querySelectorAll(
                            "#requestCategories [data-type]"
                        )
                        .forEach(item => {

                            item.classList.toggle(

                                "active",

                                item.dataset.type ===
                                selectedCategory

                            );

                        });

                }
            );

        });


    document
        .getElementById(
            "requestForm"
        )
        .addEventListener(
            "submit",
            event => {

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


                createRequest({

                    category:
                        selectedCategory,

                    name,

                    phone,

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


    if (
        !geo.coords &&
        !geo.loading &&
        !geo.error
    ) {

        requestLocation();

    }
}


/* =========================================================
   18. REQUEST TIMELINE
   ========================================================= */

function requestTimeline(
    status
) {

    const currentIndex =
        REQUEST_STATUSES.indexOf(
            status
        );


    return `

        <div class="timeline">


            ${

                REQUEST_STATUSES
                    .map(
                        (item, index) => {

                            const completed =
                                index <=
                                currentIndex;


                            return `

                                <div class="step">

                                    <div
                                        class="dot ${
                                            completed
                                                ? "done"
                                                : ""
                                        }"
                                    >

                                        ${
                                            completed
                                                ? "✓"
                                                : index + 1
                                        }

                                    </div>


                                    <div>
                                        ${item}
                                    </div>

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
   19. USER REQUESTS
   ========================================================= */

function renderMyRequests() {

    const requests =
        getRequests();


    document.getElementById(
        "app"
    ).innerHTML = `

        <div class="page">

            <div class="container">


                <div class="page-head">

                    <h1>
                        My requests
                    </h1>

                    <div class="sub">

                        Track your emergency requests.

                    </div>

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

                                    Your emergency requests
                                    will appear here.

                                </p>


                                <a
                                    class="btn btn-primary"
                                    href="#/user/raise"
                                    style="margin-top:15px"
                                >

                                    Raise a request

                                </a>

                            </div>

                        `

                        : `

                            <div class="stack">

                                ${

                                    requests
                                        .map(
                                            request => {

                                                const info =
                                                    categoryInfo(
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
                                                                        info.icon
                                                                    }

                                                                    ${
                                                                        escapeHtml(
                                                                            info.label
                                                                        )
                                                                    }

                                                                </h2>


                                                                <div class="muted">

                                                                    ${
                                                                        formatDate(
                                                                            request.createdAt
                                                                        )
                                                                    }

                                                                </div>

                                                            </div>


                                                            <span
                                                                class="status ${request.status.replaceAll(
                                                                    " ",
                                                                    "."
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
                                                            style="margin-top:10px"
                                                        >

                                                            ${
                                                                escapeHtml(
                                                                    request.description ||
                                                                    "No description provided."
                                                                )
                                                            }

                                                        </p>


                                                        <div
                                                            class="muted"
                                                            style="margin-top:7px"
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

                                                        </div>


                                                        ${
                                                            requestTimeline(
                                                                request.status
                                                            )
                                                        }


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

        </div>

    `;
}


/* =========================================================
   20. SOS CONTACTS
   ========================================================= */

function renderSos() {


    function paint() {

        const contacts =
            getContacts();


        document.getElementById(
            "app"
        ).innerHTML = `

            <div class="page">

                <div class="container">


                    <div class="page-head">

                        <h1>
                            Emergency SOS
                        </h1>

                        <div class="sub">

                            Save trusted contacts
                            and send your location.

                        </div>

                    </div>


                    <div class="grid-2">


                        <div
                            class="form-card"
                            style="margin:0"
                        >

                            <h2>
                                Add trusted contact
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
                                    >

                                </div>


                                <button
                                    class="btn btn-primary"
                                >

                                    Add contact

                                </button>


                            </form>


                        </div>


                        <div>


                            <div id="sosLocation">

                                ${locationBar()}

                            </div>


                            <h2>
                                Trusted contacts
                            </h2>


                            <div
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
                                                    No contacts added.
                                                </p>

                                            </div>

                                        `

                                        : `

                                            <div class="stack">

                                                ${

                                                    contacts
                                                        .map(
                                                            contact => `

                                                                <div
                                                                    class="card flex-between"
                                                                >


                                                                    <div>

                                                                        <strong>

                                                                            ${
                                                                                escapeHtml(
                                                                                    contact.name
                                                                                )
                                                                            }

                                                                        </strong>


                                                                        <div class="muted">

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
                                                                            data-delete-contact="${contact.id}"
                                                                        >

                                                                            🗑

                                                                        </button>


                                                                    </div>


                                                                </div>

                                                            `
                                                        )
                                                        .join("")

                                                }

                                            </div>

                                        `

                                }


                            </div>


                        </div>


                    </div>


                </div>

            </div>

        `;


        attachLocationButton();


        document
            .getElementById(
                "contactForm"
            )
            .addEventListener(
                "submit",
                event => {

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
                            "Name and phone are required.",
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
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteContact(
                            button.dataset
                                .deleteContact
                        );


                        showToast(
                            "Contact removed."
                        );


                        paint();

                    }
                );

            });

    }


    paint();


    if (
        !geo.coords &&
        !geo.loading &&
        !geo.error
    ) {

        requestLocation();

    }
}


/* =========================================================
   21. ADMIN DASHBOARD
   ========================================================= */

function renderAdminDashboard() {

    const requests =
        getRequests();


    const services =
        getServices();


    const countByStatus =
        status =>

            requests.filter(
                request =>
                    request.status ===
                    status
            ).length;


    document.getElementById(
        "app"
    ).innerHTML = `

        <div class="page">

            <div class="container">


                <div class="page-head">

                    <h1>
                        Admin Dashboard
                    </h1>

                    <div class="sub">

                        Overview of the locally
                        stored system data.

                    </div>

                </div>


                <div class="stats">


                    <div class="stat">

                        <div class="number">

                            ${requests.length}

                        </div>

                        <div class="muted">
                            Total requests
                        </div>

                    </div>


                    ${

                        REQUEST_STATUSES
                            .map(
                                status => `

                                    <div class="stat">

                                        <div class="number">

                                            ${
                                                countByStatus(
                                                    status
                                                )
                                            }

                                        </div>


                                        <span
                                            class="status ${status.replaceAll(
                                                " ",
                                                "."
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
                    class="card"
                    style="margin-top:18px"
                >

                    <div
                        class="flex-between"
                    >


                        <div>

                            <h2>
                                Services
                            </h2>

                            <p class="muted">

                                ${services.length}
                                service listings.

                            </p>

                        </div>


                        <a
                            class="btn btn-sm"
                            href="#/admin/services"
                        >

                            Manage services

                        </a>


                    </div>

                </div>


            </div>

        </div>

    `;
}


/* =========================================================
   22. ADMIN REQUESTS
   ========================================================= */

function renderAdminRequests() {

    let selectedStatus =
        "All";


    function paint() {

        const allRequests =
            getRequests();


        const requests =

            selectedStatus === "All"

                ? allRequests

                : allRequests.filter(

                    request =>

                        request.status ===
                        selectedStatus

                );


        document.getElementById(
            "app"
        ).innerHTML = `

            <div class="page">

                <div class="container">


                    <div class="page-head">

                        <h1>
                            Emergency Requests
                        </h1>

                        <div class="sub">

                            Review and update
                            incoming requests.

                        </div>

                    </div>


                    <div
                        class="pills"
                        style="margin-bottom:15px"
                    >


                        <button
                            class="pill ${
                                selectedStatus === "All"
                                    ? "active"
                                    : ""
                            }"
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
                                                selectedStatus ===
                                                status
                                                    ? "active"
                                                    : ""
                                            }"
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

                                                    const info =
                                                        categoryInfo(
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
                                                                            info.icon
                                                                        }

                                                                        ${
                                                                            escapeHtml(
                                                                                info.label
                                                                            )
                                                                        }

                                                                    </h2>


                                                                    <div>

                                                                        <strong>

                                                                            ${
                                                                                escapeHtml(
                                                                                    request.name
                                                                                )
                                                                            }

                                                                        </strong>

                                                                        ·

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
                                                                                            status ===
                                                                                            request.status
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
                                                                style="margin-top:10px"
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
                                                                style="margin-top:10px"
                                                            >


                                                                <a
                                                                    class="btn btn-sm"
                                                                    target="_blank"
                                                                    rel="noopener"
                                                                    href="${mapsLocation(
                                                                        request.lat,
                                                                        request.lng
                                                                    )}"
                                                                >

                                                                    📍 Location

                                                                </a>


                                                                <a
                                                                    class="btn btn-primary btn-sm"
                                                                    href="tel:${escapeHtml(
                                                                        request.phone
                                                                    )}"
                                                                >

                                                                    📞 Call user

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

            </div>

        `;


        document
            .querySelectorAll(
                "[data-filter]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        selectedStatus =
                            button.dataset.filter;

                        paint();

                    }
                );

            });


        document
            .querySelectorAll(
                ".status-select"
            )
            .forEach(select => {

                select.addEventListener(
                    "change",
                    () => {

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

            });

    }


    paint();

}


/* =========================================================
   23. ADMIN SERVICES
   ========================================================= */

function renderAdminServices() {

    let editingId = null;


    function paint() {

        const services =
            getServices();


        document.getElementById(
            "app"
        ).innerHTML = `

            <div class="page">

                <div class="container">


                    <div
                        class="flex-between"
                        style="margin-bottom:15px"
                    >


                        <div>

                            <h1>
                                Manage Services
                            </h1>

                            <div class="sub">

                                Add, edit or delete
                                emergency services.

                            </div>

                        </div>


                        <button
                            class="btn btn-primary"
                            id="newService"
                        >

                            ＋ New service

                        </button>


                    </div>


                    ${

                        services.length === 0

                            ? `

                                <div class="empty">

                                    <div class="big-icon">
                                        🏢
                                    </div>

                                    <h2>
                                        No services
                                    </h2>

                                </div>

                            `

                            : `

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

                                                services
                                                    .map(
                                                        service => {

                                                            const info =
                                                                categoryInfo(
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
                                                                            info.icon
                                                                        }

                                                                        ${
                                                                            escapeHtml(
                                                                                info.label
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
                                                                                data-edit-service="${service.id}"
                                                                            >

                                                                                ✎ Edit

                                                                            </button>


                                                                            <button
                                                                                class="btn btn-danger btn-sm"
                                                                                data-delete-service="${service.id}"
                                                                            >

                                                                                🗑 Delete

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

                            `

                    }


                    ${

                        editingId !== null

                            ? serviceModal(

                                getServices().find(

                                    service =>
                                        service.id ===
                                        editingId

                                )

                            )

                            : ""

                    }


                </div>

            </div>

        `;


        document
            .getElementById(
                "newService"
            )
            .addEventListener(
                "click",
                () => {

                    editingId =
                        "new";

                    paint();

                }
            );


        document
            .querySelectorAll(
                "[data-edit-service]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        editingId =
                            button.dataset
                                .editService;

                        paint();

                    }
                );

            });


        document
            .querySelectorAll(
                "[data-delete-service]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const confirmed =
                            confirm(
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

            });


        attachServiceForm(
            paint
        );

    }


    paint();


    function serviceModal(
        existing
    ) {

        const isNew =
            !existing;


        return `

            <div class="modal-backdrop">


                <div class="modal">


                    <div
                        class="flex-between"
                    >


                        <h2>

                            ${
                                isNew
                                    ? "Add service"
                                    : "Edit service"
                            }

                        </h2>


                        <button
                            class="btn btn-sm"
                            id="closeModal"
                        >

                            ✕

                        </button>


                    </div>


                    <hr>


                    <form id="serviceForm">


                        <div class="field">

                            <label>
                                Name
                            </label>

                            <input
                                id="serviceName"
                                required
                                value="${escapeHtml(
                                    existing?.name || ""
                                )}"
                            >

                        </div>


                        <div class="field">

                            <label>
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
                                                            existing?.type ||
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

                            <label>
                                Phone
                            </label>

                            <input
                                id="servicePhone"
                                required
                                value="${escapeHtml(
                                    existing?.phone || ""
                                )}"
                            >

                        </div>


                        <div class="field">

                            <label>
                                Address
                            </label>

                            <input
                                id="serviceAddress"
                                required
                                value="${escapeHtml(
                                    existing?.address || ""
                                )}"
                            >

                        </div>


                        <div class="grid-2">


                            <div class="field">

                                <label>
                                    Latitude
                                </label>

                                <input
                                    id="serviceLat"
                                    type="number"
                                    step="any"
                                    required
                                    value="${
                                        existing?.lat ??
                                        ""
                                    }"
                                >

                            </div>


                            <div class="field">

                                <label>
                                    Longitude
                                </label>

                                <input
                                    id="serviceLng"
                                    type="number"
                                    step="any"
                                    required
                                    value="${
                                        existing?.lng ??
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
                                    ? "Add service"
                                    : "Save changes"
                            }

                        </button>


                    </form>


                </div>

            </div>

        `;
    }


    function attachServiceForm(
        paint
    ) {

        const close =
            document.getElementById(
                "closeModal"
            );


        if (close) {

            close.addEventListener(
                "click",
                () => {

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
            event => {

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
                        "Please fill every field correctly.",
                        true
                    );

                    return;

                }


                if (
                    editingId === "new"
                ) {

                    addService(
                        data
                    );

                    showToast(
                        "Service added."
                    );

                }

                else {

                    updateService(
                        editingId,
                        data
                    );

                    showToast(
                        "Service updated."
                    );

                }


                editingId =
                    null;


                paint();

            }
        );

    }

}


/* =========================================================
   24. 404 PAGE
   ========================================================= */

function renderNotFound() {

    document.getElementById(
        "app"
    ).innerHTML = `

        <div class="page">

            <div class="container">


                <div class="empty">

                    <div class="big-icon">
                        404
                    </div>


                    <h1>
                        Page not found
                    </h1>


                    <a
                        class="btn btn-primary"
                        href="#/"
                    >

                        Go home

                    </a>


                </div>


            </div>

        </div>

    `;
}


/* =========================================================
   25. START APPLICATION
   ========================================================= */

getServices();


if (!location.hash) {

    location.hash =
        "#/";

}


refreshCurrentPage();
