# 💰 Qattah App - Smart Bill Splitter

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0-blue?style=for-the-badge&logo=github&logoColor=white" alt="Version">
  <img src="https://img.shields.io/badge/react-18%2B-blue?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/typescript-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/tailwindcss-3.4%2B-cyan?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge&logo=github&logoColor=white" alt="License">
  <img src="https://img.shields.io/badge/pwa-ready-orange?style=for-the-badge&logo=progressive-web-apps&logoColor=white" alt="PWA">
  <img src="https://img.shields.io/badge/vibe_coded-purple?style=for-the-badge&logo=sparkles&logoColor=white" alt="Vibe Coded">
</p>

<p align="center">
  <em>A modern, intuitive bill splitter application that makes dividing restaurant bills among friends effortless and fair - Now vibe-coded!</em>
</p>

<p align="center">
  <!-- <a href="#-demo"><strong>🎮 Live Demo</strong></a> • -->
  <a href="#-installation"><strong>📖 Installation</strong></a> •
  <a href="#-features"><strong>✨ Features</strong></a> •
  <a href="#-use-cases"><strong>🎯 Use Cases</strong></a>
</p>

---

## 🎯 **About This Project**

**Qattah App** is a sophisticated web application designed to solve the common problem of splitting restaurant bills among groups of friends and colleagues. What started as a simple calculator has evolved into a comprehensive bill-splitting solution with advanced features, intuitive design, and seamless user experience.

**🌟 Now Vibe-Coded:** This project has been meticulously crafted with attention to detail, intuitive design, and a focus on user experience - that's the essence of vibe-coding!

---

## ✨ Features

### 💳 **Smart Bill Splitting**
- **Multi-Person Support** 👥 - Handle groups from 3 to 15 people
- **Item-Level Assignment** 🍽️ - Assign specific dishes to specific people
- **Automatic Cost Division** 🧮 - Intelligently split shared items among participants
- **Real-time Calculations** ⚡ - Instant updates as you make changes

### 🎨 **Modern UI/UX**
- **Responsive Design** 📱 - Works seamlessly on all devices
- **Dark/Light Mode** 🌙 - Toggle between themes with preference saving
- **Arabic RTL Support** 🕌 - Complete right-to-left interface
- **Intuitive Interface** 🎯 - Easy-to-use with minimal learning curve
- **Real-time Updates** ⚡ - Live calculations without page refreshes

### 📊 **Advanced Functionality**
- **CSV Export** 📄 - Export complete bill data for accounting
- **Print Receipts** 🖨️ - Generate beautiful, printable receipts
- **Shareable Links** 🔗 - Share bill states via encrypted URLs
- **Multi-Currency Support** 💰 - Saudi Riyal and Kuwaiti Dinar
- **Offline Mode** 📱 - PWA support for use without internet

### 🔧 **Technical Excellence**
- **TypeScript** 📝 - Type-safe development with full IntelliSense
- **Performance Optimized** ⚡ - Code splitting and lazy loading
- **Error Handling** 🛡️ - Comprehensive error boundaries and user feedback
- **Accessibility** ♿ - Full ARIA compliance and keyboard navigation

---

## 🎯 **Use Cases**

### 🍽️ **Restaurant Dining**
- Split complex restaurant bills among friends
- Handle shared appetizers and group orders
- Calculate individual portions fairly
- Generate receipts for expense reports

### 👥 **Group Activities**
- Split costs for group outings and events
- Track shared expenses among friends
- Handle different payment methods
- Maintain expense history

### 💼 **Business Use**
- Split team lunch expenses
- Handle client entertainment costs
- Generate expense reports
- Track team dining budgets

### 🏠 **Family Gatherings**
- Divide family restaurant bills fairly
- Handle different dietary requirements
- Track family dining expenses
- Generate family expense reports

---

## 🚀 Quick Start

### 📋 **Prerequisites**
```bash
# Node.js 18+
node --version

# npm or yarn
npm --version

# Git (for cloning)
git --version
```

### 🛠️ **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/Fahad-BA/QattahApp.git
cd QattahApp
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
npm run preview
```

### 🔧 **Configuration**

Create a `.env` file in the project root:

```env
# Application Configuration
VITE_APP_NAME=Qattah App
VITE_APP_VERSION=1.0.0

# Currency Settings
VITE_DEFAULT_CURRENCY=SAR
VITE_SUPPORTED_CURRENCIES=SAR,KWD

# PWA Configuration
VITE_ENABLE_PWA=true
VITE_APP_SHORT_NAME=Qattah

# Analytics (Optional)
VITE_ENABLE_ANALYTICS=false
```

---

## 📊 **Application Features**

### 💳 **Bill Management**
- **Dynamic People Addition** - Add up to 15 people with one click
- **Comprehensive Dish Management** - Add dishes with prices and quantities
- **Smart Assignment System** - Assign dishes to multiple people automatically
- **Real-time Totals** - See individual and group totals instantly

### 📱 **Mobile Experience**
- **Touch-Friendly Interface** - Optimized for mobile interaction
- **Gesture Support** - Swipe and tap interactions
- **Responsive Tables** - Perfect viewing on all screen sizes
- **Offline Capabilities** - Works without internet connection

### 🎨 **Customization Options**
- **Theme Switching** - Toggle between light and dark modes
- **Currency Selection** - Choose between SAR and KWD
- **Language Support** - Complete Arabic interface
- **Color Schemes** - Multiple theme options

---

## 🛠️ **Technical Details**

### 🏗️ **Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │────│   PWA Service   │────│   Local Storage │
│ (SPA + Router)  │    │   (Offline)     │    │   (Data Store)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                │
                    ┌─────────────────┐
                    │  TypeScript     │
                    │  (Type Safety)  │
                    └─────────────────┘
```

### 🎯 **Key Technologies**
- **React 18** - Modern UI framework with concurrent features
- **TypeScript** - Type-safe development and better IDE support
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Workbox** - PWA service worker management

### 🔧 **Development Commands**
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run tests
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checker
```

---

## 📦 **Deployment**

### 🌐 **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 🚀 **Netlify**
```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### 📱 **GitHub Pages**
```bash
# Update vite.config.js for GitHub Pages
npm run deploy:github
```

### 🐳 **Docker**
```bash
# Build Docker image
docker build -t QattahApp .

# Run container
docker run -p 3000:3000 QattahApp
```

---

## 🔧 **Configuration**

### 🎨 **Theme Customization**
```typescript
// src/config/theme.ts
export const theme = {
  colors: {
    primary: '#8B5CF6', // Purple
    secondary: '#10B981', // Green
    accent: '#F59E0B', // Amber
  },
  typography: {
    fontFamily: 'Tajawal, sans-serif',
  },
}
```

### 💱 **Currency Configuration**
```typescript
// src/config/currency.ts
export const currencies = {
  SAR: {
    symbol: '﷼',
    name: 'Saudi Riyal',
    locale: 'ar-SA',
  },
  KWD: {
    symbol: 'د.ك',
    name: 'Kuwaiti Dinar',
    locale: 'ar-KW',
  },
}
```

### 🔧 **Feature Flags**
```typescript
// src/config/features.ts
export const features = {
  darkMode: true,
  pwa: true,
  analytics: false,
  export: true,
  print: true,
  sharing: true,
}
```

---

## 🧪 **Testing**

### 📋 **Test Coverage**
- **Unit Tests** - 48.3% coverage for utility functions
- **Integration Tests** - Component interaction testing
- **E2E Tests** - Full user flow testing
- **Accessibility Tests** - WCAG compliance testing

### 🚀 **Running Tests**
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- BillCalculator.test.tsx

# Run E2E tests
npm run test:e2e
```

---

## 📚 **Documentation**

### 📖 **Code Documentation**
- [CODEDOC.md](./CODEDOC.md) - Comprehensive code documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide (18 pages)
- [TESTING.md](./TESTING.md) - Testing documentation
- [QA_REPORT.md](./QA_REPORT.md) - Quality assurance report

### 🔧 **API Reference**
```typescript
// Core calculation functions
export const calculatePersonTotal = (person: Person, dishes: Dish[]): number => {
  // Implementation
}

// Bill splitting logic
export const splitSharedCosts = (dishes: Dish[], assignments: Assignments): Totals => {
  // Implementation
}
```

---

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### 🐛 **Bug Reports**
Please use the [issue tracker](https://github.com/Fahad-BA/QattahApp/issues) to report bugs or request features.

### 💡 **Feature Requests**
We're always looking to improve Qattah App! Feel free to suggest new features or improvements.

---

## 📜 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **React Team** for the amazing UI framework
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the lightning-fast build tool
- **TypeScript** for bringing type safety to JavaScript
- **Workbox** for PWA service worker management
- **All Contributors** who helped improve this project

---

## 📧 **Contact**

**Developer**: Fahad Alhuqaili

- 🐦 **Twitter/X**: [@falhuqaili](https://twitter.com/falhuqaili)
- 💼 **LinkedIn**: [/in/fahad-alhuqaili](https://linkedin.com/in/fahad-alhuqaili)
- 📧 **Email**: [Fahad@Alhuqaili.com](mailto:Fahad@Alhuqaili.com)
<!-- - 🎮 **Live Demo**: [QattahApp.vercel.app](https://QattahApp.vercel.app) -->


---

<p align="center">
  <em>Vibe Coded with ❤️ by Fahad Alhuqaili</em>
</p>