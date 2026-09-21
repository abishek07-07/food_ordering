
export interface Users {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name :string
  password: string;
  email: string
slug : string

}


export interface Roles {
  id: number
  name: string
  description: string

}

export interface UsersRoles {
  user_id: number,
  role_id : number

}
