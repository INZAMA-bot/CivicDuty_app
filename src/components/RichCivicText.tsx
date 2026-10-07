import React from 'react';

interface RichCivicTextProps {
  text: string;
  onHashtagClick?: (hashtag: string) => void;
  onMentionClick?: (mention: string) => void;
  className?: string;
}

export const RichCivicText: React.FC<RichCivicTextProps> = ({
  text,
  onHashtagClick,
  onMentionClick,
  className = '',
}) => {
  if (!text) return null;

  // Split text on #hashtags and @mentions while keeping delimiters
  const tokens = text.split(/(#[a-zA-Z0-9_]+|@[a-zA-Z0-9_.-]+)/g);

  return (
    <span className={className}>
      {tokens.map((token, idx) => {
        if (token.startsWith('#') && token.length > 1) {
          return (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onHashtagClick?.(token);
              }}
              className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer inline"
              title={`Filter dispatches by ${token}`}
            >
              {token}
            </button>
          );
        }
        if (token.startsWith('@') && token.length > 1) {
          return (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMentionClick?.(token.slice(1));
              }}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer inline"
              title={`Inspect ${token} profile or desk`}
            >
              {token}
            </button>
          );
        }
        return <React.Fragment key={idx}>{token}</React.Fragment>;
      })}
    </span>
  );
};
