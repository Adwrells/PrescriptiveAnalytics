
import React, { useEffect, useState } from 'react';
import { KnapsackItem, KnapsackResult } from '../types';
import { Package, Box } from 'lucide-react';

interface PackingSimulationProps {
  items: KnapsackItem[];
  result: KnapsackResult;
}

const PackingSimulation: React.FC<PackingSimulationProps> = ({ items, result }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation slightly after mount
    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, [result]);

  // Calculate scaling for visualization
  // Base size + (weight / maxWeight) * variable size
  const maxWeight = Math.max(...items.map(i => i.weight));
  
  const getSize = (weight: number) => {
    const minPx = 40;
    const maxPx = 90;
    // Linear interpolation
    const size = minPx + (weight / maxWeight) * (maxPx - minPx);
    return size;
  };

  const isSelected = (id: number) => result.selectedItems.some(i => i.id === id);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-lg relative overflow-hidden min-h-[400px] flex flex-col items-center justify-between">
      
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <h3 className="text-xl font-bold text-white z-10 mb-6 flex items-center gap-2">
        <Box className="w-6 h-6 text-primary-400" />
        Physical Simulation
      </h3>

      <div className="flex flex-col md:flex-row w-full justify-between items-center gap-12 z-10 flex-grow">
        
        {/* Left Side: Inventory Shelf */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
            <h4 className="text-slate-400 text-sm uppercase tracking-wider mb-4 border-b border-slate-700 pb-2 w-full text-center">Available Items</h4>
            <div className="flex flex-wrap justify-center gap-4 p-4 min-h-[100px]">
                {items.filter(item => !isSelected(item.id)).map(item => (
                    <div 
                        key={item.id}
                        className="rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center flex-col shadow-inner transition-all duration-700 opacity-50 grayscale hover:grayscale-0"
                        style={{ width: getSize(item.weight), height: getSize(item.weight) }}
                    >
                         <span className="text-xs font-bold text-white">{item.weight}kg</span>
                         <span className="text-[10px] text-slate-400 hidden sm:block">{item.name}</span>
                    </div>
                ))}
                 {/* 
                    We render the SELECTED items here too, but absolutely positioned initially 
                    so they can "fly" to the box. In this simple version, we will just render
                    them in the box if animated, or here if not.
                 */}
                 {items.filter(item => isSelected(item.id)).map(item => (
                     <div 
                        key={item.id}
                        className={`rounded-full flex items-center justify-center flex-col shadow-lg transition-all duration-1000 ease-in-out absolute md:static
                            ${animate ? 'opacity-0 scale-0' : 'opacity-100 scale-100 bg-primary-600 border border-primary-400'}
                        `}
                        style={{ 
                            width: getSize(item.weight), 
                            height: getSize(item.weight),
                            // If animating, we hide it here (it appears in box). If not, it sits here.
                            display: animate ? 'none' : 'flex'
                        }}
                    >
                         <span className="text-xs font-bold text-white">{item.weight}kg</span>
                    </div>
                 ))}
            </div>
        </div>

        {/* Right Side: The Knapsack Box */}
        <div className="w-full md:w-1/2 flex flex-col items-center relative">
            
            {/* The Capacity Lid/Label */}
            <div className="text-slate-500 mb-2 font-mono text-xs">Max Capacity: {result.capacity}kg</div>

            {/* The Box Container */}
            <div className={`
                relative w-full max-w-md aspect-square md:aspect-video 
                border-4 border-slate-700 border-t-0 rounded-b-xl 
                bg-gradient-to-b from-slate-800/20 to-slate-800/80 backdrop-blur-sm
                flex flex-wrap content-end justify-center gap-2 p-4 overflow-hidden
                transition-colors duration-1000
                ${animate ? 'border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)]' : ''}
            `}>
                {/* Dashed line for lid */}
                <div className="absolute top-0 left-0 right-0 border-t-2 border-dashed border-slate-600/50"></div>

                {/* Items Inside the Box */}
                {result.selectedItems.map((item, index) => (
                    <div 
                        key={`packed-${item.id}`}
                        className={`
                            rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 
                            border-2 border-primary-300 shadow-[0_4px_12px_rgba(0,0,0,0.3)]
                            flex items-center justify-center flex-col z-20
                            transition-all duration-700 cubic-bezier(.17,.67,.83,.67)
                        `}
                        style={{ 
                            width: getSize(item.weight), 
                            height: getSize(item.weight),
                            transform: animate ? 'translateY(0) scale(1)' : 'translateY(-200px) scale(0)',
                            opacity: animate ? 1 : 0,
                            transitionDelay: `${index * 200}ms`
                        }}
                    >
                        <Package className="w-4 h-4 text-white/50 mb-1" />
                        <span className="text-xs font-extrabold text-white drop-shadow-md">${item.value}</span>
                        <span className="text-[10px] text-indigo-200 font-medium">{item.weight}kg</span>
                    </div>
                ))}
                
                {/* Empty Space visualizer (water level) */}
                <div 
                    className="absolute bottom-0 left-0 right-0 bg-emerald-500/10 transition-all duration-1000 ease-out z-0 border-t border-emerald-500/30"
                    style={{ 
                        height: animate ? `${(result.totalWeight / result.capacity) * 100}%` : '0%' 
                    }}
                ></div>
            </div>
            
            <div className={`mt-4 text-sm font-medium transition-colors duration-700 ${animate ? 'text-emerald-400' : 'text-slate-600'}`}>
                {animate ? 'Optimization Complete: Maximum Value Packed' : 'Preparing packing sequence...'}
            </div>
        </div>

      </div>
    </div>
  );
};

export default PackingSimulation;
