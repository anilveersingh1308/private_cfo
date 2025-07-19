"use client";

import { ProjectImage } from "./project-image";

export interface ServiceImage {
  src: string;
  alt: string;
  title: string;
  description?: string;
}

interface ImageGalleryProps {
  images: ServiceImage[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function ImageGallery({ images, columns = 3, className = "" }: ImageGalleryProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
      {images.map((image, index) => (
        <div 
          key={index}
          className="bg-slate-700/60 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:bg-slate-700/70 transition-all duration-300 hover:scale-105"
        >
          <div className="aspect-square mb-4 overflow-hidden rounded-xl">
            <ProjectImage
              src={image.src}
              alt={image.alt}
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{image.title}</h3>
          {image.description && (
            <p className="text-gray-300 text-sm">{image.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// Predefined service image collections
export const individualServices: ServiceImage[] = [
  {
    src: "/images/services/individual_service_1.png",
    alt: "Personal Financial Planning",
    title: "Personal Financial Planning",
    description: "Comprehensive financial strategy tailored to your goals"
  },
  {
    src: "/images/services/individual_service_2.png",
    alt: "Investment Management",
    title: "Investment Management",
    description: "Professional portfolio management and optimization"
  },
  {
    src: "/images/services/individual_service_3.png",
    alt: "Tax Optimization",
    title: "Tax Optimization",
    description: "Strategic tax planning to maximize your wealth"
  },
  {
    src: "/images/services/individual_service_4.png",
    alt: "Estate Planning",
    title: "Estate Planning",
    description: "Secure your legacy with comprehensive estate strategies"
  },
  {
    src: "/images/services/individual_service_5.png",
    alt: "Risk Management",
    title: "Risk Management",
    description: "Protect your wealth with strategic risk assessment"
  },
  {
    src: "/images/services/individual_service_6.png",
    alt: "Retirement Planning",
    title: "Retirement Planning",
    description: "Build a secure financial future for retirement"
  },
  {
    src: "/images/services/individual_service_7.png",
    alt: "Cash Flow Management",
    title: "Cash Flow Management",
    description: "Optimize your personal cash flow and spending"
  },
  {
    src: "/images/services/individual_service_8.png",
    alt: "Financial Health Assessment",
    title: "Financial Health Assessment",
    description: "Comprehensive analysis of your financial position"
  }
];

export const businessServices: ServiceImage[] = [
  {
    src: "/images/services/business_service_1.png",
    alt: "Financial Strategy & Planning",
    title: "Financial Strategy & Planning",
    description: "Strategic financial roadmap for business growth"
  },
  {
    src: "/images/services/business_service_2.png",
    alt: "Cash Flow Management",
    title: "Cash Flow Management",
    description: "Optimize working capital and cash flow operations"
  },
  {
    src: "/images/services/business_service_3.png",
    alt: "Financial Reporting & Analysis",
    title: "Financial Reporting & Analysis",
    description: "Comprehensive financial insights and reporting"
  },
  {
    src: "/images/services/business_service_4.png",
    alt: "Budgeting & Forecasting",
    title: "Budgeting & Forecasting",
    description: "Accurate financial planning and projections"
  },
  {
    src: "/images/services/business_service_5.png",
    alt: "Risk Management",
    title: "Risk Management",
    description: "Identify and mitigate business financial risks"
  },
  {
    src: "/images/services/business_service_6.png",
    alt: "Investment Analysis",
    title: "Investment Analysis",
    description: "Strategic investment decisions and ROI analysis"
  },
  {
    src: "/images/services/business_service_7.png",
    alt: "Compliance & Tax Strategy",
    title: "Compliance & Tax Strategy",
    description: "Ensure compliance while optimizing tax efficiency"
  },
  {
    src: "/images/services/business_service_8.png",
    alt: "Growth Strategy",
    title: "Growth Strategy",
    description: "Financial strategies to accelerate business growth"
  }
];

export const pilarIcons: ServiceImage[] = [
  {
    src: "/images/icons/pilar-icon-1.png",
    alt: "Strategic Planning",
    title: "Strategic Planning"
  },
  {
    src: "/images/icons/pilar-icon-2.png",
    alt: "Financial Analysis",
    title: "Financial Analysis"
  },
  {
    src: "/images/icons/pilar-icon-3.png",
    alt: "Risk Management",
    title: "Risk Management"
  },
  {
    src: "/images/icons/pilar-icon-4.png",
    alt: "Performance Monitoring",
    title: "Performance Monitoring"
  },
  {
    src: "/images/icons/pilar-icon-5.png",
    alt: "Compliance",
    title: "Compliance"
  },
  {
    src: "/images/icons/pilar-icon-6.png",
    alt: "Growth Strategy",
    title: "Growth Strategy"
  },
  {
    src: "/images/icons/pilar-icon-7.png",
    alt: "Financial Technology",
    title: "Financial Technology"
  }
];

export const calculatorIcons: ServiceImage[] = [
  {
    src: "/images/icons/calc-icon-1.png",
    alt: "Net Worth Calculator",
    title: "Net Worth Calculator"
  },
  {
    src: "/images/icons/calc-icon-2.png",
    alt: "ROI Calculator",
    title: "ROI Calculator"
  },
  {
    src: "/images/icons/calc-icon-3.png",
    alt: "Cash Flow Calculator",
    title: "Cash Flow Calculator"
  },
  {
    src: "/images/icons/calc-icon-4.png",
    alt: "Investment Calculator",
    title: "Investment Calculator"
  },
  {
    src: "/images/icons/calc-icon-5.png",
    alt: "Retirement Calculator",
    title: "Retirement Calculator"
  },
  {
    src: "/images/icons/calc-icon-6.png",
    alt: "Tax Calculator",
    title: "Tax Calculator"
  }
];
