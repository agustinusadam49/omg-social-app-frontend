const orderedType = [
  [2, "Aplore"],
  [6, "Rugged"],
  [5, "Rugged"],
  [3, "Jenskin"],
  [1, "Jenskin"],
  [4, "Lombar Fox"],
];

export const mappedFromArrayToObj = (vans) => {
  const vansLocal = [...vans];
  const mapObj = new Map();
  const mappedObjVan = vansLocal.reduce((newObj, vanObjItem) => {
    newObj = mapObj.set(vanObjItem.id, vanObjItem);
    return newObj;
  }, {});

  return mappedObjVan;
};

export const orderVansByType = (vans) => {
  const vansLocal = new Map(vans);
  const result = orderedType.map((item) => vansLocal.get(item[0]));
  return result;
};
