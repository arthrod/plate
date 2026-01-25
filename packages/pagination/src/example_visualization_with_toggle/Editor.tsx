import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  CheckSquare,
  MoreHorizontal,
  MessageSquare,
  Share2,
  Clock,
  ChevronDown,
  File,
  Smartphone,
  Maximize,
} from 'lucide-react';
import type { ViewMode } from '../types';

interface EditorProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Editor: React.FC<EditorProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('paginated');

  return (
    <div className="flex h-screen flex-1 flex-col overflow-hidden bg-white">
      {/* Top Header Row: Breadcrumbs & Meta */}
      <header className="z-20 flex h-12 shrink-0 items-center justify-between border-stone-100 border-b bg-white px-4">
        <div className="flex items-center gap-3">
          {!isSidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="rounded p-1 text-stone-400 hover:bg-stone-100"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </button>
          )}
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <span className="cursor-pointer hover:text-stone-800">Private</span>
            <span className="text-stone-300">/</span>
            <span className="flex cursor-pointer items-center gap-1 rounded px-1 font-medium text-stone-800 hover:bg-stone-50">
              <FileTextIcon size={14} />
              Project Phoenix Proposal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-stone-400 text-xs">Edited 2m ago</span>
          <button className="text-stone-500 transition-colors hover:text-stone-800">
            <Share2 size={18} />
          </button>
          <button className="text-stone-500 transition-colors hover:text-stone-800">
            <MessageSquare size={18} />
          </button>
          <button className="text-stone-500 transition-colors hover:text-stone-800">
            <Clock size={18} />
          </button>
          <button className="text-stone-500 transition-colors hover:text-stone-800">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>

      {/* Toolbar Row */}
      <div className="relative z-10 flex h-12 shrink-0 items-center justify-between border-stone-200 border-b bg-white px-4 shadow-sm">
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
          <SelectButton label="Paragraph" />
          <div className="mx-2 h-4 w-px bg-stone-200" />
          <IconButton icon={<Bold size={16} />} active />
          <IconButton icon={<Italic size={16} />} />
          <IconButton icon={<Underline size={16} />} />
          <IconButton icon={<Strikethrough size={16} />} />
          <div className="mx-2 h-4 w-px bg-stone-200" />
          <IconButton icon={<Code size={16} />} />
          <div className="mx-2 h-4 w-px bg-stone-200" />
          <IconButton icon={<AlignLeft size={16} />} />
          <IconButton icon={<AlignCenter size={16} />} />
          <IconButton icon={<AlignRight size={16} />} />
          <div className="mx-2 h-4 w-px bg-stone-200" />
          <IconButton icon={<List size={16} />} />
          <IconButton icon={<CheckSquare size={16} />} />
        </div>

        {/* View Mode Switcher (The core feature) */}
        <div className="ml-4 flex shrink-0 items-center rounded-lg bg-stone-100 p-0.5">
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
      <div
        className={`relative flex-1 overflow-y-auto transition-colors duration-300 ${
          viewMode === 'paginated'
            ? 'bg-stone-200/60'
            : viewMode === 'focus'
              ? 'bg-white'
              : 'bg-white'
        }`}
      >
        <div
          className={`mx-auto pb-32 transition-all duration-500 ease-in-out ${
            viewMode === 'paginated'
              ? 'flex flex-col items-center gap-8 py-8'
              : viewMode === 'focus'
                ? 'max-w-4xl px-12 py-24'
                : 'max-w-3xl px-12 py-12'
          }`}
        >
          {/* Render content based on view mode */}
          {viewMode === 'paginated' ? (
            <PaginatedContent />
          ) : (
            <ContinuousContent isFocus={viewMode === 'focus'} />
          )}
        </div>
      </div>

      {/* Floating Action Button (Matches screenshot) */}
      <div className="absolute right-8 bottom-8">
        <button className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-white text-red-600 shadow-lg transition-transform hover:scale-105 hover:bg-stone-50">
          <div className="h-4 w-4 rounded-sm border-2 border-red-600" />
        </button>
      </div>
    </div>
  );
};

// --- Subcomponents for Editor Layouts ---

const PaginatedContent = () => (
  <>
    {/* Page 1 */}
    <div className="group relative flex min-h-[1056px] w-[816px] flex-col border border-stone-200/60 bg-white p-16 shadow-sm transition-shadow hover:shadow-md">
      <div className="absolute top-0 left-0 h-1 w-full bg-stone-900/5 opacity-0 transition-opacity group-hover:opacity-100" />

      <h1 className="mb-8 font-bold text-4xl text-stone-900 tracking-tight">
        Project Phoenix Proposal
      </h1>
      <ContentBlocks />

      {/* Page Number */}
      <div className="absolute right-8 bottom-8 font-mono text-stone-300 text-xs">
        1 / 2
      </div>
    </div>

    {/* Page 2 */}
    <div className="group relative flex min-h-[1056px] w-[816px] flex-col border border-stone-200/60 bg-white p-16 shadow-sm transition-shadow hover:shadow-md">
      <div className="h-4" />
      <h3 className="mb-4 font-semibold text-stone-800 text-xl">
        Implementation Timeline
      </h3>
      <div className="mb-6 rounded-lg border border-stone-100 bg-stone-50 p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium text-sm text-stone-600">
            Phase 1: Discovery
          </span>
          <span className="rounded bg-stone-200 px-2 py-0.5 text-stone-600 text-xs">
            Completed
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-stone-200">
          <div className="h-1.5 w-full rounded-full bg-emerald-500" />
        </div>
      </div>
      <p className="mb-4 font-serif text-lg text-stone-700 leading-relaxed">
        The subsequent phases will focus heavily on user acquisition and
        retention metrics. As outlined in the previous section, the marketing
        budget has been allocated primarily to digital channels.
      </p>
      <p className="font-serif text-lg text-stone-700 leading-relaxed">
        We expect to see a return on ad spend (ROAS) of approximately 350% by
        the end of Q3, assuming the market conditions remain stable.
      </p>

      {/* Page Number */}
      <div className="absolute right-8 bottom-8 font-mono text-stone-300 text-xs">
        2 / 2
      </div>
    </div>
  </>
);

const ContinuousContent = ({ isFocus }: { isFocus: boolean }) => (
  <div className={`flex flex-col ${isFocus ? 'animate-fade-in' : ''}`}>
    <h1
      className={`${isFocus ? 'mb-12 text-center text-5xl' : 'mb-8 text-4xl'} font-bold text-stone-900 tracking-tight`}
    >
      Project Phoenix Proposal
    </h1>
    <ContentBlocks />

    <div className="mx-auto my-8 w-24 border-stone-100 border-t" />

    <h3 className="mb-4 font-semibold text-stone-800 text-xl">
      Implementation Timeline
    </h3>
    <p className="mb-4 font-serif text-lg text-stone-700 leading-relaxed">
      The subsequent phases will focus heavily on user acquisition and retention
      metrics. As outlined in the previous section, the marketing budget has
      been allocated primarily to digital channels.
    </p>
  </div>
);

const ContentBlocks = () => (
  <div className="space-y-6">
    <div className="mb-8 flex items-center gap-3 text-stone-400">
      <div className="h-px flex-1 bg-stone-200" />
      <span className="font-medium text-xs uppercase tracking-widest">
        Executive Summary
      </span>
      <div className="h-px flex-1 bg-stone-200" />
    </div>

    <p className="font-serif text-lg text-stone-700 leading-relaxed">
      This proposal outlines the strategic direction for{' '}
      <strong className="font-semibold text-stone-900">Project Phoenix</strong>,
      aiming to revitalize our core infrastructure by Q4 2024. The primary
      objective is to reduce technical debt while simultaneously improving
      system throughput by 40%.
    </p>

    <div className="my-6 border-stone-300 border-l-2 pl-4">
      <p className="font-serif text-lg text-stone-600 italic">
        "Innovation distinguishes between a leader and a follower. We must
        choose to lead."
      </p>
    </div>

    <p className="font-serif text-lg text-stone-700 leading-relaxed">
      Our current architecture suffers from monolithic constraints that prevent
      rapid deployment. Moving to a microservices architecture is no longer
      optional; it is a survival imperative.
    </p>

    <ul className="mt-4 ml-1 space-y-2">
      {[
        'Decouple the authentication service',
        'Migrate user database to partitioned clusters',
        'Implement GraphQL gateway for frontend clients',
        'Establish 99.99% SLA for core APIs',
      ].map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-400" />
          <span className="font-serif text-lg text-stone-700">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

// --- Small UI Components ---

const IconButton = ({
  icon,
  active,
}: {
  icon: React.ReactNode;
  active?: boolean;
}) => (
  <button
    className={`rounded p-1.5 transition-colors ${
      active
        ? 'bg-stone-100 text-stone-900'
        : 'text-stone-400 hover:bg-stone-50 hover:text-stone-700'
    }`}
  >
    {icon}
  </button>
);

const SelectButton = ({ label }: { label: string }) => (
  <button className="flex items-center gap-1 rounded px-2 py-1 text-sm text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900">
    {label}
    <ChevronDown size={12} className="opacity-50" />
  </button>
);

const ViewToggle = ({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-medium text-xs transition-all ${
      active
        ? 'border border-stone-200/50 bg-white text-stone-800 shadow-sm'
        : 'text-stone-500 hover:bg-stone-200/50 hover:text-stone-700'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const FileTextIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export default Editor;
