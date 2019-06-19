

/* tslint:disable */
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
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================