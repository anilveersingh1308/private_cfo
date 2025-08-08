# Calculator data for the SIP Calculator page
SIP_CALCULATOR_DATA = {
    'calculator_type': 'sip',
    'meta': {
        'title': 'SIP Calculator',
        'hero_subtitle': 'Plan your wealth smartly with our SIP Calculator — visualize returns, set goals, and take control of your investments. Start small, grow consistently, and secure a financially free future today.'
    },    
    'calculator_config': {
        'calculator_gradient': 'gradient-text-sip',
        'calculator_primary_color': 'primary-text-sip',
        'slider-color': 'var(--accent-sip)',
        'amount_label': 'Enter Amount',
        'default_amount': '5,000',
        'default_duration': 12,
        'default_return_rate': 12,
        'duration_range': {'min': 1, 'max': 30},
        'return_range': {'min': 8, 'max': 30},
        'amount_max_length': 20
    },
    
    'tabs': [
        {'name': 'SIP Calculator', 'class': 'gradient-text-sip', 'type': 'sip'},
        {'name': 'Lumpsum Calculator', 'class': 'gradient-text-lumpsum', 'type': 'lumpsum'},
        {'name': 'FD Calculator', 'class': 'gradient-text-fd', 'type': 'fd'},
        {'name': 'Mutual Fund Re...', 'class': 'gradient-text-mutual', 'type': 'mutual-fund'},
        {'name': 'Simple Interest Calculator', 'class': 'gradient-text-simple', 'type': 'simple-interest'},
        {'name': 'Compound Interest Cal...', 'class': 'gradient-text-compound', 'type': 'compound-interest'}
    ],
    
    'info_blocks': [
        {
            'title': 'How SIP Works?',
            'content': 'When you invest through SIP, a predetermined amount is debited from your account and invested in selected mutual fund schemes. With each contribution, you purchase units of the fund at prevailing Net Asset Value (NAV). Over time, this creates an average purchase cost due to Rupee Cost Averaging, which helps mitigate the risk of investing in volatile markets. The true benefit lies in the long-term growth of invested capital, as returns get reinvested and compounded.',
            'type': 'paragraph'
        },
        {
            'title': 'What is a SIP Calculator?',
            'content': [
                'A SIP Calculator is an online tool that helps estimate the future value of investments made through SIPs. By inputting the monthly investment amount, expected annual return rate, and the investment duration, users can get a clear idea of how much their investment could grow over time.',
                'It serves as a helpful guide for goal planning—such as saving for a house, child\'s education, retirement, or a dream vacation.'
            ],
            'type': 'paragraphs'
        },
        {
            'title': 'Why Use a SIP Calculator?',
            'content': 'A SIP Calculator is especially useful for:',
            'list': [
                {'term': 'Planning:', 'desc': 'Set a goal and backtrack to see how much you need to invest monthly.'},
                {'term': 'Forecasting:', 'desc': 'Get an estimate of how much your regular investments can grow.'},
                {'term': 'Comparison:', 'desc': 'Explore different scenarios by changing time frames or return rates.'},
                {'term': 'Education:', 'desc': 'Understand the impact of consistency and compound interest.'}
            ],
            'note': 'Note: SIP calculators provide estimates based on expected returns; actual returns vary depending on market performance.',
            'type': 'list_with_note'
        },
        {
            'title': 'Formula Used in SIP Calculator',
            'content': 'The maturity value of an SIP is calculated using the future value of a growing annuity formula:',
            'formula': 'M = P × [[(1 + r)<sup>n</sup> - 1] / r] × (1 + r)',
            'variables': [
                {'symbol': 'M', 'desc': 'Maturity amount'},
                {'symbol': 'P', 'desc': 'Monthly investment amount'},
                {'symbol': 'r', 'desc': 'Rate of return per month (annual rate ÷ 12 ÷ 100)'},
                {'symbol': 'n', 'desc': 'Total number of months'}
            ],
            'formula_note': 'This formula accounts for monthly contributions and the compounding effect of returns over the investment period.',
            'type': 'formula'
        },
        {
            'title': 'Benefits of SIP Investing',
            'benefits': [
                {'term': 'Disciplined Saving:', 'desc': 'Automates monthly savings habit'},
                {'term': 'Market Volatility Protection:', 'desc': 'Rupee cost averaging lowers investment risk'},
                {'term': 'Flexible & Affordable:', 'desc': 'Start with low amounts and increase over time'},
                {'term': 'Power of Compounding:', 'desc': 'Long-term returns are significantly higher due to reinvested gains'},
                {'term': 'Goal-Oriented:', 'desc': 'Ideal for medium to long-term financial planning'}
            ],
            'type': 'ordered_list'
        },
        {
            'title': 'Things to Keep in Mind',
            'points': [
                'SIP returns are not guaranteed—they depend on market performance of the chosen mutual fund',
                'Longer durations generally reduce the impact of volatility',
                'It\'s advisable to review SIPs periodically and increase contributions as your income grows',
                'Mutual fund selection matters—check past performance, risk level, and fund category'
            ],
            'type': 'ordered_list_simple'
        },
        {
            'title': 'Final Thoughts',
            'content': 'Understanding SIPs and using tools like SIP calculators can greatly enhance your ability to make informed financial decisions. It brings clarity to your goals and encourages long-term, consistent investing. SIPs are not a get-rich-quick strategy, but a proven path to wealth creation when used patiently and wisely.',
            'type': 'paragraph'
        }
    ],
    
    'cta_section': {
        'heading': 'Ready to Take Control of Your Financial Future?',
        'description': 'Whether you\'re growing a business, building personal wealth, or simply ready to stop flying blind, Private CFO is here to help you see the whole picture—and move forward with purpose.',
        'sub_heading': 'Book your free discovery session today.',
        'button_text': 'Let\'s Talk'
    }
}

# Calculator data for the LUMPSUM Calculator page
LUMPSUM_CALCULATOR_DATA = {
    'calculator_type': 'lumpsum',
    'meta': {
        'title': 'LUMPSUM Calculator',
        'hero_subtitle': 'Plan your financial future with precision using our Lumpsum Calculator — estimate returns on one-time investments, visualize wealth growth, and make informed decisions with ease and clarity.'
    },    
    'calculator_config': {
        'calculator_gradient': 'gradient-text-lumpsum',
        'calculator_primary_color': 'primary-text-lumpsum',
        'slider-color': 'var(--accent-lumpsum)',
        'amount_label': 'Enter Amount',
        'default_amount': '5,000',
        'default_duration': 12,
        'default_return_rate': 12,
        'duration_range': {'min': 1, 'max': 30},
        'return_range': {'min': 8, 'max': 30},
        'amount_max_length': 20
    },
    
    'tabs': [
        {'name': 'SIP Calculator', 'class': 'gradient-text-sip', 'type': 'sip'},
        {'name': 'Lumpsum Calculator', 'class': 'gradient-text-lumpsum', 'type': 'lumpsum'},
        {'name': 'FD Calculator', 'class': 'gradient-text-fd', 'type': 'fd'},
        {'name': 'Mutual Fund Re...', 'class': 'gradient-text-mutual', 'type': 'mutual-fund'},
        {'name': 'Simple Interest Calculator', 'class': 'gradient-text-simple', 'type': 'simple-interest'},
        {'name': 'Compound Interest Cal...', 'class': 'gradient-text-compound', 'type': 'compound-interest'}
    ],
    
    'info_blocks': [
        {
            'title': 'What Is Lumpsum Investment?',
            'content': [
                'It is a one-time investment that allows you to put your money in a mutual fund, allowing it to grow and compound over time. A lumpsum investment is one of the best ways to maximise your potential returns in a mutual fund and secure your financial future.',
                'If you are considering a lumpsum investment in a mutual fund, it is wise to calculate its likely future value. It enables you to make the necessary adjustments to your investment strategies, aligning them more effectively with your financial goals. You can use an online lumpsum investment calculator to estimate the returns on your mutual fund investment.' 
            ],
            'type': 'paragraphs'
        },
        {
            'title': 'What Is a Lumpsum Return Calculator?',
            'content': 'A lumpsum investment calculator is a valuable financial tool for assessing the prospective returns that a significant amount of investment can give at the end of the tenure or on maturity. It determines the potential worth of your mutual fund investment based on the initial value, rate of return, and period of investment.',
            'type': 'paragraph'
        },
        {
            'title': 'How Can a Lumpsum Calculator Help You?',
            'content': [
                'A lumpsum calculator is a user-friendly online tool designed to estimate the returns on mutual fund lumpsum investments. You just have to provide the initial investment value, expected rate of returns, and investment period. With this information, the lumpsum calculator computes the returns an investment can generate on maturity.',
                'Ultimately, a lumpsum calculator helps you plan your investments in line with your financial goals—saving for a loan down payment, repaying a loan, accumulating funds for travel, and more.',
                'According to the lumpsum calculator’s outcome, you will know whether a particular initial investment amount in a mutual fund will be able to generate enough returns to meet your goals. If not, you can consider adjusting your investment or exploring alternative options offering favourable returns.'
            ],
            'type': 'paragraphs'
        },
        {
            'title': 'Formula To Calculate Mutual Fund Lumpsum Investment Returns',
            'content': 'The lumpsum investment returns on mutual funds are calculated using a formula:',
            'formula': 'Lumpsum Investment Returns = p (1 + r/n)^nt',
            'variables': [
                {'symbol': 'p', 'desc': 'Your lumpsum investment amount'},
                {'symbol': 'r', 'desc': 'Rate of return rate you are expecting to get'},
                {'symbol': 'n', 'desc': 'Number of times the returns are compounded in a year'},
                {'symbol': 't', 'desc': 'Investment duration (in years)'}
            ],
            'formula_note': 't = Investment duration (in years)Let us understand the lumpsum calculator formula better with an example. Assume you have invested ₹50,000 for 5 years in a mutual fund, and the expected annual return is 10% compounding annually. So,\np = ₹50,000,\nr = 10% ,\nn = 1,\nt = 5,\nThe potential returns of your investment in a mutual fund can be calculated using the above formula: \nLumpsum Returns = 50,000 x (1 + 10%) ^ 5,\n= ₹80,526,\nThis means that your investment in a mutual fund would earn total returns of ₹30,526 in 5 years. At the end of 5 years, your investment will grow to ₹80,526.',
            'type': 'formula'
        },
        {
            'title': 'What is a Lumpsum Investment?',
            'benefits': [
                {'desc': 'A lumpsum investment refers to investing a one-time, large amount in a mutual fund or any financial instrument instead of investing smaller amounts over regular intervals (like SIP). It is a common method used by investors who have a sizable amount ready to invest—such as from bonuses, asset sales, or savings—and want to deploy it in the market for potential long-term growth.'},
                {'desc': 'Lumpsum investments are particularly useful for those who prefer simplicity, want to invest idle capital, or time the market based on research or opportunity.'},
            ],
            'type': 'ordered_list'
        },
        {
            'title': 'Benefits of Lumpsum Investment',
            'benefits': [
                {'term': 'Immediate Market Exposure:', 'desc': 'Capital gets invested all at once, allowing for full market participation'},
                {'term': 'Potential for Higher Returns:', 'desc': 'In rising markets, lumpsum investments can outperform SIPs due to early and full exposure'},
                {'term': 'Simple & One-Time Effort:', 'desc': 'Ideal for investors who don’t want to manage monthly installments'},
                {'term': 'Faster Compounding:', 'desc': 'Since the entire amount is invested upfront, returns begin compounding immediately on the whole amount'},
            ],
            'type': 'ordered_list'
        },
        {
            'title': 'Risks to Consider',
            'benefits': [
                {'term': 'Market Timing:', 'desc': 'Lumpsum investing is more sensitive to market entry points; investing at a peak can affect short-term gains'},
                {'term': 'Volatility Exposure:', 'desc': 'Entire capital is exposed to market fluctuations from the beginning'},
                {'term': 'Not Ideal in Unstable Markets:', 'desc': 'In highly volatile or bearish markets, SIPs may provide better cost averaging'},
                {'term': 'Faster Compounding:', 'desc': 'Since the entire amount is invested upfront, returns begin compounding immediately on the whole amount'},
            ],
            'type': 'ordered_list'
        },
        {
            'title': 'Final Thoughts',
            'content': 'Lumpsum investing can be a powerful wealth-building strategy if used wisely and timed appropriately. Using a Lumpsum Calculator helps demystify future projections and supports better financial planning. Always align your investment choices with your risk tolerance, financial goals, and market outlook.',
            'type': 'paragraph'
        }
    ],
    
    'cta_section': {
        'heading': 'Ready to Take Control of Your Financial Future?',
        'description': 'Whether you\'re growing a business, building personal wealth, or simply ready to stop flying blind, Private CFO is here to help you see the whole picture—and move forward with purpose.',
        'sub_heading': 'Book your free discovery session today.',
        'button_text': 'Let\'s Talk'
    }
}

# Calculator data for the FD Calculator page
FD_CALCULATOR_DATA = {
    'calculator_type': 'fd',
    'meta': {
        'title': 'FD Calculator',
        'hero_subtitle': 'An FD calculator is used for calculating the final amount that you will get if you invest in a Fixed Deposit (FD) with a given amount, a given rate of interest, and a given duration of investment.'
    },    
    'calculator_config': {
        'calculator_gradient': 'gradient-text-fd',
        'calculator_primary_color': 'primary-text-fd',
        'slider-color': 'var(--accent-fd)',
        'amount_label': 'Total Investment',
        'default_amount': '1,00,000',
        'default_duration': 5,
        'default_return_rate': 5,
        'duration_range': {'min': 1, 'max': 30},
        'return_range': {'min': 1, 'max': 10},
        'amount_max_length': 20
    },
      'tabs': [
        {'name': 'SIP Calculator', 'class': 'gradient-text-sip', 'type': 'sip'},
        {'name': 'Lumpsum Calculator', 'class': 'gradient-text-lumpsum', 'type': 'lumpsum'},
        {'name': 'FD Calculator', 'class': 'gradient-text-fd', 'type': 'fd'},
        {'name': 'Mutual Fund Re...', 'class': 'gradient-text-mutual', 'type': 'mutual-fund'},
        {'name': 'Simple Interest Calculator', 'class': 'gradient-text-simple', 'type': 'simple-interest'},
        {'name': 'Compound Interest Cal...', 'class': 'gradient-text-compound', 'type': 'compound-interest'}
    ],
    
    'info_blocks': [
        {
            'title': 'What is a Fixed Deposit (FD)?',
            'content': [
                'A Fixed Deposit (FD) is a secure investment option offered by banks and financial institutions where a lump sum amount is deposited for a fixed tenure at a predetermined interest rate. It is a popular choice among conservative investors because it offers guaranteed returns and low risk, unlike market-linked investments like mutual funds or stocks.',
                'The interest on FDs is compounded periodically—monthly, quarterly, or annually—and paid either at regular intervals or upon maturity, depending on the chosen scheme.' 
            ],
            'type': 'paragraphs'
        },
        {
            'title': 'What is an FD Calculator?',
            'content': [
                'A Fixed Deposit Calculator is a digital tool that helps estimate the maturity amount and interest earned on an FD investment. By inputting the principal amount, interest rate, compounding frequency, and tenure, users can instantly calculate the total returns they will receive at the end of the deposit period.',
                'It removes the need for complex manual calculations and helps individuals compare different FD options offered by banks and NBFCs.'
            ],    
            'type': 'paragraphs'
        },
        {
            'title': 'How Does an FD Calculator Work?',
            'content': "FDs earn interest based on the compound interest formula (unless it's a simple interest FD). ,\nThe calculator typically uses this formula:",
            'formula': 'A = P × (1 + r/n)^(n × t)',
            'variables': [
                {'symbol': 'A', 'desc': 'Maturity amount'},
                {'symbol': 'P', 'desc': 'Principal (initial deposit)'},
                {'symbol': 'r', 'desc': 'Annual interest rate (in decimal form)'},
                {'symbol': 'n', 'desc': 'Number of times interest is compounded per year'},
                {'symbol': 't', 'desc': 'Tenure (in years)'}
            ],
            'formula_note': 'The interest earned is: \nInterest = A - P \nSome banks offer simple interest FDs for short tenures, in which case the formula used is: \nInterest = (P × r × t) / 100 \nThe calculator allows for both types of FD schemes depending on the features chosen.',
            'type': 'formula'
        },
        {
            'title': 'Why Use an FD Calculator?',
            'content': 'An FD calculator is beneficial for:',
            'list': [
                {'term': 'Estimating exact returns before locking in your money', 'desc': 'Know exactly how much you will receive at maturity'},
                {'term': 'Comparing FD returns across banks or NBFCs', 'desc': 'Find the best interest rates and schemes available'},
                {'term': 'Planning maturity amounts for fixed future goals', 'desc': 'Align your deposits with specific financial objectives'},
                {'term': 'Avoiding errors in interest and compound calculations', 'desc': 'Get accurate calculations without manual computation'}
            ],
            'note': 'Note: FD calculators provide exact returns as FD interest rates are guaranteed and fixed throughout the tenure.',
            'type': 'list_with_note'
        },
        {
            'title': 'Key Features of Fixed Deposits',
            'benefits': [
                {'term': 'Guaranteed Returns:', 'desc': 'Interest rates are fixed and not affected by market volatility'},
                {'term': 'Flexible Tenure : ', 'desc': 'Ranging from 7 days to 10 years or more based on your needs'},
                {'term': 'Safe & Secure : ', 'desc': 'Suitable for conservative and senior investors'},
                {'term': 'Premature Withdrawal Options : ', 'desc': 'Some FDs allow early access with a small penalty'},
                {'term': 'Predictable Planning : ', 'desc': 'Known maturity dates and amounts help in future financial planning'},
                {'term': 'Tax-Saving FDs : ', 'desc': 'Certain FDs offer tax deductions under Section 80C (ELSS option)'}
            ],
            'type': 'ordered_list'
        },
        {
            'title': 'Factors That Affect FD Returns',
            'benefits': [
                {'term': 'Principal Amount : ', 'desc': 'Higher principal leads to more interest earned'},
                {'term': 'Interest Rate : ', 'desc': 'Varies across institutions and schemes'},
                {'term': 'Tenure : ', 'desc': 'Longer tenure generally results in higher returns'},
                {'term': 'Compounding Frequency : ', 'desc': 'More frequent compounding (quarterly/monthly) increases returns'},
                {'term': 'Payout Preference : ', 'desc': 'Choosing cumulative vs. non-cumulative FDs affects reinvestment and returns'}
            ],
            'type': 'ordered_list'
        },
        {
            'title': 'Final Thoughts',
            'content': 'A Fixed Deposit Calculator helps investors make informed, confident decisions by offering clarity on expected returns, tenure planning, and comparative analysis. While FDs may not offer the highest returns, their security, predictability, and simplicity make them a solid foundation in any financial portfolio—especially when stability is a priority.',
            'type': 'paragraph'
        }
    ],
    
    'cta_section': {
        'heading': 'Ready to Take Control of Your Financial Future?',
        'description': 'Whether you\'re growing a business, building personal wealth, or simply ready to stop flying blind, Private CFO is here to help you see the whole picture—and move forward with purpose.',
        'sub_heading': 'Book your free discovery session today.',
        'button_text': 'Let\'s Talk'
    }
}

# Calculator data for the Mutual Fund Calculator page
MUTUAL_FUND_CALCULATOR_DATA = {
    'calculator_type': 'mutual-fund',
    'meta': {
        'title': 'Mutual Fund Returns Calculator',
        'hero_subtitle': 'Estimate your mutual fund growth with ease. Calculate SIP or lumpsum returns, explore performance projections, and take smarter investment decisions to maximize your portfolio returns.'
    },    
    'calculator_config': {
        'calculator_gradient': 'gradient-text-mutual',
        'calculator_primary_color': 'primary-text-mutual',
        'slider-color': 'var(--accent-mutual)',
        'amount_label': 'Investment Amount',
        'default_amount': '1,00,000',
        'default_duration': 10,
        'default_return_rate': 12,
        'duration_range': {'min': 1, 'max': 30},
        'return_range': {'min': 5, 'max': 25},
        'amount_max_length': 20
    },
    
    'tabs': [
        {'name': 'SIP Calculator', 'class': 'gradient-text-sip', 'type': 'sip'},
        {'name': 'Lumpsum Calculator', 'class': 'gradient-text-lumpsum', 'type': 'lumpsum'},
        {'name': 'FD Calculator', 'class': 'gradient-text-fd', 'type': 'fd'},
        {'name': 'Mutual Fund Re...', 'class': 'gradient-text-mutual', 'type': 'mutual-fund'},
        {'name': 'Simple Interest Calculator', 'class': 'gradient-text-simple', 'type': 'simple-interest'},
        {'name': 'Compound Interest Cal...', 'class': 'gradient-text-compound', 'type': 'compound-interest'}
    ],
    
    'info_blocks': [
        {
            'title': 'What are Mutual Funds?',
            'content': [
                'Mutual Funds are professionally managed investment pools that collect money from multiple investors to invest in diversified assets like stocks, bonds, and other securities. They are managed by Asset Management Companies (AMCs) and offer a range of schemes based on investment objectives.',
                'Mutual funds are ideal for individuals who want exposure to market returns but prefer to delegate fund management to experts. Returns from mutual funds are market-linked and based on scheme performance.'
            ],
            'type': 'paragraphs'
        },
        {
            'title': 'What is a Mutual Fund Returns Calculator?',
            'content': [
                'A Mutual Fund Returns Calculator is a tool that helps investors estimate the potential returns from their mutual fund investments over a specific period. It uses past data, assumed rate of returns, and investment duration to calculate the growth of an investment—whether made through SIP or lump sum.',
                'The calculator is useful for: Estimating maturity value, Understanding annualized or compounded returns, Planning future investments, Evaluating fund performance retrospectively or hypothetically'
            ],
            'type': 'paragraphs'
        },
        {
            'title': 'Types of Mutual Fund Returns',
            'content': 'Mutual funds provide returns in different ways:',
            'list': [
                {'term': 'Absolute Return:', 'desc': 'Measures total return over a fixed period (no compounding)'},
                {'term': 'Annualized Return (CAGR):', 'desc': 'Useful for long-term investments to show yearly average growth'},
                {'term': 'Formula:', 'desc': 'Final NAV - Initial NAV / Initial NAV × 100'},
                {'term': 'XIRR (Extended Internal Rate of Return):', 'desc': 'Used when investments are made at irregular intervals (common in SIPs)'},
                {'term': 'Returns with Dividends Reinvested:', 'desc': 'Total return also includes dividends if reinvested, not just NAV growth'},
                {'term': 'CAGR = [(Ending Value / Beginning Value)^(1/n)] - 1 where n = number of years', 'desc': ''}
            ],
            'note': 'XIRR (Extended Internal Rate of Return): Used when investments are made at irregular intervals (common in SIPs). Returns with Dividends Reinvested: Total return also includes dividends if reinvested, not just NAV growth.',
            'type': 'list_with_note'
        },        {
            'title': 'How Does a Mutual Fund Returns Calculator Work?',
            'content': 'Depending on the type of calculator and inputs, it can calculate:',
            'benefits': [
                'Lumpsum Returns: Based on one-time investment',
                'SIP Returns: Based on recurring monthly investments',
                'Goal-based Planning: Based on required corpus and other variables',
                'Investment Type (SIP or Lumpsum)',
                'Duration of start and end dates',
                'Expected or historical return rate (or actual NAV values)',
                'Investment amount'
            ],
            'note_content': 'Most basic calculators include: Investment amount, Investment type (SIP or Lumpsum), Duration of start and end dates, Expected or historical return rate (or actual NAV values)',
            'calculation_details': 'Based on these, the calculator provides: Final value at maturity, Total gain or returns, Annualized return percentage (CAGR or XIRR)',
            'type': 'unordered_list'
        },{
            'title': 'Why Use a Mutual Fund Returns Calculator?',
            'content': 'A Mutual Fund Returns Calculator provides valuable insights for investment planning:',
            'benefits': [
                'To forecast potential wealth accumulation',
                'To compare funds based on historical performance',
                'To analyze SIP vs lumpsum outcomes',
                'To aid in financial goal planning',
                'To evaluate return potential before investing'
            ],
            'note': 'It provides a data-backed approach to investment planning, helping users avoid unrealistic expectations or guesswork.',
            'type': 'unordered_list'
        },        {
            'title': 'Factors Affecting Mutual Fund Returns',
            'points': [
                'Fund Category: Equity, debt, hybrid, index, and sectoral funds behave differently',
                'Fund Management: Strategy, Active vs passive management affects risk and return',
                'Expense Ratio: Higher fees reduce net returns',
                'Duration of Investment: Longer tenure reduces volatility and improves consistency',
                'Market Conditions: Bull/bear cycles significantly impact performance'
            ],
            'type': 'ordered_list_simple'
        },
        {
            'title': 'Final Thoughts',
            'content': 'A Mutual Fund Returns Calculator is a valuable resource for any investor—whether you are just starting your journey or evaluating past performance. While it doesn\'t predict \'market\' behavior, it provides clarity on how your money could grow based on data and assumptions. Remember to consider diversification, review performance regularly, and make decisions that make smarter decisions, align with financial goals, and stay realistic about outcomes.',
            'type': 'paragraph'
        }
    ],
    
    'cta_section': {
        'heading': 'Ready to Take Control of Your Financial Future?',
        'description': 'Whether you\'re growing a business, building personal wealth, or simply ready to stop flying blind, Private CFO is here to help you see the whole picture—and move forward with purpose.',
        'sub_heading': 'Book your free discovery session today.',
        'button_text': 'Let\'s Talk'
    }
}

# Calculator data for the Simple Interest Calculator page
SIMPLE_INTEREST_CALCULATOR_DATA = {
    'calculator_type': 'simple-interest',
    'meta': {
        'title': 'Simple Interest Calculator',
        'hero_subtitle': 'Simple interest is calculated based on a fixed percentage of the initial principal amount. Use this calculator to calculate simple interest on your loan or investment/savings.'
    },    
    'calculator_config': {
        'calculator_gradient': 'gradient-text-simple',
        'calculator_primary_color': 'primary-text-simple',
        'slider-color': 'var(--accent-simple)',
        'amount_label': 'Enter Amount',
        'default_amount': '1,00,000',
        'default_duration': 5,
        'default_return_rate': 6.5,
        'duration_range': {'min': 1, 'max': 30},
        'return_range': {'min': 1, 'max': 20},
        'amount_max_length': 20
    },
    
    'tabs': [
        {'name': 'SIP Calculator', 'class': 'gradient-text-sip', 'type': 'sip'},
        {'name': 'Lumpsum Calculator', 'class': 'gradient-text-lumpsum', 'type': 'lumpsum'},
        {'name': 'FD Calculator', 'class': 'gradient-text-fd', 'type': 'fd'},
        {'name': 'Mutual Fund Re...', 'class': 'gradient-text-mutual', 'type': 'mutual-fund'},
        {'name': 'Simple Interest Calculator', 'class': 'gradient-text-simple', 'type': 'simple-interest'},
        {'name': 'Compound Interest Cal...', 'class': 'gradient-text-compound', 'type': 'compound-interest'}
    ],
    
    'info_blocks': [
        {
            'title': 'What is Simple Interest?',
            'content': 'Simple Interest (SI) is a basic method of calculating interest on a principal amount over a period of time. Unlike compound interest, simple interest is calculated only on the original amount (principal), not on previously earned interest. It is commonly used for short-term loans, savings accounts, and fixed income investments where interest does not accumulate on previously earned interest. In simple terms, it is the interest earned or paid only on the original amount (principal), not on the interest generated.',
            'type': 'paragraph'
        },
        {
            'title': 'What is a Simple Interest Calculator?',
            'content': [
                'A Simple Interest Calculator is a tool that helps you calculate the total interest earned or payable on a principal amount over a specified period at a fixed interest rate. By entering just three values—Principal (P), Rate of Interest (R), and Time (T)—you can find out:',
                '• The interest amount (I) = Principal × Rate × Time',
                '• The total value or maturity amount (A) = Principal + Interest',
                'This tool simplifies quick and accurate calculations, especially for basic loans, deposits, or short-term investments.'
            ],
            'type': 'paragraphs'
        },
        {
            'title': 'Simple Interest Formula',
            'content': 'The formula used by the calculator is straightforward:',
            'formula': 'Simple Interest (SI) = (P × R × T) / 100',
            'variables': [
                {'symbol': 'P', 'desc': 'Principal amount'},
                {'symbol': 'R', 'desc': 'Annual rate of interest (%)'},
                {'symbol': 'T', 'desc': 'Time (in years)'}
            ],
            'formula_note': 'If the time is given in months, it\'s converted to a fraction of a year. The Total Amount (A) is then: A = P + SI',
            'type': 'formula'
        },
        {
            'title': 'When is Simple Interest Used?',
            'content': 'Simple Interest is commonly used in:',
            'list': [
                {'term': 'Short-term personal or educational loans', 'desc': ''},
                {'term': 'Car loans or consumer durable loans', 'desc': ''},
                {'term': 'Bank savings accounts (in some cases)', 'desc': ''},
                {'term': 'Fixed deposits or recurring deposits (for specific terms)', 'desc': ''},
                {'term': 'Quick estimates of loan costs or savings returns', 'desc': ''}
            ],
            'note': 'It is ideal for situations where the interest does not need to be compounded.',
            'type': 'list_with_note'
        },
        {
            'title': 'Why Use a Simple Interest Calculator?',
            'benefits': [
                {'term': 'Quick & Easy:', 'desc': 'Avoid manual errors and save time'},
                {'term': 'Clarity in Planning:', 'desc': 'Know exactly how much you\'ll earn or owe'},
                {'term': 'Easy Comparisons:', 'desc': 'Compare interest outcomes for different rates and time periods'},
                {'term': 'Financial Literacy:', 'desc': 'Understand how interest works in simple, easy-to-follow situations'},
                {'term': 'Useful for students, beginners, and loan seekers', 'desc': 'Ideal for up to 1-3 years of investment or borrowing'}
            ],
            'type': 'ordered_list'
        },
        {
            'title': 'Benefits of Simple Interest',
            'points': [
                'Transparency: Fixed and predictable returns',
                'No Compounding Complexity: Interest stays constant over time',
                'Easy to Understand: Useful for students, beginners, and loan seekers',
                'Short-term Friendly: Ideal for up to 1-3 years of investment or borrowing'
            ],
            'type': 'ordered_list_simple'
        },
        {
            'title': 'Final Thoughts',
            'content': 'A Simple Interest Calculator is an essential tool for anyone dealing with short-term financial plans. Whether you\'re borrowing, saving, or just learning, it offers a fast way to understand how interest works without the complexity of compounding. It\'s a great starting point for building strong financial literacy and making informed money decisions.',
            'type': 'paragraph'
        }
    ],
    
    'cta_section': {
        'heading': 'Ready to Take Control of Your Financial Future?',
        'description': 'Whether you\'re growing a business, building personal wealth, or simply ready to stop flying blind, Private CFO is here to help you see the whole picture—and move forward with purpose.',
        'sub_heading': 'Book your free discovery session today.',
        'button_text': 'Let\'s Talk'
    }
}

# Calculator data for the Compound Interest Calculator page
COMPOUND_INTEREST_CALCULATOR_DATA = {
    'calculator_type': 'compound-interest',
    'meta': {
        'title': 'Compound Interest Calculator',
        'hero_subtitle': 'Plan your wealth smartly with our SIP Calculator — visualize returns, set goals, and take control of your investments. Start small, grow consistently, and secure a financially free future today.'
    },    
    'calculator_config': {
        'calculator_gradient': 'gradient-text-compound',
        'calculator_primary_color': 'primary-text-compound',
        'slider-color': 'var(--accent-compound)',
        'amount_label': 'Enter Amount',
        'default_amount': '10,000',
        'default_duration': 5,
        'default_return_rate': 12,
        'duration_range': {'min': 1, 'max': 30},
        'return_range': {'min': 1, 'max': 25},
        'amount_max_length': 20
    },
    
    'tabs': [
        {'name': 'SIP Calculator', 'class': 'gradient-text-sip', 'type': 'sip'},
        {'name': 'Lumpsum Calculator', 'class': 'gradient-text-lumpsum', 'type': 'lumpsum'},
        {'name': 'FD Calculator', 'class': 'gradient-text-fd', 'type': 'fd'},
        {'name': 'Mutual Fund Re...', 'class': 'gradient-text-mutual', 'type': 'mutual-fund'},
        {'name': 'Simple Interest Calculator', 'class': 'gradient-text-simple', 'type': 'simple-interest'},
        {'name': 'Compound Interest Cal...', 'class': 'gradient-text-compound', 'type': 'compound-interest'}
    ],
    
    'info_blocks': [
        {
            'title': 'What is Compound Interest?',
            'content': 'Compound Interest (CI) is the process of earning interest not only on the initial principal but also on the accumulated interest from previous periods. Often described as "interest on interest," compound interest causes wealth to grow at an accelerating rate, making it one of the most powerful financial concepts. It is the foundation of long-term wealth creation and is used in many financial instruments such as fixed deposits, mutual funds, loans, and retirement plans.',
            'type': 'paragraph'
        },
        {
            'title': 'What is a Compound Interest Calculator?',
            'content': [
                'A Compound Interest Calculator is a digital tool that helps estimate the future value of an investment or loan based on compound interest. By entering the principal amount, rate of interest, time period, and compounding frequency (monthly, quarterly, annually, etc.), users can instantly calculate:',
                '• Total amount (maturity value)',
                '• Total compound interest earned',
                '• Impact of compounding over time',
                'This tool helps users visualize how even small investments can grow significantly over time when left untouched.'
            ],
            'type': 'paragraphs'
        },
        {
            'title': 'Compound Interest Formula',
            'content': 'The formula used by the calculator is straightforward:',
            'formula': 'A = P (1 + r/n)^n × t',
            'variables': [
                {'symbol': 'A', 'desc': 'Future value (maturity amount)'},
                {'symbol': 'P', 'desc': 'Principal (initial investment)'},
                {'symbol': 'r', 'desc': 'Annual interest rate (in decimal)'},
                {'symbol': 'n', 'desc': 'Number of compounding periods per year'},
                {'symbol': 't', 'desc': 'Time (in years)'}
            ],
            'formula_note': 'Compound Interest (CI) = A – P,\nThis formula shows how returns accumulate faster as compounding becomes more frequent or the investment horizon increases.',
            'type': 'formula'
        },
        {
            'title': 'How Does Compounding Work?',
            'content': 'Let\'s say you invest ₹10,000 at 10% annual interest compounded yearly:',
            'list': [
                {'term': '• After 1 year: ₹11,000', 'desc': ''},
                {'term': '• After 2 years: ₹12,100', 'desc': ''},
                {'term': '• After 3 years: ₹13,310', 'desc': ''},
                {'term': 'Notice how the interest itself earns more interest every year — this is the power of compounding.', 'desc': ''}
            ],
            'note': 'Notice how the interest itself earns more interest every year — this is the power of compounding.',
            'type': 'list_with_note'
        },
        {
            'title': 'Why Use a Compound Interest Calculator?',
            'benefits': [
                {'term': 'Forecast Growth:', 'desc': 'Understand how your money will grow over time'},
                {'term': 'Compare Scenarios:', 'desc': 'See how different rates, periods, or compounding affect returns'},
                {'term': 'Goal Planning:', 'desc': 'Useful for planning investments, retirement, children\'s education, etc.'},
                {'term': 'Loan Calculation:', 'desc': 'Calculate total payable amounts for compound-interest loans'},
                {'term': 'No Manual Calculations:', 'desc': 'Get instant and accurate results with minimal input'}
            ],
            'type': 'ordered_list'
        },
        {
            'title': 'Factors Affecting Compound Interest',
            'points': [
                'Principal: Larger amounts earn more interest',
                'Interest Rate: Higher rates result in faster growth',
                'Time Period: The longer the period, the more impactful the compounding',
                'Compounding Frequency: More frequent compounding → greater returns',
                'Even small changes in these variables can significantly impact the final outcome'
            ],
            'type': 'ordered_list_simple'
        },
        {
            'title': 'Real-Life Applications of Compound Interest',
            'points': [
                'Bank fixed deposits (FDs)',
                'Recurring deposits',
                'Mutual fund investments',
                'Retirement accounts (like PPF, NPS)',
                'Student and home loans',
                'Reinvested dividends and interest'
            ],
            'note': 'Understanding compound interest is essential for both investors and borrowers alike.',
            'type': 'ordered_list_simple'
        },
        {
            'title': 'Final Thoughts',
            'content': 'Compound interest is one of the most powerful financial principles. Whether you\'re saving for a long-term goal or evaluating a loan\'s cost, knowing how compound interest works can help you make smarter decisions. A Compound Interest Calculator gives you clarity, removes guesswork, and supports better planning by showing how your money can grow over time.',
            'type': 'paragraph'
        }
    ],
    
    'cta_section': {
        'heading': 'Ready to Take Control of Your Financial Future?',
        'description': 'Whether you\'re growing a business, building personal wealth, or simply ready to stop flying blind, Private CFO is here to help you see the whole picture—and move forward with purpose.',
        'sub_heading': 'Book your free discovery session today.',
        'button_text': 'Let\'s Talk'
    }
}

# Function to get calculator data based on type
def get_calculator_data(calculator_type):
    if calculator_type == 'lumpsum':
        return LUMPSUM_CALCULATOR_DATA
    elif calculator_type == 'fd':
        return FD_CALCULATOR_DATA
    elif calculator_type == 'mutual-fund':
        return MUTUAL_FUND_CALCULATOR_DATA
    elif calculator_type == 'simple-interest':
        return SIMPLE_INTEREST_CALCULATOR_DATA
    elif calculator_type == 'compound-interest':
        return COMPOUND_INTEREST_CALCULATOR_DATA
    else:
        return SIP_CALCULATOR_DATA  # Default to SIP