"use strict";
/* ============ QUALIFICATION QUIZ (opens on CTA click) ============ */
(function () {
    var CHECKOUT_URL = "https://cc.linfaflow.com/dtcnew/checkout.php?hid=b2lkPW9mZl8wMDQyMzQ2JmFpZD1hZmZfMDU5NzY5NCZ1aWQ9YmxfNjY2ODExMQ%3D%3D&affid=aff_0597694";

    var overlay, quiz, nextBtn, backBtn, progressBar, discountAnimation;
    var currentQuestion = 1;
    var totalQuestions = 5;

    function validateCurrentQuestion() {
        switch (currentQuestion) {
            case 1:
                return document.querySelector('#quizOverlay input[name="age"]:checked') !== null;
            case 2:
                return document.querySelectorAll('#quizOverlay input[name="pain"]:checked').length > 0;
            case 3:
                return document.querySelectorAll('#quizOverlay input[name="concern"]:checked').length > 0;
            case 4:
                return document.querySelectorAll('#quizOverlay input[name="commitment"]:checked').length > 0;
            case 5:
                return document.querySelector('#quizOverlay input[name="package"]:checked') !== null;
            default:
                return false;
        }
    }

    function updateProgressBar() {
        progressBar.style.width = (currentQuestion / totalQuestions) * 100 + "%";
    }

    function updateButtonText() {
        nextBtn.textContent = currentQuestion === totalQuestions ? "Claim My Discount >>" : "Next";
    }

    function goToQuestion(n) {
        document.getElementById("question" + currentQuestion).style.display = "none";
        currentQuestion = n;
        document.getElementById("question" + currentQuestion).style.display = "block";
        updateProgressBar();
        updateButtonText();
        backBtn.style.display = currentQuestion > 1 ? "block" : "none";
    }

    function withParams(url) {
        var qs = window.location.search.replace(/^\?/, "");
        return qs ? url + (url.indexOf("?") > -1 ? "&" : "?") + qs : url;
    }

    function showDiscountAnimation() {
        quiz.style.display = "none";
        nextBtn.style.display = "none";
        discountAnimation.style.display = "block";

        var circle = discountAnimation.querySelector(".discount-circle .progress");
        var circumference = 2 * Math.PI * 45;
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;

        try {
            if (window.fbq) fbq("track", "Lead");
        } catch (_) {}

        var discount = 95;
        var currentDiscount = 0;

        var discountInterval = setInterval(function () {
            if (currentDiscount < discount) {
                currentDiscount++;
                discountAnimation.querySelector(".discount-percentage").textContent = currentDiscount + "%";
                var offset = circumference - (currentDiscount / 100) * circumference;
                circle.style.strokeDashoffset = offset;
            } else {
                clearInterval(discountInterval);
                setTimeout(function () {
                    discountAnimation.innerHTML =
                        '<h2>Your Discount is Ready!</h2>' +
                        '<div class="discount-circle">' +
                        '<svg viewBox="0 0 100 100">' +
                        '<circle class="background" cx="50" cy="50" r="45" />' +
                        '<circle class="progress" cx="50" cy="50" r="45" style="stroke-dasharray: ' + circumference + '; stroke-dashoffset: ' + (circumference - (discount / 100) * circumference) + ';" />' +
                        '</svg>' +
                        '<div class="discount-percentage">' + discount + '%</div>' +
                        '</div>' +
                        '<p>Redirecting to checkout...</p>';

                    setTimeout(function () {
                        try {
                            if (window.fbq) fbq("track", "InitiateCheckout");
                        } catch (_) {}
                        window.location.href = withParams(CHECKOUT_URL);
                    }, 300);
                }, 300);
            }
        }, 20);
    }

    function resetQuiz() {
        currentQuestion = 1;
        for (var i = 1; i <= totalQuestions; i++) {
            document.getElementById("question" + i).style.display = i === 1 ? "block" : "none";
        }
        document.querySelectorAll('#quizOverlay input[type="radio"], #quizOverlay input[type="checkbox"]').forEach(function (i) {
            i.checked = false;
        });
        document.querySelectorAll('#quizOverlay .warning-message').forEach(function (w) {
            w.style.display = "none";
        });
        quiz.style.display = "block";
        discountAnimation.style.display = "none";
        nextBtn.style.display = "block";
        backBtn.style.display = "none";
        updateProgressBar();
        updateButtonText();
    }

    function openQuiz(e) {
        if (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
        resetQuiz();
        overlay.classList.add("open");
        document.body.style.overflow = "hidden";
        try {
            if (window.fbq) fbq("trackCustom", "QuizStart");
        } catch (_) {}
    }

    function closeQuiz() {
        overlay.classList.remove("open");
        document.body.style.overflow = "";
    }

    document.addEventListener("DOMContentLoaded", function () {
        overlay = document.getElementById("quizOverlay");
        quiz = document.getElementById("quiz");
        nextBtn = document.getElementById("next-btn");
        backBtn = document.getElementById("back-btn");
        progressBar = document.getElementById("progress");
        discountAnimation = document.getElementById("discount-animation");

        if (!overlay || !quiz || !nextBtn || !backBtn || !progressBar) return;

        backBtn.style.display = "none";

        nextBtn.addEventListener("click", function () {
            if (currentQuestion < totalQuestions) {
                if (validateCurrentQuestion()) {
                    goToQuestion(currentQuestion + 1);
                } else {
                    document.getElementById("warning" + currentQuestion).style.display = "flex";
                }
            } else if (currentQuestion === totalQuestions) {
                if (validateCurrentQuestion()) {
                    showDiscountAnimation();
                } else {
                    document.getElementById("warning" + currentQuestion).style.display = "flex";
                }
            }
        });

        backBtn.addEventListener("click", function (e) {
            e.preventDefault();
            if (currentQuestion > 1) goToQuestion(currentQuestion - 1);
        });

        document.querySelectorAll(".ctabox a").forEach(function (b) {
            b.addEventListener("click", openQuiz, true);
        });

        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) closeQuiz();
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && overlay.classList.contains("open")) closeQuiz();
        });

        updateProgressBar();
        updateButtonText();
    });
})();

/* ============ NEWS-STYLE HEADER (mobile drawer + scroll progress) ============ */
(function () {
    document.addEventListener("DOMContentLoaded", function () {
        var menu = document.getElementById("mobileMenu");
        var btns = document.querySelectorAll(".js-menu");
        if (!menu || !btns.length) return;

        function setExpanded(v) {
            btns.forEach(function (b) {
                b.classList.toggle("open", v);
                b.setAttribute("aria-expanded", v ? "true" : "false");
            });
        }
        function open() {
            menu.classList.add("open");
            setExpanded(true);
            document.body.style.overflow = "hidden";
        }
        function close() {
            menu.classList.remove("open");
            setExpanded(false);
            document.body.style.overflow = "";
        }
        btns.forEach(function (b) {
            b.addEventListener("click", function () {
                menu.classList.contains("open") ? close() : open();
            });
        });
        menu.querySelectorAll("[data-close]").forEach(function (el) {
            el.addEventListener("click", close);
        });
        menu.querySelectorAll(".drawer li").forEach(function (el) {
            el.addEventListener("click", close);
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && menu.classList.contains("open")) close();
        });
    });

    document.addEventListener("DOMContentLoaded", function () {
        var bar = document.getElementById("scrollProgress");
        if (!bar) return;
        var ticking = false;
        function update() {
            var doc = document.documentElement;
            var max = doc.scrollHeight - window.innerHeight;
            var p = max > 0 ? Math.min(1, Math.max(0, (window.scrollY || doc.scrollTop) / max)) : 0;
            var eased = Math.pow(p, 0.55);
            bar.style.transform = "scaleX(" + eased + ")";
            ticking = false;
        }
        window.addEventListener(
            "scroll",
            function () {
                if (!ticking) {
                    window.requestAnimationFrame(update);
                    ticking = true;
                }
            },
            { passive: true }
        );
        window.addEventListener("resize", update, { passive: true });
        update();
    });
})();
