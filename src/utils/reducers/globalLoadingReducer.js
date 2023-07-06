export const INITIAL_LOADING_STATE = {
  status: false,
  delete: false,
};

export const actionType = {
  RUN_LOADING_STATUS: "RUN_LOADING_STATUS",
  RUN_LOADING_DELETE: "RUN_LOADING_DELETE",
  STOP_LOADING_STATUS: "STOP_LOADING_STATUS",
  STOP_LOADING_DELETE: "STOP_LOADING_DELETE",
};

export const loadingReducer = (state, action) => {
  switch (action.type) {
    case "RUN_LOADING_STATUS": {
      return {
        ...state,
        status: true,
      };
    }
    case "STOP_LOADING_STATUS": {
      return {
        ...state,
        status: false,
      };
    }
    case "RUN_LOADING_DELETE": {
      return {
        ...state,
        delete: true,
      };
    }
    case "STOP_LOADING_DELETE": {
      return {
        ...state,
        delete: false,
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
};
