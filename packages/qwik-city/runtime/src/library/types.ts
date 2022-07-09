import type { FunctionComponent } from '@builder.io/qwik';
import type { RenderDocument } from '../../../../qwik/src/server/types';
import type { ROUTE_TYPE_ENDPOINT } from './constants';

export interface EndpointModule<BODY = unknown> {
  onDelete?: EndpointHandler<BODY>;
  onGet?: EndpointHandler<BODY>;
  onHead?: EndpointHandler<BODY>;
  onOptions?: EndpointHandler<BODY>;
  onPatch?: EndpointHandler<BODY>;
  onPost?: EndpointHandler<BODY>;
  onPut?: EndpointHandler<BODY>;
  onRequest?: EndpointHandler<BODY>;
}

export interface PageModule extends EndpointModule {
  readonly default: any;
  readonly breadcrumbs?: ContentBreadcrumb[];
  readonly head?: ContentModuleHead;
  readonly headings?: ContentHeading[];
}

export interface LayoutModule extends EndpointModule {
  readonly default: any;
  readonly head?: ContentModuleHead;
}

/**
 * @public
 */
export interface RouteLocation {
  hash: string;
  hostname: string;
  href: string;
  params: RouteParams;
  pathname: string;
  search: string;
  query: Record<string, string>;
}

/**
 * @public
 */
export interface DocumentHead {
  title: string;
  meta: DocumentMeta[];
  links: DocumentLink[];
  styles: DocumentStyle[];
}

/**
 * @public
 */
export interface DocumentMeta {
  content?: string;
  httpEquiv?: string;
  name?: string;
  property?: string;
  key?: string;
}

/**
 * @public
 */
export interface DocumentLink {
  as?: string;
  crossorigin?: string;
  disabled?: boolean;
  href?: string;
  hreflang?: string;
  id?: string;
  imagesizes?: string;
  imagesrcset?: string;
  integrity?: string;
  media?: string;
  prefetch?: string;
  referrerpolicy?: string;
  rel?: string;
  sizes?: string;
  title?: string;
  type?: string;
  key?: string;
}

/**
 * @public
 */
export interface DocumentStyle {
  style: string;
  props?: { [propName: string]: string };
  key?: string;
}

/**
 * @public
 */
export interface HeadComponentProps extends RouteLocation {
  resolved: DocumentHead;
}

/**
 * @public
 */
export type HeadComponent = FunctionComponent<HeadComponentProps>;

/**
 * @public
 */
export interface ContentBreadcrumb {
  text: string;
  href?: string;
}

export interface ContentState {
  breadcrumbs: ContentBreadcrumb[] | undefined;
  headings: ContentHeading[] | undefined;
  modules: ContentModule[];
}

/**
 * @public
 */
export interface ContentMenu {
  text: string;
  href?: string;
  items?: ContentMenu[];
}

/**
 * @public
 */
export interface ContentHeading {
  text: string;
  id: string;
  level: number;
}

export type ContentModuleLoader = () => Promise<ContentModule>;
export type EndpointModuleLoader = () => Promise<EndpointModule>;
export type ModuleLoader = ContentModuleLoader | EndpointModuleLoader;

/**
 * @public
 */
export type RouteData =
  | [pattern: RegExp, pageLoaders: ContentModuleLoader[]]
  | [pattern: RegExp, pageLoaders: ContentModuleLoader[], paramNames: string[]]
  | [
      pattern: RegExp,
      endpointLoaders: EndpointModuleLoader[],
      paramNames: string[],
      routeType: typeof ROUTE_TYPE_ENDPOINT
    ];

/**
 * @public
 */
export interface QwikCityPlan {
  routes: RouteData[];
  menus?: { [pathName: string]: ContentMenu };
  trailingSlash?: boolean;
}

/**
 * @public
 */
export type RouteParams = Record<string, string>;

export interface MatchedRoute {
  loaders: ModuleLoader[];
  params: RouteParams;
}

export interface LoadedRoute extends MatchedRoute {
  modules: ContentModule[];
}

export interface LoadedContent extends LoadedRoute {
  pageModule: PageModule;
}

export type ContentModule = PageModule | LayoutModule;

export type ContentModuleHead = HeadComponent | DocumentHead;

/**
 * @public
 */
export interface RequestEvent {
  method: HttpMethod;
  request: Request;
  params: RouteParams;
  url: URL;
}

/**
 * @public
 */
export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'CONNECT'
  | 'TRACE';

/**
 * @public
 */
export type EndpointHandler<BODY = unknown> = (
  ev: RequestEvent
) => EndpointResponse<BODY> | Promise<EndpointResponse<BODY>>;

export interface EndpointResponse<BODY = unknown> {
  body?: BODY | null | undefined;
  /**
   * HTTP Headers. The "Content-Type" header is used to determine how to serialize the `body` for the
   * HTTP Response.  For example, a "Content-Type" including `application/json` will serialize the `body`
   * with `JSON.stringify(body)`. If the "Content-Type" header is not provided, the response
   * will default to include the header `"Content-Type": "application/json; charset=utf-8"`.
   */
  headers?: Record<string, string | undefined>;
  /**
   * HTTP Status code. The status code is import to determine if the data can be public
   * facing or not. Setting a value of `200` will allow the endpoint to be fetched using
   * an `"accept": "application/json"` request header. If the data from the API
   * should not allowed to be requested, the status should be set to one of the Client Error
   * response status codes. An example would be `401` for "Unauthorized", or `403` for
   * "Forbidden".
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses
   */
  status: number;
}

export interface QwikCityRenderDocument extends RenderDocument {
  __qwikUserCtx?: {
    qwikCity?: {
      endpointResponse?: EndpointResponse;
    };
  };
}
