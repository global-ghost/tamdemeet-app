import { colors } from '@components/ui';
import type { Color } from '@components/ui';
import './icon.css';

export type IconName =
  | 'eye'
  | 'eye-blocked'
  | 'google'
  | 'close'
  | 'mail-warn'
  | 'checkmark'
  | 'warning'
  | 'log-out'
  | 'group'
  | 'settings'
  | 'location'
  | 'menu';

export type IconProps = {
  icon: IconName;
  size?: number;
  color?: Color;
};

export const Icon: React.FunctionComponent<IconProps> = ({
  icon,
  size = 20,
  color = 'white',
}) => {
  return (
    <i
      // eslint-disable-next-line tailwindcss/no-custom-classname
      className={`${icon}`}
      style={{ color: colors[color], fontSize: size }}
    />
  );
};
