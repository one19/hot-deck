import type { Meta, StoryObj } from '@storybook/react';
import Scanlines from './Scanlines';

const meta: Meta<typeof Scanlines> = {
  component: Scanlines,
  title: 'Zoo/Scanlines',
  decorators: [
    (Story) => (
      <div style={{ width: 500, height: 500 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Scanlines>;

export const Default: Story = {};
