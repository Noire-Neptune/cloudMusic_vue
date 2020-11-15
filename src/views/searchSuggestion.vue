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
        <div class="classify-content-item" v-for="(item, i) of classifyArr" :key="i" 
        :style="{backgroundColor:getBackGround()}">
        <span>{{item.name}}</span><img v-if="item.hot" src="https://p1.music.126.net/2zQ0d1ThZCX5Jtkvks9aOQ==/109951163968000522.png" alt="hot"></div>
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
      classifyArr:[],//歌曲分类
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
    getSongClassify(){
      this.g.axios({
          url: this.g.host + "/playlist/catlist",
        }).then((res) => {
          console.log("歌单分类", res);
          var classifyArr=res.data.sub,
          classifyHot=[];//热门歌单
          classifyArr=classifyArr.filter((item,i)=>{
            if(item.hot){
              classifyHot.push(item)
            }
            return !item.hot
          })
          console.log(classifyArr,classifyHot);
          //将热门歌单优先显示
          this.classifyArr = classifyHot.concat(classifyArr)
        }).catch((err) => {
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
    getBackGround(){
      // bilibili粉,网易云音乐红,支付宝蓝,微信绿,浅灰色,'橙色','浅紫色'
      var colors=['#FB7299','#C20C0C','#0698DD','#01BC0D','#A3A3A3','orange','#A349A3'];
      return colors[Math.floor(Math.random()*colors.length)]
    }
  },
  watch: {},
  components: {},
};
</script>

<style scoped>
.content {
  padding: 1.5rem;
  height: 100%;
  overflow: auto;
}
.searchInputContent {
  padding-bottom: 1rem;
  text-align: center;
}
.searchInputContent input {
  width: calc(100% - 2.3rem);
  height: 2.3rem;
  border-radius: 2rem 0 0 2rem;
  border: 1px solid #e3e3e3;
  border-right: 0;
  padding: 3px 5px;
  vertical-align: middle;
}
.searchInputContent button {
  width: 2.3rem;
  border-radius: 0 2rem 2rem 0;
  height: 2.3rem;
  border: 1px solid #e3e3e3;
  border-left: 0;
  background-color: white;
  background-image: url("../img/search.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 1.4rem 1.4rem;
  vertical-align: middle;
}
/* 热搜 */
.hotSearchContent {
  padding-bottom: 1rem;
}
.hotSearchContent-title {
  padding-bottom: 0.5rem;
  font-weight: bold;
  font-size: 1.2rem;
  border-bottom: 1px solid #e3e3e3;
}
.hotSearchContent-con,.classify-content {
  display: flex;
  flex-wrap: wrap;
}
@media screen and (min-width: 1366px) {
  .hotSearchContent-con-item {
    width: 25%;
  }
}
@media screen and (min-width: 1024px) and (max-width: 1366px) {
  .hotSearchContent-con-item {
    width: 33.333%;
  }
}
@media screen and (max-width: 1023px) {
  .hotSearchContent-con-item {
    width: 50%;
  }
}
.hotSearchContent-con-item {
  height: 3.5rem;
  margin-top: 1rem;
  cursor: pointer;
}
.hotSearchContent-con-item-index {
  width: 3rem;
  float: left;
  height: 100%;
  line-height: 3.5rem;
  text-align: center;
  font-size: 1.2rem;
}
.hotSearchContent-con-item-detail {
  width: calc(100% - 3rem);
  float: left;
  height: 100%;
}
.hotSearchContent-con-item-detail-title,
.hotSearchContent-con-item-detail-discription {
  height: 50%;
}
.hotSearchContent-con-item-detail-title > span:first-child {
  width: 55%;
  font-weight: bold;
}
.hotSearchContent-con-item-detail-discription,
.hotSearchContent-con-item-detail-title > span:first-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hotSearchContent-con-item-detail-title > span {
  padding-right: 1rem;
}
.hotSearchContent-con-item-detail-title > img {
  width: auto;
  height: 1.4rem;
}
.classify-content{
  margin-top: 1rem;
}
.classify-content-item{
  position: relative;
  color: #ffffff;
  width: 13.7rem;
  padding: 0 1rem;
  margin: 0.3rem;
  height: 4.5rem;
  border-radius: 5px;
  line-height: 4.5rem;
  font-size: 1.2rem;
}
/* 热门歌单分类的hot icon */
.classify-content-item>img{
  position: absolute;
  top: 0.3rem;
  right: 0.5rem ;
  width: auto;
  height: 1.4rem;
}
</style>