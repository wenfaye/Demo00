<template>
    <div>
        <img src="../assets/image/ts-ep2-logo.png" class="image css-drop-shadow">
        <img src="../assets/image/ts-ep2-logo.png" class="image css-blur">
        <img src="../assets/image/ts-ep2-logo.png" class="image css-hue-rotate">
        <img src="../assets/image/ts-ep2-logo.png" class="image css-contrast">
    </div>
</template>
<script>
export default {
    name: 'Filter'
}
</script>
<style>
.image {
    width: 300px;
    height: 260px;
}

.css-drop-shadow {
    filter: drop-shadow(16px 16px 0px #8D1C7A);
    /* animation: change1 2s linear infinite alternate; */
}
.css-blur{
    filter: blur(5px);
}
.css-hue-rotate {
    /* filter: hue-rotate(90deg); */
    animation: change-hue-rotate 5s linear infinite alternate;
}
.css-contrast {
    animation: contrast 5s linear infinite alternate;
}
@keyframes contrast {
    from{filter: contrast(100%);}
    to{filter: contrast(0%);}
}
@keyframes change1 {
    from{
        filter: drop-shadow(16px 16px 0px #8D1C7A);
    }
    to{
        filter: drop-shadow(160px 160px 50px #8D1C7A);
    }
}
@keyframes change-hue-rotate {
    from{
        filter: hue-rotate(0);
    }
    to{
        filter: hue-rotate(180deg);
    }
}
</style>