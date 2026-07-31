
const loadingScreen = document.getElementById('loading');
const mainContent = document.getElementById('main-content');

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('Form');
    if (form) {
        form.addEventListener('submit', (event) => {
            window.location.hash = '#contact';
            sessionStorage.setItem('submittedViaForm', 'true');
        });
    }
});

let _finished = false;
function finishLoading() {
    if (_finished) return;
    _finished = true;
    document.body.classList.remove('no-scroll');
    loadingScreen.style.transition = 'opacity 0.6s ease';
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainContent.style.display = 'block';
        mainContent.classList.add('fade-in');
        document.querySelectorAll('.fadein').forEach(el => el.classList.add('loaded'));
        const bugText = document.getElementById('bugtxt');
        if (bugText) {
            bugText.style.opacity = '1';
            startTypingEffect(bugText);
        }
    }, 600);
}

function runBattleSequence(messages, onComplete) {
    const textEl  = document.getElementById('dqText');
    const cursor  = document.getElementById('dqCursor');
    const cmdPanel = document.getElementById('dqCmd');
    const enemy   = document.getElementById('dqEnemy');
    if (!textEl) { onComplete(); return; }

    let i = 0;

    function typeMessage(text, cb) {
        textEl.innerHTML = '';
        if (cursor) cursor.textContent = '';
        const lines = text.split('\n');
        const els = lines.map(() => {
            const d = document.createElement('div');
            textEl.appendChild(d);
            return d;
        });
        let li = 0, ci = 0;
        const iv = setInterval(() => {
            if (li >= lines.length) {
                clearInterval(iv);
                if (cursor) cursor.textContent = '▼';
                cb();
                return;
            }
            if (ci >= lines[li].length) { li++; ci = 0; return; }
            els[li].textContent += lines[li][ci++];
        }, 55);
    }

    function next() {
        if (i >= messages.length) { onComplete(); return; }
        const msg = messages[i++];
        if (msg.showCmd  && cmdPanel) cmdPanel.style.display = 'block';
        if (msg.hideCmd  && cmdPanel) cmdPanel.style.display = 'none';
        if (msg.hitEnemy && enemy) {
            enemy.classList.add('dq-hit');
            setTimeout(() => enemy.classList.remove('dq-hit'), 700);
        }
        if (msg.killEnemy && enemy) {
            setTimeout(() => { enemy.style.transition = 'opacity 0.5s'; enemy.style.opacity = '0'; }, 300);
        }
        typeMessage(msg.text, () => setTimeout(next, msg.pause));
    }
    next();
}

window.addEventListener('load', () => {
    const submittedViaForm = sessionStorage.getItem('submittedViaForm');
    sessionStorage.removeItem('submittedViaForm');

    if (submittedViaForm) {
        document.body.classList.remove('no-scroll');
        loadingScreen.style.display = 'none';
        document.querySelectorAll('.fadein').forEach(el => el.classList.add('loaded'));
        const bugText = document.getElementById('bugtxt');
        if (bugText) bugText.style.opacity = '1';
        return;
    }

    document.body.classList.add('no-scroll');

    const skipBtn = document.getElementById('dqSkip');
    if (skipBtn) skipBtn.addEventListener('click', finishLoading);

    runBattleSequence([
        { text: "バグ が　あらわれた！",                               pause: 1600 },
        { text: "コマンド？",                                           pause: 1200, showCmd: true },
        { text: "バグズ の　こうげき！",                                pause: 1000, hideCmd: true },
        { text: "バグ に　404ポイントの　ダメージを\nあたえた！",        pause: 1600, hitEnemy: true },
        { text: "バグ を　やっつけた！",                                pause: 1200, killEnemy: true },
        { text: "Bug.s ウェブサイトへ\nようこそ！",                     pause: 1400 },
    ], finishLoading);

});//load

function startTypingEffect(element) {
    let typeContent = element.innerHTML;
    let typeSprit = [];
    let isTag = false;
    let tagBuffer = "";

    for (let char of typeContent) {
        if (char === "<") {
            isTag = true;
            if (tagBuffer) {
                typeSprit.push(tagBuffer);
                tagBuffer = "";
            }
            tagBuffer += char;
        } else if (char === ">") {
            isTag = false;
            tagBuffer += char;
            typeSprit.push(tagBuffer);
            tagBuffer = "";
        } else if (isTag) {
            tagBuffer += char;
        } else {
            typeSprit.push(char);
        }
    }

    let originalHeight = element.offsetHeight;
    element.style.height = `${originalHeight}px`;

    let typeSpeed = element.getAttribute("data-speed");
    element.innerHTML = "";
    element.classList.add("active");

    let typeLength = 0;
    let typeInterval = setInterval(() => {
        if (typeLength >= typeSprit.length) {
            clearInterval(typeInterval);
            element.style.height = 'auto';
            return;
        }
        element.innerHTML += typeSprit[typeLength];
        typeLength++;
    }, typeSpeed);
}

const typeTarget = document.querySelectorAll('.typing');

let options = {
    rootMargin: '0px',
    threshold: 0.5
};


document.addEventListener("DOMContentLoaded", function () {
const menuBtnParent = document.getElementById("menu_btn");
const menuBtn = menuBtnParent.querySelector("span"); 
const nav = document.getElementById("nav");
const menuContent = nav.querySelector("ul.menu");
const menuLinks = menuContent.querySelectorAll("a");
let isOpen = false;

function openMenu() {
    nav.classList.add("visible");
    menuBtn.textContent = "×";
    menuContent.classList.remove("scaledown");
    menuBtn.classList.add("close");
    isOpen = true;
}

function closeMenu() {
    menuBtn.textContent = "MENU";
    menuContent.classList.add("scaledown");
    setTimeout(() => {
        nav.classList.remove("visible");
    }, 300);
    menuBtn.classList.remove("close");
    isOpen = false;
}

menuBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (isOpen) {
    closeMenu();
    } else {
    openMenu();
    }
});

nav.addEventListener("click", function (e) {
    const isClickInsideMenu = menuContent.contains(e.target);
    if (!isClickInsideMenu && window.innerWidth <= 640) {
    closeMenu();
    }
});

menuLinks.forEach(link => {
    link.addEventListener("click", function () {
    if (window.innerWidth <= 640) {
        closeMenu();
    }
    });
});

window.addEventListener("resize", function () {
    if (isOpen) {
        closeMenu();
    }
    if (window.innerWidth <= 640) {
        nav.classList.remove("visible");
        isOpen = false;
        menuBtn.textContent = "MENU";
    }
});
});


const nav = document.getElementById("nav");
const menubtn = document.getElementById("menu_btn");
const totop = document.getElementById("totop");
const topSection = document.getElementById("top");


totop.addEventListener("touchstart", () => {
    totop.classList.add("touch-hover");
    setTimeout(() => {
        totop.classList.remove("touch-hover");
    }, 1000);
});

window.addEventListener("scroll", () => {
    const topBottom = topSection.getBoundingClientRect().bottom;

    if (topBottom <= 0) {
        totop.classList.add("visible");
    } else {
        totop.classList.remove("visible");
    }
});

window.addEventListener("scroll", () => {
    const isMobile = window.innerWidth <= 640;
    if (isMobile) return;

const topBottom = topSection.getBoundingClientRect().bottom;
if (topBottom <= 0) {
    nav.classList.add("visible");
} else {
    nav.classList.remove("visible");
}
});

window.addEventListener("scroll", () => {
const topBottom = topSection.getBoundingClientRect().bottom;
const menuBtn = document.getElementById("menu_btn");

if (menuBtn.textContent === "×") {
    menuBtn.classList.add("visible");
    return;
}
if (topBottom <= 0) {
    menuBtn.classList.add("visible");
} else {
    menuBtn.classList.remove("visible");
}
});


let callback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.intersectionRatio > 0.5 && !entry.target.classList.contains('active')) {
            let typeContent = entry.target.innerHTML;
            let typeSprit = [];
            let isTag = false;
            let tagBuffer = "";

            for (let char of typeContent) {
                if (char === "<") {
                    isTag = true;
                    if (tagBuffer) {
                        typeSprit.push(tagBuffer);
                        tagBuffer = "";
                    }
                    tagBuffer += char;
                } else if (char === ">") {
                    isTag = false;
                    tagBuffer += char;
                    typeSprit.push(tagBuffer);
                    tagBuffer = "";
                } else if (isTag) {
                    tagBuffer += char;
                } else {
                    typeSprit.push(char);
                }
            }

            let originalHeight = entry.target.offsetHeight;

            entry.target.style.height = `${originalHeight}px`;

            let typeSpeed = entry.target.getAttribute("data-speed");
            entry.target.innerHTML = "";
            entry.target.classList.add("active");

            let typeLength = 0;
            let typeInterval = setInterval(() => {
                if (typeLength >= typeSprit.length) {
                    clearInterval(typeInterval);
                    entry.target.style.height = 'auto';
                    return;
                }
                entry.target.innerHTML += typeSprit[typeLength];
                typeLength++;
            }, typeSpeed);
        }
    });
};

let observer = new IntersectionObserver(callback, options);
typeTarget.forEach(e => {
    observer.observe(e);
});

var elem = document.querySelector('.grid');
var msnry = new Masonry( elem, {
    itemSelector: '.grid-item',
});

var sp = 950;

function masonry_execute() {
    var $list = $('.service_list');

    if ($('html').width() < sp) {
        $list.masonry('destroy');
    } else {
        $list.imagesLoaded(function () {
            $list.masonry({
                itemSelector: '.grid-item',
                fitWidth: true,
            });
        });
    }
}

const pairs = [
    { trigger: '.me1', target: '.f1' },
    { trigger: '.me2', target: '.f2' },
    { trigger: '.me3', target: '.f3' },
    { trigger: '.me4', target: '.f4' }
];

pairs.forEach(pair => {
    const trigger = document.querySelector(pair.trigger);
    const target = document.querySelector(pair.target);

    if (trigger && target) {
        trigger.addEventListener('mouseenter', () => {
            target.style.display = 'block';
        });

        trigger.addEventListener('mouseleave', () => {
            target.style.display = 'none';
        });

        trigger.addEventListener('touchstart', e => {
            e.stopPropagation();
            target.style.display = 'block';
        });

        target.addEventListener('touchstart', e => {
            e.stopPropagation();
        });

        target.addEventListener('click', e => {
            e.stopPropagation();
        });
    }
});

document.addEventListener('click', () => {
    document.querySelectorAll('.fukidashi').forEach(el => {
        el.style.display = 'none';
    });
});


