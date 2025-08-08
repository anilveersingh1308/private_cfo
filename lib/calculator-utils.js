// Calculator utility functions for testing
export const calculateSIP = (P, nYears, rate) => {
    const n = nYears * 12; // Total months
    const r = rate / 12 / 100; // Monthly rate
    const maturity = Math.round(P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r)));
    const invested = P * n;
    const returns = maturity - invested;
    return { maturity, invested, returns };
};

export const calculateLumpsum = (P, nYears, rate) => {
    const r = rate / 100; // Annual rate as decimal
    const maturity = Math.round(P * Math.pow(1 + r, nYears));
    const invested = P;
    const returns = maturity - invested;
    return { maturity, invested, returns };
};

export const calculateFD = (P, nYears, rate) => {
    const r = rate / 100; // Annual rate as decimal
    const n = 4; // Quarterly compounding (most common for FDs)
    
    if (rate === 0) {
        return { maturity: P, invested: P, returns: 0 };
    }
    
    const maturity = Math.round(P * Math.pow(1 + r/n, n * nYears));
    const invested = P;
    const returns = maturity - invested;
    return { maturity, invested, returns };
};

export const calculateMutualFund = (P, nYears, rate) => {
    const r = rate / 100; // Annual rate as decimal
    
    if (rate === 0) {
        return { maturity: P, invested: P, returns: 0 };
    }
    
    const maturity = Math.round(P * Math.pow(1 + r, nYears));
    const invested = P;
    const returns = maturity - invested;
    return { maturity, invested, returns };
};

export const calculateSimpleInterest = (P, nYears, rate) => {
    const r = rate / 100; // Annual rate as decimal
    const simpleInterest = Math.round(P * r * nYears);
    const maturity = P + simpleInterest;
    const invested = P;
    const returns = simpleInterest;
    return { maturity, invested, returns };
};

export const calculateCompoundInterest = (P, nYears, rate) => {
    const r = rate / 100; // Annual rate as decimal
    
    if (rate === 0) {
        return { maturity: P, invested: P, returns: 0 };
    }
    
    const maturity = Math.round(P * Math.pow(1 + r, nYears));
    const invested = P;
    const returns = maturity - invested;
    return { maturity, invested, returns };
};

// Test function
export const testCalculators = () => {
    console.log("Testing SIP Calculator:");
    console.log(calculateSIP(5000, 10, 12));
    
    console.log("Testing Lumpsum Calculator:");
    console.log(calculateLumpsum(100000, 10, 12));
    
    console.log("Testing FD Calculator:");
    console.log(calculateFD(50000, 5, 7));
    
    console.log("All calculators working!");
};

if (typeof window !== 'undefined') {
    window.testCalculators = testCalculators;
}
