/**
 * SummaryCard Component
 * 
 * The main display for the AI Summary Analysis.
 * Shows Sentiment, Verdict, Themes, Pros, and Cons.
 */
import ThemeChips from './ThemeChips';
import ProsList from './ProsList';
import ConsList from './ConsList';
import { Sparkles } from 'lucide-react';

const SummaryCard = ({ summary }) => {
  if (!summary) return null;

  const { sentiment, verdict, themes, pros, cons } = summary;

  // Determine sentiment color
  const getSentimentStyle = (s) => {
    switch (s?.toLowerCase()) {
      case 'positive': return 'bg-green-100 text-green-700 border-green-200';
      case 'negative': return 'bg-red-100 text-red-700 border-red-200';
      case 'mixed': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-blue-50 overflow-hidden mb-10 animate-fade-in-up">
      {/* Header / Verdict Section */}
      <div className="p-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-yellow-300 fill-current" />
            <span className="font-bold tracking-wider uppercase text-blue-100 text-sm">AI Analysis / Groq-70b</span>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getSentimentStyle(sentiment)} bg-white/10 backdrop-blur-sm border-white/20 text-white`}>
            {sentiment} Sentiment
          </span>
        </div>
        
        <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-4">
          Verdict
        </h3>
        <p className="text-blue-50 text-lg leading-relaxed max-w-4xl">
          "{verdict}"
        </p>
      </div>

      {/* Content Section */}
      <div className="p-8">
        <ThemeChips themes={themes} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProsList pros={pros} />
          <ConsList cons={cons} />
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
