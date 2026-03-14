import * as React from 'react'

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'cb-book-now-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
          'property-code'?: string;
        };
      }
    }
  }
}