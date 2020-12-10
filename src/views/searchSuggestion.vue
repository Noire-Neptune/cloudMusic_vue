<template>
  <div class="content">
    <div class="searchInputContent">
      <input
        type="text"
        placeholder="搜索音乐,视频,电台,专辑..."
        v-model="searchVal"
      />
      <button @click="search"></button>
    </div>
    <div class="hotSearchContent">
      <div class="hotSearchContent-title">热搜榜</div>
      <div class="hotSearchContent-con">
        <div
          class="hotSearchContent-con-item"
          v-for="(item, i) of hotSearchArr"
          :key="i"
          @click="searchSuggestionGo(item.searchWord)"
        >
          <div
            class="hotSearchContent-con-item-index"
            :style="{
              color:
                i == 0
                  ? 'red'
                  : i == 1
                  ? 'orange'
                  : i == 2
                  ? '#00A1D6'
                  : 'black',
            }"
          >
            {{ i + 1 }}
          </div>
          <div class="hotSearchContent-con-item-detail">
            <div class="hotSearchContent-con-item-detail-title">
              <!-- 搜索词 -->
              <span>{{ item.searchWord }}</span>
              <!-- 热度指数 -->
              <span>{{ item.score }}</span>
              <img v-if="item.iconUrl" v-lazy="item.iconUrl" alt="热度图片" />
            </div>
            <div class="hotSearchContent-con-item-detail-discription">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="classify">
      <div class="hotSearchContent-title">歌单分类</div>
      <div class="classify-content">
        <div
          class="classify-content-item"
          v-for="(item, i) of classifyArr"
          :key="i"
          :style="{ backgroundColor: getBackGround() }"
        >
          <span>{{ item.name }}</span
          ><img
            v-if="item.hot"
            src="https://p1.music.126.net/2zQ0d1ThZCX5Jtkvks9aOQ==/109951163968000522.png"
            alt="hot"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchVal: "", //用户搜索的关键词
      hotSearchArr: [], //热搜榜
      classifyArr: [], //歌曲分类
    };
  },
  created() {
    this.getHotSearchList();
    this.getSongClassify();
  },
  mounted() {},
  methods: {
    //获取热搜列表
    getHotSearchList() {
      //获取歌单歌曲详情
      this.g
        .axios({
          url: this.g.host + "/search/hot/detail",
        })
        .then((res) => {
          console.log("热搜列表", res);
          this.hotSearchArr = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取歌曲分类列表
    getSongClassify() {
      this.g
        .axios({
          url: this.g.host + "/playlist/catlist",
        })
        .then((res) => {
          console.log("歌单分类", res);
          var classifyArr = res.data.sub,
            classifyHot = []; //热门歌单
          classifyArr = classifyArr.filter((item, i) => {
            if (item.hot) {
              classifyHot.push(item);
            }
            return !item.hot;
          });
          console.log(classifyArr, classifyHot);
          //将热门歌单优先显示
          this.classifyArr = classifyHot.concat(classifyArr);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //搜索
    search() {
      this.$router.push({
        path: "/search",
        query: {
          searchVal: this.searchVal,
        },
      });
    },
    // 执行按照搜索建议搜索
    searchSuggestionGo(val) {
      this.searchVal = val;
      this.search();
    },
    // 获取歌单标签颜色,固定这几种颜色
    getBackGround() {
      // bilibili粉,网易云音乐红,支付宝蓝,微信绿,浅灰色,'橙色','浅紫色'
      var colors = [
        "#FB7299",
        "#C20C0C",
        "#0698DD",
        "#01BC0D",
        "#A3A3A3",
        "orange",
        "#A349A3",
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    },
  },
  watch: {},
  components: {},
};
</script>

<style src='../css/views/searchSuggestion.css' scoped>
</style>