import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { RoleService } from "../services/role.service";

export const getRoleListResolver: ResolveFn<any> = () => {
    const service = inject(RoleService);
    return service.getList();
}
