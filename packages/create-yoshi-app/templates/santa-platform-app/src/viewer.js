const generateRandomImageUrl = () => {
  const size = Math.floor(Math.random() * 500);
  return `https://placecage.com/${size}/${size}`;
};

const randomizeImageSources = $w => {
  const images = $w('@image');
  images.forEach(image => {
    image.src = generateRandomImageUrl();
  });
};

const createControllers = controllerConfigs =>
  controllerConfigs.map(({ $w }) => ({
    pageReady: () => {
      const buttons = $w('@button');
      for (const button of buttons) {
        button.onClick(() => randomizeImageSources($w));
      }
    },
    exports: {
      randomize: () => randomizeImageSources($w),
    },
  }));

module.exports = {
  createControllers,
  exports: {},
};
