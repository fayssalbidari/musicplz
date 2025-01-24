(function () {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload")) return;

    for (const r of document.querySelectorAll('link[rel="modulepreload"]')) s(r);

    new MutationObserver(r => {
        for (const i of r) {
            if (i.type === "childList") {
                for (const o of i.addedNodes) {
                    o.tagName === "LINK" && o.rel === "modulepreload" && s(o);
                }
            }
        }
    }).observe(document, { childList: true, subtree: true });

    function t(r) {
        const i = {};
        if (r.integrity) i.integrity = r.integrity;
        if (r.referrerPolicy) i.referrerPolicy = r.referrerPolicy;

        if (r.crossOrigin === "use-credentials") i.credentials = "include";
        else if (r.crossOrigin === "anonymous") i.credentials = "omit";
        else i.credentials = "same-origin";

        return i;
    }

    function s(r) {
        if (r.ep) return;
        r.ep = true;
        const i = t(r);
        fetch(r.href, i);
    }
})();

const c = (n, e) => {
    let t;
    return (...s) => {
        clearTimeout(t);
        t = setTimeout(() => {
            n.apply(void 0, s);
        }, e);
    };
};

class p {
    constructor(e, t = {}) {
        if (!e || !(e instanceof HTMLElement)) {
            throw new Error("Invalid text element provided.");
        }

        const { resizeCallback: s, splitTypeTypes: r } = t;
        this.textElement = e;
        this.onResize = typeof s === "function" ? s : null;

        if (typeof SplitType === "undefined") {
            console.error("SplitType is not loaded. Make sure it is included before this script.");
            return;
        }

        const i = r ? { types: r } : {};
        this.splitText = new SplitType(this.textElement, i);

        if (this.onResize) this.initResizeObserver();
    }

    initResizeObserver() {
        this.previousContainerWidth = null;
        new ResizeObserver(c(t => this.handleResize(t), 100)).observe(this.textElement);
    }

    handleResize(e) {
        const [{ contentRect: t }] = e;
        const s = Math.floor(t.width);

        if (this.previousContainerWidth && this.previousContainerWidth !== s) {
            this.splitText.split();
            this.onResize();
        }

        this.previousContainerWidth = s;
    }

    revert() {
        return this.splitText.revert();
    }

    getLines() {
        return this.splitText.lines;
    }

    getWords() {
        return this.splitText.words;
    }

    getChars() {
        return this.splitText.chars;
    }
}

const l = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p",
    "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "!", "@", "#", "$", "%", "^",
    "&", "*", "-", "_", "+", "=", ";", ":", "<", ">", ","
];

class a {
    constructor(e) {
        if (!e || !(e instanceof HTMLElement)) {
            throw new Error("Invalid text element provided.");
        }

        if (typeof SplitType === "undefined") {
            console.error("SplitType is not loaded. Cannot split text.");
            return;
        }

        this.textElement = e;
        this.splitText();
    }

    splitText() {
        if (typeof SplitType === "undefined") {
            console.error("SplitType is not loaded. Cannot split text.");
            return;
        }

        try {
            this.splitter = new p(this.textElement, { splitTypeTypes: "words, chars" });
            this.originalChars = this.splitter.getChars().map(e => e.innerHTML);
        } catch (error) {
            console.error("Error initializing SplitType:", error);
        }
    }

    animate() {
        if (!this.splitter) {
            console.error("Splitter is not initialized. Cannot animate.");
            return;
        }

        this.reset();
        this.splitter.getChars().forEach((t, s) => {
            const r = t.innerHTML;
            let i = 0;

            gsap.fromTo(
                t,
                { opacity: 0 },
                {
                    duration: 0.03,
                    onStart: () => gsap.set(t, { "--opa": 1 }),
                    onComplete: () => gsap.set(t, { innerHTML: r, delay: 0.03 }),
                    repeat: 3,
                    onRepeat: () => {
                        i++;
                        if (i === 1) gsap.set(t, { "--opa": 0 });
                    },
                    repeatRefresh: true,
                    repeatDelay: 0.04,
                    delay: (s + 1) * 0.07,
                    innerHTML: () => l[Math.floor(Math.random() * l.length)],
                    opacity: 1,
                }
            );
        });
    }

    reset() {
        if (!this.splitter || !this.splitter.getChars) {
            console.error("Splitter is not initialized properly.");
            return;
        }

        this.splitter.getChars().forEach((t, s) => {
            gsap.killTweensOf(t);
            t.innerHTML = this.originalChars[s];
        });
    }
}

const h = () => {
    document.querySelectorAll(".list__item").forEach(n => {
        const t = Array.from(n.querySelectorAll(".hover-effect")).map(s => new a(s));
        n.addEventListener("mouseenter", () => {
            t.forEach(s => s.animate());
        });
    });

    document.querySelectorAll("a.hover-effect").forEach(n => {
        const e = new a(n);
        n.addEventListener("mouseenter", () => {
            e.animate();
        });
    });
};

h();
