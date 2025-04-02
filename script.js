// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
    
    // Save preference to localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
});

// Check for saved theme preference
window.addEventListener('load', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        const icon = themeToggle.querySelector('i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
});

// Login Functionality
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username && password) {
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
    } else {
        alert('Please enter both username and password');
    }
}

// Navigation
document.querySelectorAll('.sidebar li').forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all items
        document.querySelectorAll('.sidebar li').forEach(i => i.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Hide all sections
        document.querySelectorAll('.main-content > div').forEach(div => div.classList.add('hidden'));
        
        // Show relevant section based on text content
        const text = item.textContent.trim().toLowerCase();
        if (text.includes('dashboard')) {
            document.querySelector('.dashboard-section').classList.remove('hidden');
        } else if (text.includes('transfer')) {
            document.querySelector('.transfer-money-section').classList.remove('hidden');
            // Animate transfer section appearance
            gsap.from('.transfer-money-section', {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: "power2.out"
            });
            // Animate form fields
            gsap.from('.transfer-form input, .transfer-form textarea', {
                opacity: 0,
                y: 20,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out"
            });
        } else if (text.includes('currency')) {
            document.querySelector('.currency-converter').classList.remove('hidden');
        } else if (text.includes('banking')) {
            document.querySelector('.banking-services').classList.remove('hidden');
        } else if (text.includes('contact')) {
            document.querySelector('.contact-section').classList.remove('hidden');
        }
    });
});

// Remove the old toggleTransfer function since we're handling it in the navigation
window.toggleTransfer = undefined;

// Update form field event listeners
document.addEventListener('DOMContentLoaded', function() {
    // IFSC Code validation and auto-fetch
    const ifscInput = document.getElementById('ifscCode');
    if (ifscInput) {
        ifscInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
            if (this.value.length === 11) {
                // Simulate bank details fetch
                gsap.to(this, {
                    borderColor: '#2ecc71',
                    duration: 0.3
                });
                
                // Mock API call - Replace with actual API
                setTimeout(() => {
                    document.getElementById('bankName').value = "EXAMPLE BANK";
                    document.getElementById('branchName').value = "EXAMPLE BRANCH";
                    
                    gsap.from(['#bankName', '#branchName'], {
                        y: 10,
                        opacity: 0,
                        duration: 0.3,
                        stagger: 0.1
                    });
                }, 500);
            }
        });
    }

    // Account number validation
    const accountInput = document.getElementById('accountNumber');
    if (accountInput) {
        accountInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
        });
    }

    // Amount input animation
    const amountInput = document.getElementById('transferAmount');
    if (amountInput) {
        amountInput.addEventListener('input', function() {
            if (this.value > 0) {
                gsap.to(this, {
                    scale: 1.05,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1
                });
            }
        });
    }
});

// Update transfer function
function initiateTransfer() {
    // Get all form inputs
    const beneficiaryName = document.getElementById('beneficiaryName');
    const accountNumber = document.getElementById('accountNumber');
    const confirmAccountNumber = document.getElementById('confirmAccountNumber');
    const ifscCode = document.getElementById('ifscCode');
    const amount = document.getElementById('transferAmount');
    const statusDiv = document.getElementById('transferStatus');

    // Clear previous status
    statusDiv.innerHTML = '';
    statusDiv.className = '';

    // Check if all fields are filled
    const isFormComplete = 
        beneficiaryName.value &&
        accountNumber.value &&
        confirmAccountNumber.value &&
        ifscCode.value &&
        amount.value;

    if (!isFormComplete) {
        // Show error for incomplete form
        statusDiv.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                Form is not filled completely. Please fill all required fields.
            </div>
        `;
        statusDiv.className = 'error';
        
        // Shake animation for error
        gsap.to('.transfer-form', {
            x: 10,
            duration: 0.1,
            yoyo: true,
            repeat: 3
        });
        return;
    }

    // Additional validations
    if (accountNumber.value !== confirmAccountNumber.value) {
        statusDiv.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                Account numbers do not match!
            </div>
        `;
        statusDiv.className = 'error';
        return;
    }

    if (ifscCode.value.length !== 11) {
        statusDiv.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                Invalid IFSC code!
            </div>
        `;
        statusDiv.className = 'error';
        return;
    }

    if (amount.value <= 0) {
        statusDiv.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                Please enter a valid amount!
            </div>
        `;
        statusDiv.className = 'error';
        return;
    }

    // If all validations pass, show processing state
    statusDiv.innerHTML = `
        <div class="processing-message">
            <i class="fas fa-spinner fa-spin"></i>
            Processing your transfer...
        </div>
    `;
    statusDiv.className = 'processing';

    // Simulate transfer process
    setTimeout(() => {
        // Show success message
        statusDiv.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                Money transferred successfully!
                <div class="transfer-details">
                    Amount: ₹${amount.value}<br>
                    To: ${beneficiaryName.value}<br>
                    Account: XXXX${accountNumber.value.slice(-4)}
                </div>
            </div>
        `;
        statusDiv.className = 'success';

        // Reset form after 3 seconds
        setTimeout(() => {
            document.querySelector('.transfer-form').reset();
        }, 3000);
    }, 2000);
}

// EMI Calculator
function calculateEMI() {
    const principal = parseFloat(document.getElementById('loanAmount').value);
    const rate = parseFloat(document.getElementById('interestRate').value) / 12 / 100;
    const time = parseFloat(document.getElementById('loanTenure').value);
    
    if (principal && rate && time) {
        const emi = principal * rate * Math.pow(1 + rate, time) / (Math.pow(1 + rate, time) - 1);
        document.getElementById('emiResult').innerHTML = `Monthly EMI: $${emi.toFixed(2)}`;
    } else {
        alert('Please enter all values');
    }
}

// Currency Converter
const dropList = document.querySelectorAll(".drop-list select"),
    fromCurrency = document.querySelector(".from select"),
    toCurrency = document.querySelector(".to select"),
    getButton = document.querySelector("form button");

// Country codes from your codes.js
const country_codes = {
    "AED": "ae", "AFN": "af", "XCD": "ag", "ALL": "al", "AMD": "am", "ANG": "an", 
    "AOA": "ao", "AQD": "aq", "ARS": "ar", "AUD": "au", "AZN": "az", "BAM": "ba", 
    "BBD": "bb", "BDT": "bd", "XOF": "be", "BGN": "bg", "BHD": "bh", "BIF": "bi", 
    "BMD": "bm", "BND": "bn", "BOB": "bo", "BRL": "br", "BSD": "bs", "NOK": "bv", 
    "BWP": "bw", "BYR": "by", "BZD": "bz", "CAD": "ca", "CDF": "cd", "XAF": "cf", 
    "CHF": "ch", "CLP": "cl", "CNY": "cn", "COP": "co", "CRC": "cr", "CUP": "cu", 
    "CVE": "cv", "CYP": "cy", "CZK": "cz", "DJF": "dj", "DKK": "dk", "DOP": "do", 
    "DZD": "dz", "ECS": "ec", "EEK": "ee", "EGP": "eg", "ETB": "et", "EUR": "eu", 
    "FJD": "fj", "FKP": "fk", "GBP": "gb", "GEL": "ge", "GGP": "gg", "GHS": "gh", 
    "GIP": "gi", "GMD": "gm", "GNF": "gn", "GTQ": "gt", "GYD": "gy", "HKD": "hk", 
    "HNL": "hn", "HRK": "hr", "HTG": "ht", "HUF": "hu", "IDR": "id", "ILS": "il", 
    "INR": "in", "IQD": "iq", "IRR": "ir", "ISK": "is", "JMD": "jm", "JOD": "jo", 
    "JPY": "jp", "KES": "ke", "KGS": "kg", "KHR": "kh", "KMF": "km", "KPW": "kp", 
    "KRW": "kr", "KWD": "kw", "KYD": "ky", "KZT": "kz", "LAK": "la", "LBP": "lb", 
    "LKR": "lk", "LRD": "lr", "LSL": "ls", "LTL": "lt", "LVL": "lv", "LYD": "ly", 
    "MAD": "ma", "MDL": "md", "MGA": "mg", "MKD": "mk", "MMK": "mm", "MNT": "mn", 
    "MOP": "mo", "MRO": "mr", "MTL": "mt", "MUR": "mu", "MVR": "mv", "MWK": "mw", 
    "MXN": "mx", "MYR": "my", "MZN": "mz", "NAD": "na", "XPF": "nc", "NGN": "ng", 
    "NIO": "ni", "NPR": "np", "NZD": "nz", "OMR": "om", "PAB": "pa", "PEN": "pe", 
    "PGK": "pg", "PHP": "ph", "PKR": "pk", "PLN": "pl", "PYG": "py", "QAR": "qa", 
    "RON": "ro", "RSD": "rs", "RUB": "ru", "RWF": "rw", "SAR": "sa", "SBD": "sb", 
    "SCR": "sc", "SDG": "sd", "SEK": "se", "SGD": "sg", "SKK": "sk", "SLL": "sl", 
    "SOS": "so", "SRD": "sr", "STD": "st", "SVC": "sv", "SYP": "sy", "SZL": "sz", 
    "THB": "th", "TJS": "tj", "TMT": "tm", "TND": "tn", "TOP": "to", "TRY": "tr", 
    "TTD": "tt", "TWD": "tw", "TZS": "tz", "UAH": "ua", "UGX": "ug", "USD": "us", 
    "UYU": "uy", "UZS": "uz", "VEF": "ve", "VND": "vn", "VUV": "vu", "YER": "ye", 
    "ZAR": "za", "ZMK": "zm", "ZWD": "zw"
};

// Currency Converter Initialization
for (let i = 0; i < dropList.length; i++) {
    for (let currency_code in country_codes) {
        // Set USD as "From" currency and INR as "To" currency by default
        let selected = i == 0 ? currency_code == "USD" ? "selected" : "" : currency_code == "INR" ? "selected" : "";
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e => {
        loadFlag(e.target);
    });
}

// Initialize flags on page load
window.addEventListener("load", () => {
    // Set initial flags
    const fromFlag = document.querySelector(".from .select-box img");
    const toFlag = document.querySelector(".to .select-box img");
    
    // Set US flag for "From" currency
    fromFlag.src = `https://flagcdn.com/48x36/us.png`;
    
    // Set Indian flag for "To" currency
    toFlag.src = `https://flagcdn.com/48x36/in.png`;
    
    // Get initial exchange rate
    getExchangeRate();
});

// Function to load flag when currency changes
function loadFlag(element) {
    for (let code in country_codes) {
        if (code == element.value) {
            let imgTag = element.parentElement.querySelector("img");
            // For INR, use 'in' as country code for Indian flag
            const countryCode = code === 'INR' ? 'in' : country_codes[code].toLowerCase();
            imgTag.src = `https://flagcdn.com/48x36/${countryCode}.png`;
        }
    }
}

// Currency Converter
async function getExchangeRate() {
    const amount = document.querySelector(".amount input");
    const exchangeRateTxt = document.querySelector(".exchange-rate");
    let amountVal = amount.value;
    
    // Validate amount
    if (amountVal == "" || amountVal == "0") {
        amount.value = "1";
        amountVal = 1;
    }
    
    exchangeRateTxt.innerText = "Getting exchange rate...";
    
    const from = fromCurrency.value.toLowerCase();
    const to = toCurrency.value.toLowerCase();

    try {
        const rate = await fetchExchangeRate(from, to);
        if (rate) {
            const totalExRate = (amountVal * rate).toFixed(2);
            exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
        } else {
            exchangeRateTxt.innerText = "Unable to fetch exchange rate";
        }
    } catch (error) {
        exchangeRateTxt.innerText = "Something went wrong";
        console.error(error);
    }
}

async function fetchExchangeRate(fromCurrency, toCurrency) {
    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency}.json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const json = await response.json();
        
        // Get the exchange rate
        const rate = json[fromCurrency][toCurrency];
        
        if (!rate) {
            throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
        }

        console.log(`Exchange rate from ${fromCurrency} to ${toCurrency}: ${rate}`);
        return rate;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        return null;
    }
}

// Event Listeners
window.addEventListener("load", () => {
    getExchangeRate();
});

getButton.addEventListener("click", e => {
    e.preventDefault();
    getExchangeRate();
});

const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});

// Populate dummy transactions
const transactions = [
    { description: 'Grocery Store', amount: -85.50, date: '2024-03-15' },
    { description: 'Salary Deposit', amount: 3500.00, date: '2024-03-14' },
    { description: 'Restaurant', amount: -45.75, date: '2024-03-13' },
    { description: 'Online Shopping', amount: -129.99, date: '2024-03-12' }
];

const transactionList = document.querySelector('.transaction-list');
transactions.forEach(transaction => {
    const div = document.createElement('div');
    div.className = 'transaction-item';
    div.innerHTML = `
        <span>${transaction.description}</span>
        <span class="transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}">
            ${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount).toFixed(2)}
        </span>
    `;
    transactionList.appendChild(div);
});

// Rewards Calculator Functions
function calculateRewards() {
    const monthlySpend = parseFloat(document.getElementById('monthlySpend').value);
    const cardType = document.getElementById('cardType').value;
    const resultDisplay = document.getElementById('rewardsResult');

    // Validate input
    if (!monthlySpend || monthlySpend <= 0) {
        showError('Please enter a valid monthly spend amount');
        return;
    }

    // Calculate annual spend
    const annualSpend = monthlySpend * 12;

    // Define reward rates and benefits for each card type
    const cardRewards = {
        basic: {
            cashbackRate: 0.01, // 1% cashback
            welcomeBonus: 1000,
            annualFee: 0,
            additionalBenefits: {
                fuelSurcharge: 250, // Estimated monthly fuel surcharge savings
                movieDiscount: 150  // Estimated monthly movie ticket savings
            }
        },
        premium: {
            rewardRate: 4, // 4X points on travel
            pointValue: 0.01, // 1 point = ₹0.01
            welcomeBonus: 5000,
            annualFee: 3000,
            additionalBenefits: {
                loungeAccess: 1000, // Estimated value per lounge visit
                travelInsurance: 2000 // Annual travel insurance value
            }
        },
        business: {
            cashbackRate: 0.02, // 2% cashback
            welcomeBonus: 10000,
            annualFee: 5000,
            additionalBenefits: {
                gstBenefits: 1000, // Estimated monthly GST filing benefits
                expenseManagement: 500 // Estimated monthly tool value
            }
        }
    };

    let annualRewards = 0;
    let rewardsSummary = '';

    switch (cardType) {
        case 'basic':
            const basicCashback = annualSpend * cardRewards.basic.cashbackRate;
            const basicAnnualBenefits = (cardRewards.basic.additionalBenefits.fuelSurcharge + 
                                       cardRewards.basic.additionalBenefits.movieDiscount) * 12;
            annualRewards = basicCashback + cardRewards.basic.welcomeBonus + basicAnnualBenefits;

            rewardsSummary = `
                <h3>Basic Rewards Card Benefits</h3>
                <div class="rewards-breakdown">
                    <p>Annual Cashback: ₹${basicCashback.toFixed(2)}</p>
                    <p>Welcome Bonus: ₹${cardRewards.basic.welcomeBonus}</p>
                    <p>Fuel Surcharge Savings: ₹${cardRewards.basic.additionalBenefits.fuelSurcharge * 12}</p>
                    <p>Movie Discount Value: ₹${cardRewards.basic.additionalBenefits.movieDiscount * 12}</p>
                    <p class="total-rewards">Total Annual Value: ₹${annualRewards.toFixed(2)}</p>
                </div>`;
            break;

        case 'premium':
            const premiumPoints = annualSpend * cardRewards.premium.rewardRate;
            const premiumPointsValue = premiumPoints * cardRewards.premium.pointValue;
            const premiumAnnualBenefits = cardRewards.premium.additionalBenefits.loungeAccess * 4 + // Assuming 4 lounge visits
                                        cardRewards.premium.additionalBenefits.travelInsurance;
            annualRewards = premiumPointsValue + cardRewards.premium.welcomeBonus + 
                           premiumAnnualBenefits - cardRewards.premium.annualFee;

            rewardsSummary = `
                <h3>Premium Travel Card Benefits</h3>
                <div class="rewards-breakdown">
                    <p>Points Earned: ${premiumPoints.toFixed(0)} points</p>
                    <p>Points Value: ₹${premiumPointsValue.toFixed(2)}</p>
                    <p>Welcome Bonus: ₹${cardRewards.premium.welcomeBonus}</p>
                    <p>Lounge Access Value: ₹${cardRewards.premium.additionalBenefits.loungeAccess * 4}</p>
                    <p>Travel Insurance: ₹${cardRewards.premium.additionalBenefits.travelInsurance}</p>
                    <p>Annual Fee: -₹${cardRewards.premium.annualFee}</p>
                    <p class="total-rewards">Total Annual Value: ₹${annualRewards.toFixed(2)}</p>
                </div>`;
            break;

        case 'business':
            const businessCashback = annualSpend * cardRewards.business.cashbackRate;
            const businessAnnualBenefits = (cardRewards.business.additionalBenefits.gstBenefits + 
                                          cardRewards.business.additionalBenefits.expenseManagement) * 12;
            annualRewards = businessCashback + cardRewards.business.welcomeBonus + 
                           businessAnnualBenefits - cardRewards.business.annualFee;

            rewardsSummary = `
                <h3>Business Card Benefits</h3>
                <div class="rewards-breakdown">
                    <p>Annual Cashback: ₹${businessCashback.toFixed(2)}</p>
                    <p>Welcome Bonus: ₹${cardRewards.business.welcomeBonus}</p>
                    <p>GST Benefits Value: ₹${cardRewards.business.additionalBenefits.gstBenefits * 12}</p>
                    <p>Expense Management Value: ₹${cardRewards.business.additionalBenefits.expenseManagement * 12}</p>
                    <p>Annual Fee: -₹${cardRewards.business.annualFee}</p>
                    <p class="total-rewards">Total Annual Value: ₹${annualRewards.toFixed(2)}</p>
                </div>`;
            break;
    }

    // Add CSS animation class
    resultDisplay.className = 'result-display fade-in';
    resultDisplay.innerHTML = rewardsSummary;
}

// Error handling function
function showError(message) {
    const resultDisplay = document.getElementById('rewardsResult');
    resultDisplay.className = 'result-display error fade-in';
    resultDisplay.innerHTML = `<p class="error-message">${message}</p>`;
}

document.addEventListener('DOMContentLoaded', function() {
    gsap.registerPlugin(ScrollTrigger);

    // Form field animations
    const formFields = document.querySelectorAll('.transfer-form input, .transfer-form textarea');
    
    formFields.forEach((field, index) => {
        gsap.from(field, {
            scrollTrigger: {
                trigger: '.transfer-form',
                start: 'top center+=100'
            },
            x: index % 2 === 0 ? -50 : 50,
            opacity: 0,
            duration: 0.5,
            delay: index * 0.1
        });

        // Add focus animations
        field.addEventListener('focus', () => {
            gsap.to(field, {
                scale: 1.02,
                borderColor: '#3498db',
                duration: 0.3
            });
        });

        field.addEventListener('blur', () => {
            gsap.to(field, {
                scale: 1,
                borderColor: '#e1e1e1',
                duration: 0.3
            });
        });
    });

    // IFSC Code validation and auto-fetch
    const ifscInput = document.getElementById('ifscCode');
    const bankNameInput = document.getElementById('bankName');
    const branchNameInput = document.getElementById('branchName');

    ifscInput.addEventListener('input', function() {
        this.value = this.value.toUpperCase();
        if (this.value.length === 11) {
            // Simulate bank details fetch
            gsap.to(this, {
                borderColor: '#2ecc71',
                duration: 0.3
            });
            
            // Mock API call - Replace with actual API
           
        }
    });

    // Account number validation
    const accountInput = document.getElementById('accountNumber');
    accountInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });

    // Amount input animation
    const amountInput = document.getElementById('transferAmount');
    amountInput.addEventListener('input', function() {
        if (this.value > 0) {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
        }
    });

    // Toggle transfer form visibility
    const transferSection = document.querySelector('.transfer-payment');
 

    // Theme toggle animation
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            gsap.to(themeToggle, {
                rotation: '+=360',
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => {
                    document.body.classList.toggle('dark-mode');
                    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
                }
            });
        });
    }
});

// Contact Form Submission
function submitContactForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const phone = document.getElementById('contactPhone').value;
    const message = document.getElementById('contactMessage').value;
    const statusDiv = document.getElementById('contactStatus');

    if (!name || !email || !phone || !message) {
        statusDiv.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                Please fill all required fields
            </div>
        `;
        return;
    }

    // Show processing state
    statusDiv.innerHTML = `
        <div class="processing-message">
            <i class="fas fa-spinner fa-spin"></i>
            Sending your message...
        </div>
    `;

    // Simulate form submission
    setTimeout(() => {
        statusDiv.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                Message sent successfully! We'll get back to you soon.
            </div>
        `;

        // Reset form
        document.getElementById('contactForm').reset();
    }, 2000);
}

// Create the chatbox and toggle system
const chatSystem = {
    init() {
        this.createChatboxUI();
        this.initializeEventListeners();
        this.isOpen = false;
    },

    createChatboxUI() {
        // Create chat toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'chat-toggle-btn';
        toggleButton.innerHTML = '<i class="fas fa-comments"></i>';
        document.body.appendChild(toggleButton);

        // Create chatbox container
        const chatbox = document.createElement('div');
        chatbox.className = 'chatbox';
        chatbox.innerHTML = `
            <div class="chatbox-header">
                <div class="header-left">
                    <i class="fas fa-robot"></i>
                    <span>AI Banking Assistant</span>
                </div>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="chatbox-messages"></div>
            <div class="chatbox-input">
                <input type="text" placeholder="Type your question...">
                <button class="send-btn"><i class="fas fa-paper-plane"></i></button>
            </div>
            <div class="quick-options"></div>
        `;
        document.body.appendChild(chatbox);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .chat-toggle-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: #3498db;
                color: white;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 999;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .chat-toggle-btn:hover {
                transform: scale(1.1);
                background: #2980b9;
            }

            .chat-toggle-btn i {
                font-size: 24px;
            }

            .chatbox {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 350px;
                height: 500px;
                background: #1a1a1a;
                border-radius: 15px;
                box-shadow: 0 5px 25px rgba(0,0,0,0.2);
                display: none;
                flex-direction: column;
                overflow: hidden;
                z-index: 1000;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
            }

            .chatbox.visible {
                display: flex;
                opacity: 1;
                transform: translateY(0);
            }

            .chatbox-header {
                background: #2c3e50;
                padding: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #34495e;
            }

            .header-left {
                display: flex;
                align-items: center;
                gap: 10px;
                color: white;
            }

            .close-btn {
                background: transparent;
                border: none;
                color: white;
                cursor: pointer;
                padding: 5px;
                transition: all 0.3s ease;
            }

            .close-btn:hover {
                color: #3498db;
                transform: scale(1.1);
            }

            .chatbox-messages {
                flex: 1;
                overflow-y: auto;
                padding: 15px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .message {
                max-width: 85%;
                padding: 10px 15px;
                border-radius: 10px;
                margin: 5px 0;
                word-wrap: break-word;
            }

            .bot-message {
                background: #2c3e50;
                color: white;
                align-self: flex-start;
                border-bottom-left-radius: 5px;
            }

            .user-message {
                background: #3498db;
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 5px;
            }

            .chatbox-input {
                padding: 15px;
                display: flex;
                gap: 10px;
                background: #2c3e50;
            }

            .chatbox-input input {
                flex: 1;
                padding: 10px 15px;
                border: none;
                border-radius: 25px;
                background: #1a1a1a;
                color: white;
                outline: none;
            }

            .send-btn {
                background: #3498db;
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .send-btn:hover {
                background: #2980b9;
            }

            .quick-options {
                padding: 10px;
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                background: #1a1a1a;
            }

            .quick-option {
                background: #2c3e50;
                color: white;
                padding: 8px 15px;
                border-radius: 15px;
                cursor: pointer;
                font-size: 13px;
                border: none;
                transition: all 0.3s ease;
            }

            .quick-option:hover {
                background: #34495e;
                transform: translateY(-2px);
            }

            @media (max-width: 480px) {
                .chatbox {
                    width: 100%;
                    height: 100%;
                    bottom: 0;
                    right: 0;
                    border-radius: 0;
                }

                .chat-toggle-btn {
                    bottom: 10px;
                    right: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    },

    initializeEventListeners() {
        const toggleBtn = document.querySelector('.chat-toggle-btn');
        const chatbox = document.querySelector('.chatbox');
        const closeBtn = document.querySelector('.chatbox .close-btn');
        const input = document.querySelector('.chatbox-input input');
        const sendBtn = document.querySelector('.send-btn');
        const quickOptions = document.querySelector('.quick-options');

        // Toggle chatbox
        toggleBtn.addEventListener('click', () => {
            this.toggleChat();
        });

        // Close chatbox
        closeBtn.addEventListener('click', () => {
            this.toggleChat();
        });

        // Send message
        sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        // Send message on Enter
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Initialize with welcome message
        this.addMessage({
            type: 'bot',
            content: "Hello! Welcome to ModernBank's AI Assistant. How can I help you today?",
            options: [
                'Account Services',
                'Loans & Cards',
                'Money Transfer',
                'Fixed Deposits'
            ]
        });
    },

    toggleChat() {
        const chatbox = document.querySelector('.chatbox');
        const toggleBtn = document.querySelector('.chat-toggle-btn');
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chatbox.classList.add('visible');
            toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            chatbox.classList.remove('visible');
            toggleBtn.innerHTML = '<i class="fas fa-comments"></i>';
        }
    },

    addMessage(message) {
        const messagesContainer = document.querySelector('.chatbox-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}-message`;
        
        // Add message content
        messageDiv.innerHTML = `<p>${message.content}</p>`;
        messagesContainer.appendChild(messageDiv);

        // Add quick options if available
        if (message.options) {
            const quickOptions = document.querySelector('.quick-options');
            quickOptions.innerHTML = '';
            message.options.forEach(option => {
                const button = document.createElement('button');
                button.className = 'quick-option';
                button.textContent = option;
                button.addEventListener('click', () => {
                    this.handleQuickOption(option);
                });
                quickOptions.appendChild(button);
            });
        }

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    sendMessage() {
        const input = document.querySelector('.chatbox-input input');
        const message = input.value.trim();
        
        if (message) {
            // Add user message
            this.addMessage({
                type: 'user',
                content: message
            });

            // Process and add bot response
            const response = this.processQuery(message);
            this.addMessage({
                type: 'bot',
                content: response.content,
                options: response.options
            });

            // Clear input
            input.value = '';
        }
    },

    processQuery(message) {
        const lowerMessage = message.toLowerCase();
        
        // Define responses based on keywords
        if (lowerMessage.includes('account')) {
            return {
                content: "We offer several account types:\n• Savings Account (7% p.a.)\n• Current Account\n• Salary Account\n• NRI Account",
                // options: ['Open Account', 'View Interest Rates', 'Required Documents']
            };
        } else if (lowerMessage.includes('loan')) {
            return {
                content: "Available Loans:\n• Home Loan (8.5% p.a.)\n• Personal Loan (10.5% p.a.)\n• Business Loan (11% p.a.)\n• Education Loan (7.5% p.a.)",
                // options: ['Calculate EMI', 'Apply for Loan', 'View Requirements']
            };
        } else if (lowerMessage.includes('transfer') || lowerMessage.includes('payment')) {
            return {
                content: "Transfer Options:\n• IMPS (24x7, instant)\n• NEFT (24x7)\n• RTGS (24x7, min ₹2 lakhs)\n",
                // options: ['Transfer Money', 'Add Beneficiary', 'View Charges']
            };
        } else if (lowerMessage.includes('deposit') || lowerMessage.includes('fd')) {
            return {
                content: "Fixed Deposit Options:\n• Regular FD (7.5% p.a.)\n• Tax Saver FD\n• Senior Citizen FD (additional 0.5%)",
                // options: ['Calculate Returns', 'Open FD', 'View Rates']
            };
        }

        // Default response
        return {
            content: "I can help you with:\n• Account Services\n• Loans & Cards\n• Money Transfers\n• Fixed Deposits\n\nPlease choose a topic or ask a specific question.",
            options: ['Account Services', 'Loans & Cards', 'Money Transfer', 'Fixed Deposits']
        };
    },

    handleQuickOption(option) {
        const response = this.processQuery(option);
        this.addMessage({
            type: 'user',
            content: option
        });
        this.addMessage({
            type: 'bot',
            content: response.content,
            options: response.options
        });
    }
};

// Initialize chatbox system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    chatSystem.init();
});
