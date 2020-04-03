<template>
    <div>

        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>
            <el-table :data="rightsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope">
                        <el-tag type="primary" v-if="scope.row.level === '0' ">一级</el-tag>
                        <el-tag type="success" v-if="scope.row.level === '1' ">二级</el-tag>
                        <el-tag type="warning" v-if="scope.row.level === '2' ">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>


    </div>
</template>
<script>
export default {
    data(){
        return {
            rightsList:[],   //权限列表 
        }
    },
    created(){
        this.getRightsList();
    },
    methods:{
        getRightsList(){
            this.$axios.get('rights/list').then(res=>{
                  console.log(res);
                  if(res.data.meta.status != 200){
                      return this.$notify({message:"获取权限列表失败"});
                  }else{
                      this.rightsList = res.data.data;
                  }
            })
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
