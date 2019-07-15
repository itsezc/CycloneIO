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

// ====================================================
// GraphQL query operation: GetCatalogPages
// ====================================================

export interface GetCatalogPages_catalogPages_parent {
  __typename: "CatalogPage";
  id: string;
}

export interface GetCatalogPages_catalogPages_language {
  __typename: "Language";
  id: string;
}

export interface GetCatalogPages_catalogPages {
  __typename: "CatalogPage";
  id: string;
  link: string;
  parent: GetCatalogPages_catalogPages_parent | null;
  layout: CatalogPageLayout | null;
  order: number | null;
  name: string | null;
  language: GetCatalogPages_catalogPages_language | null;
  description: string | null;
  icon: string | null;
  banner: string | null;
  teaser: string | null;
  visible: boolean | null;
  enabled: boolean | null;
  rank: number | null;
  club: boolean | null;
  vip: boolean | null;
  body: any | null;
  product: any | null;
}

export interface GetCatalogPages {
  catalogPages: (GetCatalogPages_catalogPages | null)[];
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum CatalogPageLayout {
  BADGE_DISPLAY = "BADGE_DISPLAY",
  BOTS = "BOTS",
  CLUB_BUY = "CLUB_BUY",
  CLUB_GIFT = "CLUB_GIFT",
  DEFAULT = "DEFAULT",
  FRONTPAGE = "FRONTPAGE",
  GUILDS = "GUILDS",
  INFO_DUCKETS = "INFO_DUCKETS",
  INFO_PETS = "INFO_PETS",
  INFO_RENTABLES = "INFO_RENTABLES",
  MARKETPLACE = "MARKETPLACE",
  MARKETPLACE_OWN_ITEMS = "MARKETPLACE_OWN_ITEMS",
  PETS = "PETS",
  PLASTO = "PLASTO",
  RECYCLER = "RECYCLER",
  RECYCLER_INFO = "RECYCLER_INFO",
  RECYCLER_PRIZES = "RECYCLER_PRIZES",
  ROOMADS = "ROOMADS",
  SINGLE_BUNDLE = "SINGLE_BUNDLE",
  SOLD_LTD_ITEMS = "SOLD_LTD_ITEMS",
  SOUNDMACHINE = "SOUNDMACHINE",
  SPACES = "SPACES",
  TROPHIES = "TROPHIES",
}

//==============================================================
// END Enums and Input Objects
//==============================================================
