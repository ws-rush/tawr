import { useState, useEffect } from 'react';
import { effect } from '@vue/reactivity';

// observer HoC (alternative to hooks for re-render)
// works on it later
export const observer = (WrappedComponent: any) => {
  return (props: any) => {
    const [, forceUpdate] = useState(0); // State to force re-render

    useEffect(() => {
      // Use effect to observe changes in the store
      const stopEffect = effect(() => {
        WrappedComponent()
        // Force a re-render by updating state
        forceUpdate(v => v + 1);
      });

      // Cleanup effect on unmount
      return () => {
        stopEffect();
      };
    }, []); // Empty dependency array ensures this runs only once

    // Render the wrapped component with its props
    return <WrappedComponent {...props} />;
  };
};