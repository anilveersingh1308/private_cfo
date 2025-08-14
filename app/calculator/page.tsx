'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Footer } from '@/components/footer';
import '../styles/calculator.css';
import { 
  CalculatorType, 
  CalculatorData, 
  CALCULATOR_DATA_MAP 
} from '../../lib/calculator-data';
import { Header } from '@/components/header';

export default function Calculator() {
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get('type') as CalculatorType;
  const [calculatorType, setCalculatorType] = useState<CalculatorType>(typeFromUrl || 'sip');
  const [amount, setAmount] = useState<string>('5,000');
  const [years, setYears] = useState<number>(5);
  const [rate, setRate] = useState<number>(12);
  const [maturity, setMaturity] = useState<number>(0);
  const [invested, setInvested] = useState<number>(0);
  const [returns, setReturns] = useState<number>(0);

  const calculatorData: CalculatorData = CALCULATOR_DATA_MAP[calculatorType];

  // Format number to Indian currency format
  const formatINR = (num: number): string => {
    return '₹ ' + num.toLocaleString('en-IN');
  };

  // Parse Indian currency formatted string to number
  const parseIndianCurrency = (value: string): number => {
    return parseFloat(value.replace(/,/g, '')) || 0;
  };

  // Format input value with Indian number system
  const formatIndianCurrency = (num: string): string => {
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
  };

  // Handle amount input change
  const handleAmountChange = (value: string) => {
    let numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length > 17) {
      numericValue = numericValue.substring(0, 17);
    }
    if (numericValue === '') {
      setAmount('');
      return;
    }
    const formattedValue = formatIndianCurrency(numericValue);
    setAmount(formattedValue);
  };

  // Calculator functions
  const calculateSIP = (P: number, nYears: number, rate: number) => {
    const n = nYears * 12; // Total months
    const r = rate / 12 / 100; // Monthly rate
    const maturity = Math.round(P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r)));
    const invested = P * n;
    const returns = maturity - invested;
    return { maturity, invested, returns };
  };

  const calculateLumpsum = (P: number, nYears: number, rate: number) => {
    const r = rate / 100; // Annual rate as decimal
    const maturity = Math.round(P * Math.pow(1 + r, nYears));
    const invested = P;
    const returns = maturity - invested;
    return { maturity, invested, returns };
  };

  const calculateFD = (P: number, nYears: number, rate: number) => {
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

  const calculateMutualFund = (P: number, nYears: number, rate: number) => {
    const r = rate / 100; // Annual rate as decimal
    
    if (rate === 0) {
      return { maturity: P, invested: P, returns: 0 };
    }
    
    const maturity = Math.round(P * Math.pow(1 + r, nYears));
    const invested = P;
    const returns = maturity - invested;
    return { maturity, invested, returns };
  };

  const calculateSimpleInterest = (P: number, nYears: number, rate: number) => {
    const r = rate / 100; // Annual rate as decimal
    const simpleInterest = Math.round(P * r * nYears);
    const maturity = P + simpleInterest;
    const invested = P;
    const returns = simpleInterest;
    return { maturity, invested, returns };
  };

  const calculateCompoundInterest = (P: number, nYears: number, rate: number) => {
    const r = rate / 100; // Annual rate as decimal
    
    if (rate === 0) {
      return { maturity: P, invested: P, returns: 0 };
    }
    
    const maturity = Math.round(P * Math.pow(1 + r, nYears));
    const invested = P;
    const returns = maturity - invested;
    return { maturity, invested, returns };
  };

  // Calculate based on calculator type
  const calculate = () => {
    const P = parseIndianCurrency(amount) || 0;
    
    let result;
    switch (calculatorType) {
      case 'lumpsum':
        result = calculateLumpsum(P, years, rate);
        break;
      case 'fd':
        result = calculateFD(P, years, rate);
        break;
      case 'mutual-fund':
        result = calculateMutualFund(P, years, rate);
        break;
      case 'simple-interest':
        result = calculateSimpleInterest(P, years, rate);
        break;
      case 'compound-interest':
        result = calculateCompoundInterest(P, years, rate);
        break;
      default:
        result = calculateSIP(P, years, rate);
    }
    
    setMaturity(result.maturity);
    setInvested(result.invested);
    setReturns(result.returns);
  };

  // Update calculator when inputs change
  useEffect(() => {
    calculate();
  }, [amount, years, rate, calculatorType]);

  // Update defaults when calculator type changes
  useEffect(() => {
    const config = calculatorData.calculator_config;
    setAmount(config.default_amount);
    setYears(config.default_duration);
    setRate(config.default_return_rate);
  }, [calculatorType]);

  // Calculate donut chart percentage
  const investedPercent = maturity === 0 ? 0 : (invested / maturity) * 100;

  // Handle calculator type change
  const switchCalculator = (type: CalculatorType) => {
    setCalculatorType(type);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('type', type);
    window.history.pushState({}, '', url.toString());
  };

  return (
    <>
      <Header />
      
      <div className="calculator-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container text-center">
            <h1 className={calculatorData.calculator_config.calculator_gradient}>
              {calculatorData.meta.title}
            </h1>
            <p>{calculatorData.meta.hero_subtitle}</p>
          </div>
        </section>

        {/* Calculator Widget */}
        <section className="calculator-wrapper">
          <div className="container">
            <div className="calculator-widget">
              {/* Input Area */}
              <div className="calculator-input-area">
                <div className="estimator-header">
                  <div>
                    <h3 className={calculatorData.calculator_config.calculator_gradient}>
                      Returns Estimator
                    </h3>
                    <p className="text-small">Estimation is based on the past performance</p>
                  </div>
                </div>
                
                {/* Amount Input */}
                <div className="input-group">
                  <label htmlFor="amount-input">{calculatorData.calculator_config.amount_label}</label>
                  <div className="amount-display">
                    <span className="rupee-symbol">₹</span>
                    <input
                      type="text"
                      id="amount-input"
                      className={`amount-input ${calculatorData.calculator_config.calculator_gradient}`}
                      maxLength={calculatorData.calculator_config.amount_max_length}
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      inputMode="numeric"
                    />
                  </div>
                </div>
                
                {/* Duration Slider */}
                <div className="slider-group">
                  <div className="slider-label">
                    <span>Select Duration</span>
                    <span><span className="slider-value" id="duration-value">{years}</span>Yrs</span>
                  </div>
                  <div className="slider-container">
                    <input
                      type="range"
                      min={calculatorData.calculator_config.duration_range.min}
                      max={calculatorData.calculator_config.duration_range.max}
                      value={years}
                      className="slider"
                      id="duration-slider"
                      onChange={(e) => setYears(Number(e.target.value))}
                    />
                  </div>
                  <div className="slider-range">
                    <span>{calculatorData.calculator_config.duration_range.min}Yr</span>
                    <span>{calculatorData.calculator_config.duration_range.max}Yrs</span>
                  </div>
                </div>
                
                {/* Return Rate Slider */}
                <div className="slider-group">
                  <div className="slider-label">
                    <span>Expected rate of Return</span>
                    <span><span className="slider-value" id="return-value">{rate}</span>%</span>
                  </div>
                  <div className="slider-container">
                    <input
                      type="range"
                      min={calculatorData.calculator_config.return_range.min}
                      max={calculatorData.calculator_config.return_range.max}
                      value={rate}
                      className="slider"
                      id="return-slider"
                      onChange={(e) => setRate(Number(e.target.value))}
                    />
                  </div>
                  <div className="slider-range">
                    <span>{calculatorData.calculator_config.return_range.min}%</span>
                    <span>{calculatorData.calculator_config.return_range.max}%</span>
                  </div>
                </div>
              </div>

              {/* Output Area */}
              <div className="calculator-output-area">
                <p className="text-medium">
                  The total value of your investment after <span id="output-duration">{years}</span> Years will be
                </p>
                <h2 className="total-value total-value-gradient" id="total-value">
                  {formatINR(maturity)}
                </h2>
                <div className="chart-wrapper">
                  <div className="donut-chart-container">
                    <div 
                      className="donut-chart" 
                      id="donut-chart"
                      style={{
                        background: `conic-gradient(var(--accent-cyan) 0% ${investedPercent}%, var(--accent-white) ${investedPercent}% 100%)`
                      }}
                    ></div>
                  </div>
                  <div className="chart-details">
                    <div className="detail-item">
                      <div>
                        <p>
                          <span className="color-dot cyan"></span>
                          Invested amount
                        </p>
                        <div className="amount invested-gradient" id="invested-amount">
                          {formatINR(invested)}
                        </div>
                      </div>
                    </div>
                    <div className="detail-item">
                      <div>
                        <p>
                          <span className="color-dot white"></span>
                          Est. returns
                        </p>
                        <div className="amount returns-gradient" id="returns-amount">
                          {formatINR(returns)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculator Tabs */}
            <div className="calculator-tabs">
              {calculatorData.tabs.map((tab) => (
                tab.type !== calculatorType && (
                  <button
                    key={tab.type}
                    className={`tab-btn ${tab.class} ${calculatorType === tab.type ? 'active' : ''}`}
                    onClick={() => switchCalculator(tab.type)}
                    data-type={tab.type}
                  >
                    {tab.name}
                  </button>
                )
              ))}
            </div>

            {/* Info Content */}
            <div className="info-content">
              {calculatorData.info_blocks.map((block, index) => (
                <div key={index} className="info-block">
                  <h2>{block.title}</h2>
                  
                  {block.type === 'paragraph' && (
                    <p>{block.content}</p>
                  )}
                  
                  {block.type === 'paragraphs' && Array.isArray(block.content) && (
                    block.content.map((paragraph, pIndex) => (
                      <p key={pIndex}>{paragraph}</p>
                    ))
                  )}
                  
                  {block.type === 'list_with_note' && (
                    <>
                      <p>{block.content}</p>
                      <ul>
                        {block.list?.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <b>{item.term}</b> {item.desc}
                          </li>
                        ))}
                      </ul>
                      {block.note && <p className="note-text">{block.note}</p>}
                    </>
                  )}
                  
                  {block.type === 'formula' && (
                    <>
                      <p>{block.content}</p>
                      <div className="formula-box" dangerouslySetInnerHTML={{ __html: block.formula || '' }}></div>
                      <p>Where:</p>
                      <ul>
                        {block.variables?.map((variable, varIndex) => (
                          <li key={varIndex}>
                            <b>{variable.symbol}</b> = {variable.desc}
                          </li>
                        ))}
                      </ul>
                      {block.formula_note && <p>{block.formula_note}</p>}
                    </>
                  )}
                  
                  {block.type === 'ordered_list' && (
                    <ol>
                      {block.benefits?.map((benefit, bIndex) => (
                        <li key={bIndex}>
                          <b>{benefit.term}</b> {benefit.desc}
                        </li>
                      ))}
                    </ol>
                  )}
                  
                  {block.type === 'ordered_list_simple' && (
                    <ol>
                      {block.points?.map((point, pIndex) => (
                        <li key={pIndex}>{point}</li>
                      ))}
                    </ol>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container text-center">
            <h2 className="gradient-text-cta-heading">{calculatorData.cta_section.heading}</h2>
            <p>{calculatorData.cta_section.description}</p>
            <div className="cta-bottom" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem'}}>
              <div>
                <h3 className="cta-subtitle">{calculatorData.cta_section.sub_heading}</h3>
              </div>
              <div>
                <a href="/consultation" className="btn-cta">
                  {calculatorData.cta_section.button_text}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
