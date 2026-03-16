/**
 * PII Scanner — detects Israeli ID numbers, email addresses, and phone numbers
 * in text content. Used as a pre-commit safeguard to prevent accidental PII leaks.
 */

export type PIIType = 'israeli-id' | 'email' | 'phone';

export interface PIIMatch {
  type: PIIType;
  value: string;
  line: number;
  column: number;
}

/** File extensions that should be scanned for PII */
const SCANNABLE_EXTENSIONS = new Set(['.ts', '.tsx', '.mdx', '.md', '.json']);

/** PII detection patterns */
const PII_PATTERNS: { type: PIIType; regex: RegExp }[] = [
  { type: 'israeli-id', regex: /\b\d{9}\b/g },
  { type: 'email', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
  { type: 'phone', regex: /\b0[2-9]\d{7,8}\b/g },
];

/**
 * Checks whether a file should be scanned based on its extension.
 * Only text-based source files are scanned; binary files are skipped.
 */
export function shouldScanFile(filePath: string): boolean {
  const lastDot = filePath.lastIndexOf('.');
  if (lastDot === -1) return false;
  const ext = filePath.slice(lastDot).toLowerCase();
  return SCANNABLE_EXTENSIONS.has(ext);
}

/**
 * Scans a string for PII patterns and returns all matches
 * with their type, value, line number, and column position.
 */
export function scanForPII(content: string): PIIMatch[] {
  const matches: PIIMatch[] = [];
  const lines = content.split('\n');

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];

    for (const { type, regex } of PII_PATTERNS) {
      // Reset regex state for each line
      const lineRegex = new RegExp(regex.source, regex.flags);
      let match: RegExpExecArray | null;

      while ((match = lineRegex.exec(line)) !== null) {
        matches.push({
          type,
          value: match[0],
          line: lineIndex + 1,
          column: match.index + 1,
        });
      }
    }
  }

  return matches;
}
