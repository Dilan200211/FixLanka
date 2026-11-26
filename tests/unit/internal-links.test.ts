import { describe, it, expect } from 'vitest';
import { buildInternalLinkGraph } from '../../src/lib/seo/internal-links';

describe('Internal Link Graph', () => {
  it('connects all static, category, and tool pages with zero orphan nodes', () => {
    const { nodes, orphans } = buildInternalLinkGraph([]);
    expect(nodes.size).toBeGreaterThanOrEqual(37);
    expect(orphans).toEqual([]);
  });
});
