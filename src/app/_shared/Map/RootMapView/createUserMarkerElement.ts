import { DEFAULT_AVATAR_SRC } from '@shared/AvatarSettings';

export const createUserMarkerElement = (
  avatarUrl?: string,
  labelText?: string,
) => {
  const container = document.createElement('div');
  container.style.position = 'relative';
  container.style.width = '70px';
  container.style.height = '90px';

  const image = document.createElement('div');
  Object.assign(image.style, {
    width: '70px',
    height: '70px',
    backgroundImage: avatarUrl ? `url('${avatarUrl}')` : DEFAULT_AVATAR_SRC,
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
    backgroundColor: '#101519',
    padding: '3px',
    borderRadius: '10px',
    fontSize: '14px',
    border: '1px solid white',
    color: 'white',
  });

  container.appendChild(image);
  container.appendChild(label);

  return container;
};
