import { createContext } from "react";

export const notifContext = createContext({
  staticFilteredData: null,
  notifArrByActivePage: null,
  notifDataFromSlice: null,
  totalAllIsRead: null,
  isNotifLoadingState: null,
  notifDataObj: null,
  notifTitle: "",
  pagePathName: "",
  changeButton: () => {},
});

export const NotifContextProvider = ({ children, ...otherProps }) => {
  return (
    <notifContext.Provider value={{ ...otherProps }}>
      {children}
    </notifContext.Provider>
  );
};
