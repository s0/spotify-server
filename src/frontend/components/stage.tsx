import * as React from 'react';

export function rootComponent() {
  return <Stage />;
}

class Stage extends React.Component<{}, {}> {
  public render() {
    return (
      <span>stage</span>
    );
  }
}
