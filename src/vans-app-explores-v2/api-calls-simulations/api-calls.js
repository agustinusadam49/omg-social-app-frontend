import { dummyVansArr } from "../../dummyDataV2";

export const promiseToGetVansV2 = () => {
  const errorObj = {
    message: "Tidak dapat menemukan data vans!",
    statusText: "Bad Request",
    code: 400,
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (dummyVansArr.length) {
        resolve(dummyVansArr);
      } else {
        reject(errorObj);
      }
    }, 500);
  });
};

export const processGetHostVanDetailV2 = (idOfHostVan) => {
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
