<template>
<el-container class="home-container">
    <!-- 头部 -->
    <el-header>
            <div>
                <img src="../assets/desk.png" alt="">
                <span>后台管理系统</span>
            </div>
            <el-button type="info" @click="logOut">退出</el-button>

    </el-header>

  <el-container>

        <el-aside :width="isCollapse? '64px':'200px'">
           <!-- 自定伸缩功能 -->
           <div class="toggle-button" @click="toggleCollapse">|||</div>
           
           <el-menu :default-active="activePath" :router="true" :collapse-transition="false" :collapse="isCollapse" :unique-opened="true" background-color="#ccc" text-color="#fff" active-text-color="#409EFF">
                <!-- 第一级菜单 -->
                            <!-- ↓1.点击展开所有都会展开,绑定唯一值 2.是string类型 -->
                <el-submenu :index="item.id + '' " v-for="item in menulist" :key="item.id">
                      <!-- template包裹的是整个一级标题 -->
                      <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{item.authName}}</span>
                        
                      </template>
                      
                      <!-- menu-item-group 暂时理解为里面是有多个选项吧 -->
                      <!-- <el-menu-item-group title="分组1">
                            <el-menu-item index="1-1">选项1</el-menu-item>

                            <el-menu-item index="1-2">
                                <template slot="title">
                                      <i class="el-icon-location"></i>
                                      <span>选项2</span>
                                </template>
                              
                            </el-menu-item>
                      </el-menu-item-group> -->
                      
                      <!-- submenu里面加submenu一直添加级数 -->
                      <!-- menu-item只是选项,可以是submenu同级别,也可是它的子级 -->
                      <el-menu-item
                        v-for="subItem in item.children"
                            :index="'/' + subItem.path"
                            :key="subItem.id"
                            @click=" handleNavState('/' + subItem.path) ">
                            <i class="el-icon-location"></i>
                            <span>{{subItem.authName}}</span>
                      </el-menu-item>

                </el-submenu>
                
          </el-menu>

        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>


  </el-container>

</el-container>
</template>

<script>
export default {
  data(){
    return{
        menulist:[{"id":125,"authName":"用户管理","path":"users","children":[{"id":110,"authName":"用户列表","path":"users","children":[],"order":null}],"order":1},
        {"id":101,"authName":"商品管理","path":"goods","children":[{"id":104,"authName":"商品列表","path":"goods","children":[],"order":1},{"id":121,"authName":"商品分类","path":"categories","children":[],"order":3}],"order":3},
        {"id":102,"authName":"订单管理","path":"orders","children":[{"id":107,"authName":"订单列表","path":"orders","children":[],"order":null}],"order":4}],
        iconsObj:{
          '125':"iconfont icon-user",
          '103':"iconfont icon-tijikongjian",
          '101':"iconfont icon-shangpin",
          '102':"iconfont icon-danju",
          '145':"iconfont icon-baobiao"
        },
        isCollapse:false, //伸缩
        activePath:''
    }
  },
  created(){
    //this.getMenuList();
    this.activePath = sessionStorage.getItem('activePath')||'/users';
  },
  methods: {
    logOut() {
      sessionStorage.clear("/token");
      this.$router.push("/login");
    },
    getMenuList(){
      this.$axios.get('menus').then(res=>{
           console.log(res);
           if(res.data.meta.status !==200){
                 return this.$notify({ message: 'menulist请求失败'});
           }
           this.menulist = res.data.data;
           console.log(this.menulist);
      })
    },
    toggleCollapse(){
        this.isCollapse = !this.isCollapse;
    },
    handleNavState(activePath){
        this.activePath = activePath;
        sessionStorage.setItem('activePath',activePath);
    }

  }
};
</script>
<style lang="scss" scoped>
.home-container{
    height: 100%;
}
.el-header{
    background: #eee;
    display: flex;
    justify-content: space-between;
    img{
        width: 70px;
        height: 70px;
        vertical-align: middle;
    }
}
.el-aside{
    background: #eeeeee69;
    .el-menu{
        border-right: none;
    }
}
.iconfont{
  margin-right: 10px;
}

.toggle-button{
  background-color: #000;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
