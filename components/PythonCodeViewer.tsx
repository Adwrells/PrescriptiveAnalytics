import React, { useState } from 'react';
import { Copy, CheckCircle2, Terminal } from 'lucide-react';
import { KnapsackItem } from '../types';
import { generatePythonCode } from '../services/codeGenService';

interface PythonCodeViewerProps {
  items: KnapsackItem[];
  capacity: number;
}

const PythonCodeViewer: React.FC<PythonCodeViewerProps> = ({ items, capacity }) => {
  const [copied, setCopied] = useState(false);
  const code = generatePythonCode(items, capacity);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg mt-8 mb-12 animate-in slide-in-from-bottom-4 duration-700">
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
             <Terminal className="w-5 h-5 text-blue-400" />
           </div>
           <div>
             <h3 className="text-lg font-semibold text-white">Google OR-Tools Solution</h3>
             <p className="text-xs text-slate-400">Python script using <code>ortools.algorithms</code></p>
           </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs font-bold uppercase tracking-wider border border-slate-700 group"
        >
          {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 group-hover:text-white" />}
          {copied ? 'Copied' : 'Copy Code'}
        </button>
      </div>
      <div className="relative">
        <div className="absolute top-0 left-0 w-8 h-full bg-slate-800/20 border-r border-slate-800/50 z-10"></div>
        <pre className="p-6 pl-12 text-sm font-mono text-blue-100 bg-[#0d1117] overflow-x-auto leading-relaxed scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default PythonCodeViewer;