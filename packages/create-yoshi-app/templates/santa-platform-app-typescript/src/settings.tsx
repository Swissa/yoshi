import * as React from 'react';
import * as ReactDOM from 'react-dom';

const ROLE_BUTTON = 'button';
const ROLE_IMAGE = 'image';

interface PropsType {
  toggle: Function;
}

class App extends React.Component<PropsType> {
  render() {
    const { toggle } = this.props;
    return (
      <div>
        <button onClick={() => toggle(true)}>Enable</button>
        <br />
        <button onClick={() => toggle(false)}>Disable</button>
      </div>
    );
  }
}

const enableApp = async ({ token, editorSDK, controllerRef }) => {
  const components = await editorSDK.components.getAllComponents(token);
  const buttons = [];
  const images = [];

  for (const componentRef of components) {
    const type = await editorSDK.components.getType(token, { componentRef });
    if (type === 'wysiwyg.viewer.components.SiteButton') {
      buttons.push(componentRef);
    }
    if (type === 'wysiwyg.viewer.components.WPhoto') {
      images.push(componentRef);
    }
  }

  buttons.map(componentRef =>
    editorSDK.controllers.connect(
      token,
      {
        controllerRef,
        connectToRef: componentRef,
        role: ROLE_BUTTON,
      },
    ),
  );

  images.map(componentRef =>
    editorSDK.controllers.connect(
      token,
      {
        controllerRef,
        connectToRef: componentRef,
        role: ROLE_IMAGE,
      },
    ),
  );
};

const disableApp = async ({ token, editorSDK, controllerRef }) => {
  const connectedComponents = await editorSDK.controllers.listConnectedComponents(
    token,
    { controllerRef },
  );
  connectedComponents.map(componentRef =>
    editorSDK.controllers.disconnect(token, {
      controllerRef,
      connectToRef: componentRef,
      role: null,
    }),
  );
};

const registerStartConfiguration = () => {
  const { editorSDK } = ((window: any) => window)(window);

  editorSDK.panel.onEvent(async ({ eventType, eventPayload }) => {
    if (eventType === 'startConfiguration') {
      const {
        token,
        initialData: { controllerRef },
      } = eventPayload;

      const toggle = val =>
        val
          ? enableApp({ token, editorSDK, controllerRef })
          : disableApp({ token, editorSDK, controllerRef });

      ReactDOM.render(<App toggle={toggle} />, document.getElementById('root'));
    }
  });
};

registerStartConfiguration();
