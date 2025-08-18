// Services Data for Private CFO Application
// This file contains all service-related data in an organized and descriptive manner

export interface ServiceItem {
  title: string;
  icon: string;
  alt: string;
  features: string[];
}

export interface TestimonialItem {
  name: string;
  title: string;
  avatar: string;
  rating: number;
  text: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// Individual CFO Services - Personal Financial Solutions
export const individualServices: ServiceItem[] = [
  {
    title: "Personal Financial Planning",
    icon: "/images/services/individual_service_1.png",
    alt: "Personal Financial Planning icon",
    features: [
      "Investment & Savings strategy",
      "Tax - efficient planning", 
      "Retirement & wealth management"
    ]
  },
  {
    title: "Tax Planning & Filing",
    icon: "/images/services/individual_service_2.png",
    alt: "Tax Planning & Filing icon",
    features: [
      "Accurate filing and deductions",
      "Tax-saving advisory",
      "Support for audits or notices"
    ]
  },
  {
    title: "Debt & Credit Advisory",
    icon: "/images/services/individual_service_3.png", 
    alt: "Debt & Credit Advisory icon",
    features: [
      "Loan management",
      "Credit score improvement plans"
    ]
  },
  {
    title: "One-on-One Financial Coaching",
    icon: "/images/services/individual_service_4.png",
    alt: "One-on-One Financial Coaching icon", 
    features: [
      "Personalized goal tracking",
      "Expert sessions for decision-making"
    ]
  },
  {
    title: "Estate and Succession Planning",
    icon: "/images/services/individual_service_5.png",
    alt: "Estate and Succession Planning icon",
    features: [
      "Asset protection and transfer strategies",
      "Will and trust coordination"
    ]
  },
  {
    title: "Expense and Budget Management",
    icon: "/images/services/individual_service_6.png",
    alt: "Expense and Budget Management icon",
    features: [
      "Smart budgeting tools.",
      "Monthly/quarterly reporting"
    ]
  },
  {
    title: "Insurance portfolio Review",
    icon: "/images/services/individual_service_7.png",
    alt: "Insurance portfolio Review icon",
    features: [
      "Optimized insurance premiums",
      "Better financial security for emergencies.",
      "Protection against under-insurance or over-insurance."
    ]
  },
  {
    title: "Education & Marriage Fund Planning",
    icon: "/images/services/individual_service_8.png",
    alt: "Education & Marriage Fund Planning icon",
    features: [
      "Achieve major life goals without debt.",
      "Use of SIPs, PPF, FDs, and child plans with milestone tracking."
    ]
  }
];

// Business CFO Services - Expert Financial Leadership for Growing Enterprises
export const businessServices: ServiceItem[] = [
  {
    title: "Virtual CFO Services",
    icon: "/images/services/business_service_1.png",
    alt: "Virtual CFO Services icon",
    features: [
      "End to end financial oversight",
      "KPI monitoring & board reporting"
    ]
  },
  {
    title: "Financial Planning & Analysis",
    icon: "/images/services/business_service_2.png",
    alt: "Financial Planning & Analysis icon",
    features: [
      "budgeting, forecasting & variance analysis",
      "Business growth strategy"
    ]
  },
  {
    title: "Fundraising & Investor Reporting",
    icon: "/images/services/business_service_3.png",
    alt: "Fundraising & Investor Reporting icon",
    features: [
      "Pitch desk & investor package support",
      "Financial modeling & valuation"
    ]
  },
  {
    title: "Tax Structuring & Compliance",
    icon: "/images/services/business_service_4.png",
    alt: "Tax Structuring & Compliance icon",
    features: [
      "GST, TDS, ROC filings",
      "Entity structuring for tax efficiency"
    ]
  },
  {
    title: "Cash-flow Management",
    icon: "/images/services/business_service_5.png",
    alt: "Cash-flow Management icon",
    features: [
      "Working capital optimization",
      "Monthly burn & runway reports"
    ]
  },
  {
    title: "M&A and Due Diligence",
    icon: "/images/services/business_service_6.png",
    alt: "M&A and Due Diligence icon",
    features: [
      "Financial health assessment",
      "Strategic deal evaluation"
    ]
  },
  {
    title: "Payroll & Employee Benefit Management",
    icon: "/images/services/business_service_7.png",
    alt: "Payroll & Employee Benefit Management icon",
    features: [
      "Hassle-free payroll execution",
      "Tax compliance with government norms",
      "Boost employee trust and satisfaction"
    ]
  },
  {
    title: "Strategic Business Advisory",
    icon: "/images/services/business_service_8.png",
    alt: "Strategic Business Advisory icon",
    features: [
      "Avoid penalties and legal risks",
      "Model & pricing strategy review",
      "Growth & risk scenario analysis"
    ]
  }
];

// Customer Testimonials - Real Impact Stories
export const individualTestimonials: TestimonialItem[] = [
  {
    name: "Ajay Saxena",
    title: "Investor",
    avatar: "https://via.placeholder.com/40x40/374151/ffffff?text=AS",
    rating: 5.0,
    text: "Having someone like Komal from the private CFO team on my side gave me confidence as an investor. She looked at my existing portfolio and offered updates that were both practical and impactful. I've seen real improvement since."
  },
  {
    name: "Niteesh Khurana",
    title: "Investor",
    avatar: "https://via.placeholder.com/40x40/374151/ffffff?text=NK", 
    rating: 5.0,
    text: "I can't stress enough how easy the entire process felt with my CFO guiding me. They took the time to understand my situation, offered expert insight, and made complex decisions feel manageable. Big thumbs-up!"
  },
  {
    name: "Nisha Chaturvedi",
    title: "Investor",
    avatar: "https://via.placeholder.com/40x40/374151/ffffff?text=NC",
    rating: 5.0,
    text: "Deepika Goyal really opened my eyes to how strategic a financial partnership can be. She helped me refine my investment approach, set clearer goals, and make changes that I now see boosting my portfolio performance."
  },
  {
    name: "Jayant Singh", 
    title: "Investor",
    avatar: "https://via.placeholder.com/40x40/374151/ffffff?text=JS",
    rating: 5.0,
    text: "Ayan Sharma quickly figured out exactly what I needed. His advice was spot-on, and I never felt like I was getting generic suggestions. I'd recommend him to anyone who wants a smart, insightful approach to managing their finances."
  },
  {
    name: "Vikram Mehra",
    title: "Investor",
    avatar: "https://via.placeholder.com/40x40/374151/ffffff?text=VM",
    rating: 5.0,
    text: "Divya went above and beyond to ensure I understood every financial option laid out for me. Her explanations were detailed yet clear, and she was always ready to respond to any doubts I had. That personal attention really stood out."
  }
];

export const businessTestimonials: TestimonialItem[] = [
  {
    name: "Rohit Agarwal",
    title: "Business Owner",
    avatar: "https://via.placeholder.com/40x40/374151/ffffff?text=RA",
    rating: 5.0,
    text: "Private CFO helped us streamline our cash flow and set up robust financial processes. Their team is proactive and always available for strategic advice. Highly recommended for any growing business!"
  },
  {
    name: "Priya Sinha",
    title: "Startup Founder",
    avatar: "https://via.placeholder.com/40x40/374151/ffffff?text=PS",
    rating: 5.0,
    text: "The fundraising and investor reporting support was a game changer for our startup. We felt confident in every board meeting thanks to the clarity and insights provided by Private CFO."
  },
  {
    name: "Manish Gupta",
    title: "MSME Owner",
    avatar: "https://via.placeholder.com/40x40/374151/ffffff?text=MG",
    rating: 5.0,
    text: "Their payroll and compliance solutions saved us countless hours and headaches. The team is knowledgeable and always goes the extra mile."
  }
];

// Frequently Asked Questions - Common Financial Planning Queries
export const individualFaqs: FAQItem[] = [
  {
    question: "Is financial planning really necessary for someone like me?",
    answer: "Yes—regardless of your age, income, or stage in life, financial planning is essential. It's not just about wealth management; it's about creating a roadmap to help you make smarter money decisions, reduce financial stress, and prepare for future goals—whether that's buying your first home, saving for your child's education, or planning for retirement."
  },
  {
    question: "What makes financial planning so important in today's world?", 
    answer: "In today's dynamic world, financial planning provides stability and direction. It helps you navigate economic uncertainties, adapt to changing life circumstances, and make informed decisions to secure your financial future and achieve peace of mind."
  },
  {
    question: "What are the charges for working with a Registered Investment Advisor (RIA)?",
    answer: "Charges for RIAs can vary. They might be a percentage of assets managed, a flat fee, or an hourly rate. It's important to discuss fee structures transparently with your advisor to understand all costs involved. We believe in clear and fair pricing."
  },
  {
    question: "Can a financial plan include my family's goals and needs too?",
    answer: "Absolutely. A comprehensive financial plan is often designed to incorporate the goals and needs of your entire family, such as education funding for children, family protection through insurance, and estate planning for future generations."
  },
  {
    question: "Can a financial plan include my child's education planning?",
    answer: "Yes, planning for your child's education is a common and crucial component of financial planning. This can involve setting up specific investment vehicles, savings plans, and strategies to ensure funds are available when needed for educational expenses."
  }
];

export const businessFaqs: FAQItem[] = [
  {
    question: "My business is growing, but I’m struggling with cash flow. What should I do?",
    answer: "Cash flow is one of the biggest challenges for businesses of all sizes. The key is to implement proper cash flow forecasting, streamline receivables, negotiate payables smartly, and ensure you always have enough working capital. Professional financial management helps you maintain liquidity while planning for growth."
  },
  {
    question: "How can I make sure my business stays financially stable during uncertain times?",
    answer: "Stability comes from strong financial planning and risk management. This means building reserves, diversifying revenue streams, controlling expenses, and having contingency strategies in place. With the right financial oversight, your business can adapt quickly to market shifts and economic uncertainties."
  },
  {
    question: "What are the typical costs of getting financial management support for my company?",
    answer: "Costs vary depending on the level of support you need. Some businesses prefer ongoing monthly advisory, while others engage experts on a project or performance basis. What matters most is transparency—knowing exactly what you’re paying for and the value being delivered in terms of growth, savings, and efficiency."
  },
  {
    question: "Can financial planning cover my company’s overall growth and long-term vision?",
    answer: "Yes. A strong financial plan aligns day-to-day operations with long-term goals. It covers budgeting, cash flow, taxation, investments, compliance, and succession planning. This ensures your business is not only profitable today but also well-prepared for future expansion and sustainability."
  },
  {
    question: "How can I prepare my business for expansion or funding from investors?",
    answer: "Preparation involves having clear financial statements, a strong business model, and well-structured capital strategies. This builds investor confidence, improves funding opportunities, and helps secure the right mix of debt or equity. Sound financial planning ensures your business is positioned for growth without unnecessary risks."
  }
];

// Page Content Configuration
export const pageContent = {
  individual: {
    heroTitle: "Empowering Individuals with expert Financial Guidance.",
    heroSubtitle: "Take control of your personal finance with tailored CFO services that ensure clarity, compliance, and growth.",
    sectionTitle: "Our Personalized Financial Solutions",
    sectionSubtitle: "Precision-Driven Services to Strengthen Your Financial Foundation",
    sectionDescription: "Discover a suite of high-impact financial services curated exclusively for individuals seeking clarity, control, and growth. Our Personal CFO offerings go beyond basic advisory — we deliver structured, strategy-led support that adapts to your life goals. Whether you're managing daily expenses, navigating taxes, or planning long-term wealth, our expert services are built to empower every financial decision you make."
  },
  business: {
    heroTitle: "Fuel Your Business Growth with On-Demand CFO Expertise",
    heroSubtitle: "Focus on scaling while we manage your financial backbone with precision, insight, and strategic foresight.",
    sectionTitle: "Expert CFO Services for Growing Businesses/MSMEs",
    sectionSubtitle: "Strategic Financial Leadership Tailored for Growing Enterprises",
    sectionDescription: "Our CFO services are built for ambitious businesses that demand clarity, control, and confidence in their financial decisions. Whether you're an MSME navigating daily operations or a high-growth startup seeking investment, we act as your strategic finance partner—without the cost of a full-time CFO. We provide end-to-end financial oversight including forecasting, fundraising, cash flow management, compliance, and investor readiness. With data-driven insights and industry-aligned strategies, we help you streamline operations, reduce financial risks, and scale sustainably."
  }
};
