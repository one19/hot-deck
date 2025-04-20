import type { Meta, StoryObj } from '@storybook/react';
import { BorderBeam } from './BorderBeam';

const meta: Meta<typeof BorderBeam> = {
  component: BorderBeam,
  title: 'Zoo/BorderBeam',
  decorators: [
    (Story) => (
      <div style={{ width: 500, height: 500, position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof BorderBeam>;

export const Default: Story = {};
