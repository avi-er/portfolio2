/* =========================================================
   AVINASH P — PORTFOLIO SCRIPT
   ========================================================= */

"use strict";


/* =========================================================
   DOM
   ========================================================= */

const body = document.body;
const navbar = document.getElementById("navbar");
const themeToggle = document.getElementById("themeToggle");
const languageSelect = document.getElementById("languageSelect");
const menuButton = document.getElementById("menuButton");
const mobileNav = document.getElementById("mobileNav");
const scrollProgress = document.getElementById("scrollProgress");
const backTop = document.getElementById("backTop");
const currentYear = document.getElementById("currentYear");

const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const messageCounter = document.getElementById("messageCounter");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

const toastContainer = document.getElementById("toastContainer");


/* =========================================================
   YEAR
   ========================================================= */

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}


/* =========================================================
   THEME
   ========================================================= */

const savedTheme = localStorage.getItem("avinash-theme");

if (savedTheme === "light" || savedTheme === "dark") {
  body.dataset.theme = savedTheme;
} else {
  const systemLight = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches;

  body.dataset.theme = systemLight ? "light" : "dark";
}

function updateThemeMeta() {
  const themeColor = document.querySelector('meta[name="theme-color"]');

  if (!themeColor) return;

  themeColor.setAttribute(
    "content",
    body.dataset.theme === "light"
      ? "#f5f8fc"
      : "#07111f"
  );
}

updateThemeMeta();
themeToggle?.setAttribute("aria-pressed", String(body.dataset.theme === "light"));

themeToggle?.addEventListener("click", () => {

  const nextTheme =
    body.dataset.theme === "light"
      ? "dark"
      : "light";

  body.dataset.theme = nextTheme;
  themeToggle.setAttribute("aria-pressed", String(nextTheme === "light"));

  localStorage.setItem("avinash-theme", nextTheme);

  updateThemeMeta();

  showToast(
    "success",
    nextTheme === "light" ? "Light Mode" : "Dark Mode",
    "Theme preference updated."
  );
});


/* =========================================================
   MOBILE MENU
   ========================================================= */

function closeMobileMenu() {
  menuButton.classList.remove("open");
  mobileNav.classList.remove("open");

  menuButton.setAttribute("aria-expanded", "false");

  body.classList.remove("menu-open");
}

menuButton?.addEventListener("click", () => {

  const isOpen = mobileNav.classList.toggle("open");

  menuButton.classList.toggle("open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));

  body.classList.toggle("menu-open", isOpen);
});

document.querySelectorAll(".mobile-nav a").forEach(link => {
  link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("click", event => {

  if (
    mobileNav.classList.contains("open") &&
    !mobileNav.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    closeMobileMenu();
  }

});


/* =========================================================
   NAVBAR + SCROLL
   ========================================================= */

function handleScroll() {

  const scrollTop = window.scrollY;
  const documentHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress =
    documentHeight > 0
      ? (scrollTop / documentHeight) * 100
      : 0;

  scrollProgress.style.width = `${progress}%`;

  navbar.classList.toggle("scrolled", scrollTop > 30);

  backTop.classList.toggle("show", scrollTop > 500);

  updateActiveNavigation();
}

window.addEventListener("scroll", handleScroll, {
  passive: true
});


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

const sections = [
  "home",
  "about",
  "skills",
  "projects",
  "education",
  "ncc",
  "sports",
  "what-i-bring",
  "interests",
  "career",
  "resume",
  "contact"
];

function updateActiveNavigation() {

  const currentPosition = window.scrollY + 160;

  let currentSection = "home";

  sections.forEach(id => {

    const section = document.getElementById(id);

    if (!section) return;

    if (currentPosition >= section.offsetTop) {
      currentSection = id;
    }

  });

  document.querySelectorAll(".nav-link, .mobile-nav a").forEach(link => {
    const linkSection = link.dataset.nav || link.getAttribute("href")?.slice(1);
    const isActive = linkSection === currentSection;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

handleScroll();

/* =========================================================
   SMOOTH INTERNAL LINKS
   ========================================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

  link.addEventListener("click", event => {

    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  });

});


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }

    });

  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -45px 0px"
  }
);

revealElements.forEach(element => {
  revealObserver.observe(element);
});


/* =========================================================
   BACK TO TOP
   ========================================================= */

backTop?.addEventListener("click", () => {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

});


/* =========================================================
   RIPPLE EFFECT
   ========================================================= */

document.querySelectorAll(".btn").forEach(button => {

  button.classList.add("ripple");

  button.addEventListener("click", event => {

    const rect = button.getBoundingClientRect();

    const ripple = document.createElement("span");

    ripple.className = "ripple-effect";

    ripple.style.left =
      `${event.clientX - rect.left}px`;

    ripple.style.top =
      `${event.clientY - rect.top}px`;

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);

  });

  const hero = document.querySelector(".hero");
  let spotlightFrame = 0;

  if (
    hero &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    hero.addEventListener("pointermove", event => {
      if (spotlightFrame) {
        cancelAnimationFrame(spotlightFrame);
      }

      spotlightFrame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        hero.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
        hero.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
        spotlightFrame = 0;
      });
    }, { passive: true });
  }

});


/* =========================================================
   LANGUAGE SYSTEM
   ========================================================= */

const translations = {
  ta: {
    text: {
      "Home": "முகப்பு", "About": "என்னைப் பற்றி", "Skills": "திறன்கள்", "Projects": "திட்டங்கள்",
      "Education": "கல்வி", "NCC": "என்.சி.சி.", "Sports": "விளையாட்டு", "Contact": "தொடர்பு",
      "What I Bring": "எனது பலங்கள்", "Interests": "ஆர்வங்கள்", "Career Objective": "தொழில் நோக்கம்",
      "Resume": "சுயவிவரம்", "Computer Science Student": "கணினி அறிவியல் மாணவர்",
      "HELLO, I'M": "வணக்கம், நான்", "B.E. Computer Science & Engineering Student": "கணினி அறிவியல் மற்றும் பொறியியல் மாணவர்",
      "🎖 NCC Cadet": "🎖 என்.சி.சி. மாணவர்", "🏆 Sports Person": "🏆 விளையாட்டு வீரர்",
      "💻 Tech Enthusiast": "💻 தொழில்நுட்ப ஆர்வலர்",
      "Passionate about technology, software development, problem solving, artificial intelligence and building practical digital solutions.": "தொழில்நுட்பம், மென்பொருள் மேம்பாடு, சிக்கல் தீர்வு, செயற்கை நுண்ணறிவு மற்றும் பயனுள்ள டிஜிட்டல் தீர்வுகளை உருவாக்குவதில் ஆர்வம் கொண்டவர்.",
      "🚀": "🚀", "Explore Projects": "திட்டங்களைப் பாருங்கள்", "📩": "📩", "Contact Me": "என்னைத் தொடர்புகொள்ளுங்கள்",
      "View Resume →": "சுயவிவரத்தைப் பாருங்கள் →", "01": "01", "Featured Project": "சிறப்புத் திட்டம்",
      "∞": "∞", "Learning Mindset": "கற்றல் மனப்பான்மை", "3": "3", "Core Identities": "முக்கிய அடையாளங்கள்",
      "AVINASH P": "அவினாஷ் பி", "CSE STUDENT": "கணினி அறிவியல் மாணவர்", "</>": "</>",
      "Code": "குறியீடு", "Build • Learn • Improve": "உருவாக்கு • கல் • மேம்படுத்து", "AI": "AI",
      "Innovation": "புதுமை", "Technology & Ideas": "தொழில்நுட்பம் மற்றும் யோசனைகள்",
      "Scroll to explore": "மேலும் காண உருட்டவும்", "↓": "↓", "01 / ABOUT": "01 / என்னைப் பற்றி",
      "Passionate About Technology": "தொழில்நுட்பத்தின் மீது ஆர்வம்", "Technology, learning and practical problem solving.": "தொழில்நுட்பம், கற்றல் மற்றும் நடைமுறைச் சிக்கல் தீர்வு.",
      "👤": "👤", "Who I Am": "நான் யார்", "I’m": "நான்", ", a B.E. Computer Science and Engineering student at": ", கணினி அறிவியல் மற்றும் பொறியியல் மாணவர்",
      ", with a strong interest in technology, software development, and building practical digital solutions.": ", தொழில்நுட்பம், மென்பொருள் மேம்பாடு மற்றும் பயனுள்ள டிஜிட்டல் தீர்வுகளை உருவாக்குவதில் மிகுந்த ஆர்வம் கொண்டவர்.",
      "I am interested in": "எனக்கு ஆர்வமுள்ள துறைகள்",
      "software development, web technologies, artificial intelligence, problem-solving, and innovative technology solutions": "மென்பொருள் மேம்பாடு, இணையத் தொழில்நுட்பங்கள், செயற்கை நுண்ணறிவு, சிக்கல் தீர்வு மற்றும் புதுமையான தொழில்நுட்பத் தீர்வுகள்",
      ". I enjoy learning new concepts, exploring emerging technologies, and applying my knowledge to create useful and meaningful projects.": ". புதிய கருத்துகளைக் கற்பது, வளர்ந்து வரும் தொழில்நுட்பங்களை ஆராய்வது மற்றும் பயனுள்ள திட்டங்களை உருவாக்க அறிவைப் பயன்படுத்துவது எனக்கு மகிழ்ச்சி அளிக்கிறது.",
      "🎖": "🎖", "Beyond Technology": "தொழில்நுட்பத்திற்கு அப்பால்", "I am also an": "நானும் ஒரு",
      "NCC Cadet and sports person": "என்.சி.சி. மாணவர் மற்றும் விளையாட்டு வீரர்",
      ". These experiences have helped me develop": ". இந்த அனுபவங்கள் எனக்கு வளர்த்துத் தந்தவை",
      "discipline, leadership, teamwork, confidence, consistency, and perseverance": "ஒழுக்கம், தலைமைத்துவம், குழுப்பணி, நம்பிக்கை, தொடர்ச்சி மற்றும் விடாமுயற்சி",
      "Discipline": "ஒழுக்கம்", "Leadership": "தலைமைத்துவம்", "Teamwork": "குழுப்பணி", "Confidence": "தன்னம்பிக்கை",
      "“": "“", "I believe that combining technical knowledge, discipline, creativity, and teamwork can help transform ideas into meaningful real-world solutions.": "தொழில்நுட்ப அறிவு, ஒழுக்கம், படைப்பாற்றல் மற்றும் குழுப்பணி ஆகியவற்றை இணைப்பது யோசனைகளை அர்த்தமுள்ள நிஜ உலகத் தீர்வுகளாக மாற்ற உதவும் என்று நம்புகிறேன்.",
      "02 / SKILLS": "02 / திறன்கள்", "Technical": "தொழில்நுட்ப", "Technologies and concepts I am developing and working with.": "நான் கற்று, பணியாற்றி வரும் தொழில்நுட்பங்களும் கருத்துகளும்.",
      "⌘": "⌘", "Programming": "நிரலாக்கம்", "C": "C", "C++": "C++", "Java": "Java", "Python": "Python",
      "Web Development": "இணைய மேம்பாடு", "HTML": "HTML", "CSS": "CSS", "JavaScript": "JavaScript",
      "▣": "▣", "Database": "தரவுத்தளம்", "SQL": "SQL", "⌬": "⌬", "Computer Science": "கணினி அறிவியல்",
      "Data Structures": "தரவு கட்டமைப்புகள்", "OOP": "பொருள் நோக்கு நிரலாக்கம்", "Algorithms": "அல்காரிதங்கள்",
      "Problem Solving": "சிக்கல் தீர்வு", "⚙": "⚙", "Tools": "கருவிகள்", "Git": "Git", "GitHub": "GitHub",
      "VS Code": "VS Code", "✦": "✦", "Artificial Intelligence": "செயற்கை நுண்ணறிவு",
      "Web Applications": "இணையப் பயன்பாடுகள்", "Smart Technology": "நுண்ணறிவுத் தொழில்நுட்பம்",
      "03 / FEATURED PROJECT": "03 / சிறப்புத் திட்டம்", "Building Solutions That": "தீர்வுகளை உருவாக்குதல்",
      "Matter": "முக்கியம்", "My featured project and practical technology work.": "எனது சிறப்புத் திட்டமும் நடைமுறைத் தொழில்நுட்பப் பணியும்.",
      "FEATURED PROJECT": "சிறப்புத் திட்டம்", "MARUDHAM 360": "மருதம் 360",
      "AI-Powered Smart Agriculture & Farmer Support Platform": "செயற்கை நுண்ணறிவு சார்ந்த நவீன வேளாண்மை மற்றும் விவசாயிகள் ஆதரவு தளம்",
      "AI-Powered": "AI சார்ந்த", "Satellite-Enabled": "செயற்கைக்கோள் ஆதரவு", "Offline-First": "ஆஃப்லைன் முன்னுரிமை",
      "A smart agriculture ecosystem designed to support farmers across crop planning, cultivation, monitoring, harvesting, post-harvest management, market access and farmer support.": "பயிர்த் திட்டமிடல், சாகுபடி, கண்காணிப்பு, அறுவடை, அறுவடைக்குப் பிந்தைய மேலாண்மை, சந்தை அணுகல் மற்றும் விவசாயிகள் ஆதரவு என அனைத்திலும் உதவும் நவீன வேளாண்மைச் சூழல்.",
      "AI Crop Intelligence": "AI பயிர் நுண்ணறிவு", "02": "02", "Smart Farm Management": "நவீன பண்ணை மேலாண்மை",
      "03": "03", "Satellite & Location Intelligence": "செயற்கைக்கோள் மற்றும் இட நுண்ணறிவு", "04": "04",
      "Crop Lifecycle Management": "பயிர் வாழ்க்கைச் சுழற்சி மேலாண்மை", "05": "05", "Market & Finance": "சந்தை மற்றும் நிதி",
      "06": "06", "Post-Harvest Support": "அறுவடைக்குப் பிந்தைய ஆதரவு", "07": "07",
      "Local Agriculture Network": "உள்ளூர் வேளாண்மை வலையமைப்பு", "08": "08",
      "Farmer Community & Voice Support": "விவசாயிகள் சமூகம் மற்றும் குரல் வழி ஆதரவு",
      "🚀 View Live Project": "🚀 நேரடித் திட்டத்தைப் பாருங்கள்", "▶ Watch Demo Video": "▶ செயல்விளக்க வீடியோவைப் பாருங்கள்",
      "APP OVERVIEW": "செயலி மேலோட்டம்", "Explore the Interface": "செயலி இடைமுகத்தைப் பாருங்கள்",
      "Click any screen to expand": "பெரிதாகப் பார்க்க திரையைத் தேர்ந்தெடுக்கவும்", "Home": "முகப்பு",
      "Landing Experience": "வரவேற்புப் பக்கம்", "Sign In": "உள்நுழைவு", "Secure Entry": "பாதுகாப்பான நுழைவு",
      "Dashboard": "முகப்புப் பலகை", "Smart Overview": "நுண்ணறிவு மேலோட்டம்", "Market": "சந்தை",
      "Market Intelligence": "சந்தை நுண்ணறிவு", "Farmer Hub": "விவசாயிகள் மையம்",
      "Community Support": "சமூக ஆதரவு", "Navigation": "வழிசெலுத்தல்", "Easy Access": "எளிய அணுகல்",
      "04 / EDUCATION": "04 / கல்வி", "Academic": "கல்விப்", "Journey": "பயணம்", "🎓": "🎓",
      "CURRENTLY PURSUING": "தற்போது பயிலும் படிப்பு", "B.E. Computer Science & Engineering": "கணினி அறிவியல் மற்றும் பொறியியல் இளங்கலை",
      "📍": "📍", "Chennai, Tamil Nadu": "சென்னை, தமிழ்நாடு", "BE": "BE", "CSE": "CSE",
      "05 / BEYOND TECHNOLOGY": "05 / தொழில்நுட்பத்திற்கு அப்பால்", "Discipline, Character": "ஒழுக்கம், பண்பு",
      "& Growth": "மற்றும் வளர்ச்சி", "PERSONAL DEVELOPMENT": "தனிநபர் வளர்ச்சி", "NCC Journey": "என்.சி.சி. பயணம்",
      "Being an NCC Cadet has been an important part of my personal development.": "என்.சி.சி. மாணவராக இருப்பது எனது தனிநபர் வளர்ச்சியின் முக்கியப் பகுதியாகும்.",
      "Responsibility": "பொறுப்புணர்வு", "Time Management": "நேர மேலாண்மை", "🏆": "🏆",
      "CHARACTER BUILDING": "பண்பு வளர்ச்சி", "As a sports person, I believe sports play an important role in building character.": "விளையாட்டு பண்பை வளர்ப்பதில் முக்கியப் பங்கு வகிக்கிறது என்று நான் நம்புகிறேன்.",
      "Team Spirit": "குழு உணர்வு", "Consistency": "தொடர்ச்சி", "Dedication": "அர்ப்பணிப்பு",
      "Competitive Mindset": "போட்டி மனப்பான்மை", "Perseverance": "விடாமுயற்சி", "Goal-Oriented Thinking": "இலக்கு நோக்கிய சிந்தனை",
      "06 / STRENGTHS": "06 / பலங்கள்", "What I": "எனது", "Bring": "பங்களிப்பு",
      "Qualities I bring to learning, teamwork and problem solving.": "கற்றல், குழுப்பணி மற்றும் சிக்கல் தீர்வில் நான் வழங்கும் பண்புகள்.",
      "🧩": "🧩", "Problem Solver": "சிக்கல் தீர்ப்பவர்", "Approaches challenges logically and systematically.": "சவால்களைத் தர்க்கரீதியாகவும் முறையாகவும் அணுகுகிறார்.",
      "⚡": "⚡", "Quick Learner": "விரைவாகக் கற்பவர்", "Adapts to new concepts and technologies.": "புதிய கருத்துகள் மற்றும் தொழில்நுட்பங்களுக்கு விரைவாகப் பொருந்துகிறார்.",
      "🤝": "🤝", "Team Player": "குழுவுடன் இணைந்து செயல்படுபவர்", "Works effectively toward shared goals.": "பொதுவான இலக்குகளை அடைய திறம்படப் பணியாற்றுகிறார்.",
      "👑": "👑", "Leader": "தலைவர்", "Takes responsibility and supports team coordination.": "பொறுப்பேற்று குழு ஒருங்கிணைப்புக்கு ஆதரவளிக்கிறார்.",
      "💡": "💡", "Creative Thinker": "படைப்பாற்றல் மிக்க சிந்தனையாளர்", "Looks for practical and innovative solutions.": "நடைமுறை மற்றும் புதுமையான தீர்வுகளைத் தேடுகிறார்.",
      "07 / INTERESTS": "07 / ஆர்வங்கள்", "Areas of": "ஆர்வத்", "Interest": "துறைகள்",
      "Software Development": "மென்பொருள் மேம்பாடு", "Data & Technology": "தரவு மற்றும் தொழில்நுட்பம்",
      "🎯": "🎯", "CAREER OBJECTIVE": "தொழில் நோக்கம்", "Learning today.": "இன்று கற்றல்.",
      "Building solutions for tomorrow.": "நாளைக்கான தீர்வுகளை உருவாக்குதல்.",
      "To continuously develop my technical and problem-solving skills, explore emerging technologies, and contribute to meaningful software solutions while growing as a responsible technology professional.": "எனது தொழில்நுட்ப மற்றும் சிக்கல் தீர்க்கும் திறன்களைத் தொடர்ந்து மேம்படுத்தி, வளர்ந்து வரும் தொழில்நுட்பங்களை ஆராய்ந்து, பொறுப்புள்ள தொழில்நுட்ப நிபுணராக வளரும்போது அர்த்தமுள்ள மென்பொருள் தீர்வுகளுக்கு பங்களிப்பதே என் நோக்கம்.",
      "RESUME": "சுயவிவரம்", "Want to know more about me?": "என்னைப் பற்றி மேலும் அறிய விரும்புகிறீர்களா?",
      "Explore my academic background, technical skills and professional profile in detail.": "எனது கல்விப் பின்னணி, தொழில்நுட்பத் திறன்கள் மற்றும் தொழில்முறை சுயவிவரத்தை விரிவாகப் பாருங்கள்.",
      "👁 View Resume": "👁 சுயவிவரத்தைப் பாருங்கள்", "↓ Download Resume": "↓ சுயவிவரத்தைப் பதிவிறக்குங்கள்",
      "08 / CONTACT": "08 / தொடர்பு", "Let's": "வாருங்கள்", "Connect": "இணைவோம்",
      "Have an idea, project, collaboration opportunity, or simply want to connect? I'd be happy to hear from you.": "யோசனை, திட்டம், கூட்டுப்பணி வாய்ப்பு அல்லது பேச விருப்பமா? உங்களிடமிருந்து கேட்க மகிழ்ச்சி.",
      "✉": "✉", "Email": "மின்னஞ்சல்", "◉": "◉", "github.com/er.avi07": "github.com/er.avi07",
      "in": "in", "LinkedIn": "LinkedIn", "⌖": "⌖", "Location": "இடம்", "Chennai, Tamil Nadu, India": "சென்னை, தமிழ்நாடு, இந்தியா",
      "Full Name": "முழுப் பெயர்", "Email Address": "மின்னஞ்சல் முகவரி", "📧": "📧",
      "Enter a valid email address from any provider.": "எந்த மின்னஞ்சல் சேவை வழங்குநரின் முகவரியையும் உள்ளிடலாம்.",
      "Your Message": "உங்கள் செய்தி", "0 / 500": "0 / 500", "💬": "💬",
      "✈️": "✈️", "Send Message": "செய்தியை அனுப்பவும்",
      "Your email client will open after the details are validated.": "விவரங்கள் சரிபார்க்கப்பட்டதும் உங்கள் மின்னஞ்சல் செயலி திறக்கும்.",
      "©": "©", "2026": "2026", "Avinash P. All rights reserved.": "அவினாஷ் பி. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
      "×": "×", "‹": "‹", "›": "›", "↑": "↑"
    },
    attributes: {
      "Language": "மொழி", "Toggle theme": "தோற்றத்தை மாற்று", "Open menu": "மெனுவைத் திற",
      "Close": "மூடு", "Previous": "முந்தையது", "Next": "அடுத்தது", "Back to top": "மேலே செல்",
      "Enter your name": "உங்கள் பெயரை உள்ளிடவும்", "Write your message...": "உங்கள் செய்தியை எழுதவும்...",
      "Project screenshot": "திட்டத்தின் திரைப்பிடிப்பு",
      "Avinash P": "அவினாஷ் பி", "MARUDHAM 360 icon": "மருதம் 360 சின்னம்",
      "MARUDHAM 360 Home": "மருதம் 360 முகப்பு", "MARUDHAM 360 Sign In": "மருதம் 360 உள்நுழைவு",
      "MARUDHAM 360 Dashboard": "மருதம் 360 முகப்புப் பலகை", "MARUDHAM 360 Market": "மருதம் 360 சந்தை",
      "MARUDHAM 360 Farmer Hub": "மருதம் 360 விவசாயிகள் மையம்", "MARUDHAM 360 Navigation": "மருதம் 360 வழிசெலுத்தல்"
    },
    messages: {
      "Language Updated": "மொழி மாற்றப்பட்டது", "Your language preference has been changed.": "உங்கள் மொழி விருப்பம் மாற்றப்பட்டது.",
      "Please enter your name.": "உங்கள் பெயரை உள்ளிடவும்.", "Name must contain at least 2 characters.": "பெயரில் குறைந்தது 2 எழுத்துகள் இருக்க வேண்டும்.",
      "Please enter your email address.": "உங்கள் மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
      "📧 Invalid Email — Please enter a valid email address.": "📧 தவறான மின்னஞ்சல் — சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
      "Please write a message before sending.": "அனுப்புவதற்கு முன் ஒரு செய்தியை எழுதவும்.",
      "Please enter a little more detail.": "மேலும் சில விவரங்களை உள்ளிடவும்.",
      "Check Your Details": "உங்கள் விவரங்களைச் சரிபார்க்கவும்", "Please complete the form with a valid email address.": "சரியான மின்னஞ்சல் முகவரியுடன் படிவத்தை நிரப்பவும்.",
      "Email Format Valid": "மின்னஞ்சல் வடிவம் சரியானது", "Your details are valid. Opening your email client...": "உங்கள் விவரங்கள் சரியானவை. மின்னஞ்சல் செயலி திறக்கப்படுகிறது...",
      "Close notification": "அறிவிப்பை மூடு", "Light Mode": "ஒளி பயன்முறை", "Dark Mode": "இருள் பயன்முறை", "Theme preference updated.": "தோற்ற விருப்பம் புதுப்பிக்கப்பட்டது."
    },
    pageTitle: "அவினாஷ் பி | கணினி அறிவியல் மற்றும் பொறியியல் மாணவர்",
    pageDescription: "அவினாஷ் பி-யின் சுயவிவரம் — கணினி அறிவியல் மற்றும் பொறியியல் மாணவர், என்.சி.சி. மாணவர், விளையாட்டு வீரர் மற்றும் தொழில்நுட்ப ஆர்வலர்."
  },
  hi: {
    text: {
      "Home": "होम", "About": "परिचय", "Skills": "कौशल", "Projects": "प्रोजेक्ट",
      "Education": "शिक्षा", "NCC": "एनसीसी", "Sports": "खेल", "Contact": "संपर्क",
      "What I Bring": "मेरी खूबियाँ", "Interests": "रुचियाँ", "Career Objective": "करियर का उद्देश्य",
      "Resume": "रिज़्यूमे", "Computer Science Student": "कंप्यूटर साइंस का विद्यार्थी",
      "HELLO, I'M": "नमस्ते, मैं हूँ", "B.E. Computer Science & Engineering Student": "कंप्यूटर साइंस और इंजीनियरिंग का विद्यार्थी",
      "🎖 NCC Cadet": "🎖 एनसीसी कैडेट", "🏆 Sports Person": "🏆 खिलाड़ी",
      "💻 Tech Enthusiast": "💻 तकनीक प्रेमी",
      "Passionate about technology, software development, problem solving, artificial intelligence and building practical digital solutions.": "तकनीक, सॉफ्टवेयर विकास, समस्या समाधान, कृत्रिम बुद्धिमत्ता और उपयोगी डिजिटल समाधान बनाने में रुचि।",
      "🚀": "🚀", "Explore Projects": "प्रोजेक्ट देखें", "📩": "📩", "Contact Me": "संपर्क करें",
      "View Resume →": "रिज़्यूमे देखें →", "01": "01", "Featured Project": "प्रमुख प्रोजेक्ट",
      "∞": "∞", "Learning Mindset": "सीखने की लगन", "3": "3", "Core Identities": "मुख्य पहचान",
      "AVINASH P": "अविनाश पी", "CSE STUDENT": "कंप्यूटर साइंस विद्यार्थी", "</>": "</>",
      "Code": "कोड", "Build • Learn • Improve": "बनाएँ • सीखें • सुधारें", "AI": "AI",
      "Innovation": "नवाचार", "Technology & Ideas": "तकनीक और विचार",
      "Scroll to explore": "देखने के लिए स्क्रॉल करें", "↓": "↓", "01 / ABOUT": "01 / परिचय",
      "Passionate About Technology": "तकनीक के प्रति जुनून", "Technology, learning and practical problem solving.": "तकनीक, सीखना और व्यावहारिक समस्या समाधान।",
      "👤": "👤", "Who I Am": "मेरे बारे में", "I’m": "मैं", ", a B.E. Computer Science and Engineering student at": ", कंप्यूटर साइंस और इंजीनियरिंग का विद्यार्थी हूँ,",
      ", with a strong interest in technology, software development, and building practical digital solutions.": "और तकनीक, सॉफ्टवेयर विकास तथा उपयोगी डिजिटल समाधान बनाने में मेरी गहरी रुचि है।",
      "I am interested in": "मेरी रुचि है",
      "software development, web technologies, artificial intelligence, problem-solving, and innovative technology solutions": "सॉफ्टवेयर विकास, वेब तकनीक, कृत्रिम बुद्धिमत्ता, समस्या समाधान और नवीन तकनीकी समाधानों में",
      ". I enjoy learning new concepts, exploring emerging technologies, and applying my knowledge to create useful and meaningful projects.": "। मुझे नई बातें सीखना, उभरती तकनीकों को जानना और उपयोगी प्रोजेक्ट बनाने में अपने ज्ञान का उपयोग करना पसंद है।",
      "🎖": "🎖", "Beyond Technology": "तकनीक से आगे", "I am also an": "मैं एक",
      "NCC Cadet and sports person": "एनसीसी कैडेट और खिलाड़ी भी हूँ",
      ". These experiences have helped me develop": "। इन अनुभवों से मुझमें विकसित हुए हैं",
      "discipline, leadership, teamwork, confidence, consistency, and perseverance": "अनुशासन, नेतृत्व, टीमवर्क, आत्मविश्वास, निरंतरता और दृढ़ता",
      "Discipline": "अनुशासन", "Leadership": "नेतृत्व", "Teamwork": "टीमवर्क", "Confidence": "आत्मविश्वास",
      "“": "“", "I believe that combining technical knowledge, discipline, creativity, and teamwork can help transform ideas into meaningful real-world solutions.": "मेरा मानना है कि तकनीकी ज्ञान, अनुशासन, रचनात्मकता और टीमवर्क से विचारों को सार्थक वास्तविक समाधान में बदला जा सकता है।",
      "02 / SKILLS": "02 / कौशल", "Technical": "तकनीकी", "Technologies and concepts I am developing and working with.": "वे तकनीकें और अवधारणाएँ जिन पर मैं काम कर रहा हूँ और सीख रहा हूँ।",
      "⌘": "⌘", "Programming": "प्रोग्रामिंग", "C": "C", "C++": "C++", "Java": "Java", "Python": "Python",
      "Web Development": "वेब विकास", "HTML": "HTML", "CSS": "CSS", "JavaScript": "JavaScript",
      "▣": "▣", "Database": "डेटाबेस", "SQL": "SQL", "⌬": "⌬", "Computer Science": "कंप्यूटर साइंस",
      "Data Structures": "डेटा संरचनाएँ", "OOP": "ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग", "Algorithms": "एल्गोरिदम",
      "Problem Solving": "समस्या समाधान", "⚙": "⚙", "Tools": "टूल", "Git": "Git", "GitHub": "GitHub",
      "VS Code": "VS Code", "✦": "✦", "Artificial Intelligence": "कृत्रिम बुद्धिमत्ता",
      "Web Applications": "वेब एप्लिकेशन", "Smart Technology": "स्मार्ट तकनीक",
      "03 / FEATURED PROJECT": "03 / प्रमुख प्रोजेक्ट", "Building Solutions That": "ऐसे समाधान बनाएँ",
      "Matter": "जो मायने रखते हैं", "My featured project and practical technology work.": "मेरा प्रमुख प्रोजेक्ट और व्यावहारिक तकनीकी कार्य।",
      "FEATURED PROJECT": "प्रमुख प्रोजेक्ट", "MARUDHAM 360": "मरुधम 360",
      "AI-Powered Smart Agriculture & Farmer Support Platform": "कृत्रिम बुद्धिमत्ता आधारित स्मार्ट कृषि और किसान सहायता मंच",
      "AI-Powered": "AI आधारित", "Satellite-Enabled": "उपग्रह-सक्षम", "Offline-First": "ऑफ़लाइन प्राथमिकता",
      "A smart agriculture ecosystem designed to support farmers across crop planning, cultivation, monitoring, harvesting, post-harvest management, market access and farmer support.": "फसल योजना, खेती, निगरानी, कटाई, कटाई के बाद प्रबंधन, बाज़ार तक पहुँच और किसान सहायता में किसानों की मदद के लिए बनाया गया स्मार्ट कृषि तंत्र।",
      "AI Crop Intelligence": "AI फसल जानकारी", "02": "02", "Smart Farm Management": "स्मार्ट खेत प्रबंधन",
      "03": "03", "Satellite & Location Intelligence": "उपग्रह और स्थान जानकारी", "04": "04",
      "Crop Lifecycle Management": "फसल जीवनचक्र प्रबंधन", "05": "05", "Market & Finance": "बाज़ार और वित्त",
      "06": "06", "Post-Harvest Support": "कटाई के बाद सहायता", "07": "07",
      "Local Agriculture Network": "स्थानीय कृषि नेटवर्क", "08": "08",
      "Farmer Community & Voice Support": "किसान समुदाय और आवाज़ सहायता",
      "🚀 View Live Project": "🚀 लाइव प्रोजेक्ट देखें", "▶ Watch Demo Video": "▶ डेमो वीडियो देखें",
      "APP OVERVIEW": "ऐप का परिचय", "Explore the Interface": "ऐप इंटरफ़ेस देखें",
      "Click any screen to expand": "बड़ा देखने के लिए किसी स्क्रीन पर क्लिक करें", "Home": "होम",
      "Landing Experience": "स्वागत पृष्ठ", "Sign In": "साइन इन", "Secure Entry": "सुरक्षित प्रवेश",
      "Dashboard": "डैशबोर्ड", "Smart Overview": "स्मार्ट जानकारी", "Market": "बाज़ार",
      "Market Intelligence": "बाज़ार की जानकारी", "Farmer Hub": "किसान केंद्र",
      "Community Support": "समुदाय सहायता", "Navigation": "नेविगेशन", "Easy Access": "आसान पहुँच",
      "04 / EDUCATION": "04 / शिक्षा", "Academic": "शैक्षणिक", "Journey": "यात्रा", "🎓": "🎓",
      "CURRENTLY PURSUING": "वर्तमान में अध्ययनरत", "B.E. Computer Science & Engineering": "कंप्यूटर साइंस और इंजीनियरिंग में स्नातक",
      "📍": "📍", "Chennai, Tamil Nadu": "चेन्नई, तमिलनाडु", "BE": "BE", "CSE": "CSE",
      "05 / BEYOND TECHNOLOGY": "05 / तकनीक से आगे", "Discipline, Character": "अनुशासन, चरित्र",
      "& Growth": "और विकास", "PERSONAL DEVELOPMENT": "व्यक्तिगत विकास", "NCC Journey": "एनसीसी यात्रा",
      "Being an NCC Cadet has been an important part of my personal development.": "एनसीसी कैडेट होना मेरे व्यक्तिगत विकास का एक महत्वपूर्ण हिस्सा रहा है।",
      "Responsibility": "ज़िम्मेदारी", "Time Management": "समय प्रबंधन", "🏆": "🏆",
      "CHARACTER BUILDING": "चरित्र निर्माण", "As a sports person, I believe sports play an important role in building character.": "एक खिलाड़ी के रूप में, मेरा मानना है कि खेल चरित्र निर्माण में महत्वपूर्ण भूमिका निभाते हैं।",
      "Team Spirit": "टीम भावना", "Consistency": "निरंतरता", "Dedication": "समर्पण",
      "Competitive Mindset": "प्रतिस्पर्धी सोच", "Perseverance": "दृढ़ता", "Goal-Oriented Thinking": "लक्ष्य-केंद्रित सोच",
      "06 / STRENGTHS": "06 / खूबियाँ", "What I": "मेरी", "Bring": "खूबियाँ",
      "Qualities I bring to learning, teamwork and problem solving.": "सीखने, टीमवर्क और समस्या समाधान में मेरे गुण।",
      "🧩": "🧩", "Problem Solver": "समस्या समाधानकर्ता", "Approaches challenges logically and systematically.": "चुनौतियों का तार्किक और व्यवस्थित ढंग से सामना करते हैं।",
      "⚡": "⚡", "Quick Learner": "तेज़ी से सीखने वाले", "Adapts to new concepts and technologies.": "नई अवधारणाओं और तकनीकों को जल्दी अपनाते हैं।",
      "🤝": "🤝", "Team Player": "टीम के साथी", "Works effectively toward shared goals.": "साझा लक्ष्यों के लिए प्रभावी ढंग से काम करते हैं।",
      "👑": "👑", "Leader": "नेता", "Takes responsibility and supports team coordination.": "ज़िम्मेदारी लेते हैं और टीम के समन्वय में मदद करते हैं।",
      "💡": "💡", "Creative Thinker": "रचनात्मक विचारक", "Looks for practical and innovative solutions.": "व्यावहारिक और नए समाधान खोजते हैं।",
      "07 / INTERESTS": "07 / रुचियाँ", "Areas of": "रुचि के", "Interest": "क्षेत्र",
      "Software Development": "सॉफ्टवेयर विकास", "Data & Technology": "डेटा और तकनीक",
      "🎯": "🎯", "CAREER OBJECTIVE": "करियर का उद्देश्य", "Learning today.": "आज सीखना।",
      "Building solutions for tomorrow.": "कल के लिए समाधान बनाना।",
      "To continuously develop my technical and problem-solving skills, explore emerging technologies, and contribute to meaningful software solutions while growing as a responsible technology professional.": "अपने तकनीकी और समस्या-समाधान कौशल को लगातार बेहतर बनाना, उभरती तकनीकों को जानना और एक ज़िम्मेदार तकनीकी पेशेवर के रूप में आगे बढ़ते हुए सार्थक सॉफ्टवेयर समाधानों में योगदान देना।",
      "RESUME": "रिज़्यूमे", "Want to know more about me?": "मेरे बारे में और जानना चाहते हैं?",
      "Explore my academic background, technical skills and professional profile in detail.": "मेरी शिक्षा, तकनीकी कौशल और पेशेवर जानकारी विस्तार से देखें।",
      "👁 View Resume": "👁 रिज़्यूमे देखें", "↓ Download Resume": "↓ रिज़्यूमे डाउनलोड करें",
      "08 / CONTACT": "08 / संपर्क", "Let's": "आइए", "Connect": "जुड़ें",
      "Have an idea, project, collaboration opportunity, or simply want to connect? I'd be happy to hear from you.": "कोई विचार, प्रोजेक्ट, साथ काम करने का अवसर या बस जुड़ना चाहते हैं? आपसे सुनकर खुशी होगी।",
      "✉": "✉", "Email": "ईमेल", "◉": "◉", "github.com/er.avi07": "github.com/er.avi07",
      "in": "in", "LinkedIn": "LinkedIn", "⌖": "⌖", "Location": "स्थान", "Chennai, Tamil Nadu, India": "चेन्नई, तमिलनाडु, भारत",
      "Full Name": "पूरा नाम", "Email Address": "ईमेल पता", "📧": "📧",
      "Enter a valid email address from any provider.": "किसी भी ईमेल सेवा का मान्य पता दर्ज करें।",
      "Your Message": "आपका संदेश", "0 / 500": "0 / 500", "💬": "💬",
      "✈️": "✈️", "Send Message": "संदेश भेजें",
      "Your email client will open after the details are validated.": "जानकारी की पुष्टि के बाद आपका ईमेल ऐप खुलेगा।",
      "©": "©", "2026": "2026", "Avinash P. All rights reserved.": "अविनाश पी. सर्वाधिकार सुरक्षित।",
      "×": "×", "‹": "‹", "›": "›", "↑": "↑"
    },
    attributes: {
      "Language": "भाषा", "Toggle theme": "थीम बदलें", "Open menu": "मेनू खोलें",
      "Close": "बंद करें", "Previous": "पिछला", "Next": "अगला", "Back to top": "ऊपर जाएँ",
      "Enter your name": "अपना नाम दर्ज करें", "Write your message...": "अपना संदेश लिखें...",
      "Project screenshot": "प्रोजेक्ट का स्क्रीनशॉट",
      "Avinash P": "अविनाश पी", "MARUDHAM 360 icon": "मरुधम 360 आइकन",
      "MARUDHAM 360 Home": "मरुधम 360 होम", "MARUDHAM 360 Sign In": "मरुधम 360 साइन इन",
      "MARUDHAM 360 Dashboard": "मरुधम 360 डैशबोर्ड", "MARUDHAM 360 Market": "मरुधम 360 बाज़ार",
      "MARUDHAM 360 Farmer Hub": "मरुधम 360 किसान केंद्र", "MARUDHAM 360 Navigation": "मरुधम 360 नेविगेशन"
    },
    messages: {
      "Language Updated": "भाषा बदल दी गई", "Your language preference has been changed.": "आपकी भाषा की पसंद बदल दी गई है।",
      "Please enter your name.": "कृपया अपना नाम दर्ज करें।", "Name must contain at least 2 characters.": "नाम में कम से कम 2 अक्षर होने चाहिए।",
      "Please enter your email address.": "कृपया अपना ईमेल पता दर्ज करें।",
      "📧 Invalid Email — Please enter a valid email address.": "📧 अमान्य ईमेल — कृपया मान्य ईमेल पता दर्ज करें।",
      "Please write a message before sending.": "भेजने से पहले संदेश लिखें।",
      "Please enter a little more detail.": "कृपया थोड़ा और विवरण लिखें।",
      "Check Your Details": "अपनी जानकारी जाँचें", "Please complete the form with a valid email address.": "कृपया मान्य ईमेल पते के साथ फ़ॉर्म भरें।",
      "Email Format Valid": "ईमेल का प्रारूप मान्य है", "Your details are valid. Opening your email client...": "आपकी जानकारी सही है। ईमेल ऐप खोला जा रहा है...",
      "Close notification": "सूचना बंद करें", "Light Mode": "लाइट मोड", "Dark Mode": "डार्क मोड", "Theme preference updated.": "थीम की पसंद अपडेट की गई।"
    },
    pageTitle: "अविनाश पी | कंप्यूटर साइंस और इंजीनियरिंग विद्यार्थी",
    pageDescription: "अविनाश पी का पोर्टफोलियो — कंप्यूटर साइंस और इंजीनियरिंग विद्यार्थी, एनसीसी कैडेट, खिलाड़ी और तकनीक प्रेमी।"
  }
};

const originalTextNodes = [];
const textWalker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_TEXT,
  {
    acceptNode(node) {
      return node.parentElement?.closest("script, style")
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT;
    }
  }
);

while (textWalker.nextNode()) {
  originalTextNodes.push({
    node: textWalker.currentNode,
    value: textWalker.currentNode.nodeValue
  });
}

const originalAttributes = [];
document.querySelectorAll("[placeholder], [aria-label], img[alt]").forEach(element => {
  ["placeholder", "aria-label", "alt"].forEach(attribute => {
    if (element.hasAttribute(attribute)) {
      originalAttributes.push({
        element,
        attribute,
        value: element.getAttribute(attribute)
      });
    }
  });
});

const originalPageTitle = document.title;
const descriptionMeta = document.querySelector('meta[name="description"]');
const originalPageDescription = descriptionMeta?.content;

function setLanguage(language) {

  if (language !== "en" && !translations[language]) {
    language = "en";
  }

  const locale = translations[language];
  const text = locale?.text || {};
  const attributes = locale?.attributes || {};

  originalTextNodes.forEach(({ node, value }) => {
    const source = value.trim().replace(/\s+/g, " ");
    const translated = text[source];

    if (language === "en" || !translated) {
      node.nodeValue = value;
      return;
    }

    const start = value.indexOf(value.trim());
    const end = start + value.trim().length;
    node.nodeValue = `${value.slice(0, start)}${translated}${value.slice(end)}`;
  });

  originalAttributes.forEach(({ element, attribute, value }) => {
    element.setAttribute(
      attribute,
      language === "en" ? value : attributes[value] || value
    );
  });

  if (language === "en") {
    document.title = originalPageTitle;
    if (descriptionMeta && originalPageDescription) {
      descriptionMeta.content = originalPageDescription;
    }
  } else if (locale) {
    document.title = locale.pageTitle;
    if (descriptionMeta) {
      descriptionMeta.content = locale.pageDescription;
    }
  }

  document.documentElement.lang = language === "en" || !locale ? "en" : language;
  localStorage.setItem("avinash-language", language);
}

function translateMessage(message) {
  return translations[languageSelect.value]?.messages?.[message] || message;
}

const savedLanguage =
  localStorage.getItem("avinash-language") || "en";

languageSelect.value = savedLanguage;
setLanguage(savedLanguage);

languageSelect.addEventListener("change", () => {
  setLanguage(languageSelect.value);

  showToast(
    "success",
    translateMessage("Language Updated"),
    translateMessage("Your language preference has been changed.")
  );
});


/* =========================================================
   CONTACT FORM
   ========================================================= */

function setFieldError(input, errorElement, message) {

  const inputWrap = input.closest(".input-wrap");
  input.classList.remove("input-success");
  inputWrap?.classList.remove("input-wrap-success");

  if (message) {

    input.classList.add("input-error");
    inputWrap?.classList.add("input-wrap-error");
    input.setAttribute("aria-invalid", "true");

    if (errorElement) {
      input.setAttribute("aria-describedby", errorElement.id);
      errorElement.textContent = translateMessage(message);
    }

    return false;
  }

  input.classList.remove("input-error");
  input.classList.add("input-success");
  inputWrap?.classList.remove("input-wrap-error");
  inputWrap?.classList.add("input-wrap-success");
  input.setAttribute("aria-invalid", "false");
  input.removeAttribute("aria-describedby");

  if (errorElement) {
    errorElement.textContent = "";
  }

  return true;
}


function validateName() {

  const error = document.getElementById("nameError");
  const value = nameInput.value.trim();

  if (!value) {
    return setFieldError(
      nameInput,
      error,
      "Please enter your name."
    );
  }

  if (value.length < 2) {
    return setFieldError(
      nameInput,
      error,
      "Name must contain at least 2 characters."
    );
  }

  return setFieldError(nameInput, error, "");
}


function validateEmail() {

  const error = document.getElementById("emailError");
  const value = emailInput.value.trim();

  if (!value) {
    return setFieldError(
      emailInput,
      error,
      "Please enter your email address."
    );
  }

  const [localPart = "", domain = ""] = value.split("@");
  const domainLabels = domain.split(".");
  const domainIsQualified =
    domainLabels.length >= 2 &&
    domainLabels[domainLabels.length - 1].length >= 2 &&
    domainLabels.every(label =>
      label.length <= 63 &&
      /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(label)
    );

  const formatIsValid =
    emailInput.validity.valid &&
    value.length <= 254 &&
    !localPart.startsWith(".") &&
    !localPart.endsWith(".") &&
    !localPart.includes("..") &&
    domainIsQualified;

  if (!formatIsValid) {
    return setFieldError(
      emailInput,
      error,
      "📧 Invalid Email — Please enter a valid email address."
    );
  }

  return setFieldError(emailInput, error, "");
}


function validateMessage() {

  const error = document.getElementById("messageError");
  const value = messageInput.value.trim();

  if (!value) {
    return setFieldError(
      messageInput,
      error,
      "Please write a message before sending."
    );
  }

  if (value.length < 5) {
    return setFieldError(
      messageInput,
      error,
      "Please enter a little more detail."
    );
  }

  return setFieldError(messageInput, error, "");
}


nameInput?.addEventListener("input", validateName);
emailInput?.addEventListener("input", validateEmail);
messageInput?.addEventListener("input", validateMessage);


/* =========================================================
   MESSAGE COUNTER
   ========================================================= */

function updateMessageCounter() {

  const length = messageInput.value.length;

  messageCounter.textContent =
    `${length} / 500`;

}

messageInput?.addEventListener(
  "input",
  updateMessageCounter
);

updateMessageCounter();


/* =========================================================
   CONTACT SUBMIT
   ========================================================= */

contactForm?.addEventListener("submit", event => {

  event.preventDefault();

  const nameValid = validateName();
  const emailValid = validateEmail();
  const messageValid = validateMessage();

  if (!nameValid || !emailValid || !messageValid) {

    showToast(
      "warning",
      "Check Your Details",
      "Please complete the form with a valid email address."
    );

    const firstInvalid =
      document.querySelector(".input-error");

    firstInvalid?.focus();

    return;
  }


  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  const subject =
    encodeURIComponent(
      `Portfolio Contact from ${name}`
    );

  const body =
    encodeURIComponent(
      `Hello Avinash,\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n\n` +
      `Message:\n${message}\n\n` +
      `Sent from Avinash P Portfolio.`
    );

  const mailto =
    `mailto:anbirkuriya.avinash@gmail.com` +
    `?subject=${subject}&body=${body}`;


  showToast(
    "success",
    "Email Format Valid",
    "Your details are valid. Opening your email client..."
  );

  setTimeout(() => {

    window.location.href = mailto;

  }, 800);

});


/* =========================================================
   TOAST SYSTEM
   ========================================================= */

function showToast(type, title, message, duration = 4500) {

  const toast = document.createElement("div");

  toast.className = `toast ${type}`;

  const icons = {
    success: "✓",
    error: "!",
    warning: "!"
  };

  toast.innerHTML = `
    <div class="toast-icon">
      ${icons[type] || "!"}
    </div>

    <div>
      <h4>${escapeHTML(translateMessage(title))}</h4>
      <p>${escapeHTML(translateMessage(message))}</p>
    </div>

    <button class="toast-close" aria-label="${escapeHTML(translateMessage("Close notification"))}">
      ×
    </button>
  `;

  toastContainer.appendChild(toast);

  const closeButton =
    toast.querySelector(".toast-close");

  closeButton.addEventListener(
    "click",
    () => removeToast(toast)
  );

  const timer = setTimeout(
    () => removeToast(toast),
    duration
  );

  toast.dataset.timer = timer;

}


function removeToast(toast) {

  if (!toast) return;

  toast.classList.add("removing");

  setTimeout(() => {
    toast.remove();
  }, 300);

}


function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================================================
   PROJECT IMAGE LIGHTBOX
   ========================================================= */

const appShots =
  Array.from(document.querySelectorAll(".app-shot"));

let currentImageIndex = 0;
let lightboxReturnFocus = null;

function openLightbox(index) {

  if (!appShots.length) return;

  currentImageIndex =
    (index + appShots.length) % appShots.length;

  const image =
    appShots[currentImageIndex].querySelector("img");

  if (!image) return;

  if (!lightbox.classList.contains("open")) {
    lightboxReturnFocus = document.activeElement;
  }

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");

  body.style.overflow = "hidden";
  lightboxClose?.focus();
}


function closeLightbox() {

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");

  body.style.overflow = "";
  lightboxReturnFocus?.focus();
  lightboxReturnFocus = null;
}


function showNextImage() {

  openLightbox(currentImageIndex + 1);

}


function showPreviousImage() {

  openLightbox(currentImageIndex - 1);

}


appShots.forEach((shot, index) => {

  shot.setAttribute("role", "button");
  shot.setAttribute("tabindex", "0");
  shot.setAttribute("aria-haspopup", "dialog");

  shot.addEventListener("click", () => {
    openLightbox(index);
  });

  shot.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(index);
    }
  });

});


lightboxClose?.addEventListener(
  "click",
  closeLightbox
);

lightboxNext?.addEventListener(
  "click",
  showNextImage
);

lightboxPrev?.addEventListener(
  "click",
  showPreviousImage
);

lightbox?.addEventListener("click", event => {

  if (event.target === lightbox) {
    closeLightbox();
  }

});


/* =========================================================
   KEYBOARD ACCESSIBILITY
   ========================================================= */

document.addEventListener("keydown", event => {

  if (!lightbox.classList.contains("open")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "Tab") {
    const focusableControls =
      Array.from(lightbox.querySelectorAll("button:not([disabled])"));
    const firstControl = focusableControls[0];
    const lastControl = focusableControls[focusableControls.length - 1];

    if (!lightbox.contains(document.activeElement)) {
      event.preventDefault();
      (event.shiftKey ? lastControl : firstControl).focus();
    } else if (event.shiftKey && document.activeElement === firstControl) {
      event.preventDefault();
      lastControl.focus();
    } else if (!event.shiftKey && document.activeElement === lastControl) {
      event.preventDefault();
      firstControl.focus();
    }
  }

  if (event.key === "ArrowRight") {
    showNextImage();
  }

  if (event.key === "ArrowLeft") {
    showPreviousImage();
  }

});

let touchStartX = 0;

lightbox?.addEventListener("touchstart", event => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

lightbox?.addEventListener("touchend", event => {
  const swipeDistance = event.changedTouches[0].clientX - touchStartX;

  if (Math.abs(swipeDistance) < 50) return;

  if (swipeDistance < 0) {
    showNextImage();
  } else {
    showPreviousImage();
  }
}, { passive: true });


/* =========================================================
   IMAGE FALLBACK
   ========================================================= */

document.querySelectorAll("img").forEach(image => {

  image.addEventListener("error", () => {

    image.style.background =
      "linear-gradient(135deg,#0d2138,#07111f)";

    image.style.objectFit = "contain";

  });

});


/* =========================================================
   EXTERNAL LINKS
   ========================================================= */

document.querySelectorAll('a[target="_blank"]').forEach(link => {

  link.setAttribute("rel", "noopener noreferrer");

});


/* =========================================================
   FORM ENTER / ESCAPE UX
   ========================================================= */

document.querySelectorAll("input, textarea").forEach(input => {

  input.addEventListener("keydown", event => {

    if (event.key === "Escape") {
      input.blur();
    }

  });

});


/* =========================================================
   INITIAL STATE
   ========================================================= */

window.addEventListener("load", () => {

  document.body.classList.add("page-loaded");

  setTimeout(() => {

    document.querySelectorAll(".hero .reveal")
      .forEach(element => {
        element.classList.add("visible");
      });

  }, 100);

});