import type { Meta, StoryObj } from '@storybook/react';
import { PaperOverlay } from './PaperOverlay';

const meta: Meta<typeof PaperOverlay> = {
  component: PaperOverlay,
  title: 'Zoo/PaperOverlay',
  decorators: [
    (Story) => (
      <div style={{ width: 500, height: 500, position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PaperOverlay>;

export const Default: Story = {};
