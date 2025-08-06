'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { formatPhoneNumber, validatePhoneNumber } from '@/lib/phone-utils';

export default function ConsultationPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    city: '',
    occupation: '',
    guidance: '',
    industry: '',
    income: '',
    preferred_communication: '',
    consultation_timing: '',
    email: '',
    message: '',
    privacy: false,
    not_job: false,
    marketing_consent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // Auto-hide notification and redirect on success
  useEffect(() => {
    if (showNotification) {
      if (notificationType === 'success') {
        // Start countdown and redirect
        setIsRedirecting(true);
        let countdown = 5;
        setRedirectCountdown(countdown);
        
        const countdownInterval = setInterval(() => {
          countdown -= 1;
          setRedirectCountdown(countdown);
          
          if (countdown <= 0) {
            clearInterval(countdownInterval);
            setShowNotification(false);
            setIsRedirecting(false);
            
            // Show redirect notification
            const redirectNotification = document.createElement('div');
            redirectNotification.style.cssText = `
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: 2000;
              padding: 2rem;
              border-radius: 12px;
              background: linear-gradient(135deg, #4f46e5, #7c3aed);
              color: white;
              font-size: 1.1rem;
              font-weight: 600;
              text-align: center;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
              animation: fadeInScale 0.3s ease-out;
              max-width: 90%;
              min-width: 300px;
            `;
            redirectNotification.innerHTML = `
              <div style="margin-bottom: 1rem;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">🚀</div>
                <div>Redirecting you back...</div>
                <div style="font-size: 0.9rem; opacity: 0.9; margin-top: 0.5rem;">
                  Thank you for your submission!
                </div>
              </div>
            `;
            
            document.body.appendChild(redirectNotification);
            
            // Remove redirect notification and navigate after 2 seconds
            setTimeout(() => {
              redirectNotification.remove();
              router.back();
            }, 2000);
          }
        }, 1000);
        
        return () => clearInterval(countdownInterval);
      } else {
        // Hide error notification after 7 seconds
        const timer = setTimeout(() => {
          setShowNotification(false);
        }, 7000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [showNotification, notificationType, router]);

  // Function to show notification
  const showNotificationMessage = (message: string, type: 'success' | 'error') => {
    setSubmitMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };

  // Name validation (only letters and spaces)
  const formatName = (value: string) => {
    return value.replace(/[^a-zA-Z\s]/g, '');
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Not needed anymore since we only have India
    return;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'phone') {
      // Handle phone separately
      return;
    } else if (name === 'countryCode') {
      // Handle country change separately
      return;
    } else {
      let processedValue = value;
      
      // Apply formatting based on field type
      if (name === 'name') {
        processedValue = formatName(value);
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value;
    if (email && !validateEmail(email)) {
      e.target.style.borderColor = '#ff6b6b';
    } else if (email) {
      e.target.style.borderColor = '#28a745';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitMessage('');
    
    // Comprehensive validation
    let isValid = true;
    const errorMessages: string[] = [];
    
    // Validate required fields
    const requiredFields = ['name', 'phone', 'city', 'occupation', 'email'];
    requiredFields.forEach(fieldName => {
      const element = document.getElementById(fieldName) as HTMLInputElement;
      const fieldValue = formData[fieldName as keyof typeof formData] as string;
      
      if (!fieldValue || fieldValue.trim() === '') {
        isValid = false;
        errorMessages.push(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
        if (element) {
          element.style.borderColor = '#ff6b6b';
        }
      } else {
        if (element) {
          element.style.borderColor = '#28a745';
        }
      }
    });

    // Validate checkboxes
    if (!formData.privacy) {
      isValid = false;
      errorMessages.push('You must accept the privacy policy');
    }
    
    if (!formData.not_job) {
      isValid = false;
      errorMessages.push('You must confirm this is not a job enquiry');
    }

    // Validate email format
    if (formData.email && !validateEmail(formData.email)) {
      isValid = false;
      errorMessages.push('Please enter a valid email address');
      const emailElement = document.getElementById('email') as HTMLInputElement;
      if (emailElement) {
        emailElement.style.borderColor = '#ff6b6b';
      }
    }

    // Validate phone format
    if (formData.phone && !validatePhoneNumber(formData.phone, '+91')) {
      isValid = false;
      errorMessages.push('Please enter a valid phone number for India (format: +91 XXXXX XXXXX)');
      const phoneElement = document.getElementById('phone') as HTMLInputElement;
      if (phoneElement) {
        phoneElement.style.borderColor = '#ff6b6b';
      }
    }

    // Validate name (only letters and spaces)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (formData.name && !nameRegex.test(formData.name)) {
      isValid = false;
      errorMessages.push('Name should only contain letters and spaces');
      const nameElement = document.getElementById('name') as HTMLInputElement;
      if (nameElement) {
        nameElement.style.borderColor = '#ff6b6b';
      }
    }

    if (!isValid) {
      setSubmitError(errorMessages.join('. '));
      setIsSubmitting(false);
      return;
    }

    // Prepare data for submission
    const submissionData = {
      ...formData,
      email: formData.email.toLowerCase().trim(),
      name: formData.name.trim(),
      city: formData.city.trim(),
      occupation: formData.occupation.trim(),
      age: formData.age ? formData.age.trim() : '',
      guidance: formData.guidance ? formData.guidance.trim() : '',
      industry: formData.industry ? formData.industry.trim() : '',
      income: formData.income ? formData.income.trim() : '',
      preferred_communication: formData.preferred_communication ? formData.preferred_communication.trim() : '',
      consultation_timing: formData.consultation_timing ? formData.consultation_timing.trim() : '',
      message: formData.message ? formData.message.trim() : '',
    };

    console.log('Submitting consultation data:', submissionData);
    console.log('Phone number being sent:', formData.phone);

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      console.log('Submission successful:', result);
      showNotificationMessage(`Thank you! Your consultation request has been submitted successfully. Redirecting you back in 5 seconds...`, 'success');
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        age: '',
        city: '',
        occupation: '',
        guidance: '',
        industry: '',
        income: '',
        preferred_communication: '',
        consultation_timing: '',
        email: '',
        message: '',
        privacy: false,
        not_job: false,
        marketing_consent: false
      });

      // Reset form styling
      [...requiredFields, 'email', 'phone', 'name'].forEach(fieldName => {
        const element = document.getElementById(fieldName) as HTMLInputElement;
        if (element && element.style) {
          element.style.borderColor = '';
        }
      });

    } catch (error) {
      console.error('Submission error:', error);
      showNotificationMessage(error instanceof Error ? error.message : 'Failed to submit consultation request. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)]">
      <Header />
      
      {/* Top-right notification */}
      {showNotification && (
        <div className={`notification-enhanced ${notificationType === 'success' ? 'notification-success' : 'notification-error'}`}>
          <div className="notification-content">
            <div className="notification-icon">
              {notificationType === 'success' ? '✅' : '❌'}
            </div>
            <div className="notification-text">
              <strong>{notificationType === 'success' ? 'Success!' : 'Error!'}</strong>
              <div>{submitMessage}</div>
              {notificationType === 'success' && isRedirecting && (
                <div className="notification-countdown">
                  ⏱ Redirecting in {redirectCountdown} seconds...
                </div>
              )}
            </div>
            <button 
              className="notification-close"
              onClick={() => setShowNotification(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      <div className="consultation-page">
        <div className="container">
          <main className="content-wrapper">
            <section className="intro-text">
              <h1>Welcome<span className="highlight">!</span></h1>
              <h2>Let's Build a Stronger<br />Financial Future</h2>
              <p>
                considering us as your strategic finance partner.
                Whether you're navigating growth, looking to raise
                capital, or need clarity on your financial operations,
                you're in the right place.
              </p>
              <p>
                Our Virtual CFOs work with startups, MSMEs, and
                scaling businesses to unlock efficiency, ensure
                compliance, and enable smart decision-making.
              </p>
              <p>
                Simply fill out the form and we'll schedule your free
                1-on-1 consultation with our expert team.
              </p>
            </section>

            <section className="form-container">
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="name" className="required-field">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Enter your full name"
                    maxLength={100}
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="required-field">Phone Number</label>
                  <div className="phone-input-container">
                    <div className="country-prefix">
                      <span>🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder="98765 43210"
                      maxLength={11}
                      value={formData.phone.startsWith('+91 ') ? formData.phone.replace('+91 ', '').replace(/\s/g, '') : formData.phone.replace(/\s/g, '')}
                      onChange={(e) => {
                        let value = e.target.value;
                        // Remove any non-digit characters
                        value = value.replace(/\D/g, '');
                        
                        // Limit to 10 digits max for Indian mobile numbers
                        if (value.length > 10) {
                          value = value.slice(0, 10);
                        }
                        
                        // Format the number as +91 XXXXX XXXXX
                        let formatted = '';
                        if (value.length > 0) {
                          if (value.length <= 5) {
                            formatted = `+91 ${value}`;
                          } else {
                            formatted = `+91 ${value.slice(0, 5)} ${value.slice(5)}`;
                          }
                        }
                        
                        setFormData(prev => ({
                          ...prev,
                          phone: formatted
                        }));
                        
                        // Validate phone number
                        if (value.length >= 10) {
                          const isValid = validatePhoneNumber(formatted, '+91');
                          if (!isValid) {
                            setPhoneError('Invalid phone number format for India');
                          } else {
                            setPhoneError('');
                          }
                        } else if (value.length > 0) {
                          setPhoneError('');
                        }
                      }}
                      onFocus={(e) => {
                        // Allow full editing by showing just the number part
                        const numberOnly = formData.phone.replace('+91 ', '').replace(/\s/g, '');
                        e.target.value = numberOnly;
                      }}
                      onBlur={(e) => {
                        // Reformat on blur
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length > 10) {
                          value = value.slice(0, 10);
                        }
                        
                        let formatted = '';
                        if (value.length > 0) {
                          if (value.length <= 5) {
                            formatted = `+91 ${value}`;
                          } else {
                            formatted = `+91 ${value.slice(0, 5)} ${value.slice(5)}`;
                          }
                        }
                        
                        setFormData(prev => ({
                          ...prev,
                          phone: formatted
                        }));
                      }}
                      style={{ flex: 1 }}
                    />
                  </div>
                  {phoneError && (
                    <div style={{
                      color: '#ff6b6b',
                      fontSize: '0.85rem',
                      marginTop: '0.25rem'
                    }}>
                      {phoneError}
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      min="18"
                      max="100"
                      placeholder="Min. age 18"
                      value={formData.age}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="city" className="required-field">City</label>
                    <select
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Select City</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="delhi">Delhi</option>
                      <option value="bangalore">Bangalore</option>
                      <option value="hyderabad">Hyderabad</option>
                      <option value="chennai">Chennai</option>
                      <option value="kolkata">Kolkata</option>
                      <option value="pune">Pune</option>
                      <option value="ahmedabad">Ahmedabad</option>
                      <option value="jaipur">Jaipur</option>
                      <option value="surat">Surat</option>
                      <option value="lucknow">Lucknow</option>
                      <option value="kanpur">Kanpur</option>
                      <option value="nagpur">Nagpur</option>
                      <option value="indore">Indore</option>
                      <option value="thane">Thane</option>
                      <option value="bhopal">Bhopal</option>
                      <option value="visakhapatnam">Visakhapatnam</option>
                      <option value="pimpri_chinchwad">Pimpri-Chinchwad</option>
                      <option value="patna">Patna</option>
                      <option value="vadodara">Vadodara</option>
                      <option value="ghaziabad">Ghaziabad</option>
                      <option value="ludhiana">Ludhiana</option>
                      <option value="agra">Agra</option>
                      <option value="nashik">Nashik</option>
                      <option value="faridabad">Faridabad</option>
                      <option value="meerut">Meerut</option>
                      <option value="rajkot">Rajkot</option>
                      <option value="kalyan_dombivali">Kalyan-Dombivali</option>
                      <option value="vasai_virar">Vasai-Virar</option>
                      <option value="varanasi">Varanasi</option>
                      <option value="srinagar">Srinagar</option>
                      <option value="aurangabad">Aurangabad</option>
                      <option value="dhanbad">Dhanbad</option>
                      <option value="amritsar">Amritsar</option>
                      <option value="navi_mumbai">Navi Mumbai</option>
                      <option value="allahabad">Allahabad</option>
                      <option value="ranchi">Ranchi</option>
                      <option value="howrah">Howrah</option>
                      <option value="coimbatore">Coimbatore</option>
                      <option value="jabalpur">Jabalpur</option>
                      <option value="gwalior">Gwalior</option>
                      <option value="vijayawada">Vijayawada</option>
                      <option value="jodhpur">Jodhpur</option>
                      <option value="madurai">Madurai</option>
                      <option value="raipur">Raipur</option>
                      <option value="kota">Kota</option>
                      <option value="guwahati">Guwahati</option>
                      <option value="chandigarh">Chandigarh</option>
                      <option value="solapur">Solapur</option>
                      <option value="hubballi_dharwad">Hubballi-Dharwad</option>
                      <option value="tiruchirappalli">Tiruchirappalli</option>
                      <option value="bareilly">Bareilly</option>
                      <option value="mysore">Mysore</option>
                      <option value="tiruppur">Tiruppur</option>
                      <option value="gurgaon">Gurgaon</option>
                      <option value="aligarh">Aligarh</option>
                      <option value="jalandhar">Jalandhar</option>
                      <option value="bhubaneswar">Bhubaneswar</option>
                      <option value="salem">Salem</option>
                      <option value="warangal">Warangal</option>
                      <option value="mira_bhayandar">Mira-Bhayandar</option>
                      <option value="thiruvananthapuram">Thiruvananthapuram</option>
                      <option value="bhiwandi">Bhiwandi</option>
                      <option value="saharanpur">Saharanpur</option>
                      <option value="guntur">Guntur</option>
                      <option value="amravati">Amravati</option>
                      <option value="bikaner">Bikaner</option>
                      <option value="noida">Noida</option>
                      <option value="jamshedpur">Jamshedpur</option>
                      <option value="bhilai_nagar">Bhilai Nagar</option>
                      <option value="cuttack">Cuttack</option>
                      <option value="firozabad">Firozabad</option>
                      <option value="kochi">Kochi</option>
                      <option value="bhavnagar">Bhavnagar</option>
                      <option value="dehradun">Dehradun</option>
                      <option value="durgapur">Durgapur</option>
                      <option value="asansol">Asansol</option>
                      <option value="nanded_waghala">Nanded-Waghala</option>
                      <option value="kolhapur">Kolhapur</option>
                      <option value="ajmer">Ajmer</option>
                      <option value="akola">Akola</option>
                      <option value="gulbarga">Gulbarga</option>
                      <option value="jamnagar">Jamnagar</option>
                      <option value="ujjain">Ujjain</option>
                      <option value="loni">Loni</option>
                      <option value="siliguri">Siliguri</option>
                      <option value="jhansi">Jhansi</option>
                      <option value="ulhasnagar">Ulhasnagar</option>
                      <option value="nellore">Nellore</option>
                      <option value="jammu">Jammu</option>
                      <option value="sangli_miraj_kupwad">Sangli-Miraj-Kupwad</option>
                      <option value="belgaum">Belgaum</option>
                      <option value="mangalore">Mangalore</option>
                      <option value="ambattur">Ambattur</option>
                      <option value="tirunelveli">Tirunelveli</option>
                      <option value="malegaon">Malegaon</option>
                      <option value="gaya">Gaya</option>
                      <option value="jalgaon">Jalgaon</option>
                      <option value="udaipur">Udaipur</option>
                      <option value="maheshtala">Maheshtala</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="occupation" className="required-field">Occupation</label>
                  <select
                    id="occupation"
                    name="occupation"
                    required
                    value={formData.occupation}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select Occupation</option>
                    <option value="student">Student</option>
                    <option value="salaried_employee">Salaried Employee</option>
                    <option value="business_owner">Business Owner</option>
                    <option value="entrepreneur">Entrepreneur</option>
                    <option value="freelancer">Freelancer</option>
                    <option value="consultant">Consultant</option>
                    <option value="professional">Professional (Doctor, Lawyer, CA, etc.)</option>
                    <option value="government_employee">Government Employee</option>
                    <option value="teacher_professor">Teacher/Professor</option>
                    <option value="engineer">Engineer</option>
                    <option value="software_developer">Software Developer</option>
                    <option value="manager">Manager/Executive</option>
                    <option value="sales_marketing">Sales & Marketing</option>
                    <option value="finance_banking">Finance & Banking</option>
                    <option value="healthcare">Healthcare Professional</option>
                    <option value="creative_artist">Creative/Artist</option>
                    <option value="real_estate">Real Estate</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="retail">Retail</option>
                    <option value="hospitality">Hospitality</option>
                    <option value="transportation">Transportation</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="retired">Retired</option>
                    <option value="homemaker">Homemaker</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="guidance">Service Interested In</label>
                  <select
                    id="guidance"
                    name="guidance"
                    value={formData.guidance}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Type of service interested in?</option>
                    <option value="individual_financial_planning">Individual Financial Planning</option>
                    <option value="tax_planning_filing">Tax Planning & Filing</option>
                    <option value="investment_advisory">Investment Advisory</option>
                    <option value="retirement_planning">Retirement Planning</option>
                    <option value="debt_management">Debt Management</option>
                    <option value="business_cfo_services">Business/Virtual CFO Services</option>
                    <option value="startup_financial_planning">Startup Financial Planning</option>
                    <option value="fundraising_support">Fundraising Support</option>
                    <option value="compliance_reporting">Compliance & Reporting</option>
                    <option value="financial_analysis">Financial Analysis</option>
                    <option value="estate_planning">Estate Planning</option>
                    <option value="insurance_review">Insurance Portfolio Review</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="industry">Industry</label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select Industry</option>
                    <option value="technology">Technology & Software</option>
                    <option value="finance_banking">Finance & Banking</option>
                    <option value="healthcare">Healthcare & Pharmaceuticals</option>
                    <option value="education">Education & Training</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="retail_ecommerce">Retail & E-commerce</option>
                    <option value="real_estate">Real Estate & Construction</option>
                    <option value="hospitality_tourism">Hospitality & Tourism</option>
                    <option value="transportation_logistics">Transportation & Logistics</option>
                    <option value="agriculture_food">Agriculture & Food Processing</option>
                    <option value="energy_utilities">Energy & Utilities</option>
                    <option value="telecommunications">Telecommunications</option>
                    <option value="media_entertainment">Media & Entertainment</option>
                    <option value="automotive">Automotive</option>
                    <option value="aerospace_defense">Aerospace & Defense</option>
                    <option value="chemicals_materials">Chemicals & Materials</option>
                    <option value="textiles_apparel">Textiles & Apparel</option>
                    <option value="mining_metals">Mining & Metals</option>
                    <option value="consulting">Consulting Services</option>
                    <option value="legal_services">Legal Services</option>
                    <option value="government_public">Government & Public Sector</option>
                    <option value="non_profit">Non-Profit & NGO</option>
                    <option value="sports_fitness">Sports & Fitness</option>
                    <option value="beauty_wellness">Beauty & Wellness</option>
                    <option value="environmental">Environmental Services</option>
                    <option value="research_development">Research & Development</option>
                    <option value="insurance">Insurance</option>
                    <option value="advertising_marketing">Advertising & Marketing</option>
                    <option value="architecture_design">Architecture & Design</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="income">Annual Income</label>
                    <select
                      id="income"
                      name="income"
                      value={formData.income}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Select Income</option>
                      <option value="below_3_lakh">Below ₹3 Lakh</option>
                      <option value="3_5_lakh">₹3 - ₹5 Lakh</option>
                      <option value="5_10_lakh">₹5 - ₹10 Lakh</option>
                      <option value="10_15_lakh">₹10 - ₹15 Lakh</option>
                      <option value="15_25_lakh">₹15 - ₹25 Lakh</option>
                      <option value="25_50_lakh">₹25 - ₹50 Lakh</option>
                      <option value="50_1_crore">₹50 Lakh - ₹1 Crore</option>
                      <option value="1_2_crore">₹1 - ₹2 Crore</option>
                      <option value="2_5_crore">₹2 - ₹5 Crore</option>
                      <option value="above_5_crore">Above ₹5 Crore</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="preferred_communication">Preferred Contact</label>
                    <select
                      id="preferred_communication"
                      name="preferred_communication"
                      value={formData.preferred_communication}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Preferred method</option>
                      <option value="phone">Phone Call</option>
                      <option value="email">Email</option>
                      <option value="video_call">Video Call</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="in_person">In-Person Meeting</option>
                      <option value="no_preference">No Preference</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="consultation_timing">Preferred Consultation Time</label>
                  <select
                    id="consultation_timing"
                    name="consultation_timing"
                    value={formData.consultation_timing}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Preferred Consultation Time</option>
                    <option value="morning_9_12">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon_12_4">Afternoon (12 PM - 4 PM)</option>
                    <option value="evening_4_7">Evening (4 PM - 7 PM)</option>
                    <option value="night_7_9">Evening (7 PM - 9 PM)</option>
                    <option value="weekend">Weekend</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="required-field">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="your.email@example.com"
                    maxLength={100}
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleEmailBlur}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Additional Message (Optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="Tell us more about your financial goals or specific questions..."
                    maxLength={500}
                    value={formData.message}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    required
                    checked={formData.privacy}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="privacy" className="required-field">
                    I have read and agree to the <a href="/privacy-policy" target="_blank">Privacy Policy</a>
                  </label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="not-job"
                    name="not_job"
                    required
                    checked={formData.not_job}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="not-job" className="required-field">
                    I confirm this is not a job application.
                  </label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="marketing"
                    name="marketing_consent"
                    checked={formData.marketing_consent}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="marketing">
                    I agree to receive marketing communications and updates about services.
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Schedule Consultation'}
                </button>
              </form>
            </section>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
