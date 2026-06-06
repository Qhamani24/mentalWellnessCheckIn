import { CheckIn } from '../types';

export function exportCheckInsToCSV(checkIns: CheckIn[]) {
  const headers = ['id', 'date', 'mood', 'tags', 'reflection'];
  const rows = checkIns.map(c => [
    `"${c.id}"`,
    `"${c.date}"`,
    c.mood,
    `"${c.tags.join(', ')}"`,
    `"${(c.reflection || '').replace(/"/g, '""')}"`
  ]);
  
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'pulse_checkins_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function parseCSV(file: File): Promise<CheckIn[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length <= 1) return resolve([]);
        
        const checkIns: CheckIn[] = [];
        
        // Simple CSV parser for a known format (not covering all edge cases, but works for our simple export)
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          // Regex to split by comma except inside quotes
          const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
          const matches = [];
          let match;
          while ((match = regex.exec(line)) !== null) {
              matches.push(match[1].replace(/^"|"$/g, '').replace(/""/g, '"'));
          }
          
          if (matches.length >= 4) {
            checkIns.push({
              id: matches[0] || Math.random().toString(36).substring(2, 9),
              date: matches[1],
              mood: parseInt(matches[2], 10),
              tags: matches[3] ? matches[3].split(',').map(t => t.trim()) : [],
              reflection: matches[4] || undefined
            });
          }
        }
        
        // Sort by date ascending to keep sequential order
        checkIns.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        resolve(checkIns);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}
