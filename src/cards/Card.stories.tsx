import type { Meta, StoryObj } from '@storybook/react';
import { useSpring, config } from '@react-spring/web';
import Card from './Card';
import getMiningCard from './Mining/getMiningCard';
import { DEFAULT_ORIENTATION } from './types';

const meta: Meta<typeof Card> = {
  component: Card,
  title: 'Cards/Card',
  decorators: [
    (Story) => {
      const springProps = useSpring({
        ...DEFAULT_ORIENTATION,
        config: config.stiff,
      });
      return <Story args={{ ...getMiningCard(), springProps }} />;
    },
  ],
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {};
