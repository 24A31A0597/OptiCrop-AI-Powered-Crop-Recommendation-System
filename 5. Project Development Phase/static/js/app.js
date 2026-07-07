document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('[data-loading-form]');
    const overlay = document.querySelector('[data-loading-overlay]');
    const predictButton = document.querySelector('[data-predict-button]');
    const resetButton = document.querySelector('[data-reset-button]');
    const toastStack = document.querySelector('[data-toast-stack]');
    const loadingMessage = document.querySelector('[data-loading-message]');
    const loadingSubmessage = document.querySelector('[data-loading-submessage]');
    const predictionCard = document.querySelector('[data-prediction]');
    const cropInfoCard = document.querySelector('[data-crop-info]');
    const confidenceRing = document.querySelector('[data-confidence-ring]');
    const confidenceRingLabel = document.querySelector('[data-confidence-ring-label]');
    const confidenceText = document.querySelector('[data-confidence-text]');
    const pageShell = document.querySelector('.page-shell');
    const historyList = document.querySelector('[data-history-list]');

    const fields = form ? Array.from(form.querySelectorAll('input[name]')) : [];
    const loaderSteps = [
        '🌱 Reading Soil Data...',
        '🌡️ Analyzing Climate...',
        '🤖 Running Random Forest Model...',
        '🌾 Generating Recommendation...'
    ];

    const cropDictionary = {
        rice: {
            emoji: '🌾',
            description: 'A water-loving staple crop that thrives in warm, humid environments with stable irrigation.',
            soil: 'Best suited to clay-loam soil with good water retention, medium fertility, and a pH around 5.5 to 6.5.',
            climate: 'Performs best in humid conditions with regular rainfall and warm temperatures.',
            season: 'Commonly grown during the Kharif or wet season in monsoon-supported regions.'
        },
        maize: {
            emoji: '🌽',
            description: 'A versatile cereal crop used for food, fodder, and industrial applications.',
            soil: 'Prefers well-drained fertile loamy soil with balanced nutrients and a pH around 6.0 to 7.0.',
            climate: 'Needs moderate warmth, good sunlight, and steady moisture without waterlogging.',
            season: 'Usually cultivated in the Kharif season, though irrigated regions may support multiple cycles.'
        },
        chickpea: {
            emoji: '🫘',
            description: 'A protein-rich legume that adds value to crop rotation and soil fertility.',
            soil: 'Grows best in well-drained sandy loam soil with moderate moisture and a pH near 6.0 to 7.0.',
            climate: 'Prefers cool, dry weather and lower humidity during the growing period.',
            season: 'Often planted in the cool season with moderate rainfall.'
        },
        kidneybeans: {
            emoji: '🫘',
            description: 'A protein-rich legume that improves soil fertility through nitrogen fixation.',
            soil: 'Grows best in well-drained sandy loam soil with moderate moisture and a pH near 6.0 to 7.0.',
            climate: 'Prefers warm weather with consistent but not excessive rainfall.',
            season: 'Often planted in the warm season with moderate rainfall.'
        },
        blackgram: {
            emoji: '🌱',
            description: 'A short-duration pulse crop valued for its nutritional content and soil-enriching ability.',
            soil: 'Thrives in light to medium-textured soil with moderate fertility and good drainage.',
            climate: 'Performs well in warm climates with seasonal rainfall.',
            season: 'Commonly grown during the Kharif season.'
        },
        mungbean: {
            emoji: '🌱',
            description: 'A fast-growing pulse crop with strong demand in human nutrition and soil improvement.',
            soil: 'Prefers loamy soil with a neutral pH and moderate moisture levels.',
            climate: 'Enjoys warm, relatively dry weather and plenty of sunlight.',
            season: 'Usually grown in warm, dry periods and early Kharif windows.'
        },
        mothbeans: {
            emoji: '🌱',
            description: 'A drought-tolerant pulse suited for dryland farming and marginal soils.',
            soil: 'Best for sandy loam soils with low to medium fertility and very good drainage.',
            climate: 'Adapts well to hot, dry, and low-rainfall climates.',
            season: 'Typically cultivated in arid and semi-arid seasons with limited rainfall.'
        },
        lentil: {
            emoji: '🌱',
            description: 'A cool-season pulse crop prized for its protein-rich seeds and resilience.',
            soil: 'Prefers well-drained loam or clay-loam soil with a slightly acidic to neutral pH.',
            climate: 'Performs best in cooler, dry air and gentle weather conditions.',
            season: 'Commonly grown in the Rabi or cool season.'
        },
        pigeonpeas: {
            emoji: '🌿',
            description: 'A hardy pulse crop that performs well under warmer climates and variable rainfall.',
            soil: 'Best in deep, well-drained loamy soil with moderate organic matter and a pH near 6.0 to 7.5.',
            climate: 'Handles warm temperatures and moderate rainfall with good resilience.',
            season: 'Mainly cultivated in the Kharif season.'
        },
        banana: {
            emoji: '🍌',
            description: 'A high-value tropical fruit crop that needs steady warmth and moisture.',
            soil: 'Prefers fertile, well-drained loamy soil rich in organic matter and a pH between 6.0 and 7.5.',
            climate: 'Thrives in humid tropical climates with stable moisture and no frost.',
            season: 'Can be grown year-round in irrigated tropical regions.'
        },
        mango: {
            emoji: '🥭',
            description: 'A premium fruit crop known for warm-climate adaptability and long orchard life.',
            soil: 'Grows well in deep, well-drained sandy loam or loam soil with a pH around 5.5 to 7.5.',
            climate: 'Prefers warm, dry weather during flowering and fruit development.',
            season: 'Orchard planting is usually done before the monsoon, with fruiting in summer.'
        },
        grapes: {
            emoji: '🍇',
            description: 'A specialty horticultural crop suited to managed irrigation and precise nutrient control.',
            soil: 'Requires well-drained fertile loamy soil and careful pH management around 6.0 to 7.0.',
            climate: 'Needs sunny conditions, moderate humidity, and low rainfall at maturity.',
            season: 'Commonly established in late winter or early spring depending on region.'
        },
        watermelon: {
            emoji: '🍉',
            description: 'A warm-season vine crop that responds well to heat and light soils.',
            soil: 'Best in sandy loam soil with excellent drainage and a pH near 6.0 to 7.0.',
            climate: 'Prefers hot, dry weather with plenty of sunlight.',
            season: 'Usually grown in the summer or hot dry season.'
        },
        muskmelon: {
            emoji: '🍈',
            description: 'A sweet warm-season fruit crop that favors sunny, dry conditions.',
            soil: 'Prefers sandy loam soil with good drainage, moderate fertility, and a neutral pH.',
            climate: 'Thrives in warm, sunny, low-humidity weather.',
            season: 'Commonly grown in spring and early summer.'
        },
        apple: {
            emoji: '🍎',
            description: 'A temperate fruit crop that needs cooler conditions and disciplined orchard management.',
            soil: 'Performs best in deep, well-drained loamy soil with a pH around 6.0 to 7.0.',
            climate: 'Requires cool temperatures and seasonal chill for reliable production.',
            season: 'Planting is typically done in the dormant or cool season.'
        },
        orange: {
            emoji: '🍊',
            description: 'A citrus crop that thrives in warm conditions and careful water management.',
            soil: 'Requires well-drained sandy loam or loam soil and a slightly acidic pH around 6.0 to 7.0.',
            climate: 'Prefers warm, sunny climates with moderate rainfall.',
            season: 'Orchards are generally established before the rainy season.'
        },
        papaya: {
            emoji: '🧡',
            description: 'A fast-growing tropical fruit crop with strong market value and high yield potential.',
            soil: 'Best in fertile, well-drained loamy soil with a pH near 6.0 to 6.8.',
            climate: 'Performs well in warm, humid regions with minimal frost risk.',
            season: 'Can be planted nearly year-round in warm regions with irrigation.'
        },
        coconut: {
            emoji: '🥥',
            description: 'A perennial tropical crop suited for humid coastal and plantation environments.',
            soil: 'Thrives in sandy, well-drained soils with ample organic matter and a pH between 5.5 and 8.0.',
            climate: 'Needs humid, coastal, tropical conditions with steady rainfall.',
            season: 'Planting is often aligned with the onset of the monsoon.'
        },
        cotton: {
            emoji: '🧵',
            description: 'A major fiber crop that benefits from warm weather and long growing periods.',
            soil: 'Performs best in deep black or loamy soil with good moisture retention and a neutral pH.',
            climate: 'Requires warm temperatures and a long frost-free season.',
            season: 'Commonly cultivated in the Kharif season.'
        },
        jute: {
            emoji: '🪢',
            description: 'A fibrous crop valued for biodegradable packaging and textile applications.',
            soil: 'Prefers alluvial soil with abundant moisture and a slightly acidic to neutral pH.',
            climate: 'Grows well in hot, humid, and rainfall-rich conditions.',
            season: 'Mainly grown during the rainy season.'
        },
        coffee: {
            emoji: '☕',
            description: 'A premium beverage crop requiring balanced shade, moisture, and altitude-aware cultivation.',
            soil: 'Prefers rich, well-drained volcanic or loamy soil with a slightly acidic pH.',
            climate: 'Likes moderate temperatures, filtered sunlight, and stable humidity.',
            season: 'New plantings usually follow the monsoon or early wet season.'
        }
    };

    const escapeHtml = (value) => String(value).replace(/[&<>"]|'/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));

    const showToast = (type, title, message) => {
        if (!toastStack) {
            return;
        }

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.setAttribute('role', 'status');
        toast.innerHTML = `
            <div class="toast__icon">${type === 'error' ? '⚠' : type === 'info' ? 'ℹ' : '✔'}</div>
            <div class="toast__content">
                <strong>${escapeHtml(title)}</strong>
                <p>${escapeHtml(message)}</p>
            </div>
        `;

        toastStack.appendChild(toast);
        window.setTimeout(() => {
            toast.classList.add('toast--hide');
            window.setTimeout(() => toast.remove(), 260);
        }, 3200);
    };

    const getFieldMessageNode = (field) => document.getElementById(`${field.name}-message`);

    const setFieldError = (field, message) => {
        const group = field.closest('.field-group');
        if (group) {
            group.classList.add('field-invalid');
        }
        field.setCustomValidity(message);

        const messageNode = getFieldMessageNode(field);
        if (messageNode) {
            messageNode.textContent = message;
        }
    };

    const clearFieldError = (field) => {
        const group = field.closest('.field-group');
        if (group) {
            group.classList.remove('field-invalid');
        }
        field.setCustomValidity('');

        const messageNode = getFieldMessageNode(field);
        if (messageNode) {
            messageNode.textContent = '';
        }
    };

    const validateField = (field) => {
        const value = field.value.trim();
        const numericValue = Number(value);

        clearFieldError(field);

        if (!value) {
            setFieldError(field, `${field.labels[0].textContent} is required.`);
            return false;
        }

        if (!Number.isFinite(numericValue)) {
            setFieldError(field, 'Please enter a valid number.');
            return false;
        }

        if (numericValue < 0) {
            setFieldError(field, 'Negative values are not allowed.');
            return false;
        }

        if (field.name === 'humidity' && numericValue > 100) {
            setFieldError(field, 'Humidity cannot exceed 100%.');
            return false;
        }

        if (field.name === 'ph' && numericValue > 14) {
            setFieldError(field, 'Soil pH cannot exceed 14.');
            return false;
        }

        if (field.name === 'temperature' && (numericValue < -10 || numericValue > 60)) {
            setFieldError(field, 'Temperature must be between -10 and 60°C.');
            return false;
        }

        return true;
    };

    const validateForm = () => {
        if (!form) {
            return true;
        }

        let valid = true;
        fields.forEach((field) => {
            if (!validateField(field)) {
                valid = false;
            }
        });

        if (!valid) {
            showToast('error', 'Invalid input', 'Please correct the highlighted fields and try again.');
        }

        return valid;
    };

    const setButtonLoading = (isLoading) => {
        if (!predictButton) {
            return;
        }

        const buttonText = predictButton.querySelector('.button-text');
        const loader = predictButton.querySelector('.button-loader');

        predictButton.classList.toggle('is-loading', isLoading);
        predictButton.disabled = isLoading;

        if (buttonText) {
            buttonText.textContent = isLoading ? 'Predicting...' : 'Predict Crop';
        }

        if (loader) {
            loader.setAttribute('aria-hidden', 'true');
        }
    };

    const setFormDisabled = (disabled) => {
        if (!form) {
            return;
        }

        fields.forEach((field) => {
            field.readOnly = disabled;
            field.setAttribute('aria-disabled', String(disabled));
        });

        if (resetButton) {
            resetButton.disabled = disabled;
        }
    };

    const showLoaderStep = (index) => {
        if (!loadingMessage || !loadingSubmessage) {
            return;
        }

        const messages = [
            ['🌱 Reading Soil Data...', 'Extracting nutrient values from the field profile.'],
            ['🌡️ Analyzing Climate...', 'Reviewing temperature, humidity, and rainfall signals.'],
            ['🤖 Running Random Forest Model...', 'Scoring the input against the trained model.'],
            ['🌾 Generating Recommendation...', 'Preparing the crop recommendation for display.']
        ];

        const [title, subtitle] = messages[index] || messages[messages.length - 1];
        loadingMessage.textContent = title;
        loadingSubmessage.textContent = subtitle;
    };

    const showLoadingSequence = async () => {
        if (!overlay) {
            return;
        }

        overlay.classList.add('is-visible');
        setButtonLoading(true);
        setFormDisabled(true);

        for (let index = 0; index < loaderSteps.length; index += 1) {
            showLoaderStep(index);
            // eslint-disable-next-line no-await-in-loop
            await new Promise((resolve) => window.setTimeout(resolve, 520));
        }
    };

    const hideLoadingSequence = () => {
        if (!overlay) {
            return;
        }

        overlay.classList.remove('is-visible');
        setButtonLoading(false);
        setFormDisabled(false);
    };

    const animateConfidence = () => {
        if (!predictionCard) {
            return;
        }

        const confidenceValue = Number(predictionCard.getAttribute('data-confidence')) || 0;
        const confidenceTarget = Math.max(0, Math.min(confidenceValue, 100));

        if (confidenceRing) {
            confidenceRing.style.setProperty('--confidence', '0');
            window.requestAnimationFrame(() => {
                confidenceRing.style.setProperty('--confidence', String(confidenceTarget));
            });
        }

        if (confidenceRingLabel) {
            let currentValue = 0;
            const duration = 900;
            const start = window.performance.now();

            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                currentValue = Math.round(progress * confidenceTarget);
                confidenceRingLabel.textContent = `${currentValue}%`;
                if (progress < 1) {
                    window.requestAnimationFrame(tick);
                }
            };

            window.requestAnimationFrame(tick);
        }

        if (confidenceText) {
            confidenceText.textContent = `${confidenceTarget.toFixed(1)}%`;
        }
    };

    const createConfetti = () => {
        if (!pageShell) {
            return;
        }

        const pieces = [];
        const colors = ['#2E7D32', '#43A047', '#81C784', '#ffffff'];
        const pieceCount = 20;

        for (let index = 0; index < pieceCount; index += 1) {
            const piece = document.createElement('span');
            const size = 6 + Math.random() * 6;
            const left = 20 + Math.random() * 60;
            const duration = 900 + Math.random() * 700;
            const delay = Math.random() * 200;
            piece.className = 'confetti-piece';
            piece.style.left = `${left}%`;
            piece.style.width = `${size}px`;
            piece.style.height = `${size * 0.6}px`;
            piece.style.background = colors[index % colors.length];
            piece.style.animationDuration = `${duration}ms`;
            piece.style.animationDelay = `${delay}ms`;
            pieces.push(piece);
            pageShell.appendChild(piece);
        }

        window.setTimeout(() => {
            pieces.forEach((piece) => piece.remove());
        }, 2200);
    };

    const readPredictionHistory = () => {
        if (historyList) {
            const serverHistory = historyList.getAttribute('data-history');
            if (serverHistory) {
                try {
                    return JSON.parse(serverHistory);
                } catch (error) {
                    return [];
                }
            }
        }

        try {
            const stored = window.sessionStorage.getItem('opticrops_recent_predictions');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            return [];
        }
    };

    const writePredictionHistory = (history) => {
        try {
            window.sessionStorage.setItem('opticrops_recent_predictions', JSON.stringify(history.slice(0, 5)));
        } catch (error) {
            // Ignore storage failures.
        }
    };

    const formatHistoryTime = (value) => {
        try {
            return new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }).format(new Date(value));
        } catch (error) {
            return '';
        }
    };

    const renderPredictionHistory = () => {
        if (!historyList) {
            return;
        }

        const history = readPredictionHistory();
        historyList.innerHTML = '';

        if (!history.length) {
            const emptyState = document.createElement('p');
            emptyState.className = 'history-empty';
            emptyState.textContent = 'No predictions yet.';
            historyList.appendChild(emptyState);
            return;
        }

        history.forEach((entry) => {
            const item = document.createElement('article');
            item.className = 'history-item';
            item.innerHTML = `
                <div>
                    <strong>${escapeHtml(entry.crop)}</strong>
                    <span>${escapeHtml(entry.time)}</span>
                </div>
                <div class="history-confidence">${escapeHtml(entry.confidence)}%</div>
            `;
            historyList.appendChild(item);
        });
    };

    const storeCurrentPrediction = () => {
        if (!predictionCard) {
            return;
        }

        const crop = predictionCard.getAttribute('data-prediction') || '';
        const confidenceValue = Number(predictionCard.getAttribute('data-confidence'));
        const confidence = Number.isFinite(confidenceValue) ? confidenceValue.toFixed(1) : '0.0';
        const time = formatHistoryTime(Date.now());

        const history = readPredictionHistory();
        const lastEntry = history[0];
        const isDuplicate = lastEntry && lastEntry.crop === crop && lastEntry.confidence === confidence && lastEntry.time === time;

        if (!isDuplicate) {
            history.unshift({ crop, confidence, time });
            writePredictionHistory(history);
        }
    };

    const enrichPredictionCard = () => {
        if (!predictionCard || !cropInfoCard) {
            return;
        }

        const cropName = predictionCard.getAttribute('data-prediction') || '';
        const cropKey = cropName.trim().toLowerCase();
        const cropMeta = cropDictionary[cropKey] || {
            emoji: '🌿',
            description: 'This crop is a suitable match for the provided field conditions.',
            soil: 'Balanced fertility, good drainage, and stable moisture levels are recommended.',
            climate: 'Moderate weather conditions with steady sunlight and moisture are ideal.',
            season: 'Check regional agricultural calendars for the best planting windows.'
        };

        const predictionIcon = predictionCard.querySelector('.prediction-icon');
        const predictionName = predictionCard.querySelector('.prediction-name');
        const infoDescription = cropInfoCard.querySelector('[data-crop-description]');
        const infoSoil = cropInfoCard.querySelector('[data-crop-soil]');
        const infoClimate = cropInfoCard.querySelector('[data-crop-climate]');
        const infoSeason = cropInfoCard.querySelector('[data-crop-season]');

        if (predictionIcon) {
            predictionIcon.textContent = cropMeta.emoji;
        }

        if (predictionName) {
            predictionName.textContent = cropName;
        }

        if (infoDescription) {
            infoDescription.textContent = cropMeta.description;
        }

        if (infoSoil) {
            infoSoil.textContent = cropMeta.soil;
        }

        if (infoClimate) {
            infoClimate.textContent = cropMeta.climate;
        }

        if (infoSeason) {
            infoSeason.textContent = cropMeta.season;
        }
    };

    const animateSuccessResult = () => {
        if (!predictionCard) {
            return;
        }

        predictionCard.classList.add('prediction-card--animated');
        window.setTimeout(() => {
            predictionCard.classList.remove('prediction-card--animated');
        }, 2200);

        animateConfidence();
        createConfetti();
        showToast('success', 'Prediction completed successfully.', 'Your crop recommendation is ready.');
    };

    if (form) {
        fields.forEach((field) => {
            field.addEventListener('input', () => {
                clearFieldError(field);
            });

            field.addEventListener('blur', () => {
                validateField(field);
            });
        });

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (!validateForm()) {
                return;
            }

            await showLoadingSequence();
            window.setTimeout(() => {
                form.submit();
            }, 250);
        });
    }

    if (resetButton && form) {
        resetButton.addEventListener('click', () => {
            window.setTimeout(() => {
                fields.forEach((field) => {
                    clearFieldError(field);
                    field.value = '';
                });
                hideLoadingSequence();
                showToast('info', 'Form reset successfully.', 'All values have been cleared.');
            }, 0);
        });
    }

    if (predictionCard) {
        enrichPredictionCard();
        storeCurrentPrediction();
        animateSuccessResult();
    }

    renderPredictionHistory();
});
