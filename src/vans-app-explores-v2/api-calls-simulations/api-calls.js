import { dummyVansArr } from "../../dummyDataV2";

export const promiseToGetVans = (typeOfVanQuery) => {
  const errorObj = {
    message: "Tidak dapat menemukan data vans!",
    statusText: "Bad Request",
    code: 400,
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (dummyVansArr.length) {
        if (typeOfVanQuery) {
          const filteredVansByType = dummyVansArr.filter(
            (vanItem) =>
              String(vanItem.type).toLowerCase() ===
              String(typeOfVanQuery).toLowerCase(),
          );

          if (filteredVansByType.length) {
            resolve(filteredVansByType);
          } else {
            reject(errorObj);
          }
        } else {
          resolve(dummyVansArr);
        }
      } else {
        reject(errorObj);
      }
    }, 500);
  });
};

export const processGetHostVanDetail = (idOfHostVan) => {
  const errorObj = {
    message: `Tidak dapat menemukan data host van detail dengan id: ${idOfHostVan}`,
    statusText: "Bad Request",
    code: 401,
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (dummyVansArr.length) {
        const hostVanByIdArr = dummyVansArr.filter(
          (hostVan) => hostVan.id === idOfHostVan,
        );

        if (hostVanByIdArr.length) {
          resolve(hostVanByIdArr[0]);
        } else {
          reject(errorObj);
        }
      } else {
        reject(errorObj);
      }
    }, 500);
  });
};

export const processGetVanHostVans = (targetedHostId) => {
  const errorObj = {
    message: "Tidak dapat menemukan data host vans!",
    statusText: "Bad Request",
    code: 400,
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (dummyVansArr.length) {
        const hostVansByHostId = dummyVansArr.filter(
          (vans) => vans.hostId === targetedHostId,
        );

        if (hostVansByHostId.length) {
          resolve(hostVansByHostId);
        } else {
          reject(errorObj);
        }
      } else {
        reject(errorObj);
      }
    }, 500);
  });
};

export const processGetVanDetailById = (idOfVanDetail) => {
  const errorObj = {
    message: `Tidak dapat menemukan data van detail dengan id: ${idOfVanDetail}`,
    statusText: "Bad Request",
    code: 400,
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!!dummyVansArr.length) {
        const vanDetailById = dummyVansArr.filter(
          (van) => van.id === Number(idOfVanDetail),
        );

        if (vanDetailById.length) {
          resolve(vanDetailById);
        } else {
          reject(errorObj);
        }
      } else {
        reject(errorObj);
      }
    }, 500);
  });
};
