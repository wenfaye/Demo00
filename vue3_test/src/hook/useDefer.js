// const useDefer = ()=>{
//     return ()=>{
//         return true;
//     }
// }
// export default useDefer;

import { ref } from 'vue'
export default function useDefer(maxFrameCount = 1000) {
    const frameCount = ref(0);
    const refreshFrameCount = () => {
        requestAnimationFrame(() => {
            frameCount.value++;
            console.log(frameCount.value);
            if (frameCount.value < maxFrameCount) {
                refreshFrameCount();
            }
        });
    }
    refreshFrameCount();
    return function (showInFrameCount) {
        console.log(frameCount.value);
        return frameCount.value >= showInFrameCount;
    }
}
