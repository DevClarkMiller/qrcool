export const INITIAL_ENTRYCONTENT_STATE = {
    EntryContent: {
        Id: -1,
        EntryId: -1,
        ContentId: -1
    },
    Content: {
        Id: -1,
        ContentTypeId: -1,
        Name: "",
        Text: "",
        Path: ""
    }
};

export const ENTRYCONTENT_ACTIONS = {
    UPDATE_ENTRYCONTENT_FIELD: 1,
    UPDATE_CONTENT_FIELD: 2,
    RESET_FIELDS: 3,
};

export const entryContentReducer = (state, action) =>{
    switch(action.type){
        case ENTRYCONTENT_ACTIONS.UPDATE_ENTRYCONTENT_FIELD:
            return {
                ...state, // Spread the whole state first
                EntryContent: {
                    ...state.EntryContent, // Spread the EntryContent field
                    [action.payload.name]: action.payload.value
                }
            };
        case ENTRYCONTENT_ACTIONS.UPDATE_CONTENT_FIELD:
            return {
                ...state, // Spread the whole state first
                Content: {
                    ...state.Content, // Spread the Content field
                    [action.payload.name]: action.payload.value
                }
            };
        case ENTRYCONTENT_ACTIONS.RESET_FIELDS:
            return state = INITIAL_ENTRYCONTENT_STATE
        default:
            return state;
    }
}