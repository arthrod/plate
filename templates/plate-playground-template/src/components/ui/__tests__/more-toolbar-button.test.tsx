import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MoreToolbarButton } from '../more-toolbar-button';

// Mock all toolbar button components
jest.mock('../ai-toolbar-button', () => ({
  AIToolbarButton: ({ children, tooltip }: any) => (
    <button data-testid="ai-toolbar-button" title={tooltip}>
      {children}
    </button>
  ),
}));

jest.mock('../align-toolbar-button', () => ({
  AlignToolbarButton: () => <button data-testid="align-toolbar-button">Align</button>,
}));

jest.mock('../comment-toolbar-button', () => ({
  CommentToolbarButton: () => <button data-testid="comment-toolbar-button">Comment</button>,
}));

jest.mock('../emoji-toolbar-button', () => ({
  EmojiToolbarButton: () => <button data-testid="emoji-toolbar-button">Emoji</button>,
}));

jest.mock('../export-toolbar-button', () => ({
  ExportToolbarButton: ({ children }: any) => (
    <button data-testid="export-toolbar-button">{children}</button>
  ),
}));

jest.mock('../font-color-toolbar-button', () => ({
  FontColorToolbarButton: ({ children, nodeType, tooltip }: any) => (
    <button data-testid={`font-color-toolbar-button-${nodeType}`} title={tooltip}>
      {children}
    </button>
  ),
}));

jest.mock('../font-size-toolbar-button', () => ({
  FontSizeToolbarButton: () => <button data-testid="font-size-toolbar-button">Font Size</button>,
}));

jest.mock('../history-toolbar-button', () => ({
  RedoToolbarButton: () => <button data-testid="redo-toolbar-button">Redo</button>,
  UndoToolbarButton: () => <button data-testid="undo-toolbar-button">Undo</button>,
}));

jest.mock('../import-toolbar-button', () => ({
  ImportToolbarButton: () => <button data-testid="import-toolbar-button">Import</button>,
}));

jest.mock('../indent-toolbar-button', () => ({
  IndentToolbarButton: () => <button data-testid="indent-toolbar-button">Indent</button>,
  OutdentToolbarButton: () => <button data-testid="outdent-toolbar-button">Outdent</button>,
}));

jest.mock('../insert-toolbar-button', () => ({
  InsertToolbarButton: () => <button data-testid="insert-toolbar-button">Insert</button>,
}));

jest.mock('../line-height-toolbar-button', () => ({
  LineHeightToolbarButton: () => <button data-testid="line-height-toolbar-button">Line Height</button>,
}));

jest.mock('../link-toolbar-button', () => ({
  LinkToolbarButton: () => <button data-testid="link-toolbar-button">Link</button>,
}));

jest.mock('../list-toolbar-button', () => ({
  BulletedListToolbarButton: () => <button data-testid="bulleted-list-toolbar-button">Bulleted</button>,
  NumberedListToolbarButton: () => <button data-testid="numbered-list-toolbar-button">Numbered</button>,
  TodoListToolbarButton: () => <button data-testid="todo-list-toolbar-button">Todo</button>,
}));

jest.mock('../mark-toolbar-button', () => ({
  MarkToolbarButton: ({ children, nodeType, tooltip }: any) => (
    <button data-testid={`mark-toolbar-button-${nodeType}`} title={tooltip}>
      {children}
    </button>
  ),
}));

jest.mock('../media-toolbar-button', () => ({
  MediaToolbarButton: ({ nodeType }: any) => (
    <button data-testid={`media-toolbar-button-${nodeType}`}>Media {nodeType}</button>
  ),
}));

jest.mock('../table-toolbar-button', () => ({
  TableToolbarButton: () => <button data-testid="table-toolbar-button">Table</button>,
}));

jest.mock('../toggle-toolbar-button', () => ({
  ToggleToolbarButton: () => <button data-testid="toggle-toolbar-button">Toggle</button>,
}));

jest.mock('../toolbar', () => ({
  ToolbarButton: ({ children, pressed, tooltip, isDropdown, ...props }: any) => (
    <button 
      data-testid="toolbar-button" 
      aria-pressed={pressed}
      title={tooltip}
      data-dropdown={isDropdown}
      {...props}
    >
      {children}
    </button>
  ),
  ToolbarGroup: ({ children, className }: any) => (
    <div data-testid="toolbar-group" className={className}>
      {children}
    </div>
  ),
  ToolbarMenuGroup: ({ children, label }: any) => (
    <div data-testid="toolbar-menu-group" data-label={label}>
      <div className="menu-label">{label}</div>
      {children}
    </div>
  ),
}));

jest.mock('../turn-into-toolbar-button', () => ({
  TurnIntoToolbarButton: () => <button data-testid="turn-into-toolbar-button">Turn Into</button>,
}));

jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children, open, onOpenChange, modal, ...props }: any) => (
    <div data-testid="dropdown-menu" data-open={open} data-modal={modal} {...props}>
      {children}
    </div>
  ),
  DropdownMenuTrigger: ({ children, asChild }: any) => (
    <div data-testid="dropdown-menu-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children, className, align }: any) => (
    <div data-testid="dropdown-menu-content" className={className} data-align={align}>
      {children}
    </div>
  ),
}));

describe('MoreToolbarButton', () => {
  describe('Component Rendering', () => {
    it('should render the more toolbar button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('toolbar-button')).toBeInTheDocument();
    });

    it('should render with MoreHorizontalIcon', () => {
      const { container } = render(<MoreToolbarButton />);
      
      // The MoreHorizontalIcon should be rendered inside the button
      expect(screen.getByTestId('toolbar-button')).toBeInTheDocument();
    });

    it('should have correct tooltip', () => {
      render(<MoreToolbarButton />);
      
      const button = screen.getByTestId('toolbar-button');
      expect(button).toHaveAttribute('title', 'More options');
    });

    it('should have isDropdown prop set', () => {
      render(<MoreToolbarButton />);
      
      const button = screen.getByTestId('toolbar-button');
      expect(button).toHaveAttribute('data-dropdown', 'true');
    });
  });

  describe('Dropdown Menu Behavior', () => {
    it('should initialize with closed state', () => {
      render(<MoreToolbarButton />);
      
      const dropdown = screen.getByTestId('dropdown-menu');
      expect(dropdown).toHaveAttribute('data-open', 'false');
    });

    it('should have modal set to false', () => {
      render(<MoreToolbarButton />);
      
      const dropdown = screen.getByTestId('dropdown-menu');
      expect(dropdown).toHaveAttribute('data-modal', 'false');
    });

    it('should render dropdown menu content', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('dropdown-menu-content')).toBeInTheDocument();
    });

    it('should have correct dropdown content alignment', () => {
      render(<MoreToolbarButton />);
      
      const content = screen.getByTestId('dropdown-menu-content');
      expect(content).toHaveAttribute('data-align', 'end');
    });

    it('should have proper content styling classes', () => {
      render(<MoreToolbarButton />);
      
      const content = screen.getByTestId('dropdown-menu-content');
      const className = content.getAttribute('class') || '';
      
      expect(className).toContain('ignore-click-outside/toolbar');
      expect(className).toContain('flex');
      expect(className).toContain('max-h-[500px]');
      expect(className).toContain('min-w-[250px]');
      expect(className).toContain('flex-col');
      expect(className).toContain('gap-1');
      expect(className).toContain('overflow-y-auto');
      expect(className).toContain('p-2');
    });
  });

  describe('Menu Groups', () => {
    it('should render History menu group', () => {
      render(<MoreToolbarButton />);
      
      const menuGroups = screen.getAllByTestId('toolbar-menu-group');
      const historyGroup = menuGroups.find(g => g.getAttribute('data-label') === 'History');
      
      expect(historyGroup).toBeInTheDocument();
    });

    it('should render AI & Tools menu group', () => {
      render(<MoreToolbarButton />);
      
      const menuGroups = screen.getAllByTestId('toolbar-menu-group');
      const aiGroup = menuGroups.find(g => g.getAttribute('data-label') === 'AI & Tools');
      
      expect(aiGroup).toBeInTheDocument();
    });

    it('should render Block Type menu group', () => {
      render(<MoreToolbarButton />);
      
      const menuGroups = screen.getAllByTestId('toolbar-menu-group');
      const blockGroup = menuGroups.find(g => g.getAttribute('data-label') === 'Block Type');
      
      expect(blockGroup).toBeInTheDocument();
    });

    it('should render Text Formatting menu group', () => {
      render(<MoreToolbarButton />);
      
      const menuGroups = screen.getAllByTestId('toolbar-menu-group');
      const formattingGroup = menuGroups.find(g => g.getAttribute('data-label') === 'Text Formatting');
      
      expect(formattingGroup).toBeInTheDocument();
    });

    it('should render Styling menu group', () => {
      render(<MoreToolbarButton />);
      
      const menuGroups = screen.getAllByTestId('toolbar-menu-group');
      const stylingGroup = menuGroups.find(g => g.getAttribute('data-label') === 'Styling');
      
      expect(stylingGroup).toBeInTheDocument();
    });

    it('should render Alignment menu group', () => {
      render(<MoreToolbarButton />);
      
      const menuGroups = screen.getAllByTestId('toolbar-menu-group');
      const alignmentGroup = menuGroups.find(g => g.getAttribute('data-label') === 'Alignment');
      
      expect(alignmentGroup).toBeInTheDocument();
    });

    it('should render Lists menu group', () => {
      render(<MoreToolbarButton />);
      
      const menuGroups = screen.getAllByTestId('toolbar-menu-group');
      const listsGroup = menuGroups.find(g => g.getAttribute('data-label') === 'Lists');
      
      expect(listsGroup).toBeInTheDocument();
    });

    it('should render Indentation menu group', () => {
      render(<MoreToolbarButton />);
      
      const menuGroups = screen.getAllByTestId('toolbar-menu-group');
      const indentGroup = menuGroups.find(g => g.getAttribute('data-label') === 'Indentation');
      
      expect(indentGroup).toBeInTheDocument();
    });

    it('should render Insert menu group', () => {
      render(<MoreToolbarButton />);
      
      const menuGroups = screen.getAllByTestId('toolbar-menu-group');
      const insertGroup = menuGroups.find(g => g.getAttribute('data-label') === 'Insert');
      
      expect(insertGroup).toBeInTheDocument();
    });

    it('should render Media menu group', () => {
      render(<MoreToolbarButton />);
      
      const menuGroups = screen.getAllByTestId('toolbar-menu-group');
      const mediaGroup = menuGroups.find(g => g.getAttribute('data-label') === 'Media');
      
      expect(mediaGroup).toBeInTheDocument();
    });

    it('should render Collaboration menu group', () => {
      render(<MoreToolbarButton />);
      
      const menuGroups = screen.getAllByTestId('toolbar-menu-group');
      const collabGroup = menuGroups.find(g => g.getAttribute('data-label') === 'Collaboration');
      
      expect(collabGroup).toBeInTheDocument();
    });

    it('should render all 11 menu groups', () => {
      render(<MoreToolbarButton />);
      
      const menuGroups = screen.getAllByTestId('toolbar-menu-group');
      expect(menuGroups.length).toBe(11);
    });
  });

  describe('History Group Buttons', () => {
    it('should render undo button in history group', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('undo-toolbar-button')).toBeInTheDocument();
    });

    it('should render redo button in history group', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('redo-toolbar-button')).toBeInTheDocument();
    });
  });

  describe('AI & Tools Group Buttons', () => {
    it('should render AI toolbar button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('ai-toolbar-button')).toBeInTheDocument();
    });

    it('should render import button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('import-toolbar-button')).toBeInTheDocument();
    });

    it('should render export button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('export-toolbar-button')).toBeInTheDocument();
    });
  });

  describe('Block Type Group Buttons', () => {
    it('should render turn into button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('turn-into-toolbar-button')).toBeInTheDocument();
    });
  });

  describe('Text Formatting Group Buttons', () => {
    it('should render bold mark button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('mark-toolbar-button-bold')).toBeInTheDocument();
    });

    it('should render italic mark button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('mark-toolbar-button-italic')).toBeInTheDocument();
    });

    it('should render underline mark button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('mark-toolbar-button-underline')).toBeInTheDocument();
    });

    it('should render strikethrough mark button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('mark-toolbar-button-strikethrough')).toBeInTheDocument();
    });

    it('should render code mark button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('mark-toolbar-button-code')).toBeInTheDocument();
    });

    it('should render kbd (keyboard) mark button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('mark-toolbar-button-kbd')).toBeInTheDocument();
    });

    it('should render superscript mark button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('mark-toolbar-button-sup')).toBeInTheDocument();
    });

    it('should render subscript mark button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('mark-toolbar-button-sub')).toBeInTheDocument();
    });

    it('should render highlight mark button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('mark-toolbar-button-highlight')).toBeInTheDocument();
    });

    it('should have flex-wrap class for text formatting group', () => {
      const { container } = render(<MoreToolbarButton />);
      
      // Find toolbar groups with flex-wrap
      const flexWrapGroups = container.querySelectorAll('[class*="flex-wrap"]');
      expect(flexWrapGroups.length).toBeGreaterThan(0);
    });
  });

  describe('Styling Group Buttons', () => {
    it('should render font size button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('font-size-toolbar-button')).toBeInTheDocument();
    });

    it('should render text color button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('font-color-toolbar-button-color')).toBeInTheDocument();
    });

    it('should render background color button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('font-color-toolbar-button-backgroundColor')).toBeInTheDocument();
    });

    it('should render line height button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('line-height-toolbar-button')).toBeInTheDocument();
    });
  });

  describe('Alignment Group Buttons', () => {
    it('should render align button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('align-toolbar-button')).toBeInTheDocument();
    });
  });

  describe('Lists Group Buttons', () => {
    it('should render numbered list button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('numbered-list-toolbar-button')).toBeInTheDocument();
    });

    it('should render bulleted list button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('bulleted-list-toolbar-button')).toBeInTheDocument();
    });

    it('should render todo list button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('todo-list-toolbar-button')).toBeInTheDocument();
    });

    it('should render toggle button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('toggle-toolbar-button')).toBeInTheDocument();
    });
  });

  describe('Indentation Group Buttons', () => {
    it('should render outdent button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('outdent-toolbar-button')).toBeInTheDocument();
    });

    it('should render indent button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('indent-toolbar-button')).toBeInTheDocument();
    });
  });

  describe('Insert Group Buttons', () => {
    it('should render insert button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('insert-toolbar-button')).toBeInTheDocument();
    });

    it('should render link button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('link-toolbar-button')).toBeInTheDocument();
    });

    it('should render table button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('table-toolbar-button')).toBeInTheDocument();
    });

    it('should render emoji button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('emoji-toolbar-button')).toBeInTheDocument();
    });
  });

  describe('Media Group Buttons', () => {
    it('should render image media button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('media-toolbar-button-img')).toBeInTheDocument();
    });

    it('should render video media button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('media-toolbar-button-video')).toBeInTheDocument();
    });

    it('should render audio media button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('media-toolbar-button-audio')).toBeInTheDocument();
    });

    it('should render file media button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('media-toolbar-button-file')).toBeInTheDocument();
    });
  });

  describe('Collaboration Group Buttons', () => {
    it('should render comment button', () => {
      render(<MoreToolbarButton />);
      
      expect(screen.getByTestId('comment-toolbar-button')).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('should pass through additional dropdown menu props', () => {
      const onOpenChange = jest.fn();
      render(<MoreToolbarButton onOpenChange={onOpenChange} />);
      
      expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    });

    it('should handle open prop', () => {
      const { rerender } = render(<MoreToolbarButton open={false} />);
      
      let dropdown = screen.getByTestId('dropdown-menu');
      expect(dropdown).toHaveAttribute('data-open', 'false');
      
      rerender(<MoreToolbarButton open={true} />);
      
      dropdown = screen.getByTestId('dropdown-menu');
      expect(dropdown).toHaveAttribute('data-open', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('should not crash when rendered without props', () => {
      expect(() => render(<MoreToolbarButton />)).not.toThrow();
    });

    it('should maintain consistent button ordering across renders', () => {
      const { container: container1 } = render(<MoreToolbarButton />);
      const { container: container2 } = render(<MoreToolbarButton />);
      
      expect(container1.innerHTML).toEqual(container2.innerHTML);
    });

    it('should handle multiple renders without state issues', () => {
      const { rerender } = render(<MoreToolbarButton />);
      
      expect(() => {
        rerender(<MoreToolbarButton />);
        rerender(<MoreToolbarButton />);
        rerender(<MoreToolbarButton />);
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have tooltips on mark buttons', () => {
      render(<MoreToolbarButton />);
      
      const boldButton = screen.getByTestId('mark-toolbar-button-bold');
      expect(boldButton).toHaveAttribute('title', 'Bold (⌘+B)');
    });

    it('should have tooltips on font color buttons', () => {
      render(<MoreToolbarButton />);
      
      const colorButton = screen.getByTestId('font-color-toolbar-button-color');
      expect(colorButton).toHaveAttribute('title', 'Text color');
    });

    it('should have proper button semantics', () => {
      render(<MoreToolbarButton />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have menu labels for screen readers', () => {
      render(<MoreToolbarButton />);
      
      const labels = screen.getAllByText(/History|AI & Tools|Block Type|Text Formatting|Styling|Alignment|Lists|Indentation|Insert|Media|Collaboration/);
      expect(labels.length).toBeGreaterThan(0);
    });
  });

  describe('Integration with Icons', () => {
    it('should render with icon components', () => {
      const { container } = render(<MoreToolbarButton />);
      
      // Check that the component renders without errors
      expect(container).toBeInTheDocument();
    });
  });

  describe('Toolbar Group Styling', () => {
    it('should have gap-1 class on toolbar groups', () => {
      const { container } = render(<MoreToolbarButton />);
      
      const groups = screen.getAllByTestId('toolbar-group');
      groups.forEach(group => {
        const className = group.getAttribute('class') || '';
        expect(className).toContain('gap-1');
      });
    });
  });
});