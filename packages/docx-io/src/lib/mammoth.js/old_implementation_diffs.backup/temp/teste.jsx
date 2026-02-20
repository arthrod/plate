import React, { useState } from 'react';
import {
  TextB,
  TextItalic,
  TextUnderline,
  TextStrikethrough,
  FloppyDisk,
  Folder,
  FolderOpen,
  Download,
  Upload,
  Gear,
  ChatCircle,
  PencilSimple,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  ListBullets,
  ListNumbers,
  File,
  Heart,
  Star,
  Bell,
  MagnifyingGlass,
  House,
  Trash,
  Copy,
  Link,
  Image,
  Code,
  Quote,
} from '@phosphor-icons/react';

import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  FileIcon,
  FileTextIcon,
  DownloadIcon,
  GearIcon,
  ChatBubbleIcon,
  Pencil1Icon,
  Pencil2Icon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  HeartIcon,
  StarIcon,
  BellIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  TrashIcon,
  CopyIcon,
  Link2Icon,
  ImageIcon,
  CodeIcon,
  QuoteIcon,
} from '@radix-ui/react-icons';

import {
  Bold as IconoirBold,
  Italic as IconoirItalic,
  Underline as IconoirUnderline,
  SaveFloppyDisk,
  Folder as IconoirFolder,
  Download as IconoirDownload,
  Upload as IconoirUpload,
  Settings as IconoirSettings,
  ChatBubble as IconoirChatBubble,
  EditPencil,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  NumberedListLeft,
  Page,
  Heart as IconoirHeart,
  StarOutline,
  Bell as IconoirBell,
  Search,
  Home,
  Trash as IconoirTrash,
  Copy as IconoirCopy,
  Link as IconoirLink,
  MediaImage,
  Code as IconoirCode,
  QuoteMessage,
} from 'iconoir-react';

const phosphorWeights = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'];

const PhosphorShowcase = ({ Icon, name }) => (
  <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
    <h4 className="text-sm font-medium text-gray-700 mb-3">{name}</h4>
    <div className="flex items-center gap-6">
      {phosphorWeights.map((weight) => (
        <div key={weight} className="flex flex-col items-center gap-1">
          <Icon size={24} weight={weight} className="text-gray-800" />
          <span className="text-xs text-gray-500">{weight}</span>
        </div>
      ))}
    </div>
  </div>
);

const PhosphorSizeShowcase = ({ Icon, name }) => (
  <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
    <h4 className="text-sm font-medium text-gray-700 mb-2">{name} - Size variations</h4>
    <div className="flex items-end gap-4">
      {[16, 20, 24, 32, 40, 48].map((size) => (
        <div key={size} className="flex flex-col items-center gap-1">
          <Icon size={size} weight="regular" className="text-gray-800" />
          <span className="text-xs text-gray-400">{size}px</span>
        </div>
      ))}
    </div>
  </div>
);

const DuotoneColorShowcase = ({ Icon, name }) => {
  const colors = [
    { primary: '#1a1a1a', secondary: '#6366f1' },
    { primary: '#1a1a1a', secondary: '#10b981' },
    { primary: '#1a1a1a', secondary: '#f59e0b' },
    { primary: '#6366f1', secondary: '#c7d2fe' },
    { primary: '#dc2626', secondary: '#fecaca' },
  ];
  
  return (
    <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
      <h4 className="text-sm font-medium text-gray-700 mb-2">{name} - Duotone color variations</h4>
      <div className="flex items-center gap-6">
        {colors.map((color, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <Icon 
              size={32} 
              weight="duotone" 
              style={{ color: color.primary }}
              duotoneColor={color.secondary}
            />
            <span className="text-xs text-gray-400">combo {i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const IconoirStrokeShowcase = ({ Icon, name }) => {
  const strokeWidths = [1, 1.5, 2, 2.5, 3];
  
  return (
    <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
      <h4 className="text-sm font-medium text-gray-700 mb-2">{name} - Stroke width variations</h4>
      <div className="flex items-center gap-6">
        {strokeWidths.map((sw) => (
          <div key={sw} className="flex flex-col items-center gap-1">
            <Icon width={24} height={24} strokeWidth={sw} className="text-gray-800" />
            <span className="text-xs text-gray-400">{sw}px</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ComparisonRow = ({ iconName, phosphor: PhosphorIcon, radix: RadixIcon, iconoir: IconoirIcon }) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50">
    <td className="py-3 px-4 text-sm font-medium text-gray-700">{iconName}</td>
    <td className="py-3 px-4">
      <div className="flex items-center gap-2">
        {PhosphorIcon && (
          <>
            <PhosphorIcon size={20} weight="regular" className="text-gray-700" />
            <PhosphorIcon size={20} weight="bold" className="text-gray-700" />
            <PhosphorIcon size={20} weight="duotone" className="text-indigo-600" />
          </>
        )}
        {!PhosphorIcon && <span className="text-gray-300">—</span>}
      </div>
    </td>
    <td className="py-3 px-4">
      {RadixIcon ? (
        <RadixIcon width={20} height={20} className="text-gray-700" />
      ) : (
        <span className="text-gray-300">—</span>
      )}
    </td>
    <td className="py-3 px-4">
      {IconoirIcon ? (
        <div className="flex items-center gap-2">
          <IconoirIcon width={20} height={20} strokeWidth={1.5} className="text-gray-700" />
          <IconoirIcon width={20} height={20} strokeWidth={2.5} className="text-gray-700" />
        </div>
      ) : (
        <span className="text-gray-300">—</span>
      )}
    </td>
  </tr>
);

const ToolbarDemo = ({ library }) => {
  const [activeFormat, setActiveFormat] = useState(new Set());
  
  const toggleFormat = (format) => {
    const newActive = new Set(activeFormat);
    if (newActive.has(format)) {
      newActive.delete(format);
    } else {
      newActive.add(format);
    }
    setActiveFormat(newActive);
  };
  
  const isActive = (format) => activeFormat.has(format);
  
  if (library === 'phosphor') {
    return (
      <div className="flex items-center gap-1 p-2 bg-gray-100 rounded-lg">
        <button
          onClick={() => toggleFormat('bold')}
          className={`p-2 rounded ${isActive('bold') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200 text-gray-600'}`}
        >
          <TextB size={18} weight={isActive('bold') ? 'bold' : 'regular'} />
        </button>
        <button
          onClick={() => toggleFormat('italic')}
          className={`p-2 rounded ${isActive('italic') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200 text-gray-600'}`}
        >
          <TextItalic size={18} weight={isActive('italic') ? 'bold' : 'regular'} />
        </button>
        <button
          onClick={() => toggleFormat('underline')}
          className={`p-2 rounded ${isActive('underline') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200 text-gray-600'}`}
        >
          <TextUnderline size={18} weight={isActive('underline') ? 'bold' : 'regular'} />
        </button>
        <button
          onClick={() => toggleFormat('strike')}
          className={`p-2 rounded ${isActive('strike') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200 text-gray-600'}`}
        >
          <TextStrikethrough size={18} weight={isActive('strike') ? 'bold' : 'regular'} />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <TextAlignLeft size={18} weight="regular" />
        </button>
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <TextAlignCenter size={18} weight="regular" />
        </button>
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <TextAlignRight size={18} weight="regular" />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <ListBullets size={18} weight="regular" />
        </button>
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <ListNumbers size={18} weight="regular" />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <Link size={18} weight="regular" />
        </button>
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <Image size={18} weight="regular" />
        </button>
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <Code size={18} weight="regular" />
        </button>
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <Quote size={18} weight="regular" />
        </button>
      </div>
    );
  }
  
  if (library === 'radix') {
    return (
      <div className="flex items-center gap-1 p-2 bg-gray-100 rounded-lg">
        <button
          onClick={() => toggleFormat('bold')}
          className={`p-2 rounded ${isActive('bold') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200 text-gray-600'}`}
        >
          <FontBoldIcon width={15} height={15} />
        </button>
        <button
          onClick={() => toggleFormat('italic')}
          className={`p-2 rounded ${isActive('italic') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200 text-gray-600'}`}
        >
          <FontItalicIcon width={15} height={15} />
        </button>
        <button
          onClick={() => toggleFormat('underline')}
          className={`p-2 rounded ${isActive('underline') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200 text-gray-600'}`}
        >
          <UnderlineIcon width={15} height={15} />
        </button>
        <button
          onClick={() => toggleFormat('strike')}
          className={`p-2 rounded ${isActive('strike') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200 text-gray-600'}`}
        >
          <StrikethroughIcon width={15} height={15} />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <TextAlignLeftIcon width={15} height={15} />
        </button>
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <TextAlignCenterIcon width={15} height={15} />
        </button>
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <TextAlignRightIcon width={15} height={15} />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <Link2Icon width={15} height={15} />
        </button>
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <ImageIcon width={15} height={15} />
        </button>
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <CodeIcon width={15} height={15} />
        </button>
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <QuoteIcon width={15} height={15} />
        </button>
      </div>
    );
  }
  
  if (library === 'iconoir') {
    return (
      <div className="flex items-center gap-1 p-2 bg-gray-100 rounded-lg">
        <button
          onClick={() => toggleFormat('bold')}
          className={`p-2 rounded ${isActive('bold') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200 text-gray-600'}`}
        >
          <IconoirBold width={18} height={18} strokeWidth={isActive('bold') ? 2.5 : 1.5} />
        </button>
        <button
          onClick={() => toggleFormat('italic')}
          className={`p-2 rounded ${isActive('italic') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200 text-gray-600'}`}
        >
          <IconoirItalic width={18} height={18} strokeWidth={isActive('italic') ? 2.5 : 1.5} />
        </button>
        <button
          onClick={() => toggleFormat('underline')}
          className={`p-2 rounded ${isActive('underline') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200 text-gray-600'}`}
        >
          <IconoirUnderline width={18} height={18} strokeWidth={isActive('underline') ? 2.5 : 1.5} />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <AlignLeft width={18} height={18} strokeWidth={1.5} />
        </button>
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <AlignCenter width={18} height={18} strokeWidth={1.5} />
        </button>
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <AlignRight width={18} height={18} strokeWidth={1.5} />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <List width={18} height={18} strokeWidth={1.5} />
        </button>
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <NumberedListLeft width={18} height={18} strokeWidth={1.5} />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <IconoirLink width={18} height={18} strokeWidth={1.5} />
        </button>
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <MediaImage width={18} height={18} strokeWidth={1.5} />
        </button>
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <IconoirCode width={18} height={18} strokeWidth={1.5} />
        </button>
        <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
          <QuoteMessage width={18} height={18} strokeWidth={1.5} />
        </button>
      </div>
    );
  }
  
  return null;
};

export default function IconShowcase() {
  const [activeTab, setActiveTab] = useState('comparison');
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Icon Library Showcase</h1>
        <p className="text-gray-600 mb-6">Compare Phosphor, Radix, and Iconoir icons for your text editor</p>
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {[
            { id: 'comparison', label: 'Side-by-Side' },
            { id: 'phosphor', label: 'Phosphor Weights' },
            { id: 'duotone', label: 'Duotone Colors' },
            { id: 'iconoir', label: 'Iconoir Strokes' },
            { id: 'toolbars', label: 'Toolbar Demos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Icon</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Phosphor
                    <span className="text-xs font-normal text-gray-400 ml-1">(regular → bold → duotone)</span>
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Radix
                    <span className="text-xs font-normal text-gray-400 ml-1">(15×15)</span>
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Iconoir
                    <span className="text-xs font-normal text-gray-400 ml-1">(1.5px → 2.5px)</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <ComparisonRow iconName="Bold" phosphor={TextB} radix={FontBoldIcon} iconoir={IconoirBold} />
                <ComparisonRow iconName="Italic" phosphor={TextItalic} radix={FontItalicIcon} iconoir={IconoirItalic} />
                <ComparisonRow iconName="Underline" phosphor={TextUnderline} radix={UnderlineIcon} iconoir={IconoirUnderline} />
                <ComparisonRow iconName="Strikethrough" phosphor={TextStrikethrough} radix={StrikethroughIcon} iconoir={null} />
                <ComparisonRow iconName="Save" phosphor={FloppyDisk} radix={null} iconoir={SaveFloppyDisk} />
                <ComparisonRow iconName="Folder" phosphor={Folder} radix={null} iconoir={IconoirFolder} />
                <ComparisonRow iconName="File" phosphor={File} radix={FileTextIcon} iconoir={Page} />
                <ComparisonRow iconName="Download" phosphor={Download} radix={DownloadIcon} iconoir={IconoirDownload} />
                <ComparisonRow iconName="Upload" phosphor={Upload} radix={null} iconoir={IconoirUpload} />
                <ComparisonRow iconName="Settings" phosphor={Gear} radix={GearIcon} iconoir={IconoirSettings} />
                <ComparisonRow iconName="Chat" phosphor={ChatCircle} radix={ChatBubbleIcon} iconoir={IconoirChatBubble} />
                <ComparisonRow iconName="Edit" phosphor={PencilSimple} radix={Pencil1Icon} iconoir={EditPencil} />
                <ComparisonRow iconName="Heart" phosphor={Heart} radix={HeartIcon} iconoir={IconoirHeart} />
                <ComparisonRow iconName="Star" phosphor={Star} radix={StarIcon} iconoir={StarOutline} />
                <ComparisonRow iconName="Search" phosphor={MagnifyingGlass} radix={MagnifyingGlassIcon} iconoir={Search} />
                <ComparisonRow iconName="Home" phosphor={House} radix={HomeIcon} iconoir={Home} />
                <ComparisonRow iconName="Trash" phosphor={Trash} radix={TrashIcon} iconoir={IconoirTrash} />
                <ComparisonRow iconName="Copy" phosphor={Copy} radix={CopyIcon} iconoir={IconoirCopy} />
                <ComparisonRow iconName="Link" phosphor={Link} radix={Link2Icon} iconoir={IconoirLink} />
                <ComparisonRow iconName="Image" phosphor={Image} radix={ImageIcon} iconoir={MediaImage} />
                <ComparisonRow iconName="Code" phosphor={Code} radix={CodeIcon} iconoir={IconoirCode} />
                <ComparisonRow iconName="Quote" phosphor={Quote} radix={QuoteIcon} iconoir={QuoteMessage} />
              </tbody>
            </table>
          </div>
        )}
        
        {/* Phosphor Weights Tab */}
        {activeTab === 'phosphor' && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-4">
              Phosphor offers 6 weight variants: thin, light, regular, bold, fill, and duotone.
              This flexibility allows you to use different weights for different states (e.g., bold for active).
            </p>
            <PhosphorShowcase Icon={TextB} name="Bold (TextB)" />
            <PhosphorShowcase Icon={FloppyDisk} name="Save (FloppyDisk)" />
            <PhosphorShowcase Icon={Folder} name="Folder" />
            <PhosphorShowcase Icon={Heart} name="Heart" />
            <PhosphorShowcase Icon={Star} name="Star" />
            <PhosphorShowcase Icon={Bell} name="Bell" />
            <PhosphorShowcase Icon={ChatCircle} name="Chat (ChatCircle)" />
            <PhosphorShowcase Icon={Gear} name="Settings (Gear)" />
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Size Variations</h3>
              <PhosphorSizeShowcase Icon={Heart} name="Heart" />
              <PhosphorSizeShowcase Icon={Folder} name="Folder" />
            </div>
          </div>
        )}
        
        {/* Duotone Tab */}
        {activeTab === 'duotone' && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-4">
              Phosphor's duotone style creates sophisticated depth by using two colors.
              The secondary color fills interior shapes while the primary defines outlines.
            </p>
            <DuotoneColorShowcase Icon={Folder} name="Folder" />
            <DuotoneColorShowcase Icon={FolderOpen} name="FolderOpen" />
            <DuotoneColorShowcase Icon={Heart} name="Heart" />
            <DuotoneColorShowcase Icon={Star} name="Star" />
            <DuotoneColorShowcase Icon={Bell} name="Bell" />
            <DuotoneColorShowcase Icon={ChatCircle} name="ChatCircle" />
            <DuotoneColorShowcase Icon={File} name="File" />
            <DuotoneColorShowcase Icon={FloppyDisk} name="FloppyDisk" />
            <DuotoneColorShowcase Icon={Gear} name="Gear" />
            
            <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <h4 className="text-sm font-medium text-indigo-800 mb-2">Usage tip</h4>
              <p className="text-sm text-indigo-700">
                Use duotone for decorative elements, empty states, and visual hierarchy. 
                Reserve regular/bold weights for functional toolbar icons.
              </p>
            </div>
          </div>
        )}
        
        {/* Iconoir Strokes Tab */}
        {activeTab === 'iconoir' && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-4">
              Iconoir allows customizable stroke width (default 1.5px). 
              Thicker strokes create bolder presence; thinner strokes feel more refined.
            </p>
            <IconoirStrokeShowcase Icon={IconoirBold} name="Bold" />
            <IconoirStrokeShowcase Icon={IconoirFolder} name="Folder" />
            <IconoirStrokeShowcase Icon={IconoirDownload} name="Download" />
            <IconoirStrokeShowcase Icon={IconoirSettings} name="Settings" />
            <IconoirStrokeShowcase Icon={IconoirChatBubble} name="Chat" />
            <IconoirStrokeShowcase Icon={EditPencil} name="Edit" />
            <IconoirStrokeShowcase Icon={IconoirHeart} name="Heart" />
            <IconoirStrokeShowcase Icon={StarOutline} name="Star" />
            <IconoirStrokeShowcase Icon={Search} name="Search" />
            <IconoirStrokeShowcase Icon={Home} name="Home" />
          </div>
        )}
        
        {/* Toolbar Demos Tab */}
        {activeTab === 'toolbars' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-600 mb-4">
              Interactive toolbar demos. Click icons to see active states.
              Notice how each library handles the active/inactive visual distinction.
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Phosphor Toolbar
                  <span className="text-xs text-gray-400 ml-2">Uses weight change (regular → bold) for active state</span>
                </h3>
                <ToolbarDemo library="phosphor" />
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Radix Toolbar
                  <span className="text-xs text-gray-400 ml-2">15×15 grid, crisp at small sizes</span>
                </h3>
                <ToolbarDemo library="radix" />
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Iconoir Toolbar
                  <span className="text-xs text-gray-400 ml-2">Uses stroke width change (1.5px → 2.5px) for active state</span>
                </h3>
                <ToolbarDemo library="iconoir" />
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Recommendation for Plate.js</h4>
              <p className="text-sm text-gray-600">
                For a Plate.js editor, the <strong>Phosphor + Radix</strong> combination works well:
                use Radix's 15px icons for the dense formatting toolbar (they're razor-sharp at small sizes),
                and Phosphor's duotone for document icons, empty states, and sidebar elements where you want more visual interest.
              </p>
            </div>
          </div>
        )}
        
        {/* Package Info */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg text-gray-100">
          <h3 className="text-sm font-semibold mb-2">Installation</h3>
          <code className="text-xs block bg-gray-900 p-3 rounded">
            bun add @phosphor-icons/react @radix-ui/react-icons iconoir-react
          </code>
          <div className="mt-3 text-xs text-gray-400">
            <p><strong>@phosphor-icons/react</strong> — 6 weights, duotone, 1500+ icons</p>
            <p><strong>@radix-ui/react-icons</strong> — 15×15 grid, 318 icons, used by shadcn/ui</p>
            <p><strong>iconoir-react</strong> — customizable stroke, 1671 icons, MIT</p>
          </div>
        </div>
      </div>
    </div>
  );
}

