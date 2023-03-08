const loader = {
  show: ({ id = "rgl-overlay" }: { id?: string } = {}) => {
    let loader: any = document.getElementById(id);
    if (loader) {
      loader.dataset.count = loader.dataset.count
        ? parseInt(loader.dataset.count) + 1
        : 1;
      loader.style.display = "block";
      if (loader.dataset.auto == "true") {
        setTimeout(() => {
          loader.style.display = "none";
        }, parseInt(loader.dataset.duration || 3000));
      }
    }
  },
  hide: ({ id = "rgl-overlay" }: { id?: string } = {}) => {
    let loader: any = document.getElementById(id);
    if (loader) {
      loader.dataset.count = loader.dataset.count
        ? parseInt(loader.dataset.count) - 1
        : 0;
      if (loader.dataset.count == 0) {
        setTimeout(() => {
          loader.style.display = "none";
        });
      }
    }
  },
};

export default loader;
