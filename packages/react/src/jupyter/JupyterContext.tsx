/*
 * Copyright (c) 2021-2023 Datalayer, Inc.
 *
 * MIT License
 */

import {
  Kernel as CoreKernel,
  ServerConnection,
  ServiceManager,
} from '@jupyterlab/services';
import type { JupyterLiteServerPlugin } from '@jupyterlite/server';
import React, { createContext, useContext } from 'react';
import { getJupyterToken } from './JupyterConfig';
import { requestAPI } from './JupyterHandlers';
import Kernel from './kernel/Kernel';
import { useJupyterStoreFromContext } from '../state';

export type Lite =
  | boolean
  | Promise<{ default: JupyterLiteServerPlugin<any>[] }>;

/**
 * The type for the Jupyter context.
 */
export type JupyterContextType = {
  /**
   * Whether the component is collaborative or not.
   */
  collaborative?: boolean;
  /**
   * Default kernel
   */
  defaultKernel?: Kernel;
  /**
   * Will be true while waiting for the default kernel.
   *
   * If `true`, it does not ensure a default kernel will
   * be created successfully.
   *
   * This is useful to not mount to quickly a Lumino Widget
   * to be unmount right away when the default kernel will
   * be available.
   */
  defaultKernelIsLoading: boolean;
  /**
   * The Kernel Manager.
   */
  kernelManager?: CoreKernel.IManager;
  /**
   * If `true`, it will load the Pyodide jupyterlite kernel.
   *
   * You can also set it to dynamically import any jupyterlite
   * kernel package.
   *
   * If defined, {@link serverUrls} and {@link defaultKernelName}
   * will be ignored and the component will run this in-browser
   * kernel.
   *
   * @example
   * `lite: true` => Load dynamically the package @jupyterlite/pyodide-kernel-extension
   *
   * `lite: import('@jupyterlite/javascript-kernel-extension')` => Load dynamically
   */
  lite?: Lite;
  /**
   * Jupyter Server settings
   *
   * This is useless if running an in-browser kernel via {@link lite}.
   */
  serverSettings?: ServerConnection.ISettings;
  /**
   * Jupyter services manager
   */
  serviceManager?: ServiceManager;
  /**
   * Jupyter Server base URL
   *
   * Useless if running an in-browser kernel.
   */
  baseUrl: string;
  /**
   * Jupyter Server websocket URL
   *
   * Useless if running an in-browser kernel.
   */
  wsUrl: string;
};

/**
 * The instance for the Jupyter context.
 */
export const JupyterContext = createContext<JupyterContextType | undefined>(
  undefined
);

export const useJupyter = (props?: JupyterContextProps): JupyterContextType => {
  const context = useContext(JupyterContext);
  if (context) {
    return context;
  }
  const { kernel, kernelIsLoading, serviceManager} = useJupyterStoreFromContext(props ?? {});
  const contextFromStore: JupyterContextType = {
    collaborative: false,
    defaultKernel: kernel,
    defaultKernelIsLoading: kernelIsLoading,
    kernelManager: serviceManager?.kernels,
    lite: false,
    serverSettings: serviceManager?.serverSettings,
    serviceManager: serviceManager,
    baseUrl: '',
    wsUrl: '',
  }
  return contextFromStore;
};

/**
 * The type for the Jupyter context consumer.
 */
export const JupyterContextConsumer = JupyterContext.Consumer;

/**
 * The type for the Jupyter context provider.
 */
const JupyterProvider = JupyterContext.Provider;

/**
 * Utility method to ensure the Jupyter context is authenticated
 * with the Jupyter server.
 */
export const ensureJupyterAuth = async (
  serverSettings: ServerConnection.ISettings
): Promise<boolean> => {
  try {
    await requestAPI<any>(serverSettings, 'api', '');
    return true;
  } catch (reason) {
    console.log('The Jupyter Server API has failed with reason', reason);
    return false;
  }
};

/**
 * Jupyter Server URLs
 */
export interface IServerUrls {
  /**
   * The base url of the server.
   */
  readonly baseUrl: string;
  /**
   * The base ws url of the server.
   */
  readonly wsUrl: string;
}

/**
 * The Jupyter context properties type.
 */
export type JupyterContextProps = React.PropsWithChildren<{
  /**
   * Whether the component is collaborative or not.
   */
  collaborative?: boolean;
  /**
   * Default kernel name
   */
  defaultKernelName?: string;
  /**
   * Code to be executed silently at kernel startup
   *
   * This is ignored if there is no default kernel.
   */
  initCode?: string;
  /**
   * URL to fetch a JupyterLite kernel (i.e. in-browser kernel).
   *
   * If defined, {@link serverUrls} and {@link defaultKernelName}
   * will be ignored and the component will run this in-browser
   * kernel.
   *
   * @example
   * https://cdn.jsdelivr.net/npm/@jupyterlite/pyodide-kernel-extension
   */
  lite?: Lite;
  /**
   * Jupyter Server URLs to connect to.
   *
   * It will be ignored if a {@link lite} is provided.
   */
  serverUrls?: IServerUrls;
  /**
   * Whether to start the default kernel or not.
   */
  startDefaultKernel?: boolean;
  /**
   * A loader to display while the kernel is being setup.
   */
  skeleton?: JSX.Element;
  /**
   * The Kernel Id to use, as defined in the Kernel API
   */
  useRunningKernelId?: string;
  /**
   * The index (aka position) of the Kernel to use in the list of kernels.
   */
  useRunningKernelIndex?: number;
}>;

export const createServerSettings = (baseUrl: string, wsUrl: string) => {
  return ServerConnection.makeSettings({
    baseUrl,
    wsUrl,
    token: getJupyterToken(),
    appendToken: true,
    init: {
      mode: 'cors',
      credentials: 'include',
      cache: 'no-store',
    },
  });
};

/**
 * The Jupyter context provider.
 */
export const JupyterContextProvider: React.FC<JupyterContextProps> = props => {
  const { collaborative, lite, skeleton, children } = props;
  const { serviceManager, kernel, kernelIsLoading,} = useJupyterStoreFromContext(props);
  return (
    <JupyterProvider
      value={{
        // FIXME we should not expose sub attributes
        // to promote single source of truth (like URLs come from serverSettings)
        baseUrl: serviceManager?.serverSettings.baseUrl ?? '',
        collaborative,
        defaultKernel: kernel,
        defaultKernelIsLoading: kernelIsLoading,
        kernelManager: serviceManager?.kernels,
        lite: lite,
        serverSettings:
          serviceManager?.serverSettings ?? createServerSettings('', ''),
        serviceManager,
        wsUrl: serviceManager?.serverSettings.wsUrl ?? '',
      }}
    >
      { kernelIsLoading && skeleton }
      { children }
    </JupyterProvider>
  );
};
