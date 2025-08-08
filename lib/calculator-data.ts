// Calculator data types and configurations for Next.js
export type CalculatorType = 'sip' | 'lumpsum' | 'fd' | 'mutual-fund' | 'simple-interest' | 'compound-interest';

export interface CalculatorConfig {
  calculator_gradient: string;
  calculator_primary_color: string;
  amount_label: string;
  default_amount: string;
  default_duration: number;
  default_return_rate: number;
  duration_range: { min: number; max: number };
  return_range: { min: number; max: number };
  amount_max_length: number;
}

export interface TabConfig {
  name: string;
  class: string;
  type: CalculatorType;
}

export interface InfoBlock {
  title: string;
  content?: string | string[];
  type: string;
  list?: Array<{ term: string; desc: string }>;
  note?: string;
  formula?: string;
  variables?: Array<{ symbol: string; desc: string }>;
  formula_note?: string;
  benefits?: Array<{ term: string; desc: string }>;
  points?: string[];
  note_content?: string;
  calculation_details?: string;
}

export interface CalculatorData {
  calculator_type: CalculatorType;
  meta: {
    title: string;
    hero_subtitle: string;
  };
  calculator_config: CalculatorConfig;
  tabs: TabConfig[];
  info_blocks: InfoBlock[];
  cta_section: {
    heading: string;
    description: string;
    sub_heading: string;
    button_text: string;
  };
}

// SIP Calculator Data
export const SIP_CALCULATOR_DATA: CalculatorData = {
  calculator_type: 'sip',
  meta: {
    title: 'SIP Calculator',
    hero_subtitle: 'Plan your wealth smartly with our SIP Calculator — visualize returns, set goals, and take control of your investments. Start small, grow consistently, and secure a financially free future today.'
  },
  calculator_config: {
    calculator_gradient: 'gradient-text-sip',
    calculator_primary_color: 'primary-text-sip',
    amount_label: 'Enter Amount',
    default_amount: '5,000',
    default_duration: 12,
    default_return_rate: 12,
    duration_range: { min: 1, max: 30 },
    return_range: { min: 8, max: 30 },
    amount_max_length: 20
  },
  tabs: [
    { name: 'SIP Calculator', class: 'gradient-text-sip', type: 'sip' },
    { name: 'Lumpsum Calculator', class: 'gradient-text-lumpsum', type: 'lumpsum' },
    { name: 'FD Calculator', class: 'gradient-text-fd', type: 'fd' },
    { name: 'Mutual Fund Re...', class: 'gradient-text-mutual', type: 'mutual-fund' },
    { name: 'Simple Interest Calculator', class: 'gradient-text-simple', type: 'simple-interest' },
    { name: 'Compound Interest Cal...', class: 'gradient-text-compound', type: 'compound-interest' }
  ],
  info_blocks: [
    {
      title: 'How SIP Works?',
      content: 'When you invest through SIP, a predetermined amount is debited from your account and invested in selected mutual fund schemes. With each contribution, you purchase units of the fund at prevailing Net Asset Value (NAV). Over time, this creates an average purchase cost due to Rupee Cost Averaging, which helps mitigate the risk of investing in volatile markets. The true benefit lies in the long-term growth of invested capital, as returns get reinvested and compounded.',
      type: 'paragraph'
    },
    {
      title: 'What is a SIP Calculator?',
      content: [
        'A SIP Calculator is an online tool that helps estimate the future value of investments made through SIPs. By inputting the monthly investment amount, expected annual return rate, and the investment duration, users can get a clear idea of how much their investment could grow over time.',
        'It serves as a helpful guide for goal planning—such as saving for a house, child\'s education, retirement, or a dream vacation.'
      ],
      type: 'paragraphs'
    },
    {
      title: 'Why Use a SIP Calculator?',
      content: 'A SIP Calculator is especially useful for:',
      list: [
        { term: 'Planning:', desc: 'Set a goal and backtrack to see how much you need to invest monthly.' },
        { term: 'Forecasting:', desc: 'Get an estimate of how much your regular investments can grow.' },
        { term: 'Comparison:', desc: 'Explore different scenarios by changing time frames or return rates.' },
        { term: 'Education:', desc: 'Understand the impact of consistency and compound interest.' }
      ],
      note: 'Note: SIP calculators provide estimates based on expected returns; actual returns vary depending on market performance.',
      type: 'list_with_note'
    },
    {
      title: 'Formula Used in SIP Calculator',
      content: 'The maturity value of an SIP is calculated using the future value of a growing annuity formula:',
      formula: 'M = P × [[(1 + r)<sup>n</sup> - 1] / r] × (1 + r)',
      variables: [
        { symbol: 'M', desc: 'Maturity amount' },
        { symbol: 'P', desc: 'Monthly investment amount' },
        { symbol: 'r', desc: 'Rate of return per month (annual rate ÷ 12 ÷ 100)' },
        { symbol: 'n', desc: 'Total number of months' }
      ],
      formula_note: 'This formula accounts for monthly contributions and the compounding effect of returns over the investment period.',
      type: 'formula'
    },
    {
      title: 'Benefits of SIP Investing',
      benefits: [
        { term: 'Disciplined Saving:', desc: 'Automates monthly savings habit' },
        { term: 'Market Volatility Protection:', desc: 'Rupee cost averaging lowers investment risk' },
        { term: 'Flexible & Affordable:', desc: 'Start with low amounts and increase over time' },
        { term: 'Power of Compounding:', desc: 'Long-term returns are significantly higher due to reinvested gains' },
        { term: 'Goal-Oriented:', desc: 'Ideal for medium to long-term financial planning' }
      ],
      type: 'ordered_list'
    },
    {
      title: 'Things to Keep in Mind',
      points: [
        'SIP returns are not guaranteed—they depend on market performance of the chosen mutual fund',
        'Longer durations generally reduce the impact of volatility',
        'It\'s advisable to review SIPs periodically and increase contributions as your income grows',
        'Mutual fund selection matters—check past performance, risk level, and fund category'
      ],
      type: 'ordered_list_simple'
    },
    {
      title: 'Final Thoughts',
      content: 'Understanding SIPs and using tools like SIP calculators can greatly enhance your ability to make informed financial decisions. It brings clarity to your goals and encourages long-term, consistent investing. SIPs are not a get-rich-quick strategy, but a proven path to wealth creation when used patiently and wisely.',
      type: 'paragraph'
    }
  ],
  cta_section: {
    heading: 'Ready to Take Control of Your Financial Future?',
    description: 'Whether you\'re growing a business, building personal wealth, or simply ready to stop flying blind, Private CFO is here to help you see the whole picture—and move forward with purpose.',
    sub_heading: 'Book your free discovery session today.',
    button_text: 'Let\'s Talk'
  }
};

// Lumpsum Calculator Data
export const LUMPSUM_CALCULATOR_DATA: CalculatorData = {
  calculator_type: 'lumpsum',
  meta: {
    title: 'Lumpsum Calculator',
    hero_subtitle: 'Make your one-time investment count! Our Lumpsum Calculator helps you calculate potential returns on your lump sum investments — perfect for bonuses, savings, or windfalls. Invest wisely, grow exponentially.'
  },
  calculator_config: {
    calculator_gradient: 'gradient-text-lumpsum',
    calculator_primary_color: 'primary-text-lumpsum',
    amount_label: 'Investment Amount',
    default_amount: '1,00,000',
    default_duration: 12,
    default_return_rate: 12,
    duration_range: { min: 1, max: 30 },
    return_range: { min: 8, max: 30 },
    amount_max_length: 20
  },
  tabs: [
    { name: 'SIP Calculator', class: 'gradient-text-sip', type: 'sip' },
    { name: 'Lumpsum Calculator', class: 'gradient-text-lumpsum', type: 'lumpsum' },
    { name: 'FD Calculator', class: 'gradient-text-fd', type: 'fd' },
    { name: 'Mutual Fund Calculator', class: 'gradient-text-mutual', type: 'mutual-fund' },
    { name: 'Simple Interest Calculator', class: 'gradient-text-simple', type: 'simple-interest' },
    { name: 'Compound Interest Calculator', class: 'gradient-text-compound', type: 'compound-interest' }
  ],
  info_blocks: [
    {
      title: 'What is Lumpsum Investment?',
      content: 'Lumpsum investment refers to investing a large amount of money at once, instead of spreading it over multiple installments. This approach is ideal when you have a significant amount available upfront—such as inheritance, bonus, maturity proceeds from another investment, or accumulated savings. The entire invested amount begins working immediately in the market.',
      type: 'paragraph'
    },
    {
      title: 'How Does a Lumpsum Calculator Work?',
      content: [
        'A Lumpsum Calculator computes the future value of a one-time investment based on compound growth. It takes into account the principal amount, expected annual return rate, and investment duration to project how much your investment could grow.',
        'The calculator provides a clear picture of the potential maturity amount, helping you make informed decisions about your investment strategy and financial goals.'
      ],
      type: 'paragraphs'
    },
    {
      title: 'When to Choose Lumpsum Investment?',
      content: 'Lumpsum investments work best in certain scenarios:',
      list: [
        { term: 'Bull Market Phase:', desc: 'When markets are trending upward consistently' },
        { term: 'Market Corrections:', desc: 'During significant market dips to benefit from recovery' },
        { term: 'Available Capital:', desc: 'When you have substantial funds sitting idle' },
        { term: 'Long-term Goals:', desc: 'For investments with horizons of 5+ years' },
        { term: 'High Conviction:', desc: 'When you have strong confidence in market timing' }
      ],
      note: 'Note: Lumpsum investments are more sensitive to market timing compared to SIPs. Consider market conditions and your risk tolerance.',
      type: 'list_with_note'
    },
    {
      title: 'Lumpsum Calculator Formula',
      content: 'The future value of a lumpsum investment is calculated using the compound interest formula:',
      formula: 'A = P × (1 + r)<sup>n</sup>',
      variables: [
        { symbol: 'A', desc: 'Final maturity amount' },
        { symbol: 'P', desc: 'Principal investment amount' },
        { symbol: 'r', desc: 'Annual rate of return (as decimal)' },
        { symbol: 'n', desc: 'Number of years' }
      ],
      formula_note: 'This formula shows how your initial investment grows through compound returns over the specified time period.',
      type: 'formula'
    },
    {
      title: 'Advantages of Lumpsum Investment',
      benefits: [
        { term: 'Immediate Market Exposure:', desc: 'Entire amount starts earning returns from day one' },
        { term: 'Higher Potential Returns:', desc: 'Can benefit more from bull markets compared to gradual investing' },
        { term: 'Simplicity:', desc: 'One-time investment decision without ongoing management' },
        { term: 'Lower Transaction Costs:', desc: 'Single transaction instead of multiple SIP installments' },
        { term: 'Compounding Benefits:', desc: 'Full principal amount compounds over the entire period' }
      ],
      type: 'ordered_list'
    },
    {
      title: 'Risks and Considerations',
      points: [
        'Market timing risk—investing at market peaks can reduce overall returns',
        'Lack of rupee cost averaging benefits that SIPs provide',
        'Requires larger capital outlay upfront',
        'More suitable for experienced investors who understand market cycles',
        'Consider your liquidity needs before making large lumpsum investments'
      ],
      type: 'ordered_list_simple'
    },
    {
      title: 'Lumpsum vs SIP: Making the Right Choice',
      content: [
        'The choice between lumpsum and SIP depends on your financial situation, market outlook, and risk appetite. Lumpsum works well when you have substantial funds and market timing is favorable, while SIP helps with disciplined investing and market volatility management.',
        'Many successful investors use a combination approach—starting with a lumpsum base and continuing with regular SIPs to maximize both immediate exposure and disciplined accumulation.'
      ],
      type: 'paragraphs'
    },
    {
      title: 'Smart Lumpsum Investment Tips',
      points: [
        'Diversify across different asset classes and fund categories',
        'Consider staggered lumpsum approach during uncertain market phases',
        'Align investment duration with your financial goals',
        'Review and rebalance your portfolio periodically',
        'Keep some funds liquid for emergency needs'
      ],
      type: 'ordered_list_simple'
    }
  ],
  cta_section: {
    heading: 'Ready to Take Control of Your Financial Future?',
    description: 'Whether you\'re growing a business, building personal wealth, or simply ready to stop flying blind, Private CFO is here to help you see the whole picture—and move forward with purpose.',
    sub_heading: 'Book your free discovery session today.',
    button_text: 'Let\'s Talk'
  }
};

// Add other calculator data objects...
export const FD_CALCULATOR_DATA: CalculatorData = {
  calculator_type: 'fd',
  meta: {
    title: 'Fixed Deposit Calculator',
    hero_subtitle: 'Secure your savings with guaranteed returns! Our FD Calculator helps you calculate Fixed Deposit maturity amounts and interest earnings. Plan your safe investments with confidence and certainty.'
  },
  calculator_config: {
    calculator_gradient: 'gradient-text-fd',
    calculator_primary_color: 'primary-text-fd',
    amount_label: 'Deposit Amount',
    default_amount: '1,00,000',
    default_duration: 5,
    default_return_rate: 7,
    duration_range: { min: 1, max: 10 },
    return_range: { min: 4, max: 9 },
    amount_max_length: 20
  },
  tabs: [
    { name: 'SIP Calculator', class: 'gradient-text-sip', type: 'sip' },
    { name: 'Lumpsum Calculator', class: 'gradient-text-lumpsum', type: 'lumpsum' },
    { name: 'FD Calculator', class: 'gradient-text-fd', type: 'fd' },
    { name: 'Mutual Fund Re...', class: 'gradient-text-mutual', type: 'mutual-fund' },
    { name: 'Simple Interest Calculator', class: 'gradient-text-simple', type: 'simple-interest' },
    { name: 'Compound Interest Cal...', class: 'gradient-text-compound', type: 'compound-interest' }
  ],
  info_blocks: [
    {
      title: 'What is a Fixed Deposit (FD)?',
      content: 'A Fixed Deposit is a financial instrument offered by banks and financial institutions where you deposit a lump sum amount for a predetermined period at a fixed interest rate. It\'s one of the safest investment options available, offering guaranteed returns and capital protection. FDs are ideal for conservative investors who prioritize safety over high returns.',
      type: 'paragraph'
    },
    {
      title: 'How Does an FD Calculator Work?',
      content: [
        'An FD Calculator helps you determine the maturity amount and interest earned on your fixed deposit investment. By entering the principal amount, interest rate, and tenure, you can instantly calculate how much your deposit will grow.',
        'The calculator uses compound interest calculations to show you the exact returns you\'ll receive, helping you make informed decisions about your investment duration and amount.'
      ],
      type: 'paragraphs'
    },
    {
      title: 'Types of Fixed Deposits',
      content: 'Banks offer various types of FDs to suit different needs:',
      list: [
        { term: 'Regular FD:', desc: 'Standard fixed deposits with predetermined tenure and interest rates' },
        { term: 'Tax Saving FD:', desc: 'Eligible for tax deduction under Section 80C with 5-year lock-in' },
        { term: 'Senior Citizen FD:', desc: 'Higher interest rates for investors above 60 years' },
        { term: 'Cumulative FD:', desc: 'Interest compounds and is paid along with principal at maturity' },
        { term: 'Non-Cumulative FD:', desc: 'Regular interest payouts monthly, quarterly, or annually' }
      ],
      note: 'Note: Interest rates and features may vary between different banks and financial institutions.',
      type: 'list_with_note'
    },
    {
      title: 'FD Interest Calculation Formula',
      content: 'The maturity amount for Fixed Deposits is calculated using compound interest formula:',
      formula: 'A = P × (1 + r/n)<sup>nt</sup>',
      variables: [
        { symbol: 'A', desc: 'Final maturity amount' },
        { symbol: 'P', desc: 'Principal deposit amount' },
        { symbol: 'r', desc: 'Annual interest rate (as decimal)' },
        { symbol: 'n', desc: 'Number of times interest compounds per year' },
        { symbol: 't', desc: 'Time period in years' }
      ],
      formula_note: 'For most FDs, interest compounds quarterly (n=4), but some banks offer monthly compounding.',
      type: 'formula'
    },
    {
      title: 'Benefits of Fixed Deposits',
      benefits: [
        { term: 'Guaranteed Returns:', desc: 'Fixed interest rate ensures predictable earnings' },
        { term: 'Capital Protection:', desc: 'Principal amount is completely safe and guaranteed' },
        { term: 'Liquidity Options:', desc: 'Premature withdrawal facility available (with penalty)' },
        { term: 'Loan Against FD:', desc: 'Can take loans up to 90% of FD value at attractive rates' },
        { term: 'Flexible Tenure:', desc: 'Choose investment period from 7 days to 10 years' }
      ],
      type: 'ordered_list'
    },
    {
      title: 'Things to Consider',
      points: [
        'Interest rates are generally lower compared to market-linked investments',
        'Premature withdrawal attracts penalty charges (usually 0.5-1% reduction in rate)',
        'Interest earned is taxable as per your income tax slab',
        'Inflation may erode real returns over long periods',
        'Compare rates across different banks before investing'
      ],
      type: 'ordered_list_simple'
    },
    {
      title: 'FD vs Other Investment Options',
      content: [
        'While FDs offer safety and guaranteed returns, they may not always beat inflation in the long term. For wealth creation goals, consider mixing FDs with market-linked investments like SIPs for better overall returns.',
        'FDs are excellent for emergency funds, short-term goals, and conservative portfolio allocation. They provide stability and peace of mind that market investments cannot guarantee.'
      ],
      type: 'paragraphs'
    },
    {
      title: 'Smart FD Investment Tips',
      points: [
        'Ladder your FDs—invest in multiple FDs with different maturity dates',
        'Consider auto-renewal options to avoid missing reinvestment opportunities',
        'Check if your bank offers higher rates for larger deposit amounts',
        'Understand tax implications and consider tax-saving FDs for Section 80C benefits',
        'Keep some FDs liquid for emergency needs while maximizing returns on others'
      ],
      type: 'ordered_list_simple'
    }
  ],
  cta_section: {
    heading: 'Ready to Take Control of Your Financial Future?',
    description: 'Whether you\'re growing a business, building personal wealth, or simply ready to stop flying blind, Private CFO is here to help you see the whole picture—and move forward with purpose.',
    sub_heading: 'Book your free discovery session today.',
    button_text: 'Let\'s Talk'
  }
};

// Mutual Fund Calculator Data
export const MUTUAL_FUND_CALCULATOR_DATA: CalculatorData = {
  calculator_type: 'mutual-fund',
  meta: {
    title: 'Mutual Fund Calculator',
    hero_subtitle: 'Unlock your wealth potential with smart mutual fund investments! Our calculator helps you plan SIP or lumpsum investments in mutual funds. Diversify your portfolio and achieve your financial goals with confidence.'
  },
  calculator_config: {
    calculator_gradient: 'gradient-text-mutual',
    calculator_primary_color: 'primary-text-mutual',
    amount_label: 'Investment Amount',
    default_amount: '5,000',
    default_duration: 15,
    default_return_rate: 12,
    duration_range: { min: 1, max: 30 },
    return_range: { min: 8, max: 25 },
    amount_max_length: 20
  },
  tabs: [
    { name: 'SIP Calculator', class: 'gradient-text-sip', type: 'sip' },
    { name: 'Lumpsum Calculator', class: 'gradient-text-lumpsum', type: 'lumpsum' },
    { name: 'FD Calculator', class: 'gradient-text-fd', type: 'fd' },
    { name: 'Mutual Fund Re...', class: 'gradient-text-mutual', type: 'mutual-fund' },
    { name: 'Simple Interest Calculator', class: 'gradient-text-simple', type: 'simple-interest' },
    { name: 'Compound Interest Cal...', class: 'gradient-text-compound', type: 'compound-interest' }
  ],
  info_blocks: [
    {
      title: 'What are Mutual Funds?',
      content: 'Mutual Funds are investment vehicles that pool money from multiple investors to invest in a diversified portfolio of stocks, bonds, or other securities. They are managed by professional fund managers who make investment decisions on behalf of investors. This allows small investors to access professionally managed, diversified portfolios that would be difficult to create individually.',
      type: 'paragraph'
    },
    {
      title: 'Types of Mutual Fund Investments',
      content: [
        'You can invest in mutual funds through two primary methods: SIP (Systematic Investment Plan) for regular monthly investments, or Lumpsum for one-time investments. Both methods offer their own advantages depending on your financial situation and market conditions.',
        'Our calculator helps you estimate returns for both investment approaches, allowing you to choose the strategy that best fits your goals and investment capacity.'
      ],
      type: 'paragraphs'
    },
    {
      title: 'Categories of Mutual Funds',
      content: 'Mutual funds are classified based on asset allocation and investment objectives:',
      list: [
        { term: 'Equity Funds:', desc: 'Invest primarily in stocks, suitable for long-term wealth creation' },
        { term: 'Debt Funds:', desc: 'Invest in bonds and fixed-income securities for stable returns' },
        { term: 'Hybrid Funds:', desc: 'Mix of equity and debt for balanced risk-return profile' },
        { term: 'Index Funds:', desc: 'Track market indices with low costs and broad diversification' },
        { term: 'Sector Funds:', desc: 'Focus on specific industries or sectors' }
      ],
      note: 'Note: Each category has different risk levels and return expectations. Choose based on your risk tolerance and investment horizon.',
      type: 'list_with_note'
    },
    {
      title: 'Mutual Fund Return Calculation',
      content: 'Mutual fund returns depend on the Net Asset Value (NAV) growth and are calculated as:',
      formula: 'Returns = [(Final NAV - Initial NAV) + Distributions] / Initial NAV × 100',
      variables: [
        { symbol: 'Final NAV', desc: 'Net Asset Value at redemption' },
        { symbol: 'Initial NAV', desc: 'Net Asset Value at investment' },
        { symbol: 'Distributions', desc: 'Dividends or capital gains distributed during holding period' }
      ],
      formula_note: 'For SIP investments, returns are calculated using XIRR (Extended Internal Rate of Return) method due to multiple investment dates.',
      type: 'formula'
    },
    {
      title: 'Benefits of Mutual Fund Investing',
      benefits: [
        { term: 'Professional Management:', desc: 'Expert fund managers handle investment decisions and portfolio management' },
        { term: 'Diversification:', desc: 'Spread risk across multiple securities and asset classes' },
        { term: 'Liquidity:', desc: 'Easy to buy and sell units during market hours' },
        { term: 'Affordability:', desc: 'Start investing with small amounts through SIPs' },
        { term: 'Transparency:', desc: 'Regular disclosure of portfolio holdings and performance' }
      ],
      type: 'ordered_list'
    },
    {
      title: 'Key Considerations',
      points: [
        'Past performance does not guarantee future returns',
        'Market risks can lead to capital loss, especially in equity funds',
        'Consider expense ratio and exit loads when selecting funds',
        'Choose funds based on your investment timeline and risk tolerance',
        'Review and rebalance your portfolio periodically'
      ],
      type: 'ordered_list_simple'
    },
    {
      title: 'SIP vs Lumpsum in Mutual Funds',
      content: [
        'SIPs help in rupee cost averaging and reduce the impact of market volatility, making them ideal for regular investors. Lumpsum investments can generate higher returns in rising markets but require better market timing.',
        'Many investors combine both approaches—starting with a lumpsum base and continuing with regular SIPs to maximize the benefits of both strategies.'
      ],
      type: 'paragraphs'
    },
    {
      title: 'Smart Mutual Fund Investment Tips',
      points: [
        'Define your financial goals and choose funds accordingly',
        'Diversify across different fund categories and fund houses',
        'Monitor performance regularly but avoid frequent churning',
        'Increase SIP amounts as your income grows',
        'Stay invested for the long term to benefit from compounding'
      ],
      type: 'ordered_list_simple'
    }
  ],
  cta_section: {
    heading: 'Ready to Take Control of Your Financial Future?',
    description: 'Whether you\'re growing a business, building personal wealth, or simply ready to stop flying blind, Private CFO is here to help you see the whole picture—and move forward with purpose.',
    sub_heading: 'Book your free discovery session today.',
    button_text: 'Let\'s Talk'
  }
};

// Simple Interest Calculator Data
export const SIMPLE_INTEREST_CALCULATOR_DATA: CalculatorData = {
  calculator_type: 'simple-interest',
  meta: {
    title: 'Simple Interest Calculator',
    hero_subtitle: 'Calculate simple interest earnings with ease! Perfect for understanding basic lending, borrowing, and simple investment returns. Get clear insights into your interest calculations in seconds.'
  },
  calculator_config: {
    calculator_gradient: 'gradient-text-simple',
    calculator_primary_color: 'primary-text-simple',
    amount_label: 'Principal Amount',
    default_amount: '10,000',
    default_duration: 3,
    default_return_rate: 8,
    duration_range: { min: 1, max: 30 },
    return_range: { min: 1, max: 20 },
    amount_max_length: 20
  },
  tabs: [
    { name: 'SIP Calculator', class: 'gradient-text-sip', type: 'sip' },
    { name: 'Lumpsum Calculator', class: 'gradient-text-lumpsum', type: 'lumpsum' },
    { name: 'FD Calculator', class: 'gradient-text-fd', type: 'fd' },
    { name: 'Mutual Fund Re...', class: 'gradient-text-mutual', type: 'mutual-fund' },
    { name: 'Simple Interest Calculator', class: 'gradient-text-simple', type: 'simple-interest' },
    { name: 'Compound Interest Cal...', class: 'gradient-text-compound', type: 'compound-interest' }
  ],
  info_blocks: [
    {
      title: 'What is Simple Interest?',
      content: 'Simple Interest is the most basic method of calculating interest on a principal amount. It is calculated only on the original principal amount for the entire duration of the investment or loan. Unlike compound interest, simple interest does not earn interest on previously earned interest, making it a linear calculation.',
      type: 'paragraph'
    },
    {
      title: 'How Simple Interest Works',
      content: [
        'Simple interest is calculated using a straightforward formula that considers three factors: the principal amount, the interest rate, and the time period. The interest remains constant throughout the tenure.',
        'This method is commonly used in personal loans, car loans, and some short-term investments where the interest structure is kept simple and transparent.'
      ],
      type: 'paragraphs'
    },
    {
      title: 'Applications of Simple Interest',
      content: 'Simple interest calculations are used in various financial scenarios:',
      list: [
        { term: 'Personal Loans:', desc: 'Many consumer loans use simple interest for easy calculation' },
        { term: 'Auto Loans:', desc: 'Car financing often employs simple interest structure' },
        { term: 'Short-term Deposits:', desc: 'Some savings products offer simple interest' },
        { term: 'Business Loans:', desc: 'Working capital loans may use simple interest' },
        { term: 'Education Planning:', desc: 'Understanding basic interest concepts for financial literacy' }
      ],
      note: 'Note: Most modern investment and savings products use compound interest, which typically offers better returns over time.',
      type: 'list_with_note'
    },
    {
      title: 'Simple Interest Formula',
      content: 'The simple interest formula is straightforward and easy to understand:',
      formula: 'SI = (P × R × T) / 100',
      variables: [
        { symbol: 'SI', desc: 'Simple Interest earned' },
        { symbol: 'P', desc: 'Principal amount (initial investment)' },
        { symbol: 'R', desc: 'Rate of interest per annum' },
        { symbol: 'T', desc: 'Time period in years' }
      ],
      formula_note: 'Total Amount = Principal + Simple Interest. This formula gives you the interest earned, which is added to the principal for the final amount.',
      type: 'formula'
    },
    {
      title: 'Characteristics of Simple Interest',
      benefits: [
        { term: 'Easy Calculation:', desc: 'Simple mathematical formula that\'s easy to understand and compute' },
        { term: 'Predictable Returns:', desc: 'Interest amount remains constant throughout the tenure' },
        { term: 'Transparency:', desc: 'Clear breakdown of interest earnings at any point in time' },
        { term: 'Quick Assessment:', desc: 'Immediate understanding of total interest payable or receivable' },
        { term: 'Linear Growth:', desc: 'Interest grows uniformly over time without compounding effect' }
      ],
      type: 'ordered_list'
    },
    {
      title: 'Limitations to Consider',
      points: [
        'Lower returns compared to compound interest over longer periods',
        'Does not take advantage of interest-on-interest growth',
        'Less common in investment products and savings accounts',
        'May not keep pace with inflation over extended periods',
        'Limited application in modern financial planning'
      ],
      type: 'ordered_list_simple'
    },
    {
      title: 'Simple Interest vs Compound Interest',
      content: [
        'While simple interest offers clarity and ease of calculation, compound interest typically provides better returns for long-term investments. Simple interest grows linearly, while compound interest grows exponentially due to the compounding effect.',
        'Understanding both concepts helps in making informed financial decisions. Use simple interest calculations for loan comparisons and basic planning, but consider compound interest for long-term wealth building.'
      ],
      type: 'paragraphs'
    },
    {
      title: 'Practical Tips',
      points: [
        'Use simple interest calculations for quick loan assessments',
        'Compare simple interest loans with compound interest alternatives',
        'Understand the true cost of loans using simple interest',
        'Consider the time value of money when evaluating options',
        'Use this calculator for educational purposes and basic planning'
      ],
      type: 'ordered_list_simple'
    }
  ],
  cta_section: {
    heading: 'Ready to Take Control of Your Financial Future?',
    description: 'Whether you\'re growing a business, building personal wealth, or simply ready to stop flying blind, Private CFO is here to help you see the whole picture—and move forward with purpose.',
    sub_heading: 'Book your free discovery session today.',
    button_text: 'Let\'s Talk'
  }
};

// Compound Interest Calculator Data
export const COMPOUND_INTEREST_CALCULATOR_DATA: CalculatorData = {
  calculator_type: 'compound-interest',
  meta: {
    title: 'Compound Interest Calculator',
    hero_subtitle: 'Discover the magic of compound interest — Einstein\'s 8th wonder of the world! Calculate how your money can grow exponentially over time. Start small, think long-term, and watch compound interest work its magic.'
  },
  calculator_config: {
    calculator_gradient: 'gradient-text-compound',
    calculator_primary_color: 'primary-text-compound',
    amount_label: 'Principal Amount',
    default_amount: '10,000',
    default_duration: 10,
    default_return_rate: 8,
    duration_range: { min: 1, max: 30 },
    return_range: { min: 1, max: 20 },
    amount_max_length: 20
  },
  tabs: [
    { name: 'SIP Calculator', class: 'gradient-text-sip', type: 'sip' },
    { name: 'Lumpsum Calculator', class: 'gradient-text-lumpsum', type: 'lumpsum' },
    { name: 'FD Calculator', class: 'gradient-text-fd', type: 'fd' },
    { name: 'Mutual Fund Re...', class: 'gradient-text-mutual', type: 'mutual-fund' },
    { name: 'Simple Interest Calculator', class: 'gradient-text-simple', type: 'simple-interest' },
    { name: 'Compound Interest Cal...', class: 'gradient-text-compound', type: 'compound-interest' }
  ],
  info_blocks: [
    {
      title: 'What is Compound Interest?',
      content: 'Compound Interest is the interest earned on both the initial principal amount and the previously earned interest. Often called "interest on interest," it\'s the key driver behind long-term wealth creation. Unlike simple interest, compound interest grows exponentially, making time your most powerful ally in building wealth.',
      type: 'paragraph'
    },
    {
      title: 'The Power of Compounding',
      content: [
        'Compounding occurs when your earnings generate their own earnings. Each time interest is calculated and added to your principal, the base amount for the next calculation increases. This creates a snowball effect that accelerates wealth growth over time.',
        'The magic of compounding becomes more apparent over longer periods. What starts as modest growth can transform into substantial wealth accumulation, which is why starting early is crucial for financial success.'
      ],
      type: 'paragraphs'
    },
    {
      title: 'Factors Affecting Compound Growth',
      content: 'Several factors determine how effectively compound interest works for you:',
      list: [
        { term: 'Principal Amount:', desc: 'Larger initial investments provide a bigger base for compounding' },
        { term: 'Interest Rate:', desc: 'Higher rates accelerate the compounding effect significantly' },
        { term: 'Time Period:', desc: 'Longer durations exponentially increase the power of compounding' },
        { term: 'Compounding Frequency:', desc: 'More frequent compounding (daily vs. annually) increases returns' },
        { term: 'Additional Contributions:', desc: 'Regular additions amplify the compounding effect' }
      ],
      note: 'Note: Even small differences in rates or time can lead to dramatically different outcomes due to the exponential nature of compounding.',
      type: 'list_with_note'
    },
    {
      title: 'Compound Interest Formula',
      content: 'The compound interest formula accounts for multiple compounding periods:',
      formula: 'A = P × (1 + r/n)<sup>nt</sup>',
      variables: [
        { symbol: 'A', desc: 'Final amount after compound interest' },
        { symbol: 'P', desc: 'Principal amount (initial investment)' },
        { symbol: 'r', desc: 'Annual interest rate (as decimal)' },
        { symbol: 'n', desc: 'Number of times interest compounds per year' },
        { symbol: 't', desc: 'Number of years' }
      ],
      formula_note: 'Compound Interest = A - P. The more frequently interest compounds (higher n), the greater the final amount.',
      type: 'formula'
    },
    {
      title: 'Benefits of Compound Interest',
      benefits: [
        { term: 'Exponential Growth:', desc: 'Returns accelerate over time rather than growing linearly' },
        { term: 'Time Advantage:', desc: 'Starting early dramatically improves long-term outcomes' },
        { term: 'Passive Wealth Building:', desc: 'Money works for you without additional effort' },
        { term: 'Inflation Protection:', desc: 'Growth rates can outpace inflation over long periods' },
        { term: 'Goal Achievement:', desc: 'Makes large financial goals more achievable with time' }
      ],
      type: 'ordered_list'
    },
    {
      title: 'Real-World Applications',
      points: [
        'Savings accounts and fixed deposits with quarterly or monthly compounding',
        'Mutual funds and stock investments where returns get reinvested',
        'Retirement accounts where contributions compound over decades',
        'Real estate investments with reinvested rental income',
        'Business investments where profits are reinvested for growth'
      ],
      type: 'ordered_list_simple'
    },
    {
      title: 'The Rule of 72',
      content: [
        'The Rule of 72 is a quick way to estimate how long it takes for an investment to double through compound interest. Simply divide 72 by the annual interest rate to get the approximate number of years.',
        'For example, at 8% annual return, your money doubles in approximately 9 years (72 ÷ 8 = 9). This rule helps you quickly assess the power of different interest rates and time horizons.'
      ],
      type: 'paragraphs'
    },
    {
      title: 'Maximizing Compound Interest',
      points: [
        'Start investing as early as possible to maximize time advantage',
        'Choose investments with higher compounding frequencies when possible',
        'Reinvest all earnings rather than withdrawing them',
        'Make regular additional contributions to accelerate growth',
        'Be patient and avoid early withdrawals that interrupt compounding'
      ],
      type: 'ordered_list_simple'
    }
  ],
  cta_section: {
    heading: 'Ready to Take Control of Your Financial Future?',
    description: 'Whether you\'re growing a business, building personal wealth, or simply ready to stop flying blind, Private CFO is here to help you see the whole picture—and move forward with purpose.',
    sub_heading: 'Book your free discovery session today.',
    button_text: 'Let\'s Talk'
  }
};

// Calculator data mapping
export const CALCULATOR_DATA_MAP: Record<CalculatorType, CalculatorData> = {
  'sip': SIP_CALCULATOR_DATA,
  'lumpsum': LUMPSUM_CALCULATOR_DATA,
  'fd': FD_CALCULATOR_DATA,
  'mutual-fund': MUTUAL_FUND_CALCULATOR_DATA,
  'simple-interest': SIMPLE_INTEREST_CALCULATOR_DATA,
  'compound-interest': COMPOUND_INTEREST_CALCULATOR_DATA
};
