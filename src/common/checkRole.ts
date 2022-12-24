import { FUNCTION_ID } from 'src/constants/role';

export enum Operation {
  IS_GRANT = 'isGrant',
  IS_INSERT = 'isInsert',
  IS_UPDATE = 'isUpdate',
  IS_DELETE = 'isDelete',
}

export const checkRole = (
  roles: any,
  operation: Operation,
  functionID: FUNCTION_ID,
) => {
  if (roles.length < 1) return false;
  return roles?.some((role) => {
    if (role?.functionID === functionID) {
      if (operation === Operation.IS_GRANT) {
        return role?.isGrant;
      } else if (operation === Operation.IS_INSERT) {
        return role?.isInsert;
      } else if (operation === Operation.IS_UPDATE) {
        return role?.isUpdate;
      } else {
        return role?.isDelete;
      }
    } else {
      return false;
    }
  });
};
