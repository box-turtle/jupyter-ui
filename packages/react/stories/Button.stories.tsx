/*
 * Copyright (c) 2021-2023 Datalayer, Inc.
 *
 * MIT License
 */

import {
  EyeClosedIcon,
  EyeIcon,
  SearchIcon,
  TriangleDownIcon,
  XIcon,
  HeartIcon,
} from '@primer/octicons-react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@datalayer/jupyter-react';
import { createLabButton } from './_utils/lab-builders';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
} as Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof Button>;

const Template = (args, { globals: { labComparison } }) => {
  return (
    <>
      <Button {...args}>{args.label ?? 'Default'}</Button>
      {labComparison === 'display' && (
        <div
          className="vertical-spacer"
          dangerouslySetInnerHTML={{ __html: createLabButton(args) }}
        ></div>
      )}
    </>
  );
};

export const Default = Template.bind({});

export const Playground: Story = {
  render: (args, options) =>
    Template.bind({})({ label: 'Default', ...args }, { globals: { labComparison: true } }),
};
Playground.argTypes = {
  size: {
    control: {
      type: 'radio',
    },
    options: ['small', 'medium', 'large'],
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  variant: {
    control: {
      type: 'radio',
    },
    options: ['default', 'primary', 'danger', 'invisible'],
  },
  alignContent: {
    control: {
      type: 'radio',
    },
    options: ['center', 'start'],
  },
  block: {
    control: {
      type: 'boolean',
    },
  },
  leadingVisual: ([
    EyeClosedIcon,
    EyeIcon,
    SearchIcon,
    XIcon,
    HeartIcon,
  ]),
  trailingVisual: ([
    EyeClosedIcon,
    EyeIcon,
    SearchIcon,
    XIcon,
    HeartIcon,
  ]),
  trailingAction: ([TriangleDownIcon]),
};
Playground.args = {
  block: false,
  size: 'medium',
  disabled: false,
  variant: 'default',
  alignContent: 'center',
  trailingVisual: null,
  leadingVisual: null,
  trailingAction: null,
};

export const Primary: Story = {
  render: (args, options) =>
    Template.bind({})({ label: 'Primary', ...args }, { globals: { labComparison: true } }),
};
Primary.args = {
  block: false,
  size: 'medium',
  disabled: false,
  variant: 'primary',
  alignContent: 'center',
  trailingVisual: null,
  leadingVisual: null,
  trailingAction: null,
};

export const Danger: Story = {
  render: (args, options) =>
    Template.bind({})({ label: 'Danger', ...args }, { globals: { labComparison: true } }),
};
Danger.args = {
  block: false,
  size: 'medium',
  disabled: false,
  variant: 'danger',
  alignContent: 'center',
  trailingVisual: null,
  leadingVisual: null,
  trailingAction: null,
};

export const Invisible: Story = {
  render: (args, options) =>
    Template.bind({})({ label: 'Invisble', ...args }, { globals: { labComparison: true } }),
};
Invisible.args = {
  block: false,
  size: 'medium',
  disabled: false,
  variant: 'invisible',
  alignContent: 'center',
  trailingVisual: null,
  leadingVisual: null,
  trailingAction: null,
};
