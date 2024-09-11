import { TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './ThemedText';

export type ThemedButtonProps = {
  title: string;
  type?: 'default' | 'primary' | 'secondary' | 'link';
  onPress: () => void;
  style?: any;
  titleStyle?: any;
  disabled?: boolean;
};

export function ThemedButton({
  title,
  type = 'default',
  onPress,
  style,
  titleStyle,
  disabled,
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor(
    {
      light: type === 'primary' ? '#007bff' : '#f7f7f7',
      dark: type === 'primary' ? '#0069d9' : '#333',
    },
    'background'
  );

  const borderColor = useThemeColor(
    {
      light: type === 'primary' ? '#007bff' : '#ddd',
      dark: type === 'primary' ? '#0069d9' : '#666',
    },
    'border'
  );

  const textColor = useThemeColor(
    {
      light: type === 'primary' ? '#fff' : '#333',
      dark: type === 'primary' ? '#fff' : '#fff',
    },
    'text'
  );

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, borderColor },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <ThemedText
        type={type === 'primary' || type === 'secondary' ? 'defaultSemiBold' : 'default'}
        style={[
          { color: textColor },
          titleStyle,
        ]}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

