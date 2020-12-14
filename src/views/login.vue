<template>
  <div class="content">
    <div class="header">
      <div class="logo">云音乐</div>
      <div class="links clearfix">
        <div>APP下载</div>
        <div>我的博客</div>
      </div>
    </div>
    <div class="swiper">
      <div class="swiper-one">
        <div
          class="swiper-img"
          v-for="(item, i) of swiperImgs1"
          :key="i"
          :style="{ backgroundImage: `url(${item}?param=1920y1080)` }"
        ></div>
      </div>
      <div class="swiper-two">
        <div
          class="swiper-img"
          v-for="(item, i) of swiperImgs2"
          :key="i"
          :style="{ backgroundImage: `url(${item}?param=1920y1080)` }"
        ></div>
      </div>
      <div class="mask">
        <div class="login-content">
          <p>登录云音乐</p>
          <input type="text" class="phone" v-model="phone" />
          <div class="pwdcon">
            <input type="password" class="pwd" v-model="pwd" />
            <!-- <button class="yzm" @click="sendYzm">发送验证码</button> -->
          </div>

          <button class="current" @click="login">确认</button>
          <div class="qiehuan">
            <span>邮箱登录</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      swiperImgs1: [], //走马灯图片
      swiperImgs2: [], //走马灯图片
      phone: "", //手机号
      pwd: "", //密码或验证码
    };
  },
  mounted() {
    this.loadSwipers();
  },
  methods: {
    // 加载走马灯图片
    loadSwipers() {
      this.g
        .axios({
          url: "/top/playlist",
          params: {
            cat: "ACG",
            order: "hot",
            limit: 40,
          },
          noCookie: true,
        })
        .then((res) => {
          console.log(res);
          for (let i = 0; i < res.data.playlists.length; i++) {
            var item = res.data.playlists[i];
            if (i < 20) {
              this.swiperImgs1.push(item.coverImgUrl);
            } else {
              this.swiperImgs2.push(item.coverImgUrl);
            }
          }
          console.log(this.swiperImgs1, this.swiperImgs2);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    login() {
      this.g
        .axios({
          url: this.g.host + "/login/cellphone",
          params: {
            phone: this.phone,
            password: this.pwd,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            this.alertShow = "none";
            //设置多个cookie值(由于网抑云的cookie始终设置无效,目前只能采用)
            var cookie = res.data.cookie;
            // cookie = cookie.split(" Path=/;");
            // cookie.forEach((item, i) => {
            //   if (item) {
            //     document.cookie = item + " Path=/;";
            //   }
            // });

            //document.cookie = "domain=" + document.domain;
            //this.$store.commit("setCookie", res.data.cookie);
            this.g.cookie = res.data.cookie;
            window.localStorage.setItem("cookie", cookie);
            this.g.userId = res.data.profile.userId;
            this.userId = this.g.userId;
            console.log(this.userId);
            window.localStorage.setItem("userId", this.userId);
            this.$router.push({
              path: "/",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          alert(err.data.msg);
        });
    },
  },
};
</script>

<style src='../css/views/login.css' scoped></style>