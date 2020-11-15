<template>
  <div class="comp-content" :style="{display:preview ? 'block' :'none'}" @click="hide">
      <img v-lazy="img">
  </div>
</template>

<script>
export default {
 data() {
        return {
           img:"",
           preview:false,
           width:0,
           height:0
        }
    },
    mounted(){
        this.width=window.innerWidth;
        this.height=window.innerHeight;
    },
    methods:{
        show(img){
            this.img=img+'?param=1920y1080';//展示大图
            this.preview=true;
        },
        hide(){
            this.preview=false;
        }
    }
}
</script>

<style scoped>
.comp-content{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.8);
    z-index: 100000;
    animation: changeLarge 0.3s ease-in-out 1;
}
.comp-content img{
    max-width: 95%;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
@keyframes changeLarge {
    0%{
        transform: scale(0);
    }
    100%{
        transform: scale(1);
    }
}
</style>
