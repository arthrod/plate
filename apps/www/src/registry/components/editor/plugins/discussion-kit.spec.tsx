/**
 * Tests for discussion-kit.tsx
 *
 * Covers:
 * - discussionPlugin configuration
 * - DiscussionKit export
 * - Plugin options and selectors
 */

import { describe, expect, it } from 'bun:test';
import { createSlateEditor } from 'platejs';
import { discussionPlugin, DiscussionKit } from './discussion-kit';

describe('discussionPlugin', () => {
  it('should have correct plugin key', () => {
    expect(discussionPlugin.key).toBe('discussion');
  });

  it('should have default options', () => {
    const editor = createSlateEditor({
      plugins: [discussionPlugin],
    });

    const currentUserId = editor.getOption(discussionPlugin, 'currentUserId');
    expect(currentUserId).toBe('alice');
  });

  it('should have discussions in options', () => {
    const editor = createSlateEditor({
      plugins: [discussionPlugin],
    });

    const discussions = editor.getOption(discussionPlugin, 'discussions');
    expect(Array.isArray(discussions)).toBe(true);
    expect(discussions.length).toBeGreaterThan(0);
  });

  it('should have users in options', () => {
    const editor = createSlateEditor({
      plugins: [discussionPlugin],
    });

    const users = editor.getOption(discussionPlugin, 'users');
    expect(typeof users).toBe('object');
    expect(users.alice).toBeDefined();
    expect(users.bob).toBeDefined();
    expect(users.charlie).toBeDefined();
  });

  it('should have default discussions with proper structure', () => {
    const editor = createSlateEditor({
      plugins: [discussionPlugin],
    });

    const discussions = editor.getOption(discussionPlugin, 'discussions');
    const firstDiscussion = discussions[0];

    expect(firstDiscussion).toBeDefined();
    expect(firstDiscussion.id).toBeDefined();
    expect(firstDiscussion.comments).toBeDefined();
    expect(Array.isArray(firstDiscussion.comments)).toBe(true);
    expect(firstDiscussion.createdAt).toBeDefined();
    expect(firstDiscussion.isResolved).toBe(false);
    expect(firstDiscussion.userId).toBeDefined();
  });

  it('should have comments in discussions with proper structure', () => {
    const editor = createSlateEditor({
      plugins: [discussionPlugin],
    });

    const discussions = editor.getOption(discussionPlugin, 'discussions');
    const firstComment = discussions[0].comments[0];

    expect(firstComment).toBeDefined();
    expect(firstComment.id).toBeDefined();
    expect(firstComment.contentRich).toBeDefined();
    expect(Array.isArray(firstComment.contentRich)).toBe(true);
    expect(firstComment.createdAt).toBeDefined();
    expect(firstComment.discussionId).toBeDefined();
    expect(firstComment.userId).toBeDefined();
  });

  it('should have user data with avatarUrl and name', () => {
    const editor = createSlateEditor({
      plugins: [discussionPlugin],
    });

    const users = editor.getOption(discussionPlugin, 'users');

    expect(users.alice.id).toBe('alice');
    expect(users.alice.name).toBe('Alice');
    expect(users.alice.avatarUrl).toContain('dicebear.com');

    expect(users.bob.id).toBe('bob');
    expect(users.bob.name).toBe('Bob');

    expect(users.charlie.id).toBe('charlie');
    expect(users.charlie.name).toBe('Charlie');
  });

  it('should have currentUser selector', () => {
    const editor = createSlateEditor({
      plugins: [discussionPlugin],
    });

    const currentUser = editor.getApi(discussionPlugin).currentUser();

    expect(currentUser).toBeDefined();
    expect(currentUser.id).toBe('alice');
    expect(currentUser.name).toBe('Alice');
  });

  it('should have user selector that accepts id', () => {
    const editor = createSlateEditor({
      plugins: [discussionPlugin],
    });

    const bob = editor.getApi(discussionPlugin).user('bob');

    expect(bob).toBeDefined();
    expect(bob.id).toBe('bob');
    expect(bob.name).toBe('Bob');
  });

  it('should return undefined for non-existent user', () => {
    const editor = createSlateEditor({
      plugins: [discussionPlugin],
    });

    const nonExistent = editor.getApi(discussionPlugin).user('nonexistent');

    expect(nonExistent).toBeUndefined();
  });

  it('should have discussion1 with documentContent', () => {
    const editor = createSlateEditor({
      plugins: [discussionPlugin],
    });

    const discussions = editor.getOption(discussionPlugin, 'discussions');
    const discussion1 = discussions.find((d) => d.id === 'discussion1');

    expect(discussion1).toBeDefined();
    expect(discussion1?.documentContent).toBe('comments');
  });

  it('should have discussion2 with documentContent', () => {
    const editor = createSlateEditor({
      plugins: [discussionPlugin],
    });

    const discussions = editor.getOption(discussionPlugin, 'discussions');
    const discussion2 = discussions.find((d) => d.id === 'discussion2');

    expect(discussion2).toBeDefined();
    expect(discussion2?.documentContent).toBe('overlapping');
  });

  it('should have multiple comments in each discussion', () => {
    const editor = createSlateEditor({
      plugins: [discussionPlugin],
    });

    const discussions = editor.getOption(discussionPlugin, 'discussions');

    for (const discussion of discussions) {
      expect(discussion.comments.length).toBeGreaterThan(0);
    }
  });
});

describe('DiscussionKit', () => {
  it('should be an array', () => {
    expect(Array.isArray(DiscussionKit)).toBe(true);
  });

  it('should contain discussionPlugin', () => {
    expect(DiscussionKit).toHaveLength(1);
    expect(DiscussionKit[0]).toBe(discussionPlugin);
  });

  it('should be usable with spread operator', () => {
    const editor = createSlateEditor({
      plugins: [...DiscussionKit],
    });

    const currentUserId = editor.getOption(discussionPlugin, 'currentUserId');
    expect(currentUserId).toBe('alice');
  });
});

describe('TDiscussion type compliance', () => {
  it('should have all required fields in discussions', () => {
    const editor = createSlateEditor({
      plugins: [discussionPlugin],
    });

    const discussions = editor.getOption(discussionPlugin, 'discussions');

    for (const discussion of discussions) {
      // Required fields
      expect(discussion.id).toBeDefined();
      expect(discussion.comments).toBeDefined();
      expect(discussion.createdAt).toBeDefined();
      expect(discussion.isResolved).toBeDefined();
      expect(discussion.userId).toBeDefined();

      // Optional fields
      expect(
        discussion.documentContent === undefined ||
          typeof discussion.documentContent === 'string'
      ).toBe(true);
    }
  });

  it('should have all required fields in comments', () => {
    const editor = createSlateEditor({
      plugins: [discussionPlugin],
    });

    const discussions = editor.getOption(discussionPlugin, 'discussions');

    for (const discussion of discussions) {
      for (const comment of discussion.comments) {
        expect(comment.id).toBeDefined();
        expect(comment.contentRich).toBeDefined();
        expect(comment.createdAt).toBeDefined();
        expect(comment.discussionId).toBeDefined();
        expect(comment.isEdited).toBeDefined();
        expect(comment.userId).toBeDefined();
      }
    }
  });
});