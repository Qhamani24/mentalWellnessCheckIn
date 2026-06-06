import { Globe, Sun, Flame, Droplets, Heart, Wind, Shield } from 'lucide-react';

export const housesData = [
  { name: 'LEFATSHE', label: 'Earth', icon: Globe, color: 'text-orange-600', bg: 'bg-orange-50', hex: 'bg-orange-400' },
  { name: 'LESEDI', label: 'Light', icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-50', hex: 'bg-yellow-400' },
  { name: 'MOYO', label: 'Fire', icon: Flame, color: 'text-red-500', bg: 'bg-red-50', hex: 'bg-red-400' },
  { name: 'PULA', label: 'Water', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50', hex: 'bg-blue-400' },
  { name: 'SERITI', label: 'Heart', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50', hex: 'bg-rose-400' },
  { name: 'UMOYA', label: 'Wind', icon: Wind, color: 'text-purple-500', bg: 'bg-purple-50', hex: 'bg-purple-400' }
];

export const getHouseData = (name: string) => {
  return housesData.find(h => h.name === name) || { name: name || 'Unknown', label: 'House', icon: Shield, color: 'text-gray-600', bg: 'bg-gray-50', hex: 'bg-gray-400' };
};
