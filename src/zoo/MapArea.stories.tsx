import type { Meta, StoryObj } from '@storybook/react';
import MapArea from './MapArea';

const meta: Meta<typeof MapArea> = {
  component: MapArea,
  title: 'Zoo/MapArea',
  decorators: [
    (Story) => (
      <div style={{ width: 500, height: 500 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MapArea>;

export const Default: Story = {};
