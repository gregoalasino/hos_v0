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

  interface Window {
    // Exposed by the Cloudbeds immersive experience loader script.
    // (https://us2.cloudbeds.com/widget/load/<propertyCode>/immersive)
    openImmersiveExperiencePopup?: (config: {
      propertyCode: string;
      lang?: string;
      currency?: string;
      closeLabel?: string;
      width?: number | string;
      height?: number | string;
      position?: string;
      onClose?: () => void;
    }) => void;
  }
}