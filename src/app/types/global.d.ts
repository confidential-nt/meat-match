import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'meat-match-game-board': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
