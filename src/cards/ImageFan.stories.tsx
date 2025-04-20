import type { Meta, StoryObj } from '@storybook/react';
import ImageFan from './ImageFan';
import coal from '../assets/resources/raw/coal.png';
import copper from '../assets/resources/raw/copper.png';
import gold from '../assets/resources/raw/gold.png';
import magnetite from '../assets/resources/raw/magnetite.png';
import oil from '../assets/resources/raw/oil.png';
import rocks from '../assets/resources/raw/rocks.png';
import sand from '../assets/resources/raw/sand.png';

const meta: Meta<typeof ImageFan> = {
  component: ImageFan,
  title: 'Cards/ImageFan',
};

export default meta;

type Story = StoryObj<typeof ImageFan>;

export const AllResources: Story = {
  args: { images: [coal, copper, gold, magnetite, oil, rocks, sand] },
};
export const Six: Story = {
  args: { images: [sand, rocks, oil, magnetite, gold, copper] },
};
export const Five: Story = {
  args: { images: [sand, rocks, oil, magnetite, gold] },
};
export const Four: Story = {
  args: { images: [sand, rocks, oil, magnetite] },
};
export const Three: Story = { args: { images: [sand, rocks, oil] } };
export const Two: Story = { args: { images: [sand, rocks] } };
export const One: Story = { args: { images: [sand] } };
