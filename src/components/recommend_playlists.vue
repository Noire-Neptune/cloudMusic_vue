<template>
  <div class="comp-content">
    <!-- 精品歌单,点击跳转至精品歌单页,传值:当前歌单标签 -->
    <router-link class="competitive" :to="{ path: '/competitive', query: { tag: curTag } }">
      <img class="competitive-img" :src="firstCompetitivePlayList.coverImgUrl" alt="精品歌单">
      <div class="competitive-descCon">
        <div class="competitive-descCon-title">精品歌单</div>
        <!-- 歌单一级标题 -->
        <div class="competitive-descCon-desc">{{firstCompetitivePlayList.name}}</div>
        <!-- 歌单二级标题 -->
         <div class="competitive-descCon-desc2">{{firstCompetitivePlayList.copywriter}}</div>
      </div>
    </router-link>
    <!-- 歌单标签 -->
    <div class="playlists-tags">
      <span v-for="(item, i) of tags" :key="i" :class="{'playlists-tags-span-active':item.name==curTag}" @click="changeTag(item.name)">{{
        item.name
      }}</span>
    </div>
    <div class="playlists">
      <playlists-component
        :playLists="playlists"
        :playListShow="playListShow"
        idKey="id"
        playCountKey="playCount"
        imgKey="coverImgUrl"
        nameKey="name"
      ></playlists-component>
    </div>
  </div>
</template>

<script>
import playlistsComponent from "../components/playilistsComponent";
export default {
  data() {
    return {
      tags: [], //标签列表
      curTag: "",
      playListShow: false,
      playlists: [], //歌单列表
      firstCompetitivePlayList:{},//第一个精品歌单
    };
  },
  mounted() {
    this.getTags();
    this.getFirstCompetitivePlayList()
  },
  methods: {
    getTags() {
      //获取热门标签(分类)
      this.g
        .axios({
          url: "/playlist/hot",
        })
        .then((res) => {
          this.g.print("热门歌单标签", res);
          this.tags = res.data.tags;
          this.curTag=this.tags[0].name;//默认选中第一个歌单
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changeTag(name) {
      //切换标签,参数:标签名
      this.curTag = name;
    },
    //获取歌单列表
    getPlayLists() {
      this.playListShow = false;
      this.g
        .axios({
          url: "/top/playlist",
          params: {
            cat: this.curTag,
            order: "hot", //热门歌单,new代表最新
          },
        })
        .then((res) => {
          this.g.print("热门歌单", res);
          this.playlists = res.data.playlists;
          this.playListShow = true;

        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取第一个精品歌单
    getFirstCompetitivePlayList() {
      this.g
        .axios({
          url: "/top/playlist/highquality",
          params: {
            cat: this.curTag,
            limit:1
          },
        })
        .then((res) => {
          this.g.print("第一个精品歌单", res);
         this.firstCompetitivePlayList=res.data.playlists[0]
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  watch: {
    curTag() {
      this.getPlayLists();
      this.getFirstCompetitivePlayList()
    },
  },
  components: {
    playlistsComponent,
  },
};
</script>

<style scoped>
.competitive {
  display: block;
  width: 100%;
  height: 15rem;
  padding: 1rem;
  border-radius: 1rem;
}
.competitive-img{
  width: 13rem;
  height: 100%;
}
.competitive-img,.competitive-descCon{
display: inline-block;
vertical-align: middle;
}
.competitive-descCon{
  width: calc(100% - 13rem);
  padding-left: 1rem;
}
.competitive-descCon-title{
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 1px solid gold;
  border-radius: 5rem;
}
.competitive-descCon-desc{
  font-size: 1.5rem;
  padding: 1rem 0 0.5rem;
}
.playlists-tags {
  padding: 0 1rem;
  text-align: right;
}
.playlists-tags span{
    margin: 0 0.5rem;
    cursor: pointer;
    padding: 0.3rem 1.2rem;
    border-radius: 1rem;
}
.playlists-tags-span-active{
  color: white;
  background-color: #409EFF;
}
</style>