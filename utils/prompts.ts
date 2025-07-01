import fs from 'fs';
import path from 'path';

export function getSystemPrompt(context: string): string {
  const promptPath = path.join(process.cwd(), 'prompts', 'system-prompt.md');
  const promptTemplate = fs.readFileSync(promptPath, 'utf-8');
  
  return promptTemplate.replace('${Context here}', context);
}
