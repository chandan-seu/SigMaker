import React, { useState, useRef } from 'react';
import { INITIAL_DATA, SignatureData, SectionId } from './types';
import { UnifiedEditor } from './components/UnifiedEditor';
import { SignatureTable } from './components/SignatureTable';
import { 
  Copy, 
  Check, 
  Monitor, 
  Smartphone, 
  Download,
  Mail,
  ExternalLink
} from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [data, setData] = useState<SignatureData>(INITIAL_DATA);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const signatureRef = useRef<HTMLDivElement>(null);

  const copySignature = async () => {
    if (!signatureRef.current) return;

    try {
      const html = signatureRef.current.innerHTML;
      
      // Create a blob for the HTML content
      const blob = new Blob([html], { type: 'text/html' });
      const textBlob = new Blob([html], { type: 'text/plain' });
      
      // Use the Clipboard API to copy as rich text
      const clipboardData = [
        new ClipboardItem({
          'text/html': blob,
          'text/plain': textBlob,
        })
      ];

      await navigator.clipboard.write(clipboardData);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy signature:', err);
      // Fallback: copy as plain text HTML
      try {
        await navigator.clipboard.writeText(signatureRef.current.innerHTML);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        alert('Failed to copy. Please try selecting the signature manually and copying.');
      }
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-900 overflow-hidden">
      {/* Left Sidebar - Editor */}
      <div className="w-[350px] border-r border-gray-100 flex flex-col h-full bg-white z-10 shadow-xl">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Mail size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">SigMaker</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">by Ignite Tech Solutions</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <UnifiedEditor 
            data={data} 
            onChange={setData} 
            onReset={() => setData(INITIAL_DATA)} 
          />
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button 
            onClick={copySignature}
            className={cn(
              "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg",
              copied 
                ? "bg-green-500 text-white shadow-green-200" 
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 active:scale-[0.98]"
            )}
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
            {copied ? 'Copied to Clipboard!' : 'Copy Signature for Gmail'}
          </button>
          <p className="text-[10px] text-gray-400 mt-3 text-center">
            Pasted signature will include all styles and images automatically.
          </p>
        </div>
      </div>

      {/* Main Content - Preview */}
      <div className="flex-1 flex flex-col bg-gray-50/50 relative">
        {/* Preview Header */}
        <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('desktop')}
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === 'desktop' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Monitor size={18} />
              </button>
              <button 
                onClick={() => setViewMode('mobile')}
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === 'mobile' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Smartphone size={18} />
              </button>
            </div>
            <div className="h-6 w-px bg-gray-200" />
            <span className="text-sm font-medium text-gray-500">
              Live Preview
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://support.google.com/mail/answer/8395" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-medium text-gray-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
            >
              How to use <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto p-12 flex items-center justify-center">
          <div 
            className={cn(
              "bg-white shadow-2xl rounded-2xl transition-all duration-500 overflow-hidden flex flex-col",
              viewMode === 'desktop' ? "w-full max-w-3xl min-h-[400px]" : "w-[375px] h-[667px]"
            )}
          >
            {/* Browser/Email Chrome Mockup */}
            <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white border border-gray-200 rounded-md py-1 px-3 text-[10px] text-gray-400 font-mono">
                New Message — {data.fullName}
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <div className="space-y-4 mb-12">
                <div className="h-4 w-1/3 bg-gray-100 rounded-full" />
                <div className="h-4 w-full bg-gray-50 rounded-full" />
                <div className="h-4 w-full bg-gray-50 rounded-full" />
                <div className="h-4 w-2/3 bg-gray-50 rounded-full" />
              </div>

              <div className="pt-8 border-t border-gray-100">
                <div className="text-xs text-gray-400 mb-4 font-medium uppercase tracking-widest">Signature Preview</div>
                <div 
                  ref={signatureRef}
                  className="bg-white p-4 border border-dashed border-gray-200 rounded-lg inline-block"
                >
                  <SignatureTable data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Tips */}
        <div className="absolute bottom-8 right-8 max-w-xs bg-white p-4 rounded-xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Download size={18} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">Pro Tip</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                After clicking "Copy", go to Gmail Settings → Signature, and simply press <b>Ctrl+V</b> (or Cmd+V) to paste.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
