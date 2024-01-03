export type ResourceState = {
  [resourceName: string]: number;
};

export type ResourceObject = {
  id: string;
  state: ResourceState;
};
