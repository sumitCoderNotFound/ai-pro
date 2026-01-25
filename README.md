# ConvoAI Platform

AI-powered hybrid communication platform for Education & Hospitality. Build, deploy, and manage AI agents across voice, video, chat & SMS with seamless human handoff.

## 🚀 Features

- **Multi-Channel Communication**: Voice, Video, Chat, and SMS AI agents
- **Hybrid AI + Human Handoff**: Seamless transfer when AI reaches its limits
- **Industry-Specific Solutions**: Built for Education and Hospitality
- **Visual Flow Builder**: Drag-and-drop conversation flow design
- **Real-Time Analytics**: Performance tracking and insights
- **Enterprise Security**: SOC2, HIPAA, and GDPR compliant

## 📁 Project Structure

```
convoai-platform/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Images, icons, etc.
│   │   ├── icons/
│   │   └── images/
│   ├── components/
│   │   ├── forms/              # Form components
│   │   ├── layout/             # Layout components (Navbar, Footer, etc.)
│   │   ├── sections/           # Landing page sections
│   │   └── ui/                 # Reusable UI components
│   ├── config/                 # App configuration
│   │   └── site.config.js      # Site-wide settings
│   ├── context/                # React Context providers
│   ├── hooks/                  # Custom React hooks
│   ├── pages/
│   │   ├── private/            # Authenticated pages
│   │   └── public/             # Public pages
│   ├── styles/
│   │   └── globals.css         # Global styles & Tailwind
│   ├── utils/                  # Utility functions
│   │   └── helpers.js
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🛠 Tech Stack

- **React 18** - UI Framework
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Framer Motion** - Animations (ready to use)
- **clsx** - Conditional classes

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd convoai-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎨 Customization

### Site Configuration

Edit `src/config/site.config.js` to customize:

- Site name and tagline
- Navigation links
- Features and pricing
- Social links
- FAQ content

### Theme & Colors

Edit `tailwind.config.js` to customize:

- Brand colors (primary, accent)
- Typography (fonts, sizes)
- Spacing and borders
- Shadows and animations

### Components

All UI components are in `src/components/ui/`:

- `Button` - Buttons with variants
- `Card` - Card containers
- `Input` - Form inputs
- `Badge` - Status badges
- `Section` - Page sections
- `Container` - Layout container
- `Logo` - Brand logo

## 📄 Pages

### Public Pages
- `/` - Landing page
- `/pricing` - Pricing page
- `/login` - Login page
- `/signup` - Signup page

### Private Pages (Requires Auth)
- `/dashboard` - Main dashboard
- `/agents` - Manage AI agents
- `/conversations` - View conversations
- `/settings` - Account settings

## 🔧 Adding New Features

### Adding a New Page

1. Create the page component in `src/pages/public/` or `src/pages/private/`
2. Add the route in `src/App.jsx`
3. Add navigation link in `src/config/site.config.js`

### Adding a New Component

1. Create the component in `src/components/ui/`
2. Export it from `src/components/ui/index.js`
3. Use it anywhere: `import { ComponentName } from '@/components/ui'`

## 📦 Path Aliases

The project uses path aliases for clean imports:

- `@/` → `src/`
- `@components/` → `src/components/`
- `@pages/` → `src/pages/`
- `@hooks/` → `src/hooks/`
- `@utils/` → `src/utils/`
- `@config/` → `src/config/`
- `@assets/` → `src/assets/`
- `@styles/` → `src/styles/`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary. All rights reserved.

---

Built with ❤️ for the future of AI communication.
