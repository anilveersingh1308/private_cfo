document.addEventListener('DOMContentLoaded', function() {
    // --- Dynamic Calculator Logic ---
    // Get calculator type from the current URL or default to 'sip'
    const urlParams = new URLSearchParams(window.location.search);
    const calculatorType = urlParams.get('type') || 'sip';
    
    const amountInput = document.getElementById('amount-input');
    const durationSlider = document.getElementById('duration-slider');
    const returnSlider = document.getElementById('return-slider');
    const durationValue = document.getElementById('duration-value');
    const returnValue = document.getElementById('return-value');
    const totalValueEl = document.getElementById('total-value');
    const investedAmountEl = document.getElementById('invested-amount');
    const returnsAmountEl = document.getElementById('returns-amount');
    const donutChart = document.getElementById('donut-chart');
    const outputDuration = document.getElementById('output-duration');
    const slider_color = document.getElementById('slider_gradient')
    // Fetch slider color from Django context
    function formatINR(num) {
        return '₹ ' + num.toLocaleString('en-IN');
    }

    // SIP Calculation Formula
    function calculateSIP(P, nYears, rate) {
        const n = nYears * 12; // Total months
        const r = rate / 12 / 100; // Monthly rate
        const maturity = Math.round(P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r)));
        const invested = P * n;
        const returns = maturity - invested;
        return { maturity, invested, returns };
    }    // Lumpsum Calculation Formula
    function calculateLumpsum(P, nYears, rate) {
        const r = rate / 100; // Annual rate as decimal
        const maturity = Math.round(P * Math.pow(1 + r, nYears));
        const invested = P;
        const returns = maturity - invested;
        return { maturity, invested, returns };
    }    // FD Calculation Formula (Compound Interest)
    function calculateFD(P, nYears, rate) {
        const r = rate / 100; // Annual rate as decimal
        const n = 4; // Quarterly compounding (most common for FDs)
        
        // Handle edge case where rate is 0
        if (rate === 0) {
            const maturity = P;
            const invested = P;
            const returns = 0;
            return { maturity, invested, returns };
        }
        
        const maturity = Math.round(P * Math.pow(1 + r/n, n * nYears));
        const invested = P;
        const returns = maturity - invested;
        return { maturity, invested, returns };
    }

    // Mutual Fund Calculation Formula (Annual Compounding)
    function calculateMutualFund(P, nYears, rate) {
        const r = rate / 100; // Annual rate as decimal
        
        // Handle edge case where rate is 0
        if (rate === 0) {
            const maturity = P;
            const invested = P;
            const returns = 0;
            return { maturity, invested, returns };
        }
        
        // Annual compounding for mutual funds
        const maturity = Math.round(P * Math.pow(1 + r, nYears));
        const invested = P;
        const returns = maturity - invested;
        return { maturity, invested, returns };
    }

    // Simple Interest Calculation Formula
    function calculateSimpleInterest(P, nYears, rate) {
        const r = rate / 100; // Annual rate as decimal
        
        // Simple Interest: SI = P * R * T
        const simpleInterest = Math.round(P * r * nYears);
        const maturity = P + simpleInterest;
        const invested = P;
        const returns = simpleInterest;
        
        return { maturity, invested, returns };
    }

    // Compound Interest Calculation Formula
    function calculateCompoundInterest(P, nYears, rate) {
        const r = rate / 100; // Annual rate as decimal
        const n = 1; // Annual compounding (most common)
        
        // Handle edge case where rate is 0
        if (rate === 0) {
            const maturity = P;
            const invested = P;
            const returns = 0;
            return { maturity, invested, returns };
        }
        
        // Compound Interest: A = P(1 + r/n)^(n*t)
        const maturity = Math.round(P * Math.pow(1 + r/n, n * nYears));
        const invested = P;
        const returns = maturity - invested;
        
        return { maturity, invested, returns };
    }

    function updateSliderFill(slider) {
        const min = parseFloat(slider.min);
        const max = parseFloat(slider.max);
        const val = parseFloat(slider.value);
        const percent = ((val - min) / (max - min)) * 100;
        slider.style.background = `linear-gradient(to right, #00bcd4 0%, #00bcd4 ${percent}%, var(--slider-track) ${percent}%, var(--slider-track) 100%)`;
    }

    function formatIndianCurrency(num) {
        let numStr = num.toString().replace(/,/g, '');
        let parts = numStr.split('.');
        let integerPart = parts[0];
        let decimalPart = parts[1] ? '.' + parts[1] : '';
        let lastThree = integerPart.substring(integerPart.length - 3);
        let otherNumbers = integerPart.substring(0, integerPart.length - 3);
        
        if (otherNumbers !== '') {
            lastThree = ',' + lastThree;
        }
        
        let result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree + decimalPart;
        return result;
    }

    function parseIndianCurrency(value) {
        return parseFloat(value.replace(/,/g, '')) || 0;
    }

    function formatInputValue(input) {
        let cursorPos = input.selectionStart;
        let oldValue = input.value;
        let numericValue = oldValue.replace(/[^0-9]/g, '');
        
        if (numericValue.length > 17) {
            numericValue = numericValue.substring(0, 17);
        }
        
        if (numericValue === '') {
            input.value = '';
            adjustInputWidth(input);
            return;
        }
        
        let formattedValue = formatIndianCurrency(numericValue);
        let diff = formattedValue.length - oldValue.length;
        let newCursorPos = cursorPos + diff;
        
        input.value = formattedValue;
        adjustInputWidth(input);
        
        setTimeout(() => {
            input.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    }

    function adjustInputWidth(input) {
        const tempSpan = document.createElement('span');
        tempSpan.style.font = window.getComputedStyle(input).font;
        tempSpan.style.fontSize = window.getComputedStyle(input).fontSize;
        tempSpan.style.fontWeight = window.getComputedStyle(input).fontWeight;
        tempSpan.style.fontFamily = window.getComputedStyle(input).fontFamily;
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.whiteSpace = 'nowrap';
        tempSpan.textContent = input.value || input.placeholder || '0';
        
        document.body.appendChild(tempSpan);
        const textWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
        
        const minWidth = 60;
        const padding = 20;
        const newWidth = Math.max(minWidth, textWidth + padding);
        
        input.style.width = newWidth + 'px';
    }

    function updateCalculator() {
        const P = parseIndianCurrency(amountInput.value) || 0;
        const years = parseInt(durationSlider.value);
        const rate = parseFloat(returnSlider.value);
        
        durationValue.innerHTML = years;
        returnValue.innerHTML = rate;
        outputDuration.innerHTML = years;
        
        let result;        // Use appropriate calculation based on calculator type
        if (calculatorType === 'lumpsum') {
            result = calculateLumpsum(P, years, rate);
        } else if (calculatorType === 'fd') {
            result = calculateFD(P, years, rate);
        } else if (calculatorType === 'mutual-fund') {
            result = calculateMutualFund(P, years, rate);
        } else if (calculatorType === 'simple-interest') {
            result = calculateSimpleInterest(P, years, rate);
        } else if (calculatorType === 'compound-interest') {
            result = calculateCompoundInterest(P, years, rate);
        } else {
            result = calculateSIP(P, years, rate);
        }
        
        const { maturity, invested, returns } = result;
        
        totalValueEl.textContent = formatINR(maturity);
        investedAmountEl.textContent = formatINR(invested);
        returnsAmountEl.textContent = formatINR(returns);
        updateDonutChart(invested, returns);
        
        updateSliderFill(durationSlider);
        updateSliderFill(returnSlider);
    }

    function updateDonutChart(invested, returns) {
        const total = invested + returns;
        const investedPercent = total === 0 ? 0 : (invested / total) * 100;
        donutChart.style.background = `conic-gradient(var(--accent-cyan) 0% ${investedPercent}%, var(--text-white) ${investedPercent}% 100%)`;
    }

    function switchCalculator(type) {
        console.log('switchCalculator called with type:', type);
        try {
            const url = `/calculator?type=${type}`;
            // console.log('Navigating to:', url);
            window.location.href = url;
        } catch (error) {
            console.error('Error in switchCalculator:', error);
        }
    }
    
    // Make switchCalculator globally available
    window.switchCalculator = switchCalculator;
    
    console.log('switchCalculator function loaded and made global');
    
    // Initial render
    updateCalculator();
    adjustInputWidth(amountInput);
    
    // Event listeners
    amountInput.addEventListener('input', function(e) {
        formatInputValue(e.target);
        updateCalculator();
    });
    
    amountInput.addEventListener('paste', function(e) {
        setTimeout(() => {
            formatInputValue(e.target);
            updateCalculator();
        }, 10);
    });
    
    amountInput.addEventListener('keydown', function(e) {
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
        const isNumber = /^[0-9]$/.test(e.key);
        
        if (!isNumber && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
        }
    });
    
    durationSlider.addEventListener('input', updateCalculator);
    returnSlider.addEventListener('input', updateCalculator);
    
    // Alternative event listener approach for calculator tabs
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('tab-btn') && e.target.dataset.type) {
            e.preventDefault();
            const type = e.target.dataset.type;
            console.log('Tab clicked via event listener:', type);
            switchCalculator(type);
        }
    });
    
    // Debug: Check if calculator tab buttons exist
    setTimeout(() => {
        const tabButtons = document.querySelectorAll('.tab-btn');
        console.log('Found calculator tab buttons:', tabButtons.length);
        tabButtons.forEach((btn, index) => {
            console.log(`Button ${index}:`, {
                text: btn.textContent,
                type: btn.dataset.type,
                onclick: btn.onclick,
                classes: btn.className
            });
        });
    }, 100);
    
    updateSliderFill(durationSlider);
    updateSliderFill(returnSlider);
});