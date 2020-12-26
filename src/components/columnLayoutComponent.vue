<template>
  <!-- 单列,双列布局组件,用于精品歌单,搜索专辑,歌单页面使用 -->
  <div class="comp-content clearfix">
    <div
      class="comp-col-content-item"
      :style="{ width: oneLayoutType ? '100%' : '50%' }"
      v-for="(item, i) of data"
      :key="i"
      @click="enter(item[idField])"
    >
      <img v-lazy="item[imgField]" alt="专辑图片" />
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "data", //数据
    "idField", //id字段
    "imgField", //图片路径字段
    "imgSpareField", //被引用图片字段
    "enterUrl", //点击子数据跳转到的页面地址
    "oneLayoutType", //是否为单列布局类型,默认否
  ],
  data() {
    return {};
  },
  methods: {
    enter(id) {
      //点击子数据跳转到配置的页面
      this.$router.push({
        path: this.enterUrl,
        query: {
          id: id,
        },
      });
    },
  },
};
</script>

<style scoped>
@media screen and (min-width: 1601px) {
  .comp-col-content-item {
    height: 10rem;
  }
  .comp-col-content-item > img {
    width: 10rem;
  }
}
@media screen and (min-width: 1367px) and (max-width: 1600px) {
  .comp-col-content-item {
    height: 9rem;
  }
  .comp-col-content-item > img {
    width: 9rem;
  }
}
@media screen and (min-width: 1025px) and (max-width: 1366px) {
  .comp-col-content-item {
    height: 8rem;
  }
  .comp-col-content-item > img {
    width: 8rem;
  }
}
/* 平板尺寸 */
@media screen and (min-width: 768px) and (max-width: 1023px) {
  .comp-col-content-item {
    height: 7rem;
  }
  .comp-col-content-item > img {
    width: 7rem;
  }
}
@media screen and (min-width: 450px) and (max-width: 767px) {
  .comp-col-content-item {
    height: 6rem;
  }
  .comp-col-content-item > img {
    width: 6rem;
  }
}
@media screen and (max-width: 449px) {
  .comp-col-content-item {
    height: 5rem;
  }
  .comp-col-content-item > img {
    width: 5rem;
  }
}
.comp-col-content-item {
  float: left;
  width: 50%;
  margin-bottom: 1rem;
}
.comp-col-content-item > span,
.comp-col-content-item > img {
  display: inline-block;
  vertical-align: middle;
}
.comp-col-content-item > img {
  height: 100%;
}
.comp-col-content-item > span {
  padding-left: 0.5rem;
}
</style>