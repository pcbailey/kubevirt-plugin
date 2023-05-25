import { ComponentClass } from 'react';

export type InstanceTypeSize = {
  sizeLabel: string;
  cpus: number;
  memory: string;
};

export type RedHatInstanceTypeSeries = {
  seriesName: string;
  classAnnotation: string;
  sizes: InstanceTypeSize[];
};

export type RedHatInstanceType = {
  label: string;
  id: string;
  Icon: ComponentClass;
  items: RedHatInstanceTypeSeries[];
};

export type UserInstanceType = {
  label: string;
  id: string;
  Icon: ComponentClass;
  items: string[];
};

export type InstanceTypesMenuItemsData = {
  redHatProvided: RedHatInstanceType;
  userProvided: UserInstanceType;
};
