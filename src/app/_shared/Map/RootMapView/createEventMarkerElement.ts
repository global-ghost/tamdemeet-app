import { DEFAULT_EVENT_SRC } from '@shared/AvatarSettings';

export const createEventMarkerElement = (
  imageUrl?: string,
  labelText?: string,
) => {
  const container = document.createElement('div');
  container.style.position = 'relative';
  container.style.width = '120px';
  container.style.height = '90px';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';

  const image = document.createElement('div');
  Object.assign(image.style, {
    width: '70px',
    height: '70px',
    flexShrink: 0,
    backgroundImage: imageUrl
      ? `url('${imageUrl}')`
      : `url('${DEFAULT_EVENT_SRC}')`,
    backgroundSize: 'cover',
    borderRadius: '50%',
    border: '2px solid white',
    boxShadow: '0 0 4px rgba(0,0,0,0.5)',
  });

  const label = document.createElement('span');
  label.textContent = labelText ?? 'YOU';
  Object.assign(label.style, {
    display: 'block',
    textAlign: 'center',
    marginTop: '4px',
    backgroundColor: '#417657',
    padding: '8px',
    borderRadius: '10px',
    fontSize: '14px',
    border: '1px solid white',
    color: 'white',
  });

  container.appendChild(image);
  container.appendChild(label);

  return container;
};
