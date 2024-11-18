import {
  FeatureType,
  PropertyOptions,
  ResourceOptions as AdminJsResourceOptions,
  ResourceWithOptions,
} from 'adminjs';

// TODO rework keys of resource type to support dot notation
type ResourceProperties<
  ResourceType,
  Keys extends string | number | symbol = keyof ResourceType,
> = Partial<Record<Keys, PropertyOptions>> &
  Partial<Record<string, PropertyOptions>>;

type ResourceOptions<ResourceType> = Omit<
  AdminJsResourceOptions,
  'properties'
> & {
  properties?: ResourceProperties<ResourceType>;
};

export type Resource<ResourceType> = {
  options: ResourceOptions<ResourceType>;
  resource: ResourceWithOptions['resource'];
  features?: Array<FeatureType>;
};
