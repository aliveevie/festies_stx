/**
 * CodeBlock component - Syntax highlighted code display
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useClipboard } from '../hooks/useClipboard';

export const CodeBlock = ({
  code,
  language = 'javascript',
  showLineNumbers = true,
  copyable = true,
  className = '',
}) => {
  const { copy, copied } = useClipboard();

  const handleCopy = () => {
    copy(code);
  };

  return (
    <div
      className={`
        relative bg-gray-900 border border-purple-500/30 rounded-lg overflow-hidden
        ${className}
      `}
    >
      {/* Header */}
      {(copyable || language) && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-purple-500/30">
          {language && (
            <span className="text-xs font-mono text-purple-400 uppercase">
              {language}
            </span>
          )}
          {copyable && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1 text-xs bg-purple-500/20 hover:bg-purple-500/30 rounded transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400">Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  );
};
// Style improvement
// Refactor improvement
