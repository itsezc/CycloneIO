/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetActiveRooms
// ====================================================

export interface GetActiveRooms_rooms {
  __typename: "Room";
  id: string;
  name: string;
  maxUsers: number | null;
  currentUsers: number | null;
}

export interface GetActiveRooms {
  rooms: (GetActiveRooms_rooms | null)[];
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNavigatorTabs
// ====================================================

export interface GetNavigatorTabs_navigatorTabs {
  __typename: "NavigatorTab";
  id: string;
  name: string | null;
}

export interface GetNavigatorTabs {
  navigatorTabs: (GetNavigatorTabs_navigatorTabs | null)[];
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNavigatorCategories
// ====================================================

export interface GetNavigatorCategories_navigatorCategories_parent {
  __typename: "NavigatorTab";
  id: string;
}

export interface GetNavigatorCategories_navigatorCategories {
  __typename: "NavigatorCategory";
  id: string;
  name: string | null;
  parent: GetNavigatorCategories_navigatorCategories_parent | null;
}

export interface GetNavigatorCategories {
  navigatorCategories: (GetNavigatorCategories_navigatorCategories | null)[];
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCatalogFeatured
// ====================================================

export interface GetCatalogFeatured_catalogFeatureds_link {
  __typename: "CatalogPage";
  id: string;
}

export interface GetCatalogFeatured_catalogFeatureds {
  __typename: "CatalogFeatured";
  caption: string | null;
  image: string | null;
  link: GetCatalogFeatured_catalogFeatureds_link | null;
}

export interface GetCatalogFeatured {
  catalogFeatureds: (GetCatalogFeatured_catalogFeatureds | null)[];
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================
