<template>
<!-- 歌单列表组件 -->
  <div class="comp-content">
    <div class="playlists clearfix">
      <div
        class="playlists-item"
        :class="{ playListShow: playListShow }"
        v-for="(item, i) of playLists"
        :key="i"
      >
        <router-link
          :to="{ name: 'playlistDetail', query: { id: item[idKey] } }"
        >
          <div class="listener-num">
            <img src="../img/listen.png" /><label>{{
              playCountToW(item[playCountKey])
            }}</label>
          </div>
          <img v-lazy="item[imgKey]" />
          <span>{{ item[nameKey] }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "playLists", //歌单列表
    "idKey", //id字段
    "playCountKey", //播放总数字段
    "imgKey", //歌单封面字段
    "nameKey", //歌单名称字段
    "playListShow", //歌单是否已经淡入出现
    "scrollLoad",//需要绑定滚动加载时间的dom元素
  ],
  data() {
    return {};
  },
  methods: {
    playCountToW(playCount) {
      //总数转换为w单位
      if (playCount < 10000) {
        return playCount;
      } else {
        return (playCount / 10000).toFixed(2) + "万";
      }
    },
  },
};
</script>

<style scoped>
@media screen and (min-width: 1921px) {
  .playlists-item {
    width: 12.5%;
    padding: 0 calc(6.25% - 5rem);
  }
}
@media screen and (min-width: 1601px) and (max-width: 1920px) {
  .playlists-item {
    width: 12.5%;
    padding: 0 calc(6.25% - 5rem);
  }
}
@media screen and (min-width: 1367px) and (max-width: 1600px) {
  .playlists-item {
    width: 16.666%;
    padding: 0 calc(8.333% - 5rem);
  }
}
@media screen and (min-width: 1025px) and (max-width: 1366px) {
  .playlists-item {
    width: 16.666%;
    padding: 0 calc(8.333% - 5rem);
  }
}
/* 平板尺寸 */
@media screen and (min-width: 768px) and (max-width: 1023px) {
  .playlists-item {
    width: 25%;
    padding: 0 calc(12.5% - 5rem);
  }
}
@media screen and (min-width: 450px) and (max-width: 767px) {
  .playlists-item {
    width: 33.3333%;
    padding: 0 calc(16.6665% - 5rem);
  }
}
@media screen and (max-width: 449px) {
  .playlists-item {
    width: 50%;
    padding: 0 calc(25% - 5rem);
  }
}
.content {
}
/* 歌单 */
.playlists {
  padding: 1rem 0;
}
.playlists-item {
  position: relative;
  top: 10px;
  opacity: 0;
  float: left;
  height: 15rem;
  padding-bottom: 1rem;
  cursor: pointer;
}
/* 淡入的过渡动画 */
.playListShow {
  transition: all 0.4s ease-in-out;
  top: 0;
  opacity: 1;
}
.playlists-item > a {
  display: block;
  position: relative;
}
.playlists-item img {
  width: 100%;
  height: 10rem;
  border-radius: 0.4rem;
}
.playlists-item span {
  display: block;
  height: 4rem;
  overflow: hidden;
}
/* 歌单右上角播放量区域 */
.listener-num {
  position: absolute;
  background-image: linear-gradient(to left, gray, transparent);
  width: 80%;
  padding-right: 0.5rem;
  right: 0;
  top: 0;
  text-align: right;
  color: white;
  border-radius: 0 0.4rem 0 0;
}
.listener-num > img {
  width: 1.4rem !important;
  height: 1.4rem !important;
}
.listener-num img,
.listener-num label {
  display: inline-block;
  vertical-align: middle;
}
</style>