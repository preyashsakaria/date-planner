document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 1;
    let stepHistory = [1];
    const TRANSITION_MS = 400;

    // User Selections
    let selections = {
        date: '',
        time: '18:00',
        food: '',
        activity: '',
        excitement: 5,
        comment: ''
    };

    const navBar = document.getElementById('nav-bar');
    const dots = document.querySelectorAll('.progress-dot');
    const floatingHearts = document.getElementById('floating-hearts');

    // =============================================
    // PROGRESS DOTS
    // =============================================
    const updateDots = (step) => {
        dots.forEach((dot, i) => {
            const dotStep = i + 1;
            dot.classList.remove('active', 'completed');
            if (dotStep === step) {
                dot.classList.add('active');
            } else if (dotStep < step) {
                dot.classList.add('completed');
            }
        });
    };

    // =============================================
    // NAVIGATION
    // =============================================
    const updateNavBar = () => {
        if (currentStep > 1 && currentStep < 7) {
            navBar.classList.add('visible');
        } else {
            navBar.classList.remove('visible');
        }
    };

    // =============================================
    // FLOATING HEARTS (Steps 3+)
    // =============================================
    const spawnHearts = () => {
        floatingHearts.innerHTML = '';
        const hearts = ['💕', '💖', '💗', '✨', '🌸'];
        for (let i = 0; i < 12; i++) {
            const span = document.createElement('span');
            span.className = 'heart';
            span.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            span.style.left = Math.random() * 100 + '%';
            span.style.animationDelay = Math.random() * 4 + 's';
            span.style.animationDuration = (3 + Math.random() * 3) + 's';
            floatingHearts.appendChild(span);
        }
    };

    const toggleHearts = (step) => {
        if (step >= 3 && step <= 6) {
            spawnHearts();
            floatingHearts.classList.add('active');
        } else {
            floatingHearts.classList.remove('active');
        }
    };

    // =============================================
    // CONFETTI ENGINE (Pure vanilla canvas)
    // =============================================
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    let confettiPieces = [];
    let confettiAnimating = false;

    const resizeCanvas = () => {
        const frame = document.querySelector('.mobile-frame');
        canvas.width = frame.offsetWidth;
        canvas.height = frame.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const launchConfetti = () => {
        resizeCanvas();
        confettiPieces = [];
        const colors = ['#ff1493', '#ff69b4', '#ffe5ec', '#ffd700', '#ff6b6b', '#a855f7', '#fff'];
        for (let i = 0; i < 80; i++) {
            confettiPieces.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height * -1,
                w: 4 + Math.random() * 6,
                h: 8 + Math.random() * 8,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                speedY: 1.5 + Math.random() * 3,
                speedX: (Math.random() - 0.5) * 2,
                opacity: 1
            });
        }
        if (!confettiAnimating) {
            confettiAnimating = true;
            animateConfetti();
        }
    };

    const animateConfetti = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        confettiPieces.forEach(p => {
            if (p.opacity <= 0) return;
            alive = true;
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;
            // Fade out near bottom
            if (p.y > canvas.height * 0.75) {
                p.opacity -= 0.02;
            }
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });
        if (alive) {
            requestAnimationFrame(animateConfetti);
        } else {
            confettiAnimating = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    // =============================================
    // STEP TRANSITIONS (Directional slides)
    // =============================================
    const goToStep = (targetStep, isBack = false) => {
        if (targetStep === currentStep) return;
        const currentEl = document.getElementById(`step-${currentStep}`);
        const nextEl = document.getElementById(`step-${targetStep}`);
        if (!currentEl || !nextEl) return;

        // Hide evasive No button when leaving step 1
        if (currentStep === 1 && targetStep !== 1) {
            const btn = document.getElementById('btn-no');
            if (btn && btn.dataset.evading) btn.style.display = 'none';
        }

        // Determine direction
        const outClass = isBack ? 'slide-out-right' : 'slide-out-left';
        const inClass  = isBack ? 'slide-in-left'  : 'slide-in-right';

        // Animate current out
        currentEl.classList.remove('active', 'pop-in', 'slide-in-left', 'slide-in-right');
        currentEl.classList.add(outClass);

        // Animate next in
        nextEl.style.display = 'flex';
        nextEl.classList.remove('slide-out-left', 'slide-out-right');
        nextEl.classList.add(inClass);

        // Cleanup after transition
        setTimeout(() => {
            currentEl.style.display = 'none';
            currentEl.classList.remove(outClass);
            nextEl.classList.remove(inClass);
            nextEl.classList.add('active');

            // Show evasive button if returning to step 1
            if (targetStep === 1) {
                const btn = document.getElementById('btn-no');
                if (btn && btn.dataset.evading) btn.style.display = 'flex';
            }
        }, TRANSITION_MS);

        if (!isBack) {
            stepHistory.push(targetStep);
        }
        currentStep = targetStep;
        updateNavBar();
        updateDots(targetStep);
        toggleHearts(targetStep);

        // Trigger confetti on step 2 (celebration) and step 7 (finale)
        if (targetStep === 2 || targetStep === 7) {
            setTimeout(() => launchConfetti(), 200);
        }
    };

    // Back button
    document.getElementById('btn-back').addEventListener('click', () => {
        if (stepHistory.length > 1) {
            stepHistory.pop();
            const prevStep = stepHistory[stepHistory.length - 1];
            goToStep(prevStep, true);
        }
    });

    // =============================================
    // MULTILINGUAL GREETING CYCLE
    // =============================================
    const greetings = ["Hello", "હેલો", "नमस्ते", "Bonjour"];
    let greetingIndex = 0;
    const greetingEl = document.getElementById('greeting');
    if (greetingEl) {
        setInterval(() => {
            greetingIndex = (greetingIndex + 1) % greetings.length;
            greetingEl.style.opacity = '0';
            setTimeout(() => {
                greetingEl.innerText = greetings[greetingIndex];
                greetingEl.style.opacity = '1';
            }, 300);
        }, 2500);
        greetingEl.style.transition = 'opacity 0.3s ease';
    }

    // =============================================
    // STEP 1: The Ask & Evasive No Button
    // =============================================
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');

    btnYes.addEventListener('click', () => goToStep(2));

    const evadeCursor = (e) => {
        const frame = document.querySelector('.mobile-frame');

        if (!btnNo.dataset.evading) {
            btnNo.dataset.evading = "true";

            const rect = btnNo.getBoundingClientRect();
            const placeholder = document.createElement('div');
            placeholder.style.width = rect.width + 'px';
            placeholder.style.height = rect.height + 'px';
            btnNo.parentNode.insertBefore(placeholder, btnNo);

            btnNo.style.width = rect.width + 'px';
            btnNo.style.height = rect.height + 'px';

            frame.appendChild(btnNo);
            btnNo.style.position = 'absolute';
            btnNo.style.zIndex = '9999';
            btnNo.style.margin = '0';
            btnNo.style.transition = 'top 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }

        const btnWidth = btnNo.offsetWidth;
        const btnHeight = btnNo.offsetHeight;
        const maxX = frame.offsetWidth - btnWidth - 20;
        const maxY = frame.offsetHeight - btnHeight - 20;
        const randomX = Math.max(10, Math.floor(Math.random() * maxX));
        const randomY = Math.max(10, Math.floor(Math.random() * maxY));

        btnNo.style.transform = 'none';
        btnNo.style.left = randomX + 'px';
        btnNo.style.top = randomY + 'px';
    };

    btnNo.addEventListener('mouseover', evadeCursor);
    btnNo.addEventListener('touchstart', evadeCursor);
    btnNo.addEventListener('click', evadeCursor);

    // =============================================
    // STEP 2: Yay
    // =============================================
    document.getElementById('btn-next-2').addEventListener('click', () => goToStep(3));

    // =============================================
    // STEP 3: Calendar
    // =============================================
    const datePicker = document.getElementById('date-picker');
    const timePicker = document.getElementById('time-picker');

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 14);

    datePicker.min = today.toISOString().split('T')[0];
    datePicker.max = maxDate.toISOString().split('T')[0];
    datePicker.value = tomorrow.toISOString().split('T')[0];

    document.getElementById('btn-next-3').addEventListener('click', () => {
        if (!datePicker.value) {
            alert("Please pick a date!");
            return;
        }
        const d = new Date(datePicker.value);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        selections.date = d.toLocaleDateString(undefined, options);
        selections.time = timePicker.value || "18:00";
        goToStep(4);
    });

    // =============================================
    // GRID SELECTION HELPER
    // =============================================
    const setupGridSelection = (optionsClass, selectionKey) => {
        const options = document.querySelectorAll(optionsClass);
        options.forEach(opt => {
            opt.addEventListener('click', function () {
                options.forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
                selections[selectionKey] = this.getAttribute('data-value');
            });
        });
        if (options.length > 0) {
            options[0].classList.add('selected');
            selections[selectionKey] = options[0].getAttribute('data-value');
        }
    };

    // =============================================
    // STEP 4: Food Vibes
    // =============================================
    setupGridSelection('.food-option', 'food');
    document.getElementById('btn-next-4').addEventListener('click', () => goToStep(5));

    // =============================================
    // STEP 5: Activity
    // =============================================
    setupGridSelection('.act-option', 'activity');
    document.getElementById('btn-next-5').addEventListener('click', () => goToStep(6));

    // =============================================
    // STEP 6: Excitement Slider (Dynamic)
    // =============================================
    const slider = document.getElementById('excitement-slider');
    const excitementVal = document.getElementById('excitement-val');
    const excitementEmoji = document.getElementById('excitement-emoji');
    const excitementDisplay = document.getElementById('excitement-display');

    const emojiMap = {
        1: '😐', 2: '😐', 3: '🙂',
        4: '😊', 5: '😊', 6: '😄',
        7: '🥰', 8: '🥰',
        9: '🔥', 10: '🔥'
    };

    const colorMap = {
        1: '#cccccc', 2: '#bbbbbb', 3: '#e8a0bf',
        4: '#f48fb1', 5: '#f06292', 6: '#ec407a',
        7: '#e91e63', 8: '#d81b60',
        9: '#ff1744', 10: '#ff1744'
    };

    slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        selections.excitement = val;
        excitementVal.innerText = val;

        // Update emoji
        excitementEmoji.innerText = emojiMap[val] || '😊';

        // Bounce the display
        excitementDisplay.classList.remove('bounce');
        void excitementDisplay.offsetWidth; // trigger reflow
        excitementDisplay.classList.add('bounce');

        // Dynamic slider track colour
        const pct = ((val - 1) / 9) * 100;
        const col = colorMap[val] || '#ff1493';
        slider.style.background = `linear-gradient(90deg, ${col} 0%, ${col} ${pct}%, #eee ${pct}%, #eee 100%)`;
    });

    // Set initial slider state
    slider.dispatchEvent(new Event('input'));

    // =============================================
    // STEP 6 → 7: Populate Receipt
    // =============================================
    document.getElementById('btn-next-6').addEventListener('click', () => {
        document.getElementById('res-date').innerText = selections.date;
        document.getElementById('res-time').innerText = selections.time;
        document.getElementById('res-food').innerText = selections.food;
        document.getElementById('res-activity').innerText = selections.activity;
        document.getElementById('res-excitement').innerText = `${selections.excitement} / 10`;
        goToStep(7);
    });

    // =============================================
    // STEP 7: Confirmation / WhatsApp
    // =============================================
    document.getElementById('btn-whatsapp').addEventListener('click', () => {
        const commentBox = document.getElementById('optional-comment');
        if (commentBox) selections.comment = commentBox.value.trim();

        const phone = "61482042704";
        let msg = `Woof! 🐶🐾\n\nI said YES to the date! 🎉\n\nHere are my picks:\n📅 Date: ${selections.date}\n⏰ Time: ${selections.time}\n🍽️ Vibe: ${selections.food}\n🎯 Activity: ${selections.activity}\n♥ Excitement: ${selections.excitement}/10`;

        if (selections.comment) {
            msg += `\n\n💬 Note from me: "${selections.comment}"`;
        }

        msg += `\n\nCan't wait! 🐾\n\nP.S. No dental check-up required for this date 🦷😄`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    });
});
