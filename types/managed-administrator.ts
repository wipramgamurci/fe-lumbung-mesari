export interface CreateAdministratorRequest {
  email: string;
  fullname: string;
  username: string;
  phoneNumber: string;
  address: string;
  password: string;
}

export interface CreatedAdministrator {
  id: string;
  email: string | null;
  fullname: string;
  username: string;
  phoneNumber: string;
  address: string | null;
  status: "active";
  roleId: "administrator";
}
