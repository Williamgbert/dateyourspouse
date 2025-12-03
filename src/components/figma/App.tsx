import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home } from './components/Home';
import { QuestionsFlow } from './components/QuestionsFlow';
import { DateIdeasFlow } from './components/DateIdeasFlow';
import { SmallMomentsHub } from './components/SmallMomentsHub';
import { BuildADate } from './components/BuildADate';
import { Favorites } from './components/Favorites';
import { History } from './components/History';
import { Settings } from './components/Settings';
import { Navigation } from './components/Navigation';
import { FloatingShuffleButton } from './components/FloatingShuffleButton';
import { ShuffleModal } from './components/ShuffleModal';

export type Screen = 'home' | 'questions' | 'dateIdeas' | 'smallMoments' | 'buildADate' | 'favorites' | 'history' | 'settings';

export interface FavoriteItem {
  id: string;
  type: 'question' | 'dateIdea' | 'smallMoment' | 'customDate';
  content: any;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  type: 'question' | 'dateIdea' | 'smallMoment';
  content: any;
  timestamp: number;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [darkMode, setDarkMode] = useState(false);
  const [spicyEnabled, setSpicyEnabled] = useState(false);
  const [faithEnabled, setFaithEnabled] = useState(true);
  const [motionReduced, setMotionReduced] = useState(false);
  const [textSize, setTextSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [showShuffleModal, setShowShuffleModal] = useState(false);
  
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addToFavorites = (item: Omit<FavoriteItem, 'id' | 'timestamp'>) => {
    const newFavorite: FavoriteItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    setFavorites(prev => [newFavorite, ...prev]);
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newHistory: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    setHistory(prev => [newHistory, ...prev].slice(0, 50)); // Keep last 50 items
  };

  const settings = {
    darkMode,
    setDarkMode,
    spicyEnabled,
    setSpicyEnabled,
    faithEnabled,
    setFaithEnabled,
    motionReduced,
    setMotionReduced,
    textSize,
    setTextSize,
    highContrast,
    setHighContrast
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home onNavigate={setCurrentScreen} />;
      case 'questions':
        return (
          <QuestionsFlow
            onBack={() => setCurrentScreen('home')}
            onAddToFavorites={addToFavorites}
            onAddToHistory={addToHistory}
            spicyEnabled={spicyEnabled}
            faithEnabled={faithEnabled}
          />
        );
      case 'dateIdeas':
        return (
          <DateIdeasFlow
            onBack={() => setCurrentScreen('home')}
            onAddToFavorites={addToFavorites}
            onAddToHistory={addToHistory}
          />
        );
      case 'smallMoments':
        return (
          <SmallMomentsHub
            onBack={() => setCurrentScreen('home')}
            onAddToFavorites={addToFavorites}
            onAddToHistory={addToHistory}
          />
        );
      case 'buildADate':
        return (
          <BuildADate
            onBack={() => setCurrentScreen('home')}
            onAddToFavorites={addToFavorites}
          />
        );
      case 'favorites':
        return (
          <Favorites
            favorites={favorites}
            onRemoveFavorite={removeFromFavorites}
          />
        );
      case 'history':
        return <History history={history} />;
      case 'settings':
        return <Settings settings={settings} />;
      default:
        return <Home onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div 
      className={`min-h-screen pb-20 ${darkMode ? 'dark bg-zinc-900' : 'bg-gradient-to-b from-rose-50 to-pink-50'} ${highContrast ? 'high-contrast' : ''}`}
      style={{ fontSize: `${textSize}%` }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={motionReduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={motionReduced ? {} : { opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      <Navigation 
        currentScreen={currentScreen} 
        onNavigate={setCurrentScreen}
        darkMode={darkMode}
      />

      {currentScreen === 'home' && (
        <FloatingShuffleButton 
          onClick={() => setShowShuffleModal(true)}
          darkMode={darkMode}
          motionReduced={motionReduced}
        />
      )}

      <ShuffleModal
        isOpen={showShuffleModal}
        onClose={() => setShowShuffleModal(false)}
        onNavigate={setCurrentScreen}
        darkMode={darkMode}
        spicyEnabled={spicyEnabled}
        faithEnabled={faithEnabled}
      />
    </div>
  );
}

export default App;
