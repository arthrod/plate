import React, { useState } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, Code, 
  AlignLeft, AlignCenter, AlignRight, 
  List, CheckSquare, Link, Image as ImageIcon, 
  MoreHorizontal, MessageSquare, Share2, Clock, 
  ChevronDown, Monitor, File, Smartphone, Maximize
} from 'lucide-react';
import { ViewMode } from '../types';

interface EditorProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Editor: React.FC<EditorProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('paginated');

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
      {/* Top Header Row: Breadcrumbs & Meta */}
      <header className="h-12 flex items-center justify-between px-4 border-b border-stone-100 bg-white shrink-0 z-20">
        <div className="flex items-center gap-3">
           {!isSidebarOpen && (
            <button onClick={toggleSidebar} className="p-1 hover:bg-stone-100 rounded text-stone-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
            </button>
           )}
           <div className="flex items-center gap-2 text-sm text-stone-500">
             <span className="hover:text-stone-800 cursor-pointer">Private</span>
             <span className="text-stone-300">/</span>
             <span className="font-medium text-stone-800 flex items-center gap-1 cursor-pointer hover:bg-stone-50 px-1 rounded">
               <FileTextIcon size={14} />
               Project Phoenix Proposal
             </span>
           </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-400">Edited 2m ago</span>
          <button className="text-stone-500 hover:text-stone-800 transition-colors">
            <Share2 size={18} />
          </button>
          <button className="text-stone-500 hover:text-stone-800 transition-colors">
            <MessageSquare size={18} />
          </button>
          <button className="text-stone-500 hover:text-stone-800 transition-colors">
            <Clock size={18} />
          </button>
          <button className="text-stone-500 hover:text-stone-800 transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>

      {/* Toolbar Row */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-stone-200 bg-white shrink-0 z-10 shadow-sm relative">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <SelectButton label="Paragraph" />
          <div className="w-px h-4 bg-stone-200 mx-2" />
          <IconButton icon={<Bold size={16} />} active />
          <IconButton icon={<Italic size={16} />} />
          <IconButton icon={<Underline size={16} />} />
          <IconButton icon={<Strikethrough size={16} />} />
          <div className="w-px h-4 bg-stone-200 mx-2" />
          <IconButton icon={<Code size={16} />} />
          <div className="w-px h-4 bg-stone-200 mx-2" />
          <IconButton icon={<AlignLeft size={16} />} />
          <IconButton icon={<AlignCenter size={16} />} />
          <IconButton icon={<AlignRight size={16} />} />
          <div className="w-px h-4 bg-stone-200 mx-2" />
          <IconButton icon={<List size={16} />} />
          <IconButton icon={<CheckSquare size={16} />} />
        </div>

        {/* View Mode Switcher (The core feature) */}
        <div className="flex items-center bg-stone-100 rounded-lg p-0.5 ml-4 shrink-0">
          <ViewToggle 
            active={viewMode === 'continuous'} 
            onClick={() => setViewMode('continuous')} 
            icon={<Smartphone size={14} />}
            label="Fluid"
          />
          <ViewToggle 
            active={viewMode === 'paginated'} 
            onClick={() => setViewMode('paginated')} 
            icon={<File size={14} />}
            label="Page"
          />
          <ViewToggle 
            active={viewMode === 'focus'} 
            onClick={() => setViewMode('focus')} 
            icon={<Maximize size={14} />}
            label="Focus"
          />
        </div>
      </div>

      {/* Editor Surface / Canvas */}
      <div className={`flex-1 overflow-y-auto relative transition-colors duration-300 ${
        viewMode === 'paginated' ? 'bg-stone-200/60' : 
        viewMode === 'focus' ? 'bg-white' : 
        'bg-white'
      }`}>
        <div className={`mx-auto transition-all duration-500 ease-in-out pb-32 ${
           viewMode === 'paginated' ? 'py-8 flex flex-col gap-8 items-center' :
           viewMode === 'focus' ? 'max-w-4xl py-24 px-12' :
           'max-w-3xl py-12 px-12'
        }`}>
          {/* Render content based on view mode */}
          {viewMode === 'paginated' ? (
             <PaginatedContent />
          ) : (
             <ContinuousContent isFocus={viewMode === 'focus'} />
          )}
        </div>
      </div>

      {/* Floating Action Button (Matches screenshot) */}
      <div className="absolute bottom-8 right-8">
        <button className="w-12 h-12 bg-white rounded-full shadow-lg border border-stone-200 flex items-center justify-center text-red-600 hover:bg-stone-50 transition-transform hover:scale-105">
          <div className="w-4 h-4 border-2 border-red-600 rounded-sm"></div>
        </button>
      </div>
    </div>
  );
};

// --- Subcomponents for Editor Layouts ---

const PaginatedContent = () => (
  <>
    {/* Page 1 */}
    <div className="w-[816px] min-h-[1056px] bg-white shadow-sm border border-stone-200/60 p-16 flex flex-col relative group transition-shadow hover:shadow-md">
      <div className="absolute top-0 left-0 w-full h-1 bg-stone-900/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <h1 className="text-4xl font-bold text-stone-900 mb-8 tracking-tight">Project Phoenix Proposal</h1>
      <ContentBlocks />
      
      {/* Page Number */}
      <div className="absolute bottom-8 right-8 text-xs text-stone-300 font-mono">1 / 2</div>
    </div>

    {/* Page 2 */}
    <div className="w-[816px] min-h-[1056px] bg-white shadow-sm border border-stone-200/60 p-16 flex flex-col relative group transition-shadow hover:shadow-md">
       <div className="h-4"></div>
       <h3 className="text-xl font-semibold text-stone-800 mb-4">Implementation Timeline</h3>
       <div className="bg-stone-50 rounded-lg p-6 border border-stone-100 mb-6">
         <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-stone-600">Phase 1: Discovery</span>
            <span className="text-xs bg-stone-200 px-2 py-0.5 rounded text-stone-600">Completed</span>
         </div>
         <div className="w-full bg-stone-200 h-1.5 rounded-full">
            <div className="bg-emerald-500 h-1.5 rounded-full w-full"></div>
         </div>
       </div>
       <p className="text-stone-700 leading-relaxed font-serif text-lg mb-4">
         The subsequent phases will focus heavily on user acquisition and retention metrics. As outlined in the previous section, the marketing budget has been allocated primarily to digital channels.
       </p>
       <p className="text-stone-700 leading-relaxed font-serif text-lg">
         We expect to see a return on ad spend (ROAS) of approximately 350% by the end of Q3, assuming the market conditions remain stable.
       </p>

       {/* Page Number */}
      <div className="absolute bottom-8 right-8 text-xs text-stone-300 font-mono">2 / 2</div>
    </div>
  </>
);

const ContinuousContent = ({ isFocus }: { isFocus: boolean }) => (
  <div className={`flex flex-col ${isFocus ? 'animate-fade-in' : ''}`}>
    <h1 className={`${isFocus ? 'text-5xl text-center mb-12' : 'text-4xl mb-8'} font-bold text-stone-900 tracking-tight`}>
      Project Phoenix Proposal
    </h1>
    <ContentBlocks />
    
    <div className="my-8 border-t border-stone-100 w-24 mx-auto"></div>
    
    <h3 className="text-xl font-semibold text-stone-800 mb-4">Implementation Timeline</h3>
    <p className="text-stone-700 leading-relaxed font-serif text-lg mb-4">
      The subsequent phases will focus heavily on user acquisition and retention metrics. As outlined in the previous section, the marketing budget has been allocated primarily to digital channels.
    </p>
  </div>
);

const ContentBlocks = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 text-stone-400 mb-8">
      <div className="h-px bg-stone-200 flex-1"></div>
      <span className="text-xs uppercase tracking-widest font-medium">Executive Summary</span>
      <div className="h-px bg-stone-200 flex-1"></div>
    </div>

    <p className="text-stone-700 leading-relaxed font-serif text-lg">
      This proposal outlines the strategic direction for <strong className="font-semibold text-stone-900">Project Phoenix</strong>, aiming to revitalize our core infrastructure by Q4 2024. The primary objective is to reduce technical debt while simultaneously improving system throughput by 40%.
    </p>

    <div className="pl-4 border-l-2 border-stone-300 my-6">
      <p className="text-stone-600 italic font-serif text-lg">
        "Innovation distinguishes between a leader and a follower. We must choose to lead."
      </p>
    </div>

    <p className="text-stone-700 leading-relaxed font-serif text-lg">
      Our current architecture suffers from monolithic constraints that prevent rapid deployment. Moving to a microservices architecture is no longer optional; it is a survival imperative.
    </p>

    <ul className="space-y-2 mt-4 ml-1">
      {[
        "Decouple the authentication service",
        "Migrate user database to partitioned clusters",
        "Implement GraphQL gateway for frontend clients",
        "Establish 99.99% SLA for core APIs"
      ].map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-stone-400 shrink-0"></div>
          <span className="text-stone-700 font-serif text-lg">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

// --- Small UI Components ---

const IconButton = ({ icon, active }: { icon: React.ReactNode, active?: boolean }) => (
  <button className={`p-1.5 rounded transition-colors ${
    active ? 'bg-stone-100 text-stone-900' : 'text-stone-400 hover:text-stone-700 hover:bg-stone-50'
  }`}>
    {icon}
  </button>
);

const SelectButton = ({ label }: { label: string }) => (
  <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-50 text-sm text-stone-600 hover:text-stone-900 transition-colors">
    {label}
    <ChevronDown size={12} className="opacity-50" />
  </button>
);

const ViewToggle = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
      active 
        ? 'bg-white text-stone-800 shadow-sm border border-stone-200/50' 
        : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200/50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const FileTextIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
);

export default Editor;