import React, { useEffect } from 'react';
import { proxy, useSnapshot, useModel } from 'umi';

/**
 * 
 */
const Valtio = () => {

    // 1、定义数据
    const state = proxy({ count: 0 });
    // 2、使用数据
    const snap = useSnapshot(state);
    //     snap.count;
    //     // 3、更新数据
    // state.count += 1;
    console.dir(state)

    const {name, setName} = useModel('global');

    const handleBtn2Click = () => {
        // setName('123')
    }



    return <div>Valtio

        {snap.count}
        <p>{name}</p>
        <button onClick={() => {
            state.count += 1;
        }}>加1</button>
        <button onClick={handleBtn2Click}>修改name</button>
        {name}

    </div>;
}




export default Valtio;