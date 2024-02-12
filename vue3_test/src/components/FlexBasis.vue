<template lang="">

   <section class="section-demo">
        <div class="flex-content align-items-center">
            <div class="headline-content">
                <h3 class="typography-headline">Apps help unlock the full potential of&nbsp;your Apple devices.</h3>
            </div>
            <div class="picture-container">
               <picture class="overview-experiences-devices">
                <img src="../assets/image/experiences_devices__ca7eoggbh2z6_large.jpeg" width="100%" height="100%">
               </picture>
            </div>
        </div>
        
   </section>

    <section class="grid-item full grid-item-potential"
        data-analytics-section-engagement="name:apps help unlock the full potential">
        <div class="flex-content align-items-center align-items-start-small flex-column-reverse-small">
            <div class="headline-content">
                <h3 class="typography-headline">Apps help unlock the full potential of&nbsp;your Apple devices.</h3>
            </div>
            <div class="picture-container">
                <picture id="overview-experiences-devices-1" class="overview-experiences-devices" data-picture-lazy-load=""
                    data-picture-loaded="">
                    <img src="../assets/image/experiences_devices__ca7eoggbh2z6_large.jpeg"
                        class="overview-experiences-devices-img" width="100%" height="100%" alt="">
                </picture>
            </div>
        </div>
    </section>

</template>
<script>
export default {
    name: 'FlexBasis'

}
</script>
<style>
.section-demo {
    overflow: hidden;/**/
    /* height: 0;
    min-height: 550px; */
    height: 550px;
    box-sizing: border-box;
    width: 1020px;
    margin: 0 auto;
    padding: var(--tile-padding);
    background-color: #fff;
    border-radius: 20px;
}

.flex-content {
    height: 100%;
    display: flex;
}

.headline-content {
    /* flex: 1; */
    flex-grow: 1;
    position: relative;
}

.picture-container {
    /* flex: 1; */
    flex-basis: 50%;
    max-width: 50%;
    margin-right: -60px;
}

.overview-experiences-devices {
    display: block;
    width: 739px;
    height: 550px;
    float: right;
}



.align-items-center {
    align-items: center;
}

.grid-item.full {
height: 0;
min-height: 550px;

}
.grid-item {
    position: relative;
    box-sizing: border-box;
    border-radius:18px;
    background-color: #fff;
    overflow: hidden;
    padding: var(--tile-padding);
    width: 1020px;
}
.grid-item.full .flex-content {
    display: flex;
    height: 100%;
}
.align-items-center {
    align-items: center;
}
</style>