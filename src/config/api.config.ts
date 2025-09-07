import { API_BASE_URL } from '../constants/urls';

interface ApiConfig {
  baseUrl: string;
  defaultParams: Record<string, string>;
  endpoints: {
    menu: {
      path: string;
      requiredParams: string[];
    };
    category: {
      path: string;
    };
    item: {
      path: string;
    };
    orders: {
      path: string;
      requiredParams: string[];
    };
  };
}

const config: ApiConfig = {
  baseUrl: API_BASE_URL,
  defaultParams: {
    organization_id: '383da1bc-069a-4da8-9e60-80c9d0e703bd',
  },
  endpoints: {
    menu: {
      path: '/menu',
      requiredParams: ['organization_id'],
    },
    category: {
      path: '/menu/category',
    },
    item: {
      path: '/menu/item',
    },
    orders: {
      path: '/orders',
      requiredParams: ['organization_id'],
    },
  },
};

export const buildApiUrl = (
  endpoint: keyof ApiConfig['endpoints'],
  additionalParams?: Record<string, string>
): string => {
  const endpointConfig = config.endpoints[endpoint];
  const url = new URL(`${config.baseUrl}${endpointConfig.path}`);

  Object.entries(config.defaultParams).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  return url.toString();
};

export default config;
