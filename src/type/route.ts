export interface RouteItem {
  path?: string;
  name?: string;
  component?: any;
  redirect?: Redirect;
  children?: RouteItem[];
}

export interface Redirect {
  name: string;
}
