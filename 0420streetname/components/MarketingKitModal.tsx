'use client';

import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  QrCode, 
  Video, 
  MapPin, 
  Share2, 
  FileText, 
  Wine, 
  Receipt, 
  Flame, 
  ExternalLink 
} from 'lucide-react';

interface MarketingKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'table-tents' | 'photos' | 'social-copy';

export const MarketingKitModal: React.FC<MarketingKitModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('table-tents');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#16181d] border border-[#262a34] w-full max-w-5xl max-h-[92vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-[#1a1d24] border-b border-[#262a34] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c29b68] to-[#8b6f48] flex items-center justify-center text-[#111215] font-black shadow">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#e2e4ea] font-serif">
                  240 Union Growth & Marketing Expansion Kit
                </h2>
                <span className="text-[10px] uppercase font-mono tracking-wider bg-[#c29b68]/20 text-[#c29b68] px-2 py-0.5 rounded border border-[#c29b68]/30 font-bold">
                  Lakewood, CO
                </span>
              </div>
              <p className="text-xs text-[#9ca3af]">
                Ready-to-print Table Tents, Check-Presenter Inserts, Google Maps Photos & Social Captions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#262a34] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 py-2.5 bg-[#111215] border-b border-[#262a34] flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('table-tents')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'table-tents'
                  ? 'bg-[#c29b68] text-[#111215] shadow'
                  : 'text-[#9ca3af] hover:text-[#e2e4ea] hover:bg-[#1a1d24]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Printable Table Tents & Check Inserts</span>
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'photos'
                  ? 'bg-[#c29b68] text-[#111215] shadow'
                  : 'text-[#9ca3af] hover:text-[#e2e4ea] hover:bg-[#1a1d24]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Google Maps & Menu Photo Kit (4K)</span>
            </button>
            <button
              onClick={() => setActiveTab('social-copy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'social-copy'
                  ? 'bg-[#c29b68] text-[#111215] shadow'
                  : 'text-[#9ca3af] hover:text-[#e2e4ea] hover:bg-[#1a1d24]'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Reels & Instagram Captions</span>
            </button>
          </div>

          {activeTab === 'table-tents' && (
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-[#1a1d24] hover:bg-[#262a34] text-[#c29b68] border border-[#c29b68]/40 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Cards</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 1: Printable Table Tents & Check Inserts */}
          {activeTab === 'table-tents' && (
            <div className="space-y-6">
              <div className="bg-[#111215] p-4 rounded-xl border border-[#262a34] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-[#e2e4ea] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#c29b68]" />
                    Direct Table-To-POS Flow (Zero Commission)
                  </h3>
                  <p className="text-xs text-[#9ca3af] mt-0.5">
                    Guests scan either physical acrylic table tents or check presenter cards to instantly split checks or order reserve wine cellar bottles.
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-[#c29b68] bg-[#1a1d24] px-3 py-1.5 rounded-lg border border-[#c29b68]/30">
                  Target: https://240.yorkstead.com
                </div>
              </div>

              {/* Printable Previews Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
                {/* Card 1: Federal Center Speed-Split Check Presenter */}
                <div className="bg-gradient-to-b from-[#1a1d24] to-[#111215] border-2 border-[#c29b68]/60 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between text-center min-h-[420px]">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#c29b68] via-amber-200 to-[#c29b68]"></div>
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#c29b68] text-[#111215] font-black font-serif flex items-center justify-center text-sm">
                        240
                      </div>
                      <span className="font-serif font-black tracking-widest text-[#e2e4ea] text-lg uppercase">
                        240 UNION
                      </span>
                    </div>
                    <p className="text-[11px] tracking-widest uppercase text-[#c29b68] font-mono font-bold mb-4">
                      LUNCH RUSH • 1-TAP SPLIT & PAY
                    </p>

                    <div className="my-3 p-3 bg-white rounded-xl inline-block shadow-md border-2 border-[#c29b68]">
                      {/* Live QR Code pointing to table guest checkout view */}
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=4&data=https%3A%2F%2F240.yorkstead.com%2Ftable%2F23" 
                        alt="240 Union QR Code Table 23" 
                        className="w-36 h-36 mx-auto"
                      />
                    </div>

                    <h4 className="text-base font-bold text-white font-serif mt-2">
                      Need To Catch a 1:00 PM Meeting?
                    </h4>
                    <p className="text-xs text-[#9ca3af] max-w-xs mx-auto mt-1 leading-relaxed">
                      Federal Center & Hospital Staff: Scan to split by seat, add gratuity, and pay instantly with Apple Pay or Corporate Card. No waiting on paper checks.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#262a34] flex items-center justify-between text-[10px] text-[#9ca3af] font-mono">
                    <span>TABLE TENT #A (4x6in)</span>
                    <span className="text-[#c29b68] font-bold">240.YORKSTEAD.COM</span>
                  </div>
                </div>

                {/* Card 2: Reserve Wine Cellar & Sommelier Secret List */}
                <div className="bg-gradient-to-b from-[#1a1d24] to-[#111215] border-2 border-[#8b6f48]/60 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between text-center min-h-[420px]">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8b6f48] via-[#c29b68] to-[#8b6f48]"></div>
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Wine className="w-5 h-5 text-[#c29b68]" />
                      <span className="font-serif font-black tracking-widest text-[#e2e4ea] text-lg uppercase">
                        RESERVE CELLAR
                      </span>
                    </div>
                    <p className="text-[11px] tracking-widest uppercase text-[#c29b68] font-mono font-bold mb-4">
                      240 UNION SOMMELIER SELECTIONS
                    </p>

                    <div className="my-3 p-3 bg-white rounded-xl inline-block shadow-md border-2 border-[#8b6f48]">
                      {/* Live QR Code */}
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=4&data=https%3A%2F%2F240.yorkstead.com" 
                        alt="240 Union Wine QR Code" 
                        className="w-36 h-36 mx-auto"
                      />
                    </div>

                    <h4 className="text-base font-bold text-white font-serif mt-2">
                      Unlock Rare Vintage Bottles
                    </h4>
                    <p className="text-xs text-[#9ca3af] max-w-xs mx-auto mt-1 leading-relaxed">
                      Scan to browse live cellar inventory: Silver Oak 2018, Caymus, Opus One, and pairing suggestions from our Sommelier before the next course.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#262a34] flex items-center justify-between text-[10px] text-[#9ca3af] font-mono">
                    <span>CHECK PRESENTER INSERT</span>
                    <span className="text-[#c29b68] font-bold">LIVE CELLAR BOTTLING</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Google Maps & Menu Photo Kit */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              <div className="bg-[#111215] p-4 rounded-xl border border-[#262a34] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-[#e2e4ea] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#c29b68]" />
                    High-Res Menu Photography for Google Business Profile
                  </h3>
                  <p className="text-xs text-[#9ca3af] mt-0.5">
                    Restaurants with professional food photos on Google Maps experience 35% higher reservation click-through rates.
                  </p>
                </div>
                <div className="text-xs text-[#9ca3af]">
                  Resolution: <span className="text-white font-mono font-bold">1024x1024 4K Ready</span>
                </div>
              </div>

              {/* Photo Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Photo 1: Ribeye */}
                <div className="bg-[#1a1d24] border border-[#262a34] rounded-2xl overflow-hidden flex flex-col">
                  <div className="relative aspect-square bg-black overflow-hidden group">
                    <img 
                      src="/dish-ribeye.jpg" 
                      alt="Wood-Fired Ribeye Steak" 
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded-md text-xs font-mono text-white border border-white/20">
                      Entree • $58.00
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-[#e2e4ea] text-base font-serif">
                        Wood-Fired Prime Ribeye
                      </h4>
                      <p className="text-xs text-[#9ca3af] mt-1 leading-relaxed">
                        16oz Prime Ribeye grilled over Colorado peach wood and charcoal, topped with bone marrow butter, roasted fingerling potatoes, and charred heirloom asparagus.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#262a34] flex items-center justify-between">
                      <span className="text-[11px] text-[#c29b68] font-mono">Google Maps Tag: Most Ordered</span>
                      <button
                        onClick={() => handleCopy("Wood-Fired Prime Ribeye (16oz) - Grilled over peach wood, roasted bone marrow butter, fingerling potatoes. Available at 240 Union, Lakewood CO.", "ribeye")}
                        className="px-2.5 py-1 bg-[#262a34] hover:bg-[#323846] text-xs text-white rounded-lg flex items-center gap-1.5 transition"
                      >
                        {copiedKey === 'ribeye' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Caption</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Photo 2: Striped Bass */}
                <div className="bg-[#1a1d24] border border-[#262a34] rounded-2xl overflow-hidden flex flex-col">
                  <div className="relative aspect-square bg-black overflow-hidden group">
                    <img 
                      src="/dish-bass.jpg" 
                      alt="Colorado Striped Bass" 
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded-md text-xs font-mono text-white border border-white/20">
                      Seafood • $44.00
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-[#e2e4ea] text-base font-serif">
                        Pan-Seared Colorado Striped Bass
                      </h4>
                      <p className="text-xs text-[#9ca3af] mt-1 leading-relaxed">
                        Crispy skin striped bass with sweet corn and saffron risotto, roasted chanterelle mushrooms, and citrus brown butter emulsion.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#262a34] flex items-center justify-between">
                      <span className="text-[11px] text-[#c29b68] font-mono">Google Maps Tag: Chef Signature</span>
                      <button
                        onClick={() => handleCopy("Crispy Colorado Striped Bass with saffron sweet corn risotto & chanterelles. Daily catch at 240 Union.", "bass")}
                        className="px-2.5 py-1 bg-[#262a34] hover:bg-[#323846] text-xs text-white rounded-lg flex items-center gap-1.5 transition"
                      >
                        {copiedKey === 'bass' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Caption</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Photo 3: Wood-Fired Pizza */}
                <div className="bg-[#1a1d24] border border-[#262a34] rounded-2xl overflow-hidden flex flex-col">
                  <div className="relative aspect-square bg-black overflow-hidden group">
                    <img 
                      src="/dish-pizza.jpg" 
                      alt="Artisanal Wood-Fired Pizza" 
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded-md text-xs font-mono text-white border border-white/20">
                      Wood Oven • $24.00
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-[#e2e4ea] text-base font-serif">
                        Prosciutto & Fior Di Latte Pizza
                      </h4>
                      <p className="text-xs text-[#9ca3af] mt-1 leading-relaxed">
                        Blistered sourdough crust baked directly on the hearth of our copper-domed wood-fired oven. San Marzano tomato, fresh basil, and shaved prosciutto di Parma.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#262a34] flex items-center justify-between">
                      <span className="text-[11px] text-[#c29b68] font-mono">Google Maps Tag: Lunch Favorite</span>
                      <button
                        onClick={() => handleCopy("Straight from our hearth: Blistered wood-fired sourdough pizza with fior di latte & prosciutto. 240 Union lunch & dinner.", "pizza")}
                        className="px-2.5 py-1 bg-[#262a34] hover:bg-[#323846] text-xs text-white rounded-lg flex items-center gap-1.5 transition"
                      >
                        {copiedKey === 'pizza' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Caption</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Photo 4: Wine Cellar Pour */}
                <div className="bg-[#1a1d24] border border-[#262a34] rounded-2xl overflow-hidden flex flex-col">
                  <div className="relative aspect-square bg-black overflow-hidden group">
                    <img 
                      src="/dish-wine.jpg" 
                      alt="Sommelier Wine Pour" 
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded-md text-xs font-mono text-white border border-white/20">
                      Private Cellar • Sommelier
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-[#e2e4ea] text-base font-serif">
                        Sommelier Reserve Cellar Selection
                      </h4>
                      <p className="text-xs text-[#9ca3af] mt-1 leading-relaxed">
                        Floor-to-ceiling reserve cellar featuring vintage Napa Valley, Bordeaux, and Super Tuscans paired tableside in our private Wine Room.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#262a34] flex items-center justify-between">
                      <span className="text-[11px] text-[#c29b68] font-mono">Google Maps Tag: Wine Spectator</span>
                      <button
                        onClick={() => handleCopy("Uncork something extraordinary tonight in our private Wine Room. Reserve cellar pours at 240 Union, Lakewood.", "wine")}
                        className="px-2.5 py-1 bg-[#262a34] hover:bg-[#323846] text-xs text-white rounded-lg flex items-center gap-1.5 transition"
                      >
                        {copiedKey === 'wine' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Caption</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Reels & Instagram Captions */}
          {activeTab === 'social-copy' && (
            <div className="space-y-6">
              <div className="bg-[#111215] p-4 rounded-xl border border-[#262a34]">
                <h3 className="text-sm font-bold text-[#e2e4ea] flex items-center gap-2">
                  <Video className="w-4 h-4 text-pink-400" />
                  Pre-Written Social Media Posts & Video Reels Pitch
                </h3>
                <p className="text-xs text-[#9ca3af] mt-0.5">
                  High-converting captions targeted at local Lakewood business professionals, Denver Federal Center workers, and foodies.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reel Script 1 */}
                <div className="bg-[#1a1d24] border border-[#262a34] rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                        Reel #1: 45-Minute Fed Center Lunch
                      </span>
                      <span className="text-[10px] bg-[#262a34] text-[#9ca3af] px-2 py-0.5 rounded font-mono">
                        Target: Federal Center & Hospital
                      </span>
                    </div>

                    <div className="bg-[#111215] p-3 rounded-xl border border-[#262a34] font-mono text-xs text-[#e2e4ea] space-y-2">
                      <p className="text-emerald-400"># [HOOK - 0:00-0:03]:</p>
                      <p>"Got 45 minutes for lunch near Denver Federal Center?"</p>
                      
                      <p className="text-emerald-400 mt-2"># [ACTION - 0:04-0:15]:</p>
                      <p>"Watch the 60-foot open kitchen at 240 Union fire wood-fired steaks, artisan pizzas, and fresh fish in under 12 minutes."</p>

                      <p className="text-emerald-400 mt-2"># [PAYMENT - 0:16-0:25]:</p>
                      <p>"And when it's time to go? 1-tap split the check on your phone. No waiting 15 minutes for paper receipts. In and out before your 1:00 meeting."</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#262a34] flex items-center justify-between">
                    <span className="text-xs text-[#9ca3af]">Ideal sound: Upbeat lo-fi jazz</span>
                    <button
                      onClick={() => handleCopy("Got 45 minutes for lunch near Denver Federal Center? Watch the 60-foot open kitchen at 240 Union fire fresh entrees in under 12 minutes—with 1-tap phone split checks so you make your 1:00 meeting. 📍 240 Union Blvd, Lakewood #DenverFood #LakewoodCO #FederalCenter", "reel1")}
                      className="px-3 py-1 bg-[#c29b68] text-[#111215] font-bold text-xs rounded-lg flex items-center gap-1.5 hover:bg-[#d6b07c] transition"
                    >
                      {copiedKey === 'reel1' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Reel Script</span>
                    </button>
                  </div>
                </div>

                {/* Reel Script 2 */}
                <div className="bg-[#1a1d24] border border-[#262a34] rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-[#c29b68] uppercase tracking-wider">
                        Reel #2: Lakewood's Best Kept Secret
                      </span>
                      <span className="text-[10px] bg-[#262a34] text-[#9ca3af] px-2 py-0.5 rounded font-mono">
                        Target: Date Night & Wine Lovers
                      </span>
                    </div>

                    <div className="bg-[#111215] p-3 rounded-xl border border-[#262a34] font-mono text-xs text-[#e2e4ea] space-y-2">
                      <p className="text-[#c29b68]"># [HOOK - 0:00-0:03]:</p>
                      <p>"This Lakewood culinary institution has been discreetly serving Denver since 1989..."</p>
                      
                      <p className="text-[#c29b68] mt-2"># [ACTION - 0:04-0:15]:</p>
                      <p>"From dry-aged ribeyes kissed by open flame to our sommelier-curated reserve wine room holding over 400 bottles."</p>

                      <p className="text-[#c29b68] mt-2"># [CTA - 0:16-0:25]:</p>
                      <p>"Book the Wine Room or grab a seat at the exhibition grill counter. 240 Union Blvd."</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#262a34] flex items-center justify-between">
                    <span className="text-xs text-[#9ca3af]">Ideal sound: Ambient romantic acoustic</span>
                    <button
                      onClick={() => handleCopy("Lakewood's premier contemporary grill since 1989. Experience open-flame cooking and rare reserve cellar bottles at 240 Union. Reserve your table at 240.yorkstead.com 🍷 #ColoradoDining #DenverFoodScene #LakewoodEats", "reel2")}
                      className="px-3 py-1 bg-[#c29b68] text-[#111215] font-bold text-xs rounded-lg flex items-center gap-1.5 hover:bg-[#d6b07c] transition"
                    >
                      {copiedKey === 'reel2' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Caption</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#1a1d24] border-t border-[#262a34] flex items-center justify-between text-xs text-[#9ca3af]">
          <span>Generated for 240 Union • 240 Union Blvd, Lakewood CO</span>
          <a
            href="https://240.yorkstead.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#c29b68] hover:underline font-bold"
          >
            <span>Visit 240.yorkstead.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
