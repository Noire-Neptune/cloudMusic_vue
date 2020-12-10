<template>
  <div id="app" :class="{ darkModel: isDark }">
    <router-view @getDarkModel="getDarkModel" />
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      isDark: false,
    };
  },
  methods: {
    getDarkModel(isDark) {
      this.isDark = isDark;
    },
  },
};
</script>

<style>
body,
html {
  /* background-image: url('./img/84035784_p0.jpg');
  background-repeat: no-repeat;
  background-size: cover; */
  height: 100%;
}
#app {
  background: rgba(255, 255, 255, 0.8);
  height: 100%;
}

@media screen and (min-width: 1921px) {
  html {
    font-size: 14px;
  }
}
@media screen and (min-width: 1601px) and (max-width: 1920px) {
  html {
    font-size: 13px;
  }
}
@media screen and (min-width: 1367px) and (max-width: 1600px) {
  html {
    font-size: 13px;
  }
}
@media screen and (min-width: 1025px) and (max-width: 1366px) {
  html {
    font-size: 13px;
  }
}
@media screen and (min-width: 1025px) and (max-width: 1366px) {
  html {
    font-size: 13px;
  }
}
/* 平板尺寸 */
@media screen and (min-width: 768px) and (max-width: 1023px) {
  html {
    font-size: 12px;
  }
}
@media screen and (min-width: 450px) and (max-width: 767px) {
  html {
    font-size: 12px;
  }
}
@media screen and (max-width: 449px) {
  html {
    font-size: 12px;
  }
}
* {
  font-size: 1rem;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "微软雅黑";
}
a {
  text-decoration: none;
  color: black;
}
input {
  height: 2.2rem;
  box-sizing: border-box;
  border: 1px solid #e3e3e3;
  border-radius: 3px;
  padding: 3px 5px;
}
::-webkit-scrollbar {
  width: 6px;
  height: 7px;
  background-color: #f5f5f5;
}
::-webkit-scrollbar-thumb {
  background-color: #999;
  border-radius: 10px;
}
::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}
.clearfix:after {
  display: block;
  content: "";
  clear: both;
}
/* 去除手机浏览器按钮点击出现的高亮框 */
button,
input {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
/* 评论回复区域(抽屉内部) */
.comment-drawer {
  background-color: rgba(255, 255, 255, 0.8) !important;
}
.comment-drawer .el-drawer__header {
  margin-bottom: 0;
}
.comment-drawer .el-drawer__body {
  height: calc(100% - 46px);
  overflow: auto;
}
/* 暗黑模式 */
#app.darkModel .leftDrawer,
#app.darkModel .play-tuijian,
#app.darkModel .comment-drawer {
  color: #efefef;
  background-color: #333333;
}
#app.darkModel .header,
#app.darkModel .play-setting {
  color: #efefef;
  background-color: #262626;
}
#app.darkModel .comment-drawer {
  background-color: rgba(51, 51, 51, 0.8) !important;
}
#app.darkModel .leftDrawer {
  border-right: 2px solid gray;
}
#app.darkModel .leftDrawer a,
#app.darkModel .play-tuijian a,
#app.darkModel .header a,
#app.darkModel .play-setting a {
  color: #efefef;
}

/* 菜单图标 */
@font-face {
  font-family: "menu";
  src: url("./fonts/menu.eot?t=1603802424647"); /* IE9 */
  src: url("./fonts/menu.eot?t=1603802424647#iefix") format("embedded-opentype"),
    /* IE6-IE8 */
      url("data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAK4AAsAAAAABsgAAAJpAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCcAqBVIFJATYCJAMICwYABCAFhG0HMBvvBcguoRzbUaRIjTD22MXDrNJPwIFxIB6e3x917vvvD5XIONPANLNw2iZVIUJpQx6EskKJ252F/V/TlFjX5fmWXRXgQKE9zD/gXEaOnZ6b3vObkJtwywdN5hZRwZHUAyc2/zpDA/BfUfj+z+X0rjYHMj9QQCmvvWlSL8A4oMD2xCiyC2hM44axC17gcQI1ug0UVvbnV1CX2eMCcdpzDKgXfLLMklVCRcPSLB4oVaWbaeB+dP34YhZ1krJgl+06urNh+Z6TxtP/HAwQfgJaXaLAJJCJfY2xHUqC0UpqYmX94FjFwXsfGMRRtYL9dXZhHeiEvGfie4JHvWUCGdVYAlYnJaiuC/fdutR9uHljq9btjevrZ5vXN25vRU8enWnoNb1+6euM1wXYfEJv3jXvFVtbv38ZaJfaLXH9JGuHJftnxbniCSggGH17Ua0387Vem8G7FWmyYQ5QdWJ78AP5A5uyIbT1KWv8xlSypHFjFTVq8B92tfibqmq/W0uoKvAZJJW6oFBlEM3ESSjVmoIKVeahxoTD6lqtWEnkaox7BxCafEDS4CUUmvygmfgLpQ7/UKEpSlDjQLRuWWs4vOYykyFko/mInpXEyjVKMy6+IOc2NDgvjOg3xLkXxOloUk4eKCZeYkZ+58xEFCpOItyD0ygME0w58cmSkSuSLsZj1XShkZVE0LSMEYMgNmR6hDyWREwF7UWzgv0F4rgVMnBHQ53zBmE5r3s0NTIZgB5k8aCGRzknd8cxI4SCFJaIoD2wkNCJJVDaPMhHLGLEnRBJLYxRKzVUNtpeEf3dDqhhq1M4/QoVhwzPNmIAAAAA")
      format("woff2"),
    url("./fonts/menu.woff?t=1603802424647") format("woff"),
    url("./fonts/menu.ttf?t=1603802424647") format("truetype"),
    /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
      url("./fonts/menu.svg?t=1603802424647#iconfont") format("svg"); /* iOS 4.1- */
}
.icon-menu {
  font-family: "menu";
}
.icon-menu:before {
  content: "\e614";
}
.el-slider__runway {
  margin: 0 auto !important;
}
img[lazy="loading"] {
  transform: scale(0.3) !important;
}
@font-face {font-family: "iconfont";
  src: url('./fonts/iconfont.eot?t=1607603741229'); /* IE9 */
  src: url('./fonts/iconfont.eot?t=1607603741229#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAWcAAsAAAAACogAAAVPAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDQAqIAIZgATYCJAMYCw4ABCAFhG0HWhsQCVGUT06Q7Asc5wmE0qiy2WjFEJkGQPQPPMdYAQAAAACQAIiHp/1+nTszb1BpapGMR000Kkm0k0kQEqWTZLfE7Wje/P9v6n7XFPq7MrNkFWupOS6Xf+k1+3LpeB4l0SiFqgZJFZ7HANsUBit02Q26isC/dVHg+pVpwSuiAQQG/uV/PuDFpWnqeMDq2lniUHvBUDgcoIDW/r3gg1WQF/V/SFe1F07CcQKdxm0o7R6cXUJTwYkCc86kz6BpUyshhNAuqz5Li3iipj09eBnAo/r78QtOyJE0GXeio9N9D7Y+estB+PGY53jPz4jbKjJWgULc+ZovVPTwqorOT7BqG3z/ol2SPvo/+x+L5WDgowf8Fpk7dfP/8iiSkDVExYm7Cb8XafjoiQiFjz5C4mMfIfhYIGQ+B2oNymuO1SMg1kG8IH52yyI0svaelR6F3N/fZcbkGMr3MDhUh0v77dtI7vr1+IYNvE2bOBvZOx3JteoTOhJU/IBFUcLWbPoxJkkg1vG1pi0pVHwDxU0kD9k0DZtqx9drTx7hHQM5Gzdy0fHkDEsRJt9RxPVEwR8zUoJEgonFuYIQ1ZwAew/DOZuiMpgkyeFrKRAEPp7P4MlGBOG+shl1CKnJQm1FWgw2f40GxtZYwTPVEXQ8k3fBxobgaWltohnGzgJJMipGKUpTyEnbdClot9hajGOEJOU1XURrbaNBDhW4kUK4Ynt1W3V4l+QpJn6CUs9Y9HOsNuyaXAiTwidWn0bIKc01PC1CE2KCqFQSoaEjvqyu7jGbv00PRMACAAGkhCEA44F9LtYGgY79lND2/t4XpgKmmcJ10+sKZsxvVdDcto9HV6zMXOm603uf76YDLgttNooYPNl6+9KQYZWBaf0IBSFZ+FbHMm5T3jGbHbY3lKX2+uzzvl1D3/LhO5x8rTKLlFsCL5gg4uYVpqfKFJhek3uRN8N2HqChD3A5CZBvbrGuZEOoY9xCIAkapA+vhHiG7IQGoQHzgMpBqcMroE4gJr492Kq+Przc1mHogDuJRhtOHr6jcWeYzibvA3JF/QpyVcD8BCiIY71wys1SOCR/SPUQvi2oL3N5FuulU17m8btvtOA8dy6b3a5wv2xx+X1XqIGFIYZypacSm9vLK8OD+He9Th32JX0rbukuTzC9Fhi1JzD6yOMXPwvVlp+PX14WGKU5uFpkuB6I0LN0TDF/+N79WoIpYAzhN2FjY/gmMIgpNZgJvkfgP39gFBxhTOSzDxO9877mvoumljpc7+PO+APF3fZ2gatk/9j4FkS5W0WCUQ9LyHzZ2zn2623PDdnafhy0LmktiYKt31uPNRMpnz88CSeAdn2AFhd8gGXys36yGgoHyPfl/7SO46G9eJiY+jucp+T/v8nYsn3//rwM1Ib07F1RIjZnnxWV3FH//C+PU9fy1rSoDSI7FqU60QwmdPId7Kv2Qd95SUdii50U0hETkjZjkLWbRRf8KjS6rEHVbgM6rThc3WWIUhGlA8veAEK/D0h6vULW7xNd8F/QGPULVX9A0Ok41LbsMh8V7TBFTJOH7hwlT2Ih6HRbyz0nvwiZsvJU4jWpXPrQNixn7JBiUnnMyCe+o7VAoZIID+BkFIYJpioZE9fGSOt0aJrC74kMnkTQtkMhjEY8yDWHJC4RE3J3re36+XPEVwgxKqTlh/YaUXKyf2QzWDHQh+I4Vsu6FOcmfA5NQQGJW3Yigg7ISEI+nECp/6AxwmmGUYpgasikdiKu2ChfGk3lHujEXahGihwlmqjRplxLzRpNLB5LltSlveK5rJcXzGVxr4y4nJL0ZIgKAAA=') format('woff2'),
  url('./fonts/iconfont.woff?t=1607603741229') format('woff'),
  url('./fonts/iconfont.ttf?t=1607603741229') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('./fonts/iconfont.svg?t=1607603741229#iconfont') format('svg'); /* iOS 4.1- */
}
.iconfont {
  font-family: "iconfont" !important;
}
.icon-qita:before {
  content: "\e645";
}

.icon-sanjiao:before {
  content: "\e60e";
}

.icon-jianyi:before {
  content: "\e6d3";
}

.icon-huaban:before {
  content: "\e60d";
}

.icon-geciweidianji:before {
  content: "\e727";
}


</style>
