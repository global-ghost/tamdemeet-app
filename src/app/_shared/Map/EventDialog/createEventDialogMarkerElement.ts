export const createEventDialogMarkerElement = () => {
  const container = document.createElement('div');
  container.style.position = 'relative';
  container.style.width = '70px';
  container.style.height = '90px';

  const image = document.createElement('div');
  Object.assign(image.style, {
    width: '70px',
    height: '70px',
    backgroundImage: `url('https://i.postimg.cc/BQ7KsMFq/marker-icon-icons.webp')`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    borderRadius: '50%',
  });

  container.appendChild(image);

  return container;
};
