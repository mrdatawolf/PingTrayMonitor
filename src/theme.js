// Semantic color tokens for the two supported UI modes. Status colors
// (green/yellow/red) stay saturated and work on both backgrounds; only the
// structural chrome (panels, borders, text) needs a light/dark variant.

const dark = {
  algorithm: 'dark',
  pageBg:        '#141414',
  headerBg:      '#1f1f1f',
  panelBg:       '#1a1a1a',
  panelBgAlt:    '#141414',
  inputBg:       '#1a1a1a',
  inputBgAlt:    '#141414',
  codeBg:        '#1f1f1f',
  border:        '#3a3a3a',
  borderSubtle:  '#2a2a2a',
  borderFaint:   '#252525',
  rowBorder:     '#1f1f1f',
  textPrimary:   '#e0e0e0',
  textBody:      '#d9d9d9',
  textSecondary: '#8c8c8c',
  textTertiary:  '#595959',
  textFaint:     '#434343',
  greyDot:       '#595959',
  blackDot:      '#2a2a2a',
  scrollTrack:   '#1a1a1a',
  scrollThumb:   '#3a3a3a',
  statusBg:      { green: '#162312', yellow: '#2b2111', orange: '#2b1d11', red: '#2a1215', grey: '#1a1a1a' },
  statusBorder:  { green: '#274916', yellow: '#443111', orange: '#593815', red: '#431418', grey: '#2a2a2a' },
};

const light = {
  algorithm: 'light',
  pageBg:        '#f0f2f5',
  headerBg:      '#ffffff',
  panelBg:       '#ffffff',
  panelBgAlt:    '#fafafa',
  inputBg:       '#ffffff',
  inputBgAlt:    '#fafafa',
  codeBg:        '#f0f0f0',
  border:        '#d9d9d9',
  borderSubtle:  '#e8e8e8',
  borderFaint:   '#f0f0f0',
  rowBorder:     '#f0f0f0',
  textPrimary:   '#1f1f1f',
  textBody:      '#262626',
  textSecondary: '#595959',
  textTertiary:  '#8c8c8c',
  textFaint:     '#bfbfbf',
  greyDot:       '#bfbfbf',
  blackDot:      '#8c8c8c',
  scrollTrack:   '#f0f0f0',
  scrollThumb:   '#d9d9d9',
  statusBg:      { green: '#f6ffed', yellow: '#fffbe6', orange: '#fff7e6', red: '#fff1f0', grey: '#fafafa' },
  statusBorder:  { green: '#b7eb8f', yellow: '#ffe58f', orange: '#ffd591', red: '#ffccc7', grey: '#e8e8e8' },
};

export function getColors(mode) {
  return mode === 'light' ? light : dark;
}
