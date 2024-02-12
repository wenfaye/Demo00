<template lang="">
    <div class="container">

    </div>
    <div class="dialog-container">
        <img src="../assets/image/687474703a2f2f692e696d6775722e636f6d2f503463525567442e706e67.png" />
    </div>
</template>

<script>
export default {
    name: 'Backdrop'
}
</script>

<style>
.container {
    background-image: url(../assets/image/687474703a2f2f692e696d6775722e636f6d2f503463525567442e706e67.png);
    width: 208px;
    height: 202px;
}
.dialog-container{
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    padding: 0;
    background-color: rgba(25, 28, 34, 0.88);
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);
}
</style>