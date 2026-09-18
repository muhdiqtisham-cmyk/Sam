import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  Share2,
  Copy,
  Check,
  X,
  Globe,
  ExternalLink,
  QrCode,
  Smartphone,
  Laptop,
  AlertTriangle,
  Sparkles,
  Info,
  Download,
  Settings,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'share' | 'custom' | 'guide'>('share');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mm_custom_share_url') || '';
    }
    return '';
  });
  const [savedCustomUrl, setSavedCustomUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mm_custom_share_url') || '';
    }
    return '';
  });
  const [useCleanLink, setUseCleanLink] = useState<boolean>(true);

  // Determine current origin and URLs
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const isAisDev = currentOrigin.includes('ais-dev-');
  const isAisPre = currentOrigin.includes('ais-pre-');
  const hasAiInDomain = currentOrigin.includes('ais-') || currentOrigin.includes('ai.');

  // Pre-configured clean shortlink (no "ai" in domain, e.g. tinyurl.com/27ybthoz)
  const cleanShortlink = 'https://tinyurl.com/27ybthoz';

  // Compute what link to show
  const activeShareUrl = React.useMemo(() => {
    if (savedCustomUrl.trim()) {
      let formatted = savedCustomUrl.trim();
      if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
        formatted = `https://${formatted}`;
      }
      return formatted;
    }

    if (useCleanLink) {
      return cleanShortlink;
    }

    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return cleanShortlink;
  }, [savedCustomUrl, useCleanLink, cleanShortlink]);

  // Generate QR Code whenever activeShareUrl changes
  useEffect(() => {
    if (!isOpen || !activeShareUrl) return;

    let isMounted = true;
    QRCode.toDataURL(activeShareUrl, {
      width: 240,
      margin: 1.5,
      color: {
        dark: '#1D2B4F',
        light: '#FFFDF8',
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, activeShareUrl]);

  if (!isOpen) return null;

  const handleCopy = async (textToCopy: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        return;
      }
    } catch {
      // Fallback below
    }

    try {
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Clipboard unavailable
    }
  };

  const handleSaveCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    let cleaned = customUrl.trim();
    if (cleaned && !cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
      cleaned = `https://${cleaned}`;
    }
    localStorage.setItem('mm_custom_share_url', cleaned);
    setSavedCustomUrl(cleaned);
    setCustomUrl(cleaned);
    setActiveTab('share');
  };

  const handleClearCustomUrl = () => {
    localStorage.removeItem('mm_custom_share_url');
    setSavedCustomUrl('');
    setCustomUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#122A22]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-mono">
      <div className="bg-[#FFFDF8] border border-[#1D2B4F] max-w-lg w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-lg shadow-xl relative animate-pop flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-[#4C5A7A] hover:text-[#1D2B4F] p-1 rounded transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Badge */}
        <div className="flex items-center gap-2 mb-1 text-[#1B4332]">
          <Share2 className="w-5 h-5 text-[#C9A227]" />
          <h3 className="font-serif text-xl sm:text-2xl font-bold">Access on Phone & Laptop</h3>
        </div>

        <p className="text-xs text-[#4C5A7A] leading-relaxed mb-3">
          Play Money Moves across all devices — desktop, laptop, tablet, and mobile phones.
        </p>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-[#D8CFBA] pb-2 mb-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('share')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors cursor-pointer ${
              activeTab === 'share'
                ? 'bg-[#1B4332] text-[#FFFDF8]'
                : 'text-[#1D2B4F] hover:bg-[#EDE6D6]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Direct Link & QR</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-[#1B4332] text-[#FFFDF8]'
                : 'text-[#1D2B4F] hover:bg-[#EDE6D6]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Custom Domain</span>
            {savedCustomUrl && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" title="Custom domain active" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-[#1B4332] text-[#FFFDF8]'
                : 'text-[#1D2B4F] hover:bg-[#EDE6D6]'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>No-AI Guide</span>
          </button>
        </div>

        {/* TAB 1: SHARE & QR */}
        {activeTab === 'share' && (
          <div className="space-y-4">
            {/* Warning if current address is the private dev sandbox */}
            {isAisDev && !savedCustomUrl && (
              <div className="p-3 bg-[#FFF7ED] border border-[#FDBA74] rounded text-xs text-[#9A3412] flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">Why phone users can't open the dev link:</div>
                  <p className="text-[11px] leading-relaxed text-[#7C2D12]">
                    The browser address bar currently shows the <strong>private dev sandbox</strong> (<code className="bg-[#FED7AA]/50 px-1 py-0.5 rounded">ais-dev-...</code>), which requires your developer login.
                  </p>
                  <p className="text-[11px] leading-relaxed text-[#7C2D12]">
                    To let any phone or laptop user open it without login: click the <strong>Share</strong> button in the top bar of AI Studio, or use the <strong>Clean Link</strong> below.
                  </p>
                </div>
              </div>
            )}

            {/* Link Selector Toggle (Clean Link without AI vs Raw Dev) */}
            {!savedCustomUrl && (
              <div className="flex items-center justify-between gap-2 p-2 bg-[#EDE6D6]/60 border border-[#D8CFBA] rounded text-xs">
                <div className="flex items-center gap-1.5 text-[#1D2B4F]">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span className="font-semibold">Link format:</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setUseCleanLink(true)}
                    className={`px-2.5 py-1 rounded text-xs cursor-pointer transition-colors ${
                      useCleanLink
                        ? 'bg-[#1B4332] text-[#FFFDF8] font-bold'
                        : 'text-[#4C5A7A] hover:bg-[#D8CFBA]'
                    }`}
                  >
                    Clean Link (Zero AI)
                  </button>
                  <button
                    onClick={() => setUseCleanLink(false)}
                    className={`px-2.5 py-1 rounded text-xs cursor-pointer transition-colors ${
                      !useCleanLink
                        ? 'bg-[#1B4332] text-[#FFFDF8] font-bold'
                        : 'text-[#4C5A7A] hover:bg-[#D8CFBA]'
                    }`}
                  >
                    Browser URL
                  </button>
                </div>
              </div>
            )}

            {/* Active Link Box */}
            <div className="p-2.5 bg-[#F7F3E9] border border-[#D8CFBA] rounded flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#4C5A7A] shrink-0 ml-1" />
              <input
                id="share-link-input"
                type="text"
                readOnly
                value={activeShareUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="flex-1 bg-transparent text-xs text-[#1D2B4F] outline-none select-all truncate font-mono font-medium"
                aria-label="Active Game URL"
              />

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  id="copy-share-link-btn"
                  onClick={() => handleCopy(activeShareUrl)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B4332] hover:bg-[#122A22] text-[#FFFDF8] rounded text-xs font-semibold cursor-pointer transition-colors"
                  title="Copy link to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                {activeShareUrl && (
                  <a
                    href={activeShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 border border-[#B9AD8E] bg-[#EDE6D6] hover:bg-[#D8CFBA] text-[#1D2B4F] rounded transition-colors inline-flex items-center justify-center"
                    title="Open link in new tab"
                    aria-label="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* QR Code Card for Phone Scanning */}
            <div className="p-4 bg-[#EDE6D6]/40 border border-[#D8CFBA] rounded-lg flex flex-col sm:flex-row items-center gap-4">
              <div className="p-2 bg-[#FFFDF8] border-2 border-[#1D2B4F] rounded-md shrink-0 shadow-xs">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Game QR Code"
                    className="w-32 h-32 sm:w-36 sm:h-36 block"
                  />
                ) : (
                  <div className="w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center text-xs text-[#4C5A7A]">
                    Generating QR...
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-[#1D2B4F]">
                  <QrCode className="w-4 h-4 text-[#1B4332]" />
                  <span>Scan to Play on Mobile Phone</span>
                </div>
                <p className="text-[11px] text-[#4C5A7A] leading-relaxed">
                  Point any phone camera (iPhone or Android) at this QR code to immediately launch Money Moves without typing a link.
                </p>
                {qrDataUrl && (
                  <a
                    href={qrDataUrl}
                    download="money-moves-qr.png"
                    className="inline-flex items-center gap-1.5 text-[11px] text-[#1B4332] hover:text-[#122A22] font-semibold underline underline-offset-2 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download QR Image</span>
                  </a>
                )}
              </div>
            </div>

            {/* Device Compatibility note */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-[#FFFDF8] border border-[#D8CFBA] rounded flex items-center gap-2">
                <Laptop className="w-4 h-4 text-[#1B4332] shrink-0" />
                <div>
                  <div className="font-bold text-[#1D2B4F]">Laptop / PC</div>
                  <div className="text-[10px] text-[#4C5A7A]">Full widescreen board view</div>
                </div>
              </div>

              <div className="p-2.5 bg-[#FFFDF8] border border-[#D8CFBA] rounded flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#C9A227] shrink-0" />
                <div>
                  <div className="font-bold text-[#1D2B4F]">Mobile Phone</div>
                  <div className="text-[10px] text-[#4C5A7A]">Touch-optimized responsive UI</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOM DOMAIN */}
        {activeTab === 'custom' && (
          <div className="space-y-4">
            <div className="p-3 bg-[#EDE6D6]/50 border border-[#D8CFBA] rounded text-xs space-y-2">
              <div className="font-bold text-[#1D2B4F] flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#1B4332]" />
                <span>Use Your Own Custom Game Domain</span>
              </div>
              <p className="text-[#4C5A7A] leading-relaxed text-[11px]">
                If you host this app on your own domain (e.g. <code className="bg-[#FFFDF8] px-1 py-0.5 rounded border border-[#D8CFBA]">moneymoves.vercel.app</code>, <code className="bg-[#FFFDF8] px-1 py-0.5 rounded border border-[#D8CFBA]">moneymoves.app</code>, or any Netlify/Cloudflare domain), enter it here.
              </p>
              <p className="text-[#4C5A7A] leading-relaxed text-[11px]">
                This will automatically update the copy link and the QR code with your custom URL and completely remove any AI identifier!
              </p>
            </div>

            <form onSubmit={handleSaveCustomUrl} className="space-y-3">
              <div>
                <label htmlFor="custom-url-field" className="block text-xs font-bold text-[#1D2B4F] mb-1">
                  Custom Domain or Hosting URL:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="custom-url-field"
                    type="text"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="e.g. moneymoves.vercel.app or play.yourdomain.com"
                    className="flex-1 p-2 bg-[#FFFDF8] border border-[#B9AD8E] focus:border-[#1D2B4F] rounded text-xs outline-none text-[#1D2B4F]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1B4332] hover:bg-[#122A22] text-[#FFFDF8] rounded text-xs font-bold transition-colors cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>

              {savedCustomUrl && (
                <div className="flex items-center justify-between p-2 bg-[#F7F3E9] border border-[#D8CFBA] rounded text-xs">
                  <span className="text-[#1B4332] font-semibold truncate">Active: {savedCustomUrl}</span>
                  <button
                    type="button"
                    onClick={handleClearCustomUrl}
                    className="text-[#A63D40] hover:underline text-[11px] font-medium cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* TAB 3: HOW TO REMOVE AI FROM URL */}
        {activeTab === 'guide' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#EDE6D6]/60 border border-[#D8CFBA] rounded space-y-2">
              <h4 className="font-bold text-[#1D2B4F] text-sm">
                How to get a 100% Free Link with NO "AI" in the name
              </h4>
              <p className="text-[#4C5A7A] leading-relaxed text-[11px]">
                Google AI Studio automatically prefixes internal sandbox domains with <code className="bg-[#FFFDF8] px-1 py-0.5 rounded border border-[#D8CFBA]">ais-*.run.app</code>. To deploy your own custom link (such as <strong className="text-[#1D2B4F]">moneymoves.vercel.app</strong> or a custom <strong className="text-[#1D2B4F]">.com</strong>):
              </p>
            </div>

            <ol className="list-decimal list-inside space-y-2.5 text-[#1D2B4F] text-xs">
              <li className="leading-relaxed">
                <strong>Export Code</strong>: Click the menu button (top-right of AI Studio) &rarr; choose <strong>Export to GitHub</strong> or <strong>Download ZIP</strong>.
              </li>
              <li className="leading-relaxed">
                <strong>Deploy to Vercel or Netlify (Free &amp; 1-click)</strong>:
                <p className="text-[#4C5A7A] text-[11px] ml-4 mt-0.5">
                  Go to <a href="https://vercel.com" target="_blank" rel="noreferrer" className="underline font-bold text-[#1B4332]">vercel.com</a> or <a href="https://netlify.com" target="_blank" rel="noreferrer" className="underline font-bold text-[#1B4332]">netlify.com</a> and click "Import Project". It builds your standard React Vite project in 30 seconds.
                </p>
              </li>
              <li className="leading-relaxed">
                <strong>Enjoy Your Clean Custom URL</strong>:
                <p className="text-[#4C5A7A] text-[11px] ml-4 mt-0.5">
                  You get a clean link like <code className="bg-[#EDE6D6] px-1 py-0.5 rounded text-[#1D2B4F]">https://moneymoves.vercel.app</code> with 0 "ai" keywords, completely accessible to any phone or laptop anywhere in the world!
                </p>
              </li>
            </ol>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#D8CFBA] flex items-center justify-between text-xs text-[#4C5A7A]">
          <span>Money Moves Web Edition</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-[#B9AD8E] bg-[#EDE6D6] hover:bg-[#D8CFBA] text-[#1D2B4F] rounded text-xs font-semibold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
