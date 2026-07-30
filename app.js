document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 1;
    let stepHistory = [1];
    
    // User Selections
    let selections = {
        date: '',
        time: '18:00',
        food: 'Cat Cafe',
        activity: 'Scuba Diving',
        excitement: 5,
        comment: ''
    };

    const navBar = document.getElementById('nav-bar');

    const updateNavBar = () => {
        if (currentStep > 1 && currentStep < 7) {
            navBar.classList.add('visible');
        } else {
            navBar.classList.remove('visible');
        }
    };

    const goToStep = (targetStep, isBack = false) => {
        const currentEl = document.getElementById(`step-${currentStep}`);
        if (!currentEl) return;

        // Hide evasive button if leaving step 1
        if (currentStep === 1 && targetStep !== 1) {
            const btn = document.getElementById('btn-no');
            if (btn && btn.dataset.evading) btn.style.display = 'none';
        }

        currentEl.classList.remove('active');
        
        setTimeout(() => {
            currentEl.style.display = 'none';
            
            const nextEl = document.getElementById(`step-${targetStep}`);
            if (nextEl) {
                nextEl.style.display = 'block';
                setTimeout(() => {
                    nextEl.classList.add('active');
                }, 10);
            }
            
            // Show evasive button if returning to step 1
            if (targetStep === 1) {
                const btn = document.getElementById('btn-no');
                if (btn && btn.dataset.evading) btn.style.display = 'flex';
            }
        }, 300);

        if (!isBack) {
            stepHistory.push(targetStep);
        }
        currentStep = targetStep;
        updateNavBar();
    };

    document.getElementById('btn-back').addEventListener('click', () => {
        if (stepHistory.length > 1) {
            stepHistory.pop(); // remove current
            const prevStep = stepHistory[stepHistory.length - 1];
            goToStep(prevStep, true);
        }
    });

    // --- Multilingual Greeting Cycle ---
    const greetings = ["Hello", "Nǐ Hǎo", "你好", "Hallo", "Hola"];
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

    // --- Step 1: The Ask & Evasive No Button ---
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');

    btnYes.addEventListener('click', () => {
        goToStep(2);
    });

    const evadeCursor = (e) => {
        const frame = document.querySelector('.mobile-frame');
        
        if (!btnNo.dataset.evading) {
            btnNo.dataset.evading = "true";
            
            // Create a placeholder to keep layout stable
            const rect = btnNo.getBoundingClientRect();
            const placeholder = document.createElement('div');
            placeholder.style.width = rect.width + 'px';
            placeholder.style.height = rect.height + 'px';
            btnNo.parentNode.insertBefore(placeholder, btnNo);

            // Lock the button's exact size so it doesn't stretch
            btnNo.style.width = rect.width + 'px';
            btnNo.style.height = rect.height + 'px';

            // Move the button directly into the mobile-frame so it's absolutely positioned against the frame
            frame.appendChild(btnNo);
            btnNo.style.position = 'absolute';
            btnNo.style.zIndex = '9999';
            btnNo.style.margin = '0';
            btnNo.style.transition = 'top 0.2s ease, left 0.2s ease';
        }

        const btnWidth = btnNo.offsetWidth;
        const btnHeight = btnNo.offsetHeight;
        
        // Random position strictly within the .mobile-frame bounds
        const maxX = frame.offsetWidth - btnWidth - 20;
        const maxY = frame.offsetHeight - btnHeight - 20;
        
        const randomX = Math.max(10, Math.floor(Math.random() * maxX));
        const randomY = Math.max(10, Math.floor(Math.random() * maxY));

        // Set explicit coordinates relative to the frame
        btnNo.style.transform = 'none';
        btnNo.style.left = randomX + 'px';
        btnNo.style.top = randomY + 'px';
    };

    btnNo.addEventListener('mouseover', evadeCursor);
    btnNo.addEventListener('touchstart', evadeCursor);
    btnNo.addEventListener('click', evadeCursor);

    // --- Step 2: Yay ---
    document.getElementById('btn-next-2').addEventListener('click', () => goToStep(3));

    // --- Step 3: Calendar ---
    const datePicker = document.getElementById('date-picker');
    const timePicker = document.getElementById('time-picker');
    
    // Set default to tomorrow and restrict to 14 days
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

    // --- Grid Selection Helper ---
    const setupGridSelection = (optionsClass, selectionKey) => {
        const options = document.querySelectorAll(optionsClass);
        options.forEach(opt => {
            opt.addEventListener('click', function() {
                options.forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
                selections[selectionKey] = this.getAttribute('data-value');
            });
        });
        // Select first by default
        if(options.length > 0) {
            options[0].classList.add('selected');
            selections[selectionKey] = options[0].getAttribute('data-value');
        }
    };

    // --- Step 4: Food Vibes ---
    setupGridSelection('.food-option', 'food');
    document.getElementById('btn-next-4').addEventListener('click', () => goToStep(5));

    // --- Step 5: Activity ---
    setupGridSelection('.act-option', 'activity');
    document.getElementById('btn-next-5').addEventListener('click', () => goToStep(6));

    // --- Step 6: Excitement Slider ---
    const slider = document.getElementById('excitement-slider');
    const excitementVal = document.getElementById('excitement-val');
    
    slider.addEventListener('input', (e) => {
        selections.excitement = e.target.value;
        excitementVal.innerText = selections.excitement;
    });

    document.getElementById('btn-next-6').addEventListener('click', () => {
        // Populate receipt
        document.getElementById('res-date').innerText = selections.date;
        document.getElementById('res-time').innerText = selections.time;
        document.getElementById('res-food').innerText = selections.food;
        document.getElementById('res-activity').innerText = selections.activity;
        document.getElementById('res-excitement').innerText = `${selections.excitement} / 10`;
        goToStep(7);
    });

    // --- Step 7: Confirmation / WhatsApp ---
    document.getElementById('btn-whatsapp').addEventListener('click', () => {
        const commentBox = document.getElementById('optional-comment');
        if(commentBox) selections.comment = commentBox.value.trim();

        const phone = "61482042704";
        let msg = `Meow! 😻\n\nI said YES to the date! 🎉\n\nHere are my picks:\n📅 Date: ${selections.date}\n⏰ Time: ${selections.time}\n🍽️ Vibe: ${selections.food}\n🎯 Activity: ${selections.activity}\n♥ Excitement: ${selections.excitement}/10`;
        
        if (selections.comment) {
            msg += `\n\n💬 Note from me: "${selections.comment}"`;
        }
        
        msg += `\n\nCan't wait! 🐾`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    });
});
