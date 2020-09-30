
import { CognitoUser } from "amazon-cognito-identity-js";

export const BROADCAST_AUTH_CHANNEL = "AuthStateEventChannel";

export enum BROADCAST_EVENT {
    "LOADING",
    "UPDATED"
}

type AuthState = {
    isAuthenticated: boolean;
    user: CognitoUser | null;
}
export default AuthState;