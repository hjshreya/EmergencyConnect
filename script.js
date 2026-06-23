/* EmergencyConnect — vanilla JS app with hash router + localStorage */
(function () {
  "use strict";
  /* ============ STORAGE ============ */
  const store = {
    read(k, fb) { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; } },
    write(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
    remove(k) { localStorage.removeItem(k); }
  };
  const uid = (p = "") => p + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  /* ============ AUTH ============ */
  const AUTH_KEY = "ec_role";
  const getRole = () => store.read(AUTH_KEY, null);
  const setRole = (r) => store.write(AUTH_KEY, r);
  const logout = () => store.remove(AUTH_KEY);
  /* ============ CATEGORIES (with SVG icons) ============ */
  const ICONS = {
    hospital: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#8ca4b8" d="M4 15h40v3H4Z"/><path fill="#fff" d="M5 18h38v25.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V18Z"/><path fill="none" stroke="#45413c" stroke-linecap="round" stroke-linejoin="round" d="M5 18h38v25.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V18h0Z"/><path fill="#fff" d="M13.5 12.5h21v32h-21z"/><path fill="none" stroke="#45413c" stroke-linecap="round" stroke-linejoin="round" d="M13.5 12.5h21v32h-21z"/><path fill="#00b8f0" d="M18 33.5h12v11H18z"/><path fill="none" stroke="#45413c" stroke-linecap="round" stroke-linejoin="round" d="M18 33.5h12v11H18z"/><path fill="#ff6242" stroke="#45413c" stroke-linecap="round" stroke-linejoin="round" d="M27.5 19H26a.5.5 0 0 1-.5-.5V17a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5v1.5a.5.5 0 0 1-.5.5h-1.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5H22a.5.5 0 0 1 .5.5V24a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1.5a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5Z"/></svg>',
    ambulance: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#fff" stroke="#45413c" stroke-linecap="round" stroke-linejoin="round" d="m8.68 20.9l-1 3.44a2.49 2.49 0 0 1-1.15 1.47l-1.77 1a3.37 3.37 0 0 0-1.69 2.92v4.87a1.23 1.23 0 0 0 1.24 1.23h18V16.64h-8a5.87 5.87 0 0 0-5.63 4.26Z"/><path fill="#fff" stroke="#45413c" stroke-linecap="round" stroke-linejoin="round" d="M22.28 11.07h22.29v29.71H22.28Z"/><path fill="#656769" stroke="#45413c" d="M9.28 39.55a4.95 4.95 0 1 0 9.9 0a4.95 4.95 0 1 0-9.9 0Zm21.67 0a4.95 4.95 0 1 0 9.9 0a4.95 4.95 0 1 0-9.9 0Z"/><path fill="#ff6242" stroke="#45413c" stroke-linecap="round" stroke-linejoin="round" d="M37.76 17.88h-2.48V15.4h-3.71v2.48h-2.48v3.71h2.48v2.48h3.71v-2.48h2.48v-3.71z"/></svg>',
    police: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="#3e4347" d="M58.2 37.6L52.9 36c-1.1-.3-2.1-1.4-2.3-2.4l-2.2-9.2c-.2-1-1.3-1.9-2.4-1.9H27.7c-1.1 0-2.4 1-2.9 1.9l-5.3 9.4c-.5.9-1.8 1.9-2.8 2.2l-8.3 2.5c-1.1.3-2.2 1.8-2.5 2.8l.6 2l-1.6 1.8l-1 9.8h56.2V40.4c0-1.1-.9-2.5-1.9-2.8"/><path fill="#42ade2" d="M34.8 20.6h-2.6c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5h2.6v7"/><path fill="#f15744" d="M38.9 13.6h2.6c1.9 0 3.5 1.6 3.5 3.5s-1.6 3.5-3.5 3.5h-2.6v-7"/><path fill="#cbd1d6" d="M39.1 20.6v-7.4c0-1.2-1-2.2-2.2-2.2s-2.2 1-2.2 2.2v7.4H32v2.2h9.8v-2.2h-2.7"/><path fill="#dbb471" d="m32 40.6l1.1 3.4h3.6l-2.9 2.1l1.1 3.5l-2.9-2.2l-2.9 2.2l1.1-3.5l-2.9-2.1h3.6z"/><ellipse cx="17.1" cy="53.5" fill="#62727a" rx="8.4" ry="8.5"/><ellipse cx="46.9" cy="53.5" fill="#62727a" rx="8.4" ry="8.5"/></svg>',
    fire: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="#FF2A23" d="M118 95.22s.16-2.18.02-5.43c-.05-1.12-.54-2.79-.68-3.33c0-.02.7-3.75.7-3.77c.03-10.65.06-24.44-.04-25.6c-.17-1.91-1.39-2.6-3.29-2.77c-1.91-.17-21.27-.15-21.27-.15s.1-3.5.07-5.07c-.02-1.09-1.44-1.36-2.83-1.28c-1.65.1-72.29-.26-74.19-.09c-1.91.17-3.64.52-4.16 3.64S10.6 76.66 10.6 76.66s-3.64 2.6-4.68 3.98c-1.34 1.79-1.21 3.46-1.21 3.46l.87 24.95l13.69 3.64l93.72.52l12.82-5.37s.01-9.6.01-11.05c0-1.54-1.16-1.5-3.62-1.5c-1.47.03-4.2-.07-4.2-.07z"/><path fill="#B0B0B0" d="M114.14 30.48c-.14-1.74-1.09-2.39-4.2-2.53c-3.11-.14-63.67.22-64.97.22s-2.24 1.01-2.24 2.75s.07 19.17.07 19.17l46.56 11.57l23.41-7.1s.72-.49 1.01-1.43c.28-.94.5-20.91.36-22.65z"/><path fill="#4E433D" d="M22.78 111.47c.08 5.07 4.12 12.37 12.93 12.43s13.37-6.69 13.1-13.6c-.28-7.02-5.74-11.98-13.6-11.76c-7.36.21-12.54 5.91-12.43 12.93zm83.52-.54c-.1-5.07-4.18-12.35-12.98-12.37c-8.8-.02-13.34 6.75-13.04 13.65c.31 7.02 5.79 11.96 13.65 11.7c7.35-.24 12.51-5.96 12.37-12.98z"/></svg>',
    pharmacy: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#fff" stroke="#2859c5" stroke-width="3" stroke-linejoin="round" d="M29.325 3.24c-1.326-.176-2.453.761-2.745 2.066L24.635 14l9.45.147l1.973-6.3c.4-1.276-.108-2.651-1.344-3.162a22 22 0 0 0-2.65-.891a22 22 0 0 0-2.74-.553Z"/><path fill="#8fbffa" stroke="#2859c5" stroke-width="3" stroke-linejoin="round" d="M42.615 14.604c1.957.162 3.395 1.81 3.318 3.773c-.217 5.534-.935 10.047-1.7 13.43c-.82 3.629-3.08 6.474-6.242 7.87c.727.592 1.63 1.56 1.898 2.858c.243 1.18-.88 2.043-2.083 2.12C35.5 44.8 31.071 45 23.998 45c-7.074 0-11.5-.199-13.807-.345c-1.201-.077-2.324-.939-2.082-2.118c.292-1.42 1.346-2.446 2.097-3.016c-3.32-1.613-5.647-4.767-6.485-8.696a78 78 0 0 1-1.638-12.452a3.577 3.577 0 0 1 3.3-3.769C8.7 14.33 14.638 14 24 14s15.3.33 18.616.604Z"/><path fill="#fff" stroke="#2859c5" stroke-width="3" stroke-linejoin="round" d="M21.088 36.124c.027.897.57 1.675 1.46 1.79c.393.05.875.086 1.452.086s1.059-.036 1.453-.086c.89-.115 1.432-.893 1.46-1.79c.027-.912.057-2.274.074-4.137c1.863-.017 3.225-.047 4.137-.075c.897-.027 1.675-.57 1.79-1.46c.05-.393.086-.875.086-1.452s-.036-1.059-.086-1.453c-.115-.89-.893-1.432-1.79-1.46a205 205 0 0 0-4.137-.074a201 201 0 0 0-.075-4.137c-.027-.897-.57-1.675-1.46-1.79C25.06 20.036 24.578 20 24 20s-1.059.036-1.453.086c-.89.115-1.432.893-1.46 1.79a205 205 0 0 0-.074 4.137c-1.863.017-3.225.047-4.137.075c-.897.027-1.675.57-1.79 1.46c-.05.393-.086.875-.086 1.452s.036 1.059.086 1.453c.115.89.893 1.432 1.79 1.46c.912.027 2.274.057 4.137.074c.017 1.863.047 3.225.075 4.137"/></svg>',
    bloodbank: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><path fill="#D22F27" d="M16 19.308h25v12.496c0 3.828-2.52 6.93-5.63 6.93h-1.365c-3.13.567-3 5.292-3 5.292h-5.66s.13-4.725-3-5.292h-.714c-3.11 0-5.631-3.102-5.631-6.93V19.31zm35.086 1.208h1.419c1.05 0 1.902.852 1.902 1.903v7.77c0 1.05-.852 1.902-1.902 1.902h-1.419a1.902 1.902 0 0 1-1.902-1.902v-7.77c0-1.051.852-1.903 1.902-1.903z"/><path fill="#EA5A47" d="M32.007 30.836a3.513 3.513 0 1 1-7.013-.004s-.038-2.508 2.92-7.045c0 0 .555-.941 1.114-.062c2.959 4.537 2.979 7.111 2.979 7.111"/><g fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 19.308v-1.736a5.631 5.631 0 0 1 5.631-5.631H35.37a5.631 5.631 0 0 1 5.631 5.63v1.777"/><path d="M16 19.308h25v12.496c0 3.828-2.52 6.93-5.63 6.93h-1.365c-3.13.567-3 5.292-3 5.292h-5.66s.13-4.725-3-5.292h-.714c-3.11 0-5.631-3.102-5.631-6.93V19.31z"/></g></svg>'
  };
  const CATEGORIES = [
    { type: "hospital", label: "Hospital" },
    { type: "ambulance", label: "Ambulance" },
    { type: "police", label: "Police" },
    { type: "fire", label: "Fire Station" },
    { type: "pharmacy", label: "Pharmacy" },
    { type: "bloodbank", label: "Blood Bank" }
  ];
  const categoryLabel = (t) => (CATEGORIES.find(c => c.type === t) || {}).label || t;
  const catIcon = (t) => ICONS[t] || "";
  /* ============ SERVICES ============ */
  const SVC_KEY = "ec_services";
  const SEED = [
    { id: "h1", name: "AIIMS Delhi", type: "hospital", phone: "+911126588500", address: "Ansari Nagar, New Delhi", lat: 28.5672, lng: 77.21 },
    { id: "h2", name: "Safdarjung Hospital", type: "hospital", phone: "+911126707444", address: "Ansari Nagar West, New Delhi", lat: 28.5685, lng: 77.2069 },
    { id: "h3", name: "Fortis Escorts", type: "hospital", phone: "+911147135000", address: "Okhla Road, New Delhi", lat: 28.5535, lng: 77.2588 },
    { id: "a1", name: "CATS Ambulance Service", type: "ambulance", phone: "102", address: "Citywide, Delhi NCR", lat: 28.6139, lng: 77.209 },
    { id: "a2", name: "Dial 108 Ambulance", type: "ambulance", phone: "108", address: "Emergency Response", lat: 28.6304, lng: 77.2177 },
    { id: "p1", name: "Connaught Place Police Station", type: "police", phone: "100", address: "Connaught Place, New Delhi", lat: 28.6315, lng: 77.2167 },
    { id: "p2", name: "Saket Police Station", type: "police", phone: "+911126562100", address: "Saket, New Delhi", lat: 28.5245, lng: 77.2066 },
    { id: "f1", name: "Delhi Fire Service HQ", type: "fire", phone: "101", address: "Connaught Lane, New Delhi", lat: 28.6289, lng: 77.2196 },
    { id: "f2", name: "Laxmi Nagar Fire Station", type: "fire", phone: "101", address: "Laxmi Nagar, Delhi", lat: 28.6358, lng: 77.2773 },
    { id: "ph1", name: "Apollo Pharmacy", type: "pharmacy", phone: "+911860500500", address: "Karol Bagh, New Delhi", lat: 28.6519, lng: 77.1909 },
    { id: "ph2", name: "1mg Pharmacy", type: "pharmacy", phone: "+919999999999", address: "Saket, New Delhi", lat: 28.528, lng: 77.2186 },
    { id: "b1", name: "Red Cross Blood Bank", type: "bloodbank", phone: "+911123711551", address: "Red Cross Road, New Delhi", lat: 28.6189, lng: 77.2295 },
    { id: "b2", name: "Rotary Blood Bank", type: "bloodbank", phone: "+911129849393", address: "Tughlakabad Inst Area, Delhi", lat: 28.5161, lng: 77.2615 }
  ];
  function listServices() {
    const e = store.read(SVC_KEY, null);
    if (e && e.length) return e;
    store.write(SVC_KEY, SEED);
    return SEED;
  }
  function addService(d) { const l = listServices(); const it = { ...d, id: uid("s_") }; store.write(SVC_KEY, [it, ...l]); return it; }
  function updateService(id, patch) { store.write(SVC_KEY, listServices().map(s => s.id === id ? { ...s, ...patch } : s)); }
  function deleteService(id) { store.write(SVC_KEY, listServices().filter(s => s.id !== id)); }
  /* ============ REQUESTS ============ */
  const REQ_KEY = "ec_requests";
  const STATUSES = ["Pending", "Acknowledged", "In Progress", "Resolved"];
  function listRequests() { return store.read(REQ_KEY, []).slice().sort((a, b) => b.createdAt - a.createdAt); }
  function createRequest(d) {
    const list = store.read(REQ_KEY, []);
    const now = Date.now();
    const it = { ...d, id: uid("r_"), status: "Pending", createdAt: now, updatedAt: now };
    store.write(REQ_KEY, [it, ...list]); return it;
  }
  function updateRequestStatus(id, status) {
    store.write(REQ_KEY, store.read(REQ_KEY, []).map(r => r.id === id ? { ...r, status, updatedAt: Date.now() } : r));
  }
  /* ============ CONTACTS ============ */
  const CT_KEY = "ec_contacts";
  const listContacts = () => store.read(CT_KEY, []);
  const addContact = (d) => { const l = listContacts(); const it = { ...d, id: uid("c_") }; store.write(CT_KEY, [...l, it]); };
  const deleteContact = (id) => store.write(CT_KEY, listContacts().filter(c => c.id !== id));
  const buildSosSmsHref = (phone, name, lat, lng) => {
    const loc = (lat != null && lng != null) ? ` My location: https://www.google.com/maps/?q=${lat},${lng}` : "";
    const body = `SOS! This is ${name || "a contact"}. I need help.${loc}`;
    return `sms:${phone}?&body=${encodeURIComponent(body)}`;
  };
  /* ============ GEO ============ */
  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371, toRad = d => d * Math.PI / 180;
    const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  const formatDistance = (km) => km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
  const mapsNavUrl = (lat, lng) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const mapsLocUrl = (lat, lng) => `https://www.google.com/maps/?q=${lat},${lng}`;
  // Shared geo state
  const geo = { coords: null, loading: false, error: null };
  const geoListeners = [];
  function onGeo(fn) { geoListeners.push(fn); }
  function emitGeo() { geoListeners.forEach(fn => { try { fn(geo); } catch {} }); }
  function requestGeo() {
    if (!navigator.geolocation) { geo.error = "Geolocation not supported"; emitGeo(); return; }
    geo.loading = true; geo.error = null; emitGeo();
    navigator.geolocation.getCurrentPosition(
      (pos) => { geo.coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }; geo.loading = false; emitGeo(); },
      (err) => { geo.error = err.message || "Couldn't get location"; geo.loading = false; emitGeo(); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }
  /* ============ UTIL ============ */
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtDate = (t) => new Date(t).toLocaleString();
  function toast(msg, kind) {
    const el = document.getElementById("toast");
    el.textContent = msg; el.className = "toast show" + (kind === "error" ? " error" : "");
    clearTimeout(toast._t); toast._t = setTimeout(() => el.className = "toast", 2400);
  }
  function on(sel, ev, fn, root) {
    (root || document).querySelectorAll(sel).forEach(el => el.addEventListener(ev, fn));
  }
  /* ============ ROUTER ============ */
  const routes = {
    "": renderLanding,
    "login": renderLogin,
    "user/dashboard": renderUserDashboard,
    "user/nearby": renderNearby,
    "user/raise": renderRaise,
    "user/requests": renderMyRequests,
    "user/sos": renderSos,
    "admin/dashboard": renderAdminDashboard,
    "admin/requests": renderAdminRequests,
    "admin/services": renderAdminServices
  };
  function parseHash() {
    const h = location.hash.replace(/^#\/?/, "");
    const [path, qs] = h.split("?");
    const params = {};
    if (qs) qs.split("&").forEach(kv => { const [k, v] = kv.split("="); if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || ""); });
    return { path: path || "", params };
  }
  function navigate(to) { location.hash = "#/" + to.replace(/^\//, ""); }
  window.ecNav = navigate;
  function route() {
    const { path, params } = parseHash();
    const role = getRole();
    // Auth guards
    if (path.startsWith("user/") && role !== "user") { navigate(role === "admin" ? "admin/dashboard" : "login"); return; }
    if (path.startsWith("admin/") && role !== "admin") { navigate(role === "user" ? "user/dashboard" : "login"); return; }
    if (path === "" && role === "user") { navigate("user/dashboard"); return; }
    if (path === "" && role === "admin") { navigate("admin/dashboard"); return; }
    renderHeader(path);
    const handler = routes[path] || renderNotFound;
    handler(params);
  }
  window.addEventListener("hashchange", route);
  /* ============ HEADER ============ */
  function renderHeader(activePath) {
    const role = getRole();
    const USER_LINKS = [
      ["user/dashboard", "Dashboard"], ["user/nearby", "Nearby"],
      ["user/raise", "Raise Request"], ["user/sos", "SOS"], ["user/requests", "My Requests"]
    ];
    const ADMIN_LINKS = [
      ["admin/dashboard", "Dashboard"], ["admin/requests", "Requests"], ["admin/services", "Services"]
    ];
    const links = role === "admin" ? ADMIN_LINKS : role === "user" ? USER_LINKS : [];
    const navHtml = links.map(([p, l]) =>
      `<a href="#/${p}" class="${activePath === p ? "active" : ""}">${l}</a>`).join("");
    const tail = role
      ? `<span class="role-chip">${role}</span> <button class="btn btn-sm" id="hdrLogout">Logout</button>`
      : `<a href="#/login" class="btn btn-sm btn-primary">Sign in</a>`;
    document.getElementById("appHeader").outerHTML = `
      <header class="site-header" id="appHeader">
        <div class="header-inner">
          <a href="#/" class="brand"><span class="brand-icon">!</span> EmergencyConnect</a>
          <nav class="main-nav">${navHtml}</nav>
          <div style="display:flex;gap:8px;align-items:center">${tail}</div>
        </div>
      </header>`;
    const lo = document.getElementById("hdrLogout");
    if (lo) lo.addEventListener("click", () => { logout(); navigate("login"); });
  }
  /* ============ PAGES ============ */
  function renderLanding() {
    document.getElementById("app").innerHTML = `
      <section class="hero">
        <span class="badge">! Emergency response, in your pocket</span>
        <h1>Help is just a tap away.</h1>
        <p>Find the nearest hospital, ambulance, police, fire station, pharmacy or blood bank instantly — and raise an emergency request when seconds matter.</p>
        <div class="btn-row" style="justify-content:center">
          <a href="#/login" class="btn btn-primary btn-lg">Get Started</a>
          <a href="#features" class="btn btn-lg">Learn more</a>
        </div>
      </section>
      <h2 style="text-align:center;margin:28px 0 14px" id="features">Built for moments that count</h2>
      <div class="features">
        ${[
          ["📍", "Nearby services", "Geolocated hospitals, police, fire and more sorted by distance."],
          ["⚠️", "Raise a request", "File an emergency request with location auto-attached."],
          ["📞", "SOS contacts", "One-tap SMS to your trusted contacts with your live location."],
          ["🛡️", "Admin controls", "Admins can update request status and manage services."],
          ["👥", "User & Admin roles", "Switch between roles with a simple mock login."],
          ["🚨", "Call & navigate", "Direct call and Google Maps directions from every listing."]
        ].map(([i, t, d]) => `<div class="feature"><div class="ico">${i}</div><h3>${t}</h3><p class="muted" style="margin-top:4px;font-size:12px">${d}</p></div>`).join("")}
      </div>`;
  }
  function renderLogin() {
    document.getElementById("app").innerHTML = `
      <div class="login-wrap">
        <div class="card login-card">
          <div style="text-align:center;margin-bottom:14px">
            <div class="brand" style="justify-content:center"><span class="brand-icon">!</span> EmergencyConnect</div>
          </div>
          <h1 style="text-align:center;font-size:24px">Mock Login</h1>
          <p class="muted" style="text-align:center;margin:4px 0 16px">Pick a role to continue. (Demo only — no password.)</p>
          <button class="pick" data-role="user">
            <span class="ico">U</span>
            <span><span class="ttl">Continue as User</span><br><span class="ds">Find services, raise requests, manage SOS contacts</span></span>
          </button>
          <button class="pick" data-role="admin">
            <span class="ico">A</span>
            <span><span class="ttl">Continue as Admin</span><br><span class="ds">Manage services & update request statuses</span></span>
          </button>
        </div>
      </div>`;
    on(".pick", "click", (e) => {
      const r = e.currentTarget.dataset.role;
      setRole(r); navigate(r === "admin" ? "admin/dashboard" : "user/dashboard");
    });
  }
  function renderUserDashboard() {
    const recent = listRequests().slice(0, 3);
    document.getElementById("app").innerHTML = `
      <div class="page-head"><h1>Welcome back</h1><div class="sub">What do you need help with today?</div></div>
      <div class="qa-grid" style="margin-bottom:18px">
        <a class="qa" href="#/user/nearby"><span class="ico">📍</span><div><div class="ttl">Find nearby</div><div class="ds">Hospitals, police & more</div></div></a>
        <a class="qa" href="#/user/raise"><span class="ico">⚠️</span><div><div class="ttl">Raise request</div><div class="ds">Get help fast</div></div></a>
        <a class="qa" href="#/user/sos"><span class="ico">📞</span><div><div class="ttl">SOS contacts</div><div class="ds">Alert your people</div></div></a>
      </div>
      <h2 style="margin-bottom:10px">Emergency categories</h2>
      <div class="cat-grid" style="margin-bottom:20px">
        ${CATEGORIES.map(c => `<a class="cat-tile" href="#/user/nearby?category=${c.type}">${catIcon(c.type)}<span>${c.label}</span></a>`).join("")}
      </div>
      <div class="flex-between" style="margin-bottom:10px">
        <h2>Recent requests</h2>
        <a href="#/user/requests">View all</a>
      </div>
      ${recent.length === 0
        ? `<div class="empty"><div class="ico">📥</div><h3>No requests yet</h3><p class="muted">When you raise an emergency request, it will appear here.</p><div style="margin-top:10px"><a class="btn btn-primary" href="#/user/raise">Raise a request</a></div></div>`
        : recent.map(r => `
          <div class="card" style="display:flex;justify-content:space-between;align-items:center;gap:10px">
            <div style="display:flex;align-items:center;gap:10px;min-width:0">
              <span style="width:32px;height:32px;display:inline-flex">${catIcon(r.category)}</span>
              <div style="min-width:0">
                <div style="font-weight:700">${esc(r.description || "No description")}</div>
                <div class="muted" style="font-size:11px">${fmtDate(r.createdAt)}</div>
              </div>
            </div>
            <span class="badge ${r.status.replace(" ", ".")}">${r.status}</span>
          </div>`).join("")}
    `;
  }
  function locBar(extraBtnLabel) {
    const g = geo;
    let txt = "";
    if (g.loading) txt = `<span class="muted">Detecting your location…</span>`;
    else if (g.coords) txt = `<span style="color:var(--ok);font-weight:700">Location: ${g.coords.lat.toFixed(4)}, ${g.coords.lng.toFixed(4)}</span>`;
    else if (g.error) txt = `<span style="color:var(--primary)">${esc(g.error)}</span>`;
    else txt = `<span class="muted">Location not shared</span>`;
    return `
      <div class="card flex-between" style="margin-bottom:14px">
        <div>📍 ${txt}</div>
        <button class="btn btn-sm" id="locBtn">${g.coords ? "Refresh location" : (extraBtnLabel || "Get my location")}</button>
      </div>`;
  }
  function wireLocBtn(onUpdate) {
    const b = document.getElementById("locBtn");
    if (b) b.addEventListener("click", requestGeo);
    onGeo(() => onUpdate && onUpdate());
  }
  function renderNearby(params) {
    const category = params.category || "";
    const services = listServices();
    const list = category ? services.filter(s => s.type === category) : services;
    const items = geo.coords
      ? list.map(s => ({ s, d: haversine(geo.coords.lat, geo.coords.lng, s.lat, s.lng) })).sort((a, b) => a.d - b.d)
      : list.map(s => ({ s, d: undefined }));
    document.getElementById("app").innerHTML = `
      <div class="page-head"><h1>Nearby services</h1><div class="sub">${geo.coords ? "Sorted by distance from your location." : "Share your location for distance-sorted results."}</div></div>
      ${locBar()}
      <div class="pills" style="margin-bottom:14px">
        <button class="pill ${!category ? "active" : ""}" data-cat="">All</button>
        ${CATEGORIES.map(c => `<button class="pill ${category === c.type ? "active" : ""}" data-cat="${c.type}">${catIcon(c.type)} ${c.label}</button>`).join("")}
      </div>
      ${items.length === 0
        ? `<div class="empty"><div class="ico">📍</div><h3>No services found</h3><p class="muted">Try a different category or ask an admin to add services.</p></div>`
        : `<div class="list cols-2">${items.map(({ s, d }) => `
          <div class="service">
            <div class="service-top">
              ${catIcon(s.type)}
              <div style="flex:1;min-width:0">
                <div class="title-row"><h3>${esc(s.name)}</h3>${d != null ? `<span class="dist">${formatDistance(d)}</span>` : ""}</div>
                <div class="muted" style="font-size:11px">${categoryLabel(s.type)}</div>
                <div class="muted" style="margin-top:4px">${esc(s.address)}</div>
              </div>
            </div>
            <div class="btn-row">
              <a class="btn btn-primary" style="flex:1" href="tel:${esc(s.phone)}">📞 Call</a>
              <a class="btn" style="flex:1" href="${mapsNavUrl(s.lat, s.lng)}" target="_blank" rel="noreferrer">🧭 Navigate</a>
            </div>
          </div>`).join("")}</div>`}
    `;
    on(".pill", "click", (e) => {
      const c = e.currentTarget.dataset.cat;
      navigate("user/nearby" + (c ? `?category=${c}` : ""));
    });
    wireLocBtn(() => renderNearby(params));
    if (!geo.coords && !geo.loading) requestGeo();
  }
  function renderRaise() {
    document.getElementById("app").innerHTML = `
      <div style="max-width:640px;margin:0 auto">
        <div class="page-head"><h1>⚠️ Raise an emergency request</h1><div class="sub">Fill in the details below. Your location will be attached automatically.</div></div>
        <form id="raiseForm" class="card stack">
          <div class="field">
            <label>Emergency type</label>
            <div class="cat-grid" id="catPick" style="grid-template-columns:repeat(3,1fr)">
              ${CATEGORIES.map((c, i) => `<button type="button" class="pill ${i === 1 ? "active" : ""}" data-type="${c.type}" style="padding:10px;justify-content:center">${c.label}</button>`).join("")}
            </div>
          </div>
          <div class="grid-2">
            <div class="field"><label>Your name *</label><input id="rName" maxlength="80" required></div>
            <div class="field"><label>Phone *</label><input id="rPhone" type="tel" maxlength="20" required></div>
          </div>
          <div class="field"><label>What's happening?</label><textarea id="rDesc" maxlength="500" placeholder="Briefly describe the situation…"></textarea></div>
          <div id="locSlot"></div>
          <button type="submit" class="btn btn-primary btn-lg btn-block" id="rSubmit">Submit request</button>
        </form>
      </div>`;
    let category = "ambulance";
    on("#catPick .pill", "click", (e) => {
      category = e.currentTarget.dataset.type;
      document.querySelectorAll("#catPick .pill").forEach(p => p.classList.toggle("active", p.dataset.type === category));
    });
    function paintLoc() { document.getElementById("locSlot").innerHTML = locBar("Share location"); wireLocBtn(paintLoc); }
    paintLoc();
    if (!geo.coords && !geo.loading) requestGeo();
    document.getElementById("raiseForm").addEventListener("submit", (e) => {
      e.preventDefault();
      if (!geo.coords) return toast("Please share your location first.", "error");
      const name = document.getElementById("rName").value.trim();
      const phone = document.getElementById("rPhone").value.trim();
      if (!name || !phone) return toast("Name and phone are required.", "error");
      createRequest({ category, description: document.getElementById("rDesc").value.trim(), name, phone, lat: geo.coords.lat, lng: geo.coords.lng });
      toast("Emergency request raised. Help is on the way.");
      navigate("user/requests");
    });
  }
  function timeline(status) {
    const idx = STATUSES.indexOf(status);
    return `<div class="timeline">${STATUSES.map((s, i) => {
      const done = i <= idx;
      return `<div class="step"><div class="dot ${done ? "done" : ""}">${done ? "✓" : i + 1}</div><div class="lbl">${s}</div></div>${i < STATUSES.length - 1 ? `<div class="bar ${i < idx ? "done" : ""}"></div>` : ""}`;
    }).join("")}</div>`;
  }
  function renderMyRequests() {
    const reqs = listRequests();
    document.getElementById("app").innerHTML = `
      <div class="page-head"><h1>My requests</h1><div class="sub">Track the status of every request you've raised.</div></div>
      ${reqs.length === 0
        ? `<div class="empty"><div class="ico">📥</div><h3>No requests yet</h3><p class="muted">When you raise an emergency request, it will appear here.</p><div style="margin-top:10px"><a class="btn btn-primary" href="#/user/raise">Raise a request</a></div></div>`
        : reqs.map(r => `
          <article class="card stack">
            <div class="flex-between" style="align-items:flex-start">
              <div style="display:flex;gap:10px;min-width:0">
                <span style="width:40px;height:40px;display:inline-flex">${catIcon(r.category)}</span>
                <div style="min-width:0">
                  <div style="font-weight:700">${categoryLabel(r.category)}</div>
                  <div class="muted" style="font-size:11px">${fmtDate(r.createdAt)}</div>
                  ${r.description ? `<p style="margin-top:4px">${esc(r.description)}</p>` : ""}
                </div>
              </div>
              <span class="badge ${r.status.replace(" ", ".")}">${r.status}</span>
            </div>
            ${timeline(r.status)}
            <div class="tag-row"><a href="${mapsLocUrl(r.lat, r.lng)}" target="_blank" rel="noreferrer">📍 View location</a></div>
          </article>`).join("")}
    `;
  }
  function renderSos() {
    function paint() {
      const contacts = listContacts();
      document.getElementById("app").innerHTML = `
        <div style="max-width:640px;margin:0 auto">
          <div class="page-head"><h1>SOS Contacts</h1><div class="sub">Trusted people to alert in an emergency. SOS sends an SMS with your live location.</div></div>
          <div id="locSlot"></div>
          <form id="addContact" class="card stack">
            <h3>Add a contact</h3>
            <div class="grid-2">
              <input id="cName" placeholder="Name" maxlength="80">
              <input id="cPhone" placeholder="Phone number" type="tel" maxlength="20">
            </div>
            <button type="submit" class="btn btn-primary">Add contact</button>
          </form>
          ${contacts.length === 0
            ? `<div class="empty"><div class="ico">📞</div><h3>No SOS contacts yet</h3><p class="muted">Add the people you'd want alerted in an emergency.</p></div>`
            : `<div>${contacts.map(c => `
                <div class="card flex-between">
                  <div><div style="font-weight:700">${esc(c.name)}</div><div class="muted">${esc(c.phone)}</div></div>
                  <div class="btn-row">
                    <a class="btn btn-primary btn-sm" href="${buildSosSmsHref(c.phone, c.name, geo.coords && geo.coords.lat, geo.coords && geo.coords.lng)}">✉ Send SOS</a>
                    <button class="btn btn-sm" data-del="${c.id}">🗑</button>
                  </div>
                </div>`).join("")}</div>`}
        </div>`;
      document.getElementById("locSlot").innerHTML = locBar();
      wireLocBtn(paint);
      document.getElementById("addContact").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("cName").value.trim();
        const phone = document.getElementById("cPhone").value.trim();
        if (!name || !phone) return toast("Name and phone are required.", "error");
        addContact({ name, phone }); toast("Contact added."); paint();
      });
      on("[data-del]", "click", (e) => { deleteContact(e.currentTarget.dataset.del); paint(); });
    }
    paint();
    if (!geo.coords && !geo.loading) requestGeo();
  }
  function renderAdminDashboard() {
    const reqs = listRequests();
    const svcs = listServices();
    const by = (s) => reqs.filter(r => r.status === s).length;
    document.getElementById("app").innerHTML = `
      <div class="page-head"><h1>Admin overview</h1><div class="sub">Live snapshot of the EmergencyConnect system.</div></div>
      <div class="stats" style="margin-bottom:18px">
        <div class="stat"><div class="num">${reqs.length}</div><div class="muted">Total requests</div></div>
        ${STATUSES.map(s => `<div class="stat"><div class="num">${by(s)}</div><span class="badge ${s.replace(" ", ".")}">${s}</span></div>`).join("")}
      </div>
      <div class="flex-between" style="margin-bottom:10px"><h2>Requests by category</h2><a href="#/admin/requests">Manage requests</a></div>
      <div class="cat-grid" style="margin-bottom:18px">
        ${CATEGORIES.map(c => `<div class="cat-tile">${catIcon(c.type)}<div style="font-size:22px;font-weight:700;font-family:'Times New Roman',serif">${reqs.filter(r => r.category === c.type).length}</div><div class="muted">${c.label}</div></div>`).join("")}
      </div>
      <div class="card flex-between">
        <div><div style="font-weight:700">Services in directory</div><div class="muted">${svcs.length} services across all categories.</div></div>
        <a href="#/admin/services">Manage services →</a>
      </div>`;
  }
  function renderAdminRequests() {
    let filter = "All";
    function paint() {
      const reqs = listRequests();
      const list = filter === "All" ? reqs : reqs.filter(r => r.status === filter);
      document.getElementById("app").innerHTML = `
        <div class="page-head"><h1>All emergency requests</h1><div class="sub">Review and update the status of incoming requests.</div></div>
        <div class="pills" style="margin-bottom:14px">
          ${["All", ...STATUSES].map(s => `<button class="pill ${filter === s ? "active" : ""}" data-f="${s}">${s}</button>`).join("")}
        </div>
        ${list.length === 0
          ? `<div class="empty"><div class="ico">📥</div><h3>No requests in this view</h3></div>`
          : list.map(r => `
            <article class="card">
              <div style="display:flex;gap:10px;align-items:flex-start">
                <span style="width:40px;height:40px;display:inline-flex">${catIcon(r.category)}</span>
                <div style="flex:1;min-width:0">
                  <div class="flex-between" style="align-items:flex-start">
                    <div>
                      <div style="font-weight:700">${categoryLabel(r.category)}</div>
                      <div class="muted" style="font-size:11px">${fmtDate(r.createdAt)} • by ${esc(r.name)}</div>
                    </div>
                    <span class="badge ${r.status.replace(" ", ".")}">${r.status}</span>
                  </div>
                  ${r.description ? `<p style="margin-top:6px">${esc(r.description)}</p>` : ""}
                  <div class="tag-row">
                    <a href="tel:${esc(r.phone)}">📞 ${esc(r.phone)}</a>
                    <a href="${mapsLocUrl(r.lat, r.lng)}" target="_blank" rel="noreferrer">📍 View location</a>
                  </div>
                  <div style="margin-top:8px;display:flex;align-items:center;gap:8px">
                    <label style="margin:0">Update status:</label>
                    <select data-id="${r.id}" class="statusSel" style="width:auto">
                      ${STATUSES.map(s => `<option ${s === r.status ? "selected" : ""}>${s}</option>`).join("")}
                    </select>
                  </div>
                </div>
              </div>
            </article>`).join("")}
      `;
      on(".pill", "click", (e) => { filter = e.currentTarget.dataset.f; paint(); });
      on(".statusSel", "change", (e) => {
        updateRequestStatus(e.currentTarget.dataset.id, e.currentTarget.value);
        toast(`Status updated to ${e.currentTarget.value}`); paint();
      });
    }
    paint();
  }
  function renderAdminServices() {
    let editingId = null;
    let draft = { name: "", type: "hospital", phone: "", address: "", lat: "", lng: "" };
    let open = false;
    function paint() {
      const svcs = listServices();
      document.getElementById("app").innerHTML = `
        <div class="flex-between" style="margin-bottom:14px">
          <div><h1>Services management</h1><div class="sub muted">Add, edit, or remove emergency services.</div></div>
          <button class="btn btn-primary" id="newSvc">＋ New service</button>
        </div>
        ${svcs.length === 0
          ? `<div class="empty"><div class="ico">🏢</div><h3>No services yet</h3><p class="muted">Add your first service to get started.</p></div>`
          : `<div style="overflow:auto"><table>
              <thead><tr><th>Service</th><th>Category</th><th>Phone</th><th>Location</th><th style="text-align:right">Actions</th></tr></thead>
              <tbody>${svcs.map(s => `
                <tr>
                  <td><div style="font-weight:700">${esc(s.name)}</div><div class="muted">${esc(s.address)}</div></td>
                  <td><span style="display:inline-flex;align-items:center;gap:6px"><span style="width:20px;height:20px;display:inline-flex">${catIcon(s.type)}</span>${categoryLabel(s.type)}</span></td>
                  <td>${esc(s.phone)}</td>
                  <td class="muted">${s.lat.toFixed(3)}, ${s.lng.toFixed(3)}</td>
                  <td style="text-align:right"><div class="btn-row" style="justify-content:flex-end">
                    <button class="btn btn-sm" data-edit="${s.id}">✎</button>
                    <button class="btn btn-sm" data-del="${s.id}">🗑</button>
                  </div></td>
                </tr>`).join("")}</tbody></table></div>`}
        ${open ? renderModal() : ""}
      `;
      document.getElementById("newSvc").addEventListener("click", () => { editingId = null; draft = { name: "", type: "hospital", phone: "", address: "", lat: "", lng: "" }; open = true; paint(); });
      on("[data-edit]", "click", (e) => {
        const s = listServices().find(x => x.id === e.currentTarget.dataset.edit);
        editingId = s.id; draft = { name: s.name, type: s.type, phone: s.phone, address: s.address, lat: String(s.lat), lng: String(s.lng) }; open = true; paint();
      });
      on("[data-del]", "click", (e) => {
        if (!confirm("Delete this service?")) return;
        deleteService(e.currentTarget.dataset.del); paint();
      });
      if (open) wireModal();
    }
    function renderModal() {
      return `
        <div class="modal-back" id="mback">
          <div class="modal" id="mbox">
            <div class="modal-head"><h2>${editingId ? "Edit service" : "New service"}</h2><button class="btn btn-sm" id="mClose">✕</button></div>
            <form id="svcForm" class="stack">
              <div class="field"><label>Name *</label><input id="dName" value="${esc(draft.name)}" maxlength="120" required></div>
              <div class="field"><label>Category *</label>
                <select id="dType">${CATEGORIES.map(c => `<option value="${c.type}" ${c.type === draft.type ? "selected" : ""}>${c.label}</option>`).join("")}</select>
              </div>
              <div class="grid-2">
                <div class="field"><label>Phone *</label><input id="dPhone" value="${esc(draft.phone)}" maxlength="20" required></div>
                <div class="field"><label>Address</label><input id="dAddr" value="${esc(draft.address)}" maxlength="200"></div>
              </div>
              <div class="field">
                <div class="flex-between"><label style="margin:0">Coordinates *</label><button type="button" id="useLoc" class="btn btn-sm">📍 Use my location</button></div>
                <div class="grid-2" style="margin-top:6px">
                  <input id="dLat" placeholder="Latitude" value="${esc(draft.lat)}" required>
                  <input id="dLng" placeholder="Longitude" value="${esc(draft.lng)}" required>
                </div>
              </div>
              <div class="btn-row" style="justify-content:flex-end">
                <button type="button" class="btn" id="mCancel">Cancel</button>
                <button type="submit" class="btn btn-primary">${editingId ? "Save changes" : "Create service"}</button>
              </div>
            </form>
          </div>
        </div>`;
    }
    function close() { open = false; paint(); }
    function wireModal() {
      document.getElementById("mback").addEventListener("click", (e) => { if (e.target.id === "mback") close(); });
      document.getElementById("mClose").addEventListener("click", close);
      document.getElementById("mCancel").addEventListener("click", close);
      document.getElementById("useLoc").addEventListener("click", () => {
        requestGeo();
        const tick = setInterval(() => {
          if (geo.coords) { document.getElementById("dLat").value = geo.coords.lat; document.getElementById("dLng").value = geo.coords.lng; clearInterval(tick); }
          else if (!geo.loading) clearInterval(tick);
        }, 250);
      });
      document.getElementById("svcForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("dName").value.trim();
        const phone = document.getElementById("dPhone").value.trim();
        const lat = parseFloat(document.getElementById("dLat").value);
        const lng = parseFloat(document.getElementById("dLng").value);
        const type = document.getElementById("dType").value;
        const address = document.getElementById("dAddr").value.trim();
        if (!name || !phone || isNaN(lat) || isNaN(lng)) return toast("All fields required, and lat/lng must be numbers.", "error");
        const payload = { name, type, phone, address, lat, lng };
        if (editingId) { updateService(editingId, payload); toast("Service updated."); }
        else { addService(payload); toast("Service added."); }
        close();
      });
    }
    paint();
  }
  function renderNotFound() {
    document.getElementById("app").innerHTML = `<div class="empty"><div class="ico">404</div><h3>Page not found</h3><p class="muted">That page doesn't exist.</p><div style="margin-top:10px"><a class="btn btn-primary" href="#/">Go home</a></div></div>`;
  }
  /* ============ BOOT ============ */
  if (!location.hash) location.hash = "#/";
  route();
})();
