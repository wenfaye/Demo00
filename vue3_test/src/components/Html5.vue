<template lang="">
    <div id="wrap">
        <input type="range" />
        <div>
            选择时间：<input type="time" value="22:52" />
        </div>
        <div><input type="color" value="#34538b" /></div>

       <div class="demo1"></div>
       <div class="demo2">react-native-navigation</div>
    
    </div>
</template>
<script>
export default {
    name: 'Html5'
}
</script>
<style>
#wrap {
    display: flex;
    align-items: center;
    flex-direction: column;
}

.demo1 {
    width: 400px;
    height: 300px;
    /* background-color: #375; */
    /* background-image: linear-gradient(130deg,#da6d83 30%,#d3a237 70%); */
    background-image: linear-gradient(90deg, #da6d83, #ba5140, #2b2e77, #ce93bf, #c0d09d, #ecd452);
    margin-bottom: 20px;
    /* animation: hue 2s infinite linear; */
}

.demo2 {
    font-size: 30px;
    font-weight: 600;
    background-image: linear-gradient(130deg, #da6d83 30%, #d3a237 70%);
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: hue 2s infinite linear;

}

@keyframes hue {
    from {
        filter: hue-rotate(0deg);
    }

    to {
        filter: hue-rotate(360deg);
    }
}
</style>