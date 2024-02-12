<template>
    <section class="grid-item full grid-item-potential"
        data-analytics-section-engagement="name:apps help unlock the full potential">
        <div class="flex-content align-items-center align-items-start-small flex-column-reverse-small">
            <div class="headline-content">
                <h3 class="typography-headline">Apps help unlock the full potential of&nbsp;your Apple devices.</h3>
            </div>
            <div class="picture-container">
                <picture id="overview-experiences-devices-1" class="overview-experiences-devices" data-picture-lazy-load=""
                    data-picture-loaded="">

<!-- 
                    <source
                        srcset="/v/app-store/b/images/overview/experiences_devices__ca7eoggbh2z6_small.jpg 1x ,/v/app-store/b/images/overview/experiences_devices__ca7eoggbh2z6_small_2x.jpg 2x "
                        media="(max-width: 734px)">
                    <source
                        srcset="/v/app-store/b/images/overview/experiences_devices__ca7eoggbh2z6_medium.jpg 1x ,/v/app-store/b/images/overview/experiences_devices__ca7eoggbh2z6_medium_2x.jpg 2x "
                        media="(max-width: 1068px)">
                    <source
                        srcset="/v/app-store/b/images/overview/experiences_devices__ca7eoggbh2z6_large.jpg 1x ,/v/app-store/b/images/overview/experiences_devices__ca7eoggbh2z6_large_2x.jpg 2x "
                        media="(min-width: 0px)"> -->
                    <img src="../assets/image/experiences_devices__ca7eoggbh2z6_large.jpeg"
                        class="overview-experiences-devices-img" width="100%" height="100%" alt="">
                </picture>

            </div>
        </div>
</section>
</template>
<script>
export default {
    name: 'Section'

}
</script>
<style>
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