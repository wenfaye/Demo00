<template lang="">
    
     <div class="container">
        
        <div class="wrap">
            <img src="../assets/image/ts-ep2-logo.png" class="pic">
        </div>

        
     </div>
     
</template>

<script>
export default {
    name: 'EA'
}
</script>

<style>
.container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.wrap {
    width: 300px;
    height: 260px;
    transform-style: preserve-3d;
    perspective: 800px;

}

.pic {
    width: 300px;
    height: 260px;
    transform-origin: top;
    /* will-change:transform; */
    animation: house 1s linear infinite alternate;
    /* animation: house 1s linear .5s infinite alternate; */
}


@keyframes house {
    0% {
        transform: rotateX(45deg) scale(4,2) ;
        opacity: .1;
    }

    100% {
        transform: rotateX(0deg) scale(1,1) ;
        opacity: 1;
    }
}
</style>