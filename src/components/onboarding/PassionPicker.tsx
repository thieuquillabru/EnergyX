'use client';

import { useState, useMemo, useCallback } from 'react';
import type { PassionItem, UserPassion, PassionCategory } from '@/types';
import { PASSION_CATEGORY_LABELS } from '@/types';
import { searchPassions, getPassionsGrouped, normalize } from '@/lib/passionCatalog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, Plus } from 'lucide-react';

const CATEGORIES: PassionCategory[] = ['sports', 'art', 'music', 'reading', 'gaming', 'coding', 'cooking', 'other'];

interface PassionPickerProps {
  selectedPassions: UserPassion[];
  onToggle: (passion: PassionItem) => void;
  onAddCustom: (name: string) => void;
}

export function PassionPicker({ selectedPassions, onToggle, onAddCustom }: PassionPickerProps) {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<PassionCategory | 'all'>('all');

  const results = useMemo(() => {
    let items = searchPassions(query);
    if (categoryFilter !== 'all') {
      items = items.filter((p) => p.category === categoryFilter);
    }
    return items;
  }, [query, categoryFilter]);

  const grouped = useMemo(() => getPassionsGrouped(results), [results]);

  const selectedIds = useMemo(
    () => new Set(selectedPassions.map((p) => p.id)),
    [selectedPassions]
  );

  const hasNoResults = query.trim().length > 0 && results.length === 0;

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher une passion..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setCategoryFilter('all')}
          className={cn(
            'px-2.5 py-1 rounded-md text-xs border transition-colors',
            categoryFilter === 'all' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
          )}
        >
          Tous
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={cn(
              'px-2.5 py-1 rounded-md text-xs border transition-colors',
              categoryFilter === cat ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
            )}
          >
            {PASSION_CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="max-h-64 overflow-y-auto space-y-3">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              {PASSION_CATEGORY_LABELS[cat as PassionCategory] || cat}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {items.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onToggle(p)}
                  className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-colors',
                    selectedIds.has(p.id)
                      ? 'border-primary bg-primary/20 text-primary'
                      : 'border-border text-foreground hover:border-primary/50'
                  )}
                >
                  <span>{p.emoji}</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {hasNoResults && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">
              Aucun résultat pour « {query} »
            </p>
            <button
              type="button"
              onClick={() => onAddCustom(query)}
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Plus size={14} />
              Ajouter « {query} »
            </button>
          </div>
        )}

        {!hasNoResults && results.length === 0 && !query && (
          <div className="flex flex-wrap gap-1.5">
            {Object.values(PASSION_CATEGORY_LABELS).map((label) => (
              <span key={label} className="text-xs text-muted-foreground px-2 py-1">{label}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
