# 🎮 PairPong - Crypto Battle Arena

A futuristic cryptocurrency battle game where digital assets fight in real-time Pong-style battles based on their market performance. Watch as Bitcoin, Ethereum, and other cryptocurrencies battle it out in an epic gaming arena!


![React](https://img.shields.io/badge/React-19.1.1-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.7-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.16-cyan)

## 🚀 Features

### 🎯 **Crypto Battles**
- **Real-time Price Integration**: Live cryptocurrency data from CoinGecko API
- **Dynamic Gameplay**: Paddle sizes and speeds change based on price performance
- **40-Second Battles**: Fast-paced, intense cryptocurrency showdowns
- **AI-Controlled Paddles**: Smart AI that responds to market volatility

### 🎮 **Game Modes**
- **Normal Mode**: Watch the battle unfold
- **Prediction Mode**: Make predictions and potentially earn rewards (blockchain integration planned)

### 🎨 **Gaming Experience**
- **Futuristic UI**: Neon colors, glowing effects, and gaming aesthetics
- **Custom Modals**: Beautiful themed notifications instead of browser alerts
- **Responsive Design**: Works perfectly on desktop and mobile
- **Smooth Animations**: Canvas-based game rendering with particle effects

### 📊 **Live Data**
- **Real-time Prices**: Live cryptocurrency price updates
- **Historical Analysis**: 1-day price history for battle simulation
- **Performance Tracking**: Detailed battle statistics and results
- **Market Volatility**: Ball speed affected by market conditions

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: TailwindCSS 4 + Custom CSS
- **Icons**: Lucide React
- **Data**: CoinGecko API
- **Canvas**: HTML5 Canvas for game rendering
- **Animations**: CSS3 + RequestAnimationFrame

## 🎮 How to Play

1. **Select Your Fighters**: Choose two cryptocurrencies from the dropdown
2. **Pick Your Mode**:
   - **Normal**: Just watch the battle
   - **Prediction**: Make a prediction on the winner
3. **Start the Battle**: Click "START BATTLE" and watch the magic happen
4. **Watch the Action**: See how market performance affects gameplay
5. **See the Results**: Find out which crypto performed better

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pairpong-base

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## 🎯 Game Mechanics

### **Battle System**
- **Duration**: 40 seconds per battle
- **Paddle Dynamics**: Size based on total price performance
- **Ball Physics**: Speed affected by market volatility
- **AI Behavior**: Paddles automatically track and respond to ball movement
- **Scoring**: Points when ball passes opponent's paddle

### **Price Integration**
- **Historical Data**: 1-day price history for battle simulation
- **Real-time Updates**: Live prices every 30 seconds
- **Performance Calculation**: Total percentage change from battle start
- **Volatility Effects**: Higher volatility = faster ball speed

## 🎨 Design System

### **Color Palette**
- **Primary**: Neon Green (#00ff88)
- **Secondary**: Gold (#ffd700)
- **Accent**: Pink (#ff6b9d)
- **Background**: Dark gradients with subtle glows

### **Typography**
- **Headers**: Orbitron (futuristic, gaming)
- **Body**: Rajdhani (clean, readable)

### **Components**
- Custom modals with gaming aesthetics
- Animated buttons with hover effects
- Canvas-based game rendering
- Responsive grid layouts

## 🔮 Future Features

- **Blockchain Integration**: Smart contracts for predictions
- **Wallet Integration**: Web3 wallet connection
- **Token Rewards**: Cryptocurrency rewards for correct predictions
- **Leaderboards**: Global prediction rankings
- **Tournament Mode**: Multi-round competitions
- **NFT Integration**: Battle result NFTs

## 📱 Responsive Design

- **Desktop**: Full 3-column layout with battle arena
- **Tablet**: Optimized 2-column layout
- **Mobile**: Single-column stacked layout
- **Touch Support**: Mobile-friendly controls

## 🛡️ Error Handling

- **API Fallbacks**: Graceful degradation when APIs fail
- **Custom Modals**: Beautiful error messages instead of browser alerts
- **Retry Logic**: Automatic retry for failed requests
- **Loading States**: Clear feedback during data fetching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CoinGecko API** for real-time cryptocurrency data
- **Lucide React** for beautiful icons
- **TailwindCSS** for utility-first styling
- **React** and **Vite** for the amazing development experience

---

**Ready to battle?** 🚀 Start your crypto battle adventure now!

> *"Where cryptocurrency meets gaming - the future of DeFi entertainment!"*