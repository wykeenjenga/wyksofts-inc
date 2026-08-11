export const services = [
  { number: "01", title: "Mobile apps", description: "Fast, intuitive iOS and Android experiences built around your customers and business goals.", tags: ["iOS", "Android", "Cross-platform"] },
  { number: "02", title: "Websites & web apps", description: "High-performing marketing sites, platforms, and web products that look sharp on every screen.", tags: ["Web design", "Frontend", "Web platforms"] },
  { number: "03", title: "Custom software", description: "Purpose-built tools that replace manual work, connect teams, and help your operation scale.", tags: ["Business systems", "Automation", "Dashboards"] },
  { number: "04", title: "APIs & integrations", description: "Reliable connections between your products, payment providers, data, and third-party services.", tags: ["APIs", "Payments", "System integration"] },
  { number: "05", title: "AI & cloud", description: "Practical AI features and dependable cloud foundations designed for real business value.", tags: ["AI solutions", "Cloud", "Architecture"] },
] as const;

export const process = [
  { step: "Discover", text: "We get clear on the problem, the people using the product, and what success should look like." },
  { step: "Design", text: "We map the experience, test the important flows, and shape a visual system that fits your brand." },
  { step: "Build", text: "We turn the plan into dependable software, sharing progress early and often along the way." },
  { step: "Launch", text: "We ship with care, measure what matters, and keep improving as your product and business grow." },
] as const;

export const projects = [
  { number: "01", name: "Mynomp", type: "Product website", summary: "An accountability-powered focus platform designed to turn work sessions into lasting momentum.", href: "https://www.mynomp.com/", image: "/projects/mynomp-mark.svg", imageAlt: "Mynomp Spark product mark", imageWidth: 512, imageHeight: 512, challenge: "Turn focused work into a repeatable, social habit.", delivered: "Product experience, accountability flows, and a responsive web platform.", capabilities: ["Product design", "Web platform", "Focus experience"] },
  { number: "02", name: "City BBQ App", type: "iOS & iPadOS app", summary: "A customer-focused mobile experience designed around convenient ordering and brand engagement.", href: "https://apps.apple.com/us/app/city-barbeque/id979145837", image: "/projects/city-barbeque.jpg", imageAlt: "City Barbeque rewards and mobile ordering app interface", imageWidth: 552, imageHeight: 414, challenge: "Make ordering, rewards, and repeat purchases feel effortless.", delivered: "An iOS and iPadOS ordering experience with loyalty at its core.", capabilities: ["iOS", "iPadOS", "Ordering", "Rewards"] },
  { number: "03", name: "SlimChickens App", type: "iOS app", summary: "A polished restaurant app experience that brings menu discovery and customer interaction together.", href: "https://apps.apple.com/us/app/slim-chickens/id1244055810", image: "/projects/slim-chickens.jpg", imageAlt: "Slim Chickens application icon", imageWidth: 512, imageHeight: 512, challenge: "Bring ordering, favourites, offers, and rewards into one experience.", delivered: "A customer-facing iOS application designed for speed and repeat use.", capabilities: ["iOS", "Mobile ordering", "Offers", "Loyalty"] },
] as const;

export const packages = [
  { name: "Launch", price: "From $100", type: "Landing page or focused website", description: "A focused digital launch for a clear offer, campaign, or early-stage business.", items: ["Responsive build", "Core SEO setup", "Contact conversion path"] },
  { name: "Grow", price: "Scoped quotation", type: "Business website or web application", description: "A stronger web presence or workflow designed around business growth.", items: ["Product strategy", "Custom interface", "Integrations & analytics"] },
  { name: "Product", price: "Scoped quotation", type: "Mobile app or custom software", description: "A complete product engagement for ambitious, operationally important ideas.", items: ["Discovery & UX", "Software engineering", "Launch & support plan"] },
] as const;

export const faqs = [
  { question: "How much does a project cost?", answer: "Focused landing-page work starts from $100. Business websites, mobile apps, web platforms, and custom software are quoted after the scope, integrations, content, timeline, and support needs are understood." },
  { question: "How long will my project take?", answer: "A focused landing page may take around one to three weeks when content and feedback are ready. Larger websites and software products are planned in milestones, with a realistic delivery schedule included in the quotation." },
  { question: "Can you improve an existing website or app?", answer: "Yes. We can review an existing product, identify the highest-value improvements, modernize the interface, add features, improve performance, or help stabilize its technical foundation." },
  { question: "Who owns the finished work?", answer: "Ownership is defined in the accepted agreement. Unless stated otherwise, ownership of custom deliverables transfers after full payment, while third-party and open-source components remain under their original licences." },
  { question: "Do you provide maintenance and support?", answer: "Yes. Launch assistance, defect correction, ongoing maintenance, feature development, monitoring, and service levels can be included in the project or arranged as a separate support plan." },
  { question: "How do payments work?", answer: "Payment structure depends on the project. Larger engagements are normally divided into agreed milestones, while smaller focused work may use a simpler payment schedule. The quotation confirms the exact arrangement before work begins." },
  { question: "Will you keep my idea confidential?", answer: "We treat project information as confidential and can review a reasonable non-disclosure agreement before sensitive discovery. Access to project materials is limited to people involved in delivering the engagement." },
  { question: "Can WykSofts work with teams outside Nairobi?", answer: "Yes. We are based at Mirage Towers in Nairobi and collaborate remotely with clients and teams worldwide through scheduled calls, written updates, shared project tools, and milestone reviews." },
] as const;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "WykSofts Inc.",
  url: "https://wyksoftsinc.com/",
  email: "hello@wyksoftsinc.com",
  telephone: "+254703285070",
  priceRange: "From USD 100",
  description: "Software development company building mobile apps, websites, custom software, integrations, AI solutions, and cloud platforms.",
  address: { "@type": "PostalAddress", streetAddress: "Mirage Towers", addressLocality: "Nairobi", addressCountry: "KE" },
  areaServed: "Worldwide",
  founder: { "@type": "Person", name: "Wycliff Njenga", jobTitle: "Founder & CEO", url: "https://wyksoftsinc.com/about/", sameAs: ["https://www.linkedin.com/in/wycliff-njenga-5973b512a/", "https://github.com/wykeenjenga"] },
};
