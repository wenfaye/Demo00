import React from 'react';
import { useLocation, useMatch,useParams } from 'umi';
import WithRouterExample from './component/WithRouterExample';



export default (props) => {
  // const inventory = [
  //     { name: 'asparagus', type: 'vegetables', quantity: 9 },
  //     { name: 'bananas', type: 'fruit', quantity: 5 },
  //     { name: 'goat', type: 'meat', quantity: 23 },
  //     { name: 'cherries', type: 'fruit', quantity: 12 },
  //     { name: 'fish', type: 'meat', quantity: 22 },
  //   ];

  //   const restock = { restock: true };
  //   const sufficient = { restock: false };
  //   const result = Map.groupBy(inventory, ({ quantity }) =>
  //     quantity < 6 ? restock : sufficient,
  //   );
  //   console.log(result.get(restock));
  // [{ name: "bananas", type: "fruit", quantity: 5 }]

  const match = useMatch('/CSSworld/JavaScript/GroupBy/:id');
  console.log(match?.pathname, match?.params.id);

  const params = useParams();
  console.dir(params)

  let location = useLocation();

  return (
    <div>
      {location.pathname}
      {location.search}
      {location.hash}
      <WithRouterExample/>
    </div>
  );
}

