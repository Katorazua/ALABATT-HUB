import { Icon, type IconName } from "@/components/icon";
import { LearningIllustration } from "@/components/learning-illustration";
import { SiteHeader } from "@/components/site-header";

const benefits: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "compass",
    title: "Flexible Learning",
    description: "Access learning opportunities with greater convenience.",
  },
  {
    icon: "globe",
    title: "Digital Access",
    description: "Find essential academic information and services online.",
  },
  {
    icon: "support",
    title: "Student Support",
    description: "Access guidance and important academic updates.",
  },
];

const services: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "people",
    title: "Student Registration",
    description:
      "Find information about student enrolment and the registration process.",
  },
  {
    icon: "book",
    title: "Course Registration",
    description:
      "Learn about course selection and semester registration information.",
  },
  {
    icon: "credit-card",
    title: "Online Payments",
    description:
      "Discover how approved digital payment services can simplify university transactions.",
  },
  {
    icon: "monitor",
    title: "Learning Resources",
    description:
      "Explore ways to access learning materials and useful academic information.",
  },
];

const steps: { number: string; icon: IconName; title: string; description: string }[] = [
  {
    number: "01",
    icon: "compass",
    title: "Explore",
    description: "Learn about available academic services and information.",
  },
  {
    number: "02",
    icon: "cap",
    title: "Get Started",
    description:
      "Follow the university's approved registration process when available.",
  },
  {
    number: "03",
    icon: "globe",
    title: "Stay Connected",
    description:
      "Access academic information, learning services, and updates.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <section aria-labelledby="hero-title" className="hero-section relative" id="home">
          <div className="container-shell hero-layout grid items-center">
            <div className="hero-copy">
              <span className="university-label">
                <span className="label-rule" />
                REV. FR. MOSES ORSHIO ADASU UNIVERSITY
              </span>
              <h1 id="hero-title">
                Learn Beyond Boundaries. <span>Build Your Future.</span>
              </h1>
              <p className="hero-description">
                The Centre for Open and Distance Learning helps students access
                academic services and learning opportunities through a
                convenient digital platform.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#services">
                  Explore Learning Services <Icon name="arrow-right" />
                </a>
                <a className="button button-secondary" href="/student-portal">
                  Student Portal
                </a>
              </div>
              <div className="hero-trust">
                <span className="trust-check"><Icon name="check" /></span>
                <p>A simpler digital experience for open and distance learning.</p>
              </div>
            </div>
            <LearningIllustration />
          </div>
          <a className="hero-scroll" href="#about">
            <span>Discover CODL</span>
            <Icon name="arrow-down" />
          </a>
        </section>

        <section aria-labelledby="about-title" className="about-section section-space" id="about">
          <div className="container-shell">
            <SectionHeading
              description="Open and distance learning creates more ways to pursue education. CODL is focused on improving access, supporting flexible learning, and making academic services easier to find."
              eyebrow="ABOUT CODL"
              title="Education Designed Around You"
            />
            <div className="benefit-grid grid">
              {benefits.map((benefit, index) => (
                <article className="benefit-card" key={benefit.title}>
                  <span className={`icon-tile icon-tile-${index + 1}`}>
                    <Icon name={benefit.icon} />
                  </span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="services-title"
          className="services-section section-space"
          id="services"
        >
          <div className="container-shell">
            <SectionHeading
              description="A clear place to learn about the academic services and resources being developed for the CODL community."
              eyebrow="LEARNING SERVICES"
              title="Your Academic Services, Connected"
            />
            <div className="service-grid grid">
              {services.map((service, index) => (
                <article className="service-card" key={service.title}>
                  <div className="service-card-top">
                    <span className="service-icon"><Icon name={service.icon} /></span>
                    <span className="service-number">0{index + 1}</span>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a className="text-link" href="#student-portal">
                    Learn more <Icon name="arrow-right" />
                  </a>
                </article>
              ))}
            </div>
            <p className="services-note">
              Service details will be shared as they are confirmed by the university.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="steps-title"
          className="steps-section section-space"
          id="how-it-works"
        >
          <div className="container-shell">
            <SectionHeading
              description="The digital learning journey is designed to be straightforward, with useful information in one connected place."
              eyebrow="HOW IT WORKS"
              title="A Simpler Digital Learning Journey"
            />
            <div className="steps-grid grid">
              {steps.map((step) => (
                <article className="step-card" key={step.number}>
                  <div className="step-top">
                    <span className="step-icon"><Icon name={step.icon} /></span>
                    <span className="step-number">{step.number}</span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="portal-title"
          className="portal-section"
          id="student-portal"
        >
          <div className="container-shell portal-inner">
            <span className="portal-icon"><Icon name="spark" /></span>
            <div className="portal-copy">
              <span className="portal-kicker">FOR THE CODL COMMUNITY</span>
              <h2 id="portal-title">Your Academic Journey Starts Here</h2>
              <p>
                ALABATT-HUB is being developed to make essential academic
                services more accessible through one connected digital platform.
              </p>
              <span className="portal-notice" id="portal-notice">
                Frontend demo only — authentication and student services are not production-ready.
              </span>
            </div>
            <a className="button portal-button" href="/student-portal">
              Student Portal <Icon name="arrow-right" />
            </a>
          </div>
        </section>

        <section
          aria-labelledby="contact-title"
          className="contact-section section-space"
          id="contact"
        >
          <div className="container-shell contact-layout">
            <div className="contact-copy">
              <span className="eyebrow">CONTACT</span>
              <h2 id="contact-title">We’re Here to Help You Find Your Way.</h2>
              <p>
                For official information about the Centre for Open and Distance
                Learning, please use the university’s confirmed contact channels.
              </p>
              <a className="button button-primary contact-button" href="#contact-details">
                Contact information <Icon name="arrow-right" />
              </a>
            </div>
            <address className="contact-card" id="contact-details">
              <div className="contact-identity">
                <span className="contact-mark"><Icon name="cap" /></span>
                <div>
                  <strong>Centre for Open and Distance Learning</strong>
                  <span>Rev. Fr. Moses Orshio Adasu University</span>
                </div>
              </div>
              <div className="contact-detail">
                <Icon name="map-pin" />
                <span>Makurdi, Benue State, Nigeria</span>
              </div>
              <div className="contact-detail contact-placeholder">
                <Icon name="mail" />
                <span>
                  Official contact email or telephone number
                  <small>To be confirmed by the university</small>
                </span>
              </div>
            </address>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container-shell">
          <div className="footer-main">
            <div className="footer-about">
              <a aria-label="ALABATT-HUB, home" className="brand footer-brand" href="#home">
                <span className="brand-mark"><Icon name="cap" /></span>
                <span className="brand-copy">
                  <strong>ALABATT-HUB</strong>
                  <span>Centre for Open and Distance Learning</span>
                </span>
              </a>
              <p>
                A digital learning initiative connecting students with
                accessible academic information and services.
              </p>
            </div>
            <div className="footer-nav-wrap">
              <strong className="footer-nav-title">Quick links</strong>
              <nav aria-label="Footer navigation" className="footer-nav">
                <a href="#about">About CODL</a>
                <a href="#services">Learning Services</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#contact">Contact</a>
              </nav>
            </div>
            <div className="footer-status">
              <span className="status-dot" />
              Platform under development
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} ALABATT-HUB. All rights reserved.</span>
            <span>Rev. Fr. Moses Orshio Adasu University, Makurdi</span>
          </div>
        </div>
      </footer>
    </>
  );
}
