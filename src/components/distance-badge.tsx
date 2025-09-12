import { Badge } from '@/components/ui/badge';
import {
  formatDistance,
  getDistanceColor,
  kmToMiles,
} from '@/lib/utils/distance';
import { useAppSelector } from '@/lib/hooks';
import { selectDistancePreferences } from '@/lib/features/search/searchSelectors';

interface DistanceBadgeProps {
  distance: number | null; // Distance in kilometers
  className?: string;
}

export function DistanceBadge({ distance, className }: DistanceBadgeProps) {
  const distancePreferences = useAppSelector(selectDistancePreferences);

  if (distance === null || isNaN(distance)) {
    return null;
  }

  // Convert distance to user's preferred unit
  const displayDistance =
    distancePreferences.unit === 'mi' ? kmToMiles(distance) : distance;

  return (
    <Badge
      variant="secondary"
      className={`${getDistanceColor(
        displayDistance,
        distancePreferences.unit
      )} ${className || ''}`}
    >
      📍 {formatDistance(distance, distancePreferences)}
    </Badge>
  );
}
