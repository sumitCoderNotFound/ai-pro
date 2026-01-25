// Site Configuration
// Update these values to customize your platform

export const siteConfig = {
  name: 'ConvoAI',
  tagline: 'Meet your AI communication center from the future',
  description: 'Build, deploy, and manage AI agents across voice, video, chat & SMS — with seamless human handoff.',
  url: 'https://convoai.com',
  
  // Contact
  email: 'hello@convoai.com',
  supportEmail: 'support@convoai.com',
  
  // Social Links
  social: {
    twitter: 'https://twitter.com/convoai',
    linkedin: 'https://linkedin.com/company/convoai',
    youtube: 'https://youtube.com/@convoai',
  },
  
  // Navigation
  navigation: {
    main: [
      { name: 'Product', href: '#product', hasDropdown: true },
      { name: 'Solutions', href: '#solutions', hasDropdown: true },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Resources', href: '#resources', hasDropdown: true },
      { name: 'Company', href: '#company', hasDropdown: true },
    ],
    footer: {
      product: [
        { name: 'Voice Agent', href: '#voice' },
        { name: 'Video Agent', href: '#video' },
        { name: 'Chat Agent', href: '#chat' },
        { name: 'SMS Agent', href: '#sms' },
        { name: 'Integrations', href: '#integrations' },
        { name: 'API', href: '#api' },
      ],
      solutions: [
        { name: 'Education', href: '#education' },
        { name: 'Hospitality', href: '#hospitality' },
        { name: 'Healthcare', href: '#healthcare' },
        { name: 'Real Estate', href: '#realestate' },
      ],
      resources: [
        { name: 'Documentation', href: '#docs' },
        { name: 'Blog', href: '#blog' },
        { name: 'Case Studies', href: '#cases' },
        { name: 'Changelog', href: '#changelog' },
      ],
      company: [
        { name: 'About Us', href: '#about' },
        { name: 'Careers', href: '#careers' },
        { name: 'Contact', href: '#contact' },
        { name: 'Partners', href: '#partners' },
      ],
      legal: [
        { name: 'Privacy Policy', href: '#privacy' },
        { name: 'Terms of Service', href: '#terms' },
        { name: 'GDPR', href: '#gdpr' },
      ],
    },
  },
}

// Feature Highlights
export const features = {
  channels: [
    {
      id: 'voice',
      name: 'Voice',
      title: 'Voice AI Agent',
      description: 'Natural, human-like phone conversations at scale with ultra-low latency.',
      icon: 'Phone',
      color: 'primary',
    },
    {
      id: 'video',
      name: 'Video',
      title: 'Video AI Agent',
      description: 'Face-to-face AI interactions for high-trust moments and complex explanations.',
      icon: 'Video',
      color: 'accent',
    },
    {
      id: 'chat',
      name: 'Chat',
      title: 'Chat AI Agent',
      description: 'Intelligent conversations across web and mobile chat experiences.',
      icon: 'MessageSquare',
      color: 'success',
    },
    {
      id: 'sms',
      name: 'SMS',
      title: 'SMS AI Agent',
      description: 'Engage customers through reliable, async text messaging workflows.',
      icon: 'Smartphone',
      color: 'warning',
    },
  ],
  highlights: [
    {
      title: 'Hybrid AI + Human',
      description: 'Seamless handoff between AI and human agents when needed.',
      icon: 'Users',
    },
    {
      title: 'Ultra-Low Latency',
      description: 'Sub-second response times for natural conversations.',
      icon: 'Zap',
    },
    {
      title: 'Multi-Language',
      description: 'Support for 20+ languages out of the box.',
      icon: 'Globe',
    },
    {
      title: 'Enterprise Security',
      description: 'SOC2, HIPAA, and GDPR compliant infrastructure.',
      icon: 'Shield',
    },
  ],
}

// Industry Solutions
export const industries = [
  {
    id: 'education',
    name: 'Education',
    title: 'AI for Education & Student Recruitment',
    description: 'Automate student inquiries, counseling sessions, and application guidance with AI agents that understand the education journey.',
    useCases: [
      'Student inquiry handling',
      'Virtual counseling sessions',
      'Application guidance',
      'Visa & document support',
      'Campus virtual tours',
      'Agent training & support',
    ],
    image: '/images/education.jpg',
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    title: 'AI for Hotels & Hospitality',
    description: 'Elevate guest experience with AI concierge that handles bookings, requests, and support across all channels.',
    useCases: [
      'Virtual concierge',
      'Booking assistance',
      'Room service requests',
      'Check-in & check-out',
      'Complaint resolution',
      'Upselling experiences',
    ],
    image: '/images/hospitality.jpg',
  },
]

// Testimonials
export const testimonials = [
  {
    quote: 'ConvoAI transformed our student recruitment process. We now handle 3x more inquiries with the same team.',
    author: 'Sarah Johnson',
    role: 'Director of Admissions',
    company: 'Global Education Partners',
    image: '/images/testimonial-1.jpg',
  },
  {
    quote: 'Our guests love the instant video support. It\'s like having a concierge available 24/7 in every room.',
    author: 'Michael Chen',
    role: 'Operations Manager',
    company: 'Luxury Hotels Group',
    image: '/images/testimonial-2.jpg',
  },
  {
    quote: 'The hybrid handoff feature is a game-changer. AI handles routine queries, humans handle the rest.',
    author: 'Emily Rodriguez',
    role: 'Customer Success Lead',
    company: 'TechCorp Solutions',
    image: '/images/testimonial-3.jpg',
  },
]

// Pricing Plans
export const pricingPlans = [
  {
    name: 'Starter',
    description: 'Perfect for small teams getting started',
    price: 49,
    period: 'month',
    features: [
      '500 minutes/month',
      '2 AI agents',
      'Voice & Chat channels',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'For growing businesses',
    price: 199,
    period: 'month',
    features: [
      '2,500 minutes/month',
      '10 AI agents',
      'All 4 channels',
      'Advanced analytics',
      'API access',
      'Priority support',
      'Custom integrations',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations',
    price: null,
    period: 'custom',
    features: [
      'Unlimited minutes',
      'Unlimited agents',
      'All channels + Video',
      'Custom AI training',
      'Dedicated account manager',
      'SLA guarantee',
      'On-premise option',
      'SSO & advanced security',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

// Stats
export const stats = [
  { value: '500+', label: 'Businesses' },
  { value: '10M+', label: 'Conversations' },
  { value: '99.9%', label: 'Uptime' },
  { value: '<1s', label: 'Response Time' },
]

// Integration Partners
export const integrations = [
  { name: 'Salesforce', logo: '/images/integrations/salesforce.svg' },
  { name: 'HubSpot', logo: '/images/integrations/hubspot.svg' },
  { name: 'Twilio', logo: '/images/integrations/twilio.svg' },
  { name: 'Slack', logo: '/images/integrations/slack.svg' },
  { name: 'Zapier', logo: '/images/integrations/zapier.svg' },
  { name: 'Google Calendar', logo: '/images/integrations/google-calendar.svg' },
  { name: 'Zoom', logo: '/images/integrations/zoom.svg' },
  { name: 'OpenAI', logo: '/images/integrations/openai.svg' },
]

// FAQ
export const faqs = [
  {
    question: 'What is ConvoAI?',
    answer: 'ConvoAI is an AI-powered communication platform that enables businesses to deploy intelligent agents across voice, video, chat, and SMS channels with seamless human handoff capabilities.',
  },
  {
    question: 'How does the hybrid AI + human handoff work?',
    answer: 'Our platform monitors conversation complexity, sentiment, and custom triggers. When a situation requires human intervention, the AI seamlessly transfers the conversation to a human agent with full context preserved.',
  },
  {
    question: 'What industries do you support?',
    answer: 'We specialize in Education and Hospitality, but our platform is flexible enough for any industry including Healthcare, Real Estate, Financial Services, and more.',
  },
  {
    question: 'Can I customize the AI agent\'s behavior?',
    answer: 'Yes! You can define custom conversation flows, triggers, responses, and integrations through our visual builder. No coding required for most customizations.',
  },
  {
    question: 'What about data security and compliance?',
    answer: 'We are SOC2 Type II, HIPAA, and GDPR compliant. All data is encrypted at rest and in transit. We also offer on-premise deployment for enterprise clients.',
  },
  {
    question: 'How long does it take to get started?',
    answer: 'You can deploy your first AI agent in under 30 minutes using our templates. Custom implementations typically take 1-2 weeks depending on complexity.',
  },
]
