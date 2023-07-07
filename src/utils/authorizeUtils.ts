import jwtDecode, { JwtPayload } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
    'custom:mex_workspace_ids'?: string;
    exp?: number;
}

function isTokenActive(token: string): boolean {
    try {
        const decoded: CustomJwtPayload = jwtDecode(token);
        const now = Date.now() / 1000;  // Get current time in seconds

        // If the token's expiration time is less than the current time, it's expired
        return decoded.exp ? decoded.exp > now : false;
    } catch (error) {
        console.error(`Error decoding token: ${error}`);
        return false;
    }
}

function isUserPartOfWorkspace(token: string, userWorkspaceID: string): boolean {
    try {
        const decoded: CustomJwtPayload = jwtDecode(token);
        const workspaceIDs = decoded['custom:mex_workspace_ids']?.split('#') || [];
        // Check if userWorkspaceID is in the array
        return workspaceIDs.includes(userWorkspaceID);
    } catch (error) {
        console.error(`Error decoding token: ${error}`);
        return false;
    }
}

async function isAuthorized(bearerToken: string, workspaceId: string): Promise<boolean> {
    const isPartOfWorkspace = isUserPartOfWorkspace(bearerToken, workspaceId);
    const isTokenStillActive = isTokenActive(bearerToken);
    const isAuth = await Promise.all([isPartOfWorkspace, isTokenStillActive])
        .then(([workspace, active]) => workspace && active);

    if (!isAuth) throw new Error('Unauthorized');
    else return isAuth
}

export { isAuthorized };

