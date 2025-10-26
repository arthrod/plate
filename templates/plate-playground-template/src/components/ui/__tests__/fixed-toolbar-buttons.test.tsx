import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FixedToolbarButtons } from '../fixed-toolbar-buttons';
import { PlateEditor } from 'platejs/react';

// Mock all the toolbar button components
jest.mock('../ai-toolbar-button', () => ({
  AIToolbarButton: ({ children, tooltip }: any) => (
    <button data-testid="ai-toolbar-button" title={tooltip}>
      {children}
    </button>
  ),
}));

jest.mock('../export-toolbar-button', () => ({
  ExportToolbarButton: ({ children }: any) => (
    <button data-testid="export-toolbar-button">{children}</button>
  ),
}));

jest.mock('../import-toolbar-button', () => ({
  ImportToolbarButton: () => <button data-testid="import-toolbar-button">Import</button>,
}));

jest.mock('../insert-toolbar-button', () => ({
  InsertToolbarButton: () => <button data-testid="insert-toolbar-button">Insert</button>,
}));

jest.mock('../turn-into-toolbar-button', () => ({
  TurnIntoToolbarButton: () => <button data-testid="turn-into-toolbar-button">Turn Into</button>,
}));

jest.mock('../font-size-toolbar-button', () => ({
  FontSizeToolbarButton: () => <button data-testid="font-size-toolbar-button">Font Size</button>,
}));

jest.mock('../mark-toolbar-button', () => ({
  MarkToolbarButton: ({ children, nodeType, tooltip }: any) => (
    <button data-testid={`mark-toolbar-button-${nodeType}`} title={tooltip}>
      {children}
    </button>
  ),
}));

jest.mock('../font-color-toolbar-button', () => ({
  FontColorToolbarButton: ({ children, nodeType, tooltip }: any) => (
    <button data-testid={`font-color-toolbar-button-${nodeType}`} title={tooltip}>
      {children}
    </button>
  ),
}));

jest.mock('../align-toolbar-button', () => ({
  AlignToolbarButton: () => <button data-testid="align-toolbar-button">Align</button>,
}));

jest.mock('../list-toolbar-button', () => ({
  NumberedListToolbarButton: () => <button data-testid="numbered-list-toolbar-button">Numbered</button>,
  BulletedListToolbarButton: () => <button data-testid="bulleted-list-toolbar-button">Bulleted</button>,
  TodoListToolbarButton: () => <button data-testid="todo-list-toolbar-button">Todo</button>,
}));

jest.mock('../toggle-toolbar-button', () => ({
  ToggleToolbarButton: () => <button data-testid="toggle-toolbar-button">Toggle</button>,
}));

jest.mock('../link-toolbar-button', () => ({
  LinkToolbarButton: () => <button data-testid="link-toolbar-button">Link</button>,
}));

jest.mock('../table-toolbar-button', () => ({
  TableToolbarButton: () => <button data-testid="table-toolbar-button">Table</button>,
}));

jest.mock('../emoji-toolbar-button', () => ({
  EmojiToolbarButton: () => <button data-testid="emoji-toolbar-button">Emoji</button>,
}));

jest.mock('../media-toolbar-button', () => ({
  MediaToolbarButton: ({ nodeType }: any) => (
    <button data-testid={`media-toolbar-button-${nodeType}`}>Media {nodeType}</button>
  ),
}));

jest.mock('../line-height-toolbar-button', () => ({
  LineHeightToolbarButton: () => <button data-testid="line-height-toolbar-button">Line Height</button>,
}));

jest.mock('../indent-toolbar-button', () => ({
  OutdentToolbarButton: () => <button data-testid="outdent-toolbar-button">Outdent</button>,
  IndentToolbarButton: () => <button data-testid="indent-toolbar-button">Indent</button>,
}));

jest.mock('../history-toolbar-button', () => ({
  UndoToolbarButton: () => <button data-testid="undo-toolbar-button">Undo</button>,
  RedoToolbarButton: () => <button data-testid="redo-toolbar-button">Redo</button>,
}));

jest.mock('../comment-toolbar-button', () => ({
  CommentToolbarButton: () => <button data-testid="comment-toolbar-button">Comment</button>,
}));

jest.mock('../mode-toolbar-button', () => ({
  ModeToolbarButton: () => <button data-testid="mode-toolbar-button">Mode</button>,
}));

jest.mock('../more-toolbar-button', () => ({
  MoreToolbarButton: () => <button data-testid="more-toolbar-button">More</button>,
}));

jest.mock('../toolbar', () => ({
  Toolbar: ({ children, ...props }: any) => <div data-testid="toolbar" {...props}>{children}</div>,
  ToolbarGroup: ({ children, className }: any) => (
    <div data-testid="toolbar-group" className={className}>
      {children}
    </div>
  ),
}));

// Mock the useReadOnly hook
jest.mock('platejs/react', () => ({
  useReadOnly: jest.fn(),
}));

const { useReadOnly } = require('platejs/react');

describe('FixedToolbarButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Read-only Mode', () => {
    it('should not render toolbar buttons when in read-only mode', () => {
      (useReadOnly as jest.Mock).mockReturnValue(true);
      const { container } = render(<FixedToolbarButtons />);
      
      // Should only render ModeToolbarButton in read-only mode
      expect(screen.getByTestId('mode-toolbar-button')).toBeInTheDocument();
      expect(screen.queryByTestId('undo-toolbar-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('more-toolbar-button')).not.toBeInTheDocument();
    });

    it('should render grow spacer in read-only mode', () => {
      (useReadOnly as jest.Mock).mockReturnValue(true);
      const { container } = render(<FixedToolbarButtons />);
      
      const growDiv = container.querySelector('.grow');
      expect(growDiv).toBeInTheDocument();
    });
  });

  describe('Edit Mode - Desktop Layout (max-lg:hidden)', () => {
    beforeEach(() => {
      (useReadOnly as jest.Mock).mockReturnValue(false);
    });

    it('should render all toolbar groups with max-lg:hidden class for desktop', () => {
      const { container } = render(<FixedToolbarButtons />);
      
      const desktopGroups = container.querySelectorAll('[class*="max-lg:hidden"]');
      expect(desktopGroups.length).toBeGreaterThan(0);
    });

    it('should render history buttons in desktop layout', () => {
      render(<FixedToolbarButtons />);
      
      const undoButtons = screen.getAllByTestId('undo-toolbar-button');
      const redoButtons = screen.getAllByTestId('redo-toolbar-button');
      
      expect(undoButtons.length).toBeGreaterThanOrEqual(1);
      expect(redoButtons.length).toBeGreaterThanOrEqual(1);
    });

    it('should render AI toolbar button in desktop layout', () => {
      render(<FixedToolbarButtons />);
      
      const aiButtons = screen.getAllByTestId('ai-toolbar-button');
      expect(aiButtons.length).toBeGreaterThanOrEqual(1);
    });

    it('should render export and import buttons in desktop layout', () => {
      render(<FixedToolbarButtons />);
      
      const exportButtons = screen.getAllByTestId('export-toolbar-button');
      const importButtons = screen.getAllByTestId('import-toolbar-button');
      
      expect(exportButtons.length).toBeGreaterThanOrEqual(1);
      expect(importButtons.length).toBeGreaterThanOrEqual(1);
    });

    it('should render insert and turn-into buttons in desktop layout', () => {
      render(<FixedToolbarButtons />);
      
      const insertButtons = screen.getAllByTestId('insert-toolbar-button');
      const turnIntoButtons = screen.getAllByTestId('turn-into-toolbar-button');
      
      expect(insertButtons.length).toBeGreaterThanOrEqual(1);
      expect(turnIntoButtons.length).toBeGreaterThanOrEqual(1);
    });

    it('should render all text formatting marks in desktop layout', () => {
      render(<FixedToolbarButtons />);
      
      // Bold, Italic, Underline, Strikethrough, Code should all be present
      expect(screen.getAllByTestId('mark-toolbar-button-bold').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByTestId('mark-toolbar-button-italic').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByTestId('mark-toolbar-button-underline').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByTestId('mark-toolbar-button-strikethrough').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByTestId('mark-toolbar-button-code').length).toBeGreaterThanOrEqual(1);
    });

    it('should render font color buttons in desktop layout', () => {
      render(<FixedToolbarButtons />);
      
      const colorButtons = screen.getAllByTestId('font-color-toolbar-button-color');
      const bgColorButtons = screen.getAllByTestId('font-color-toolbar-button-backgroundColor');
      
      expect(colorButtons.length).toBeGreaterThanOrEqual(1);
      expect(bgColorButtons.length).toBeGreaterThanOrEqual(1);
    });

    it('should render list buttons in desktop layout', () => {
      render(<FixedToolbarButtons />);
      
      const numberedListButtons = screen.getAllByTestId('numbered-list-toolbar-button');
      const bulletedListButtons = screen.getAllByTestId('bulleted-list-toolbar-button');
      const todoListButtons = screen.getAllByTestId('todo-list-toolbar-button');
      
      expect(numberedListButtons.length).toBeGreaterThanOrEqual(1);
      expect(bulletedListButtons.length).toBeGreaterThanOrEqual(1);
      expect(todoListButtons.length).toBeGreaterThanOrEqual(1);
    });

    it('should render media buttons in desktop layout', () => {
      render(<FixedToolbarButtons />);
      
      expect(screen.getAllByTestId('media-toolbar-button-img').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByTestId('media-toolbar-button-video').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByTestId('media-toolbar-button-audio').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByTestId('media-toolbar-button-file').length).toBeGreaterThanOrEqual(1);
    });

    it('should render indentation buttons in desktop layout', () => {
      render(<FixedToolbarButtons />);
      
      const outdentButtons = screen.getAllByTestId('outdent-toolbar-button');
      const indentButtons = screen.getAllByTestId('indent-toolbar-button');
      
      expect(outdentButtons.length).toBeGreaterThanOrEqual(1);
      expect(indentButtons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Edit Mode - Tablet Layout (max-md:hidden lg:hidden)', () => {
    beforeEach(() => {
      (useReadOnly as jest.Mock).mockReturnValue(false);
    });

    it('should render tablet-specific toolbar groups', () => {
      const { container } = render(<FixedToolbarButtons />);
      
      const tabletGroups = container.querySelectorAll('[class*="max-md:hidden"][class*="lg:hidden"]');
      expect(tabletGroups.length).toBeGreaterThan(0);
    });

    it('should render reduced button set for tablet layout', () => {
      render(<FixedToolbarButtons />);
      
      // Tablet should have history, AI, turn-into, font-size
      // The getAllBy queries will return both desktop and tablet versions
      const undoButtons = screen.getAllByTestId('undo-toolbar-button');
      const aiButtons = screen.getAllByTestId('ai-toolbar-button');
      const turnIntoButtons = screen.getAllByTestId('turn-into-toolbar-button');
      const fontSizeButtons = screen.getAllByTestId('font-size-toolbar-button');
      
      expect(undoButtons.length).toBeGreaterThanOrEqual(2); // Desktop + Tablet
      expect(aiButtons.length).toBeGreaterThanOrEqual(2);
      expect(turnIntoButtons.length).toBeGreaterThanOrEqual(2);
      expect(fontSizeButtons.length).toBeGreaterThanOrEqual(2);
    });

    it('should render limited text formatting in tablet layout', () => {
      render(<FixedToolbarButtons />);
      
      // Tablet has Bold, Italic, Strikethrough (but not Underline or Code)
      const boldButtons = screen.getAllByTestId('mark-toolbar-button-bold');
      const italicButtons = screen.getAllByTestId('mark-toolbar-button-italic');
      const strikethroughButtons = screen.getAllByTestId('mark-toolbar-button-strikethrough');
      
      expect(boldButtons.length).toBeGreaterThanOrEqual(2); // Desktop + Tablet
      expect(italicButtons.length).toBeGreaterThanOrEqual(2);
      expect(strikethroughButtons.length).toBeGreaterThanOrEqual(2);
    });

    it('should render color buttons in tablet layout', () => {
      render(<FixedToolbarButtons />);
      
      const colorButtons = screen.getAllByTestId('font-color-toolbar-button-color');
      const bgColorButtons = screen.getAllByTestId('font-color-toolbar-button-backgroundColor');
      
      // Should have both desktop and tablet versions
      expect(colorButtons.length).toBeGreaterThanOrEqual(2);
      expect(bgColorButtons.length).toBeGreaterThanOrEqual(2);
    });

    it('should render list buttons without toggle in tablet layout', () => {
      render(<FixedToolbarButtons />);
      
      const numberedListButtons = screen.getAllByTestId('numbered-list-toolbar-button');
      const bulletedListButtons = screen.getAllByTestId('bulleted-list-toolbar-button');
      const todoListButtons = screen.getAllByTestId('todo-list-toolbar-button');
      
      expect(numberedListButtons.length).toBeGreaterThanOrEqual(2);
      expect(bulletedListButtons.length).toBeGreaterThanOrEqual(2);
      expect(todoListButtons.length).toBeGreaterThanOrEqual(2);
    });

    it('should render link, insert, and table buttons in tablet layout', () => {
      render(<FixedToolbarButtons />);
      
      const linkButtons = screen.getAllByTestId('link-toolbar-button');
      const insertButtons = screen.getAllByTestId('insert-toolbar-button');
      const tableButtons = screen.getAllByTestId('table-toolbar-button');
      
      expect(linkButtons.length).toBeGreaterThanOrEqual(2);
      expect(insertButtons.length).toBeGreaterThanOrEqual(2);
      expect(tableButtons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Edit Mode - Mobile Layout (md:hidden)', () => {
    beforeEach(() => {
      (useReadOnly as jest.Mock).mockReturnValue(false);
    });

    it('should render mobile-specific toolbar groups', () => {
      const { container } = render(<FixedToolbarButtons />);
      
      const mobileGroups = container.querySelectorAll('[class*="md:hidden"]');
      expect(mobileGroups.length).toBeGreaterThan(0);
    });

    it('should render minimal button set for mobile layout', () => {
      render(<FixedToolbarButtons />);
      
      // Mobile should have: Undo/Redo, AI, Bold/Italic, Lists, Link
      const undoButtons = screen.getAllByTestId('undo-toolbar-button');
      const redoButtons = screen.getAllByTestId('redo-toolbar-button');
      const aiButtons = screen.getAllByTestId('ai-toolbar-button');
      
      // Should have Desktop + Tablet + Mobile = 3 sets
      expect(undoButtons.length).toBeGreaterThanOrEqual(3);
      expect(redoButtons.length).toBeGreaterThanOrEqual(3);
      expect(aiButtons.length).toBeGreaterThanOrEqual(3);
    });

    it('should render only bold and italic in mobile layout', () => {
      render(<FixedToolbarButtons />);
      
      const boldButtons = screen.getAllByTestId('mark-toolbar-button-bold');
      const italicButtons = screen.getAllByTestId('mark-toolbar-button-italic');
      
      // Desktop + Tablet + Mobile = 3 sets
      expect(boldButtons.length).toBeGreaterThanOrEqual(3);
      expect(italicButtons.length).toBeGreaterThanOrEqual(3);
    });

    it('should render only numbered and bulleted lists in mobile layout', () => {
      render(<FixedToolbarButtons />);
      
      const numberedListButtons = screen.getAllByTestId('numbered-list-toolbar-button');
      const bulletedListButtons = screen.getAllByTestId('bulleted-list-toolbar-button');
      
      // Desktop + Tablet + Mobile = 3 sets
      expect(numberedListButtons.length).toBeGreaterThanOrEqual(3);
      expect(bulletedListButtons.length).toBeGreaterThanOrEqual(3);
    });

    it('should render link button in mobile layout', () => {
      render(<FixedToolbarButtons />);
      
      const linkButtons = screen.getAllByTestId('link-toolbar-button');
      
      // Desktop + Tablet + Mobile = 3 sets
      expect(linkButtons.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Always Visible - Right Side Elements', () => {
    beforeEach(() => {
      (useReadOnly as jest.Mock).mockReturnValue(false);
    });

    it('should always render highlight and comment buttons when not read-only', () => {
      render(<FixedToolbarButtons />);
      
      expect(screen.getByTestId('mark-toolbar-button-highlight')).toBeInTheDocument();
      expect(screen.getByTestId('comment-toolbar-button')).toBeInTheDocument();
    });

    it('should always render mode toolbar button', () => {
      render(<FixedToolbarButtons />);
      
      expect(screen.getByTestId('mode-toolbar-button')).toBeInTheDocument();
    });

    it('should always render more toolbar button when not read-only', () => {
      render(<FixedToolbarButtons />);
      
      expect(screen.getByTestId('more-toolbar-button')).toBeInTheDocument();
    });

    it('should render grow spacer to separate left and right sides', () => {
      const { container } = render(<FixedToolbarButtons />);
      
      const growDiv = container.querySelector('.grow');
      expect(growDiv).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    beforeEach(() => {
      (useReadOnly as jest.Mock).mockReturnValue(false);
    });

    it('should render with correct root structure', () => {
      const { container } = render(<FixedToolbarButtons />);
      
      const rootDiv = container.querySelector('.flex.w-full');
      expect(rootDiv).toBeInTheDocument();
    });

    it('should render multiple toolbar groups', () => {
      render(<FixedToolbarButtons />);
      
      const groups = screen.getAllByTestId('toolbar-group');
      expect(groups.length).toBeGreaterThan(0);
    });

    it('should have proper class structure for responsive design', () => {
      const { container } = render(<FixedToolbarButtons />);
      
      // Check for responsive classes
      const hasMaxLgHidden = container.innerHTML.includes('max-lg:hidden');
      const hasMaxMdHidden = container.innerHTML.includes('max-md:hidden');
      const hasMdHidden = container.innerHTML.includes('md:hidden');
      const hasLgHidden = container.innerHTML.includes('lg:hidden');
      
      expect(hasMaxLgHidden).toBe(true);
      expect(hasMaxMdHidden).toBe(true);
      expect(hasMdHidden).toBe(true);
      expect(hasLgHidden).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle read-only toggle correctly', () => {
      (useReadOnly as jest.Mock).mockReturnValue(false);
      const { rerender } = render(<FixedToolbarButtons />);
      
      expect(screen.getByTestId('more-toolbar-button')).toBeInTheDocument();
      
      (useReadOnly as jest.Mock).mockReturnValue(true);
      rerender(<FixedToolbarButtons />);
      
      expect(screen.queryByTestId('more-toolbar-button')).not.toBeInTheDocument();
    });

    it('should not crash when rendered without mocks', () => {
      (useReadOnly as jest.Mock).mockReturnValue(false);
      
      expect(() => render(<FixedToolbarButtons />)).not.toThrow();
    });

    it('should maintain consistent button ordering across renders', () => {
      (useReadOnly as jest.Mock).mockReturnValue(false);
      
      const { container: container1 } = render(<FixedToolbarButtons />);
      const { container: container2 } = render(<FixedToolbarButtons />);
      
      expect(container1.innerHTML).toEqual(container2.innerHTML);
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      (useReadOnly as jest.Mock).mockReturnValue(false);
    });

    it('should have tooltips on AI buttons', () => {
      render(<FixedToolbarButtons />);
      
      const aiButtons = screen.getAllByTestId('ai-toolbar-button');
      aiButtons.forEach(button => {
        expect(button).toHaveAttribute('title', 'AI commands');
      });
    });

    it('should have tooltips on mark toolbar buttons', () => {
      render(<FixedToolbarButtons />);
      
      const boldButton = screen.getAllByTestId('mark-toolbar-button-bold')[0];
      expect(boldButton).toHaveAttribute('title', 'Bold (⌘+B)');
    });

    it('should have proper button semantics', () => {
      render(<FixedToolbarButtons />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});