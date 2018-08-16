export default class EditorApp {
  init(editorSDK, appDefinitionId) {
    this.editorSDK = editorSDK;
    this.appDefinitionId = appDefinitionId;
  }

  async controllerAlreadyExists(controllerType) {
    const controllers = await this.editorSDK.controllers.listAllControllers(
      this.appDefinitionId,
    );
    for (const controller of controllers) {
      const data = await this.editorSDK.controllers.getData(
        this.appDefinitionId,
        controller,
      );
      if (data.controllerType === controllerType) {
        return true;
      }
    }
    return false;
  }

  editorReady = async (editorSDK, appDefinitionId, { firstInstall }) => {
    this.init(editorSDK, appDefinitionId);

    if (firstInstall || !(await this.controllerAlreadyExists('myFirstApp'))) {
      // Creating missing controller
      const applicationId = await editorSDK.info.getAppDefinitionId(
        appDefinitionId,
      );
      const pageRef = await editorSDK.pages.getCurrent(appDefinitionId);
      await editorSDK.components.add(appDefinitionId, {
        componentDefinition: {
          componentType: 'platform.components.AppController',
          data: {
            type: 'AppController',
            controllerType: 'myFirstApp',
            applicationId,
            settings: JSON.stringify({}),
          },
        },
        pageRef,
      });
    }
  };

  onEvent = async ({ eventType, eventPayload }) => {
    const { controllerRef } = eventPayload;
    if (eventType === 'controllerSettingsButtonClicked') {
      const options = {
        title: 'Manage My First Application',
        url: './settings.html',
        initialData: {
          controllerRef,
        },
        width: '80%',
        height: '80%',
      };
      await this.editorSDK.editor.openComponentPanel(this.appDefinitionId, {
        ...options,
        componentRef: controllerRef,
      });
    }
  };

  getAppManifest = () => {
    return Promise.resolve({
      controllersStageData: {
        myFirstApp: {
          default: {
            mainAction: {
              label: 'Manage My First App',
            },
          },
        },
      },
      exports: {
        myFirstApp: {
          tagname: 'myFirstApp',
          widgetDisplayName: '',
          eventHandlers: {},
          synthetic: false,
          inherits: {},
          members: {
            randomize: {
              description: 'Randomize image sources',
              kind: 'function',
            },
          },
        },
      },
    });
  };
}
