import React from 'react';

interface AccountabilityDocketProps {
  leftLabel: string;
  leftSubLabel: string;
  centerVal: string | number;
  centerLabel: string;
  rightLabel: string;
  rightSubLabel: string;
  high?: boolean;
}

export const AccountabilityDocket: React.FC<AccountabilityDocketProps> = ({
  leftLabel,
  leftSubLabel,
  centerVal,
  centerLabel,
  rightLabel,
  rightSubLabel,
  high,
}) => {
  return (
    <div className={`docket ${high ? 'docket-high' : ''}`}>
      <div>
        <div className="docket-l">{leftLabel}</div>
        <div className="docket-label">{leftSubLabel}</div>
      </div>
      <div>
        <div className="docket-c">{centerVal}</div>
        <div className="docket-label">{centerLabel}</div>
      </div>
      <div>
        <div className="docket-r">{rightLabel}</div>
        <div className="docket-label">{rightSubLabel}</div>
      </div>
    </div>
  );
};
