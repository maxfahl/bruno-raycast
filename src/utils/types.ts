export interface BrunoCollection {
  name: string;
  description?: string;
  parent?: string;
}

export interface BrunoRequest {
  name: string;
  method: string;
  url: string;
  collection: string;
  description?: string;
  requestId: string;
}

export interface BrunoEnvironment {
  name: string;
  variables: Record<string, string>;
}

export interface BrunoResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
  variables?: Record<string, string>;
}
