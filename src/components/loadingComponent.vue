<template>
  <div class="loadingContent" :style="{height:`${loadingHeight}px`,display:loading ? 'flex' : 'none'}">
      <div class="loader">
          <span style="--i:1"></span>
          <span style="--i:2"></span>
          <span style="--i:3"></span>
          <span style="--i:4"></span>
          <span style="--i:5"></span>
          <span style="--i:6"></span>
          <span style="--i:7"></span>
      </div>
  </div>
</template>

<script>
export default {
 data() {
        return {
           loadingHeight:0 ,//loading高度
           loading:false,
        }
    },
    mounted(){
        this.loadingHeight=this.g.loadingAllPageHeight
    },
    methods:{
        show(){
            this.loading=true;
        },
        hide(){
            this.loading=false;
        }
    }
}
</script>

<style scoped>
.loadingContent{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255,255,255,0.7);
    z-index: 100;
}
.loader{
    position: relative;
    width: 15rem;
    height: 15rem;
}
.loader span{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    animation: loading 3s ease-in-out infinite;
    animation-delay: calc(0.2s * var(--i));
}
.loader span::before{
    position: absolute;
    top: 0;
    left: calc(50% - 1.5rem);
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: linear-gradient(#fce4ec,#03a9f4);
    content:'';

}
@keyframes loading {
    0%{
        transform: rotate(0deg);
    }
    50%,100%{
        transform: rotate(360deg);
    }
}
</style>
