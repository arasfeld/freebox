import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectDistanceUnit } from '@/lib/features/search/searchSelectors';
import { setDistanceUnit } from '@/lib/features/search/searchSlice';
import type { DistanceUnit } from '@/lib/utils/distance';

interface DistanceUnitToggleProps {
  className?: string;
}

export function DistanceUnitToggle({ className }: DistanceUnitToggleProps) {
  const dispatch = useAppDispatch();
  const currentUnit = useAppSelector(selectDistanceUnit);

  const handleUnitChange = (unit: DistanceUnit) => {
    dispatch(setDistanceUnit(unit));
  };

  return (
    <div className={`flex items-center gap-1 ${className || ''}`}>
      <span className="text-xs text-muted-foreground mr-2">Distance:</span>
      <div className="flex border rounded-md overflow-hidden">
        <Button
          variant={currentUnit === 'mi' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleUnitChange('mi')}
          className="h-7 px-2 text-xs rounded-none border-0"
        >
          mi
        </Button>
        <Button
          variant={currentUnit === 'km' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleUnitChange('km')}
          className="h-7 px-2 text-xs rounded-none border-0"
        >
          km
        </Button>
      </div>
    </div>
  );
}
