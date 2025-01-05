/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Bruno Workspace Path - Full path to your Bruno workspace directory where your collections are stored. Default is ~/.bruno */
  "workspacePath": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `index` command */
  export type Index = ExtensionPreferences & {}
  /** Preferences accessible in the `list-collections` command */
  export type ListCollections = ExtensionPreferences & {}
  /** Preferences accessible in the `create-collection` command */
  export type CreateCollection = ExtensionPreferences & {}
  /** Preferences accessible in the `manage-environments` command */
  export type ManageEnvironments = ExtensionPreferences & {}
  /** Preferences accessible in the `view-history` command */
  export type ViewHistory = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `index` command */
  export type Index = {}
  /** Arguments passed to the `list-collections` command */
  export type ListCollections = {}
  /** Arguments passed to the `create-collection` command */
  export type CreateCollection = {}
  /** Arguments passed to the `manage-environments` command */
  export type ManageEnvironments = {}
  /** Arguments passed to the `view-history` command */
  export type ViewHistory = {}
}

