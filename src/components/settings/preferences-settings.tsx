'use client';

import { Ruler, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectDistanceUnit } from '@/lib/features/search/searchSelectors';
import { setDistanceUnit } from '@/lib/features/search/searchSlice';
import { usePrimaryColor } from '@/components/primary-color-provider';
import type { DistanceUnit } from '@/lib/utils/distance';
import type { PrimaryColor } from '@/components/primary-color-provider';

// Color values for primary colors
const COLOR_VALUES: Record<PrimaryColor, { border: string; bg: string }> = {
  default: { border: '#6b7280', bg: '#6b7280' }, // gray-500
  red: { border: '#ef4444', bg: '#ef4444' }, // red-500
  rose: { border: '#f43f5e', bg: '#f43f5e' }, // rose-500
  orange: { border: '#f97316', bg: '#f97316' }, // orange-500
  green: { border: '#84cc16', bg: '#84cc16' }, // lime-500
  blue: { border: '#3b82f6', bg: '#3b82f6' }, // blue-500
  yellow: { border: '#eab308', bg: '#eab308' }, // yellow-500
  violet: { border: '#8b5cf6', bg: '#8b5cf6' }, // violet-500
};

export function PreferencesSettings() {
  const dispatch = useAppDispatch();
  const currentUnit = useAppSelector(selectDistanceUnit);
  const { theme, setTheme } = useTheme();
  const { primaryColor, setPrimaryColor } = usePrimaryColor();

  const handleUnitChange = (unit: DistanceUnit) => {
    dispatch(setDistanceUnit(unit));
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handlePrimaryColorChange = (color: string) => {
    setPrimaryColor(color as PrimaryColor);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ruler className="h-5 w-5" />
          Display Preferences
        </CardTitle>
        <CardDescription>
          Customize how information is displayed throughout the application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Theme Preference */}
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <div className="flex border rounded-md overflow-hidden w-fit">
              <Button
                id="theme-light"
                variant={theme === 'light' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleThemeChange('light')}
                className="h-9 px-4 rounded-none border-0 flex items-center gap-2"
              >
                <Sun className="h-4 w-4" />
                Light
              </Button>
              <Button
                id="theme-dark"
                variant={theme === 'dark' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleThemeChange('dark')}
                className="h-9 px-4 rounded-none border-0 flex items-center gap-2"
              >
                <Moon className="h-4 w-4" />
                Dark
              </Button>
              <Button
                id="theme-system"
                variant={theme === 'system' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleThemeChange('system')}
                className="h-9 px-4 rounded-none border-0 flex items-center gap-2"
              >
                <Monitor className="h-4 w-4" />
                System
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Choose your preferred theme. System will automatically match your
              operating system&apos;s theme setting.
            </p>
          </div>

          {/* Primary Color Preference */}
          <div className="space-y-2">
            <Label htmlFor="primary-color">Primary Color</Label>
            <div className="grid grid-cols-4 gap-2 max-w-xs">
              {(
                [
                  'default',
                  'red',
                  'rose',
                  'orange',
                  'green',
                  'blue',
                  'yellow',
                  'violet',
                ] as const
              ).map((color) => (
                <Button
                  key={color}
                  id={`primary-color-${color}`}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePrimaryColorChange(color)}
                  className="h-12 w-12 p-0 rounded-full relative border-2 hover:scale-105 transition-transform bg-transparent"
                  style={{ borderColor: COLOR_VALUES[color].border }}
                >
                  {primaryColor === color && (
                    <div
                      className="absolute inset-2 rounded-full"
                      style={{ backgroundColor: COLOR_VALUES[color].bg }}
                    />
                  )}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Choose your preferred primary color for buttons, links, and other
              interactive elements throughout the app.
            </p>
          </div>

          {/* Distance Unit Preference */}
          <div className="space-y-2">
            <Label htmlFor="distance-unit">Distance Unit</Label>
            <div className="flex border rounded-md overflow-hidden w-fit">
              <Button
                id="distance-unit-mi"
                variant={currentUnit === 'mi' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleUnitChange('mi')}
                className="h-9 px-4 rounded-none border-0"
              >
                Miles (mi)
              </Button>
              <Button
                id="distance-unit-km"
                variant={currentUnit === 'km' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleUnitChange('km')}
                className="h-9 px-4 rounded-none border-0"
              >
                Kilometers (km)
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Choose your preferred unit for displaying distances throughout the
              app. This affects how distances are shown in search results, item
              details, and location-based features.
            </p>
          </div>

          {/* Current Setting Display */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="font-medium text-sm mb-2">Current Settings</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                • Theme:{' '}
                {theme === 'light'
                  ? 'Light'
                  : theme === 'dark'
                  ? 'Dark'
                  : 'System'}
              </p>
              <p>
                • Primary Color:{' '}
                {primaryColor.charAt(0).toUpperCase() + primaryColor.slice(1)}
              </p>
              <p>
                • Distance Unit: {currentUnit === 'mi' ? 'Miles' : 'Kilometers'}
              </p>
              <p>
                • Distance badges will show in{' '}
                {currentUnit === 'mi' ? 'miles' : 'kilometers'}
              </p>
              <p>
                • Search radius filters will use{' '}
                {currentUnit === 'mi' ? 'miles' : 'kilometers'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
