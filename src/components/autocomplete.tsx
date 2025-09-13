import { cn } from '@/lib/utils';
import { Command as CommandPrimitive } from 'cmdk';
import { Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from './ui/command';
import { Input } from './ui/input';
import { Popover, PopoverAnchor, PopoverContent } from './ui/popover';

type Props<T extends string> = {
  emptyMessage?: string;
  isLoading?: boolean;
  items: { value: T; label: string }[];
  onSearchValueChange: (value: string) => void;
  onSelectedValueChange: (value: T) => void;
  placeholder?: string;
  searchValue: string;
  selectedValue: T;
};

export function AutoComplete<T extends string>({
  emptyMessage = 'No items.',
  isLoading,
  items,
  onSearchValueChange,
  onSelectedValueChange,
  placeholder = 'Search...',
  searchValue,
  selectedValue,
}: Props<T>) {
  const [open, setOpen] = useState(false);

  const labels = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          acc[item.value] = item.label;
          return acc;
        },
        {} as Record<string, string>
      ),
    [items]
  );

  const reset = () => {
    onSelectedValueChange('' as T);
    onSearchValueChange('');
  };

  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (
      !e.relatedTarget?.hasAttribute('cmdk-list') &&
      labels[selectedValue] !== searchValue
    ) {
      reset();
    }
  };

  const onSelectItem = (inputValue: string) => {
    if (inputValue === selectedValue) {
      reset();
    } else {
      onSelectedValueChange(inputValue as T);
      onSearchValueChange(labels[inputValue] ?? '');
    }
    setOpen(false);
  };

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <PopoverAnchor asChild>
            <CommandPrimitive.Input
              asChild
              value={searchValue}
              onValueChange={onSearchValueChange}
              onKeyDown={e => setOpen(e.key !== 'Escape')}
              onMouseDown={() => setOpen(open => !!searchValue || !open)}
              onFocus={() => setOpen(true)}
              onBlur={onInputBlur}
            >
              <Input placeholder={placeholder} />
            </CommandPrimitive.Input>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}
          <PopoverContent
            asChild
            onOpenAutoFocus={e => e.preventDefault()}
            onInteractOutside={e => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute('cmdk-input')
              ) {
                e.preventDefault();
              }
            }}
            className="w-[var(--radix-popover-trigger-width)] p-0 border rounded-md shadow-md bg-popover"
            align="start"
            sideOffset={4}
          >
            <CommandList>
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Loading...
                  </div>
                </div>
              ) : items.length > 0 ? (
                <CommandGroup>
                  {items.map(option => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onMouseDown={e => e.preventDefault()}
                      onSelect={onSelectItem}
                      className="flex items-center gap-2"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4 flex-shrink-0',
                          selectedValue === option.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      <span className="truncate text-sm">{option.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : searchValue ? (
                <CommandEmpty>{emptyMessage ?? 'No items.'}</CommandEmpty>
              ) : (
                <CommandEmpty>Start typing to search...</CommandEmpty>
              )}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}
