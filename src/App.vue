<template>
  <div id="app" :class="{darkModel:isDark}">
    <router-view @getDarkModel="getDarkModel"/>
    
  </div>
</template>

<script>

export default {
  name: 'app',
  data(){
    return{
      isDark:false,
    }
  },
  methods:{
    getDarkModel(isDark){
      this.isDark=isDark;
    }
  }
}
</script>

<style>
body,html{
  /* background-image: url('./img/84035784_p0.jpg');
  background-repeat: no-repeat;
  background-size: cover; */
  height: 100%;
}
#app{
  background: rgba(255,255,255,0.8);
  height: 100%;
}


@media screen and (min-width:1921px){
   html{
   font-size: 14px;
  }
}
@media screen and (min-width:1601px) and (max-width:1920px){
  html{
      font-size: 13px;
  }
}
@media screen and (min-width:1367px) and (max-width:1600px){
  html{
      font-size: 13px;
  }
}
@media screen and (min-width:1025px) and (max-width:1366px){
  html{
      font-size: 13px;
  }
}
@media screen and (min-width:1025px) and (max-width:1366px){
  html{
      font-size: 13px;
  }
}
/* 平板尺寸 */
@media screen and (min-width:768px) and (max-width:1023px){
  html{
      font-size: 12px;
  }
}
@media screen and (min-width:450px) and (max-width:767px){
  html{
      font-size: 12px;
  }
}
@media screen and (max-width:449px){
  html{
      font-size: 12px;
  }
}
*{
  font-size: 1rem;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "微软雅黑";
}
a{
  text-decoration: none;
  color: black;
}
input{
  height: 2.2rem;
  box-sizing: border-box;
  border: 1px solid #e3e3e3;
  border-radius: 3px;
  padding: 3px 5px;
}
::-webkit-scrollbar {
    width: 6px;
    height: 7px;
    background-color: #F5F5F5;
}
::-webkit-scrollbar-thumb {
    background-color: #999;
    border-radius: 10px;
}
::-webkit-scrollbar-track {
    background-color: #F5F5F5;
}
.clearfix:after{
  display: block;
  content: "";
  clear: both;
}
/* 去除手机浏览器按钮点击出现的高亮框 */
button,input{
-webkit-tap-highlight-color: rgba(0,0,0,0);
}
/* 评论回复区域(抽屉内部) */
.comment-drawer{
   background-color: rgba(255,255,255,0.8) !important;
}
.comment-drawer .el-drawer__header{
  margin-bottom: 0;
}
.comment-drawer .el-drawer__body{
  height: calc(100% - 46px);
  overflow: auto;
}
/* 暗黑模式 */
#app.darkModel .leftDrawer,
#app.darkModel .play-tuijian,
#app.darkModel .comment-drawer{
  color: #efefef;
  background-color:#333333;
}
#app.darkModel .header,
#app.darkModel .play-setting{
    color: #efefef;
  background-color:#262626;
}
#app.darkModel .comment-drawer{
  background-color: rgba(51,51,51,0.8) !important;
}
#app.darkModel .leftDrawer{
  border-right: 2px solid gray;
}
#app.darkModel .leftDrawer a,
#app.darkModel .play-tuijian a,
#app.darkModel .header a,
#app.darkModel .play-setting a{
  color:#efefef;
}

/* 菜单图标 */
@font-face {font-family: "menu";
  src: url('./fonts/menu.eot?t=1603802424647'); /* IE9 */
  src: url('./fonts/menu.eot?t=1603802424647#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAK4AAsAAAAABsgAAAJpAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCcAqBVIFJATYCJAMICwYABCAFhG0HMBvvBcguoRzbUaRIjTD22MXDrNJPwIFxIB6e3x917vvvD5XIONPANLNw2iZVIUJpQx6EskKJ252F/V/TlFjX5fmWXRXgQKE9zD/gXEaOnZ6b3vObkJtwywdN5hZRwZHUAyc2/zpDA/BfUfj+z+X0rjYHMj9QQCmvvWlSL8A4oMD2xCiyC2hM44axC17gcQI1ug0UVvbnV1CX2eMCcdpzDKgXfLLMklVCRcPSLB4oVaWbaeB+dP34YhZ1krJgl+06urNh+Z6TxtP/HAwQfgJaXaLAJJCJfY2xHUqC0UpqYmX94FjFwXsfGMRRtYL9dXZhHeiEvGfie4JHvWUCGdVYAlYnJaiuC/fdutR9uHljq9btjevrZ5vXN25vRU8enWnoNb1+6euM1wXYfEJv3jXvFVtbv38ZaJfaLXH9JGuHJftnxbniCSggGH17Ua0387Vem8G7FWmyYQ5QdWJ78AP5A5uyIbT1KWv8xlSypHFjFTVq8B92tfibqmq/W0uoKvAZJJW6oFBlEM3ESSjVmoIKVeahxoTD6lqtWEnkaox7BxCafEDS4CUUmvygmfgLpQ7/UKEpSlDjQLRuWWs4vOYykyFko/mInpXEyjVKMy6+IOc2NDgvjOg3xLkXxOloUk4eKCZeYkZ+58xEFCpOItyD0ygME0w58cmSkSuSLsZj1XShkZVE0LSMEYMgNmR6hDyWREwF7UWzgv0F4rgVMnBHQ53zBmE5r3s0NTIZgB5k8aCGRzknd8cxI4SCFJaIoD2wkNCJJVDaPMhHLGLEnRBJLYxRKzVUNtpeEf3dDqhhq1M4/QoVhwzPNmIAAAAA') format('woff2'),
  url('./fonts/menu.woff?t=1603802424647') format('woff'),
  url('./fonts/menu.ttf?t=1603802424647') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('./fonts/menu.svg?t=1603802424647#iconfont') format('svg'); /* iOS 4.1- */
}
.icon-menu{
  font-family: "menu";
}
.icon-menu:before {
  content: "\e614";
}
.el-slider__runway{
  margin: 0 auto !important;
}
</style>
