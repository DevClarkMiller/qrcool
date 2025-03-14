export const INITIAL_STATE = {
    Id: -1,
    Username: "",
    Email: "",
    Password: "",
    LoggedIn: false
};

export const LOGIN_ACTIONS = {
    UPDATE_INPUT: 1,
    RESET_FIELDS: 2,
    LOGIN: 3,
    LOGOUT: 4
};

export const loginReducer = (state, action) =>{
    switch(action.type){
        case LOGIN_ACTIONS.UPDATE_INPUT:
            return{
                ...state,
                [action.payload.name]:action.payload.value
            }
        case LOGIN_ACTIONS.RESET_FIELDS:
            return state = INITIAL_STATE
        case LOGIN_ACTIONS.LOGIN:
            return {
                ...state, 
                LoggedIn: true
            };

        case LOGIN_ACTIONS.LOGOUT:
            return INITIAL_STATE;
        default:
            return state;
    }
}