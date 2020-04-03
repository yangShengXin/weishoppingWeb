<template>
    <div class="list-container">
        
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                                                    <!-- 绑定输入的内容,点击button查询相关query相关字符得信息.点击clearable,clear得时候就重新获取所有信息(此时query是清空的) -->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- table区域 -->
            <el-table :data="goodslist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="140px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>



            <!-- 分页 -->
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 7, 12]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        

    </div>
</template>
<script>
export default {
    data(){
        return{
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:3
            },
            goodslist:[],  //商品列表
            total:0,       //总共有多少条数据
        }
    },
    created(){
        this.getGoodsList();
    },
    methods:{
        getGoodsList(){
            this.$axios.get('goods',{params:this.queryInfo}).then(res=>{
                if(res.data.meta.status !==200){
                    return this.$notify({message:'获取商品列表失败!'});
                }else{
                    this.$notify({message:'获取商品列表成功;'})
                    console.log(res);
                    this.goodslist = res.data.data.goods;
                    this.total = res.data.data.total;
                }
            })
        },
        handleSizeChange(newSize){  //分页功能
            this.queryInfo.pagesize = newSize;
            this.getGoodsList();
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getGoodsList();
        },

        removeById(id){      //删除功能
            this.$confirm('将永久删除该商品,确定?','提升',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
            }).then(confirm=>{
                    this.$axios.delete(`goods/${id}`).then(res=>{
                        if(res.data.meta.status !== 200){
                            return this.$notify({message:'删除api接口有误'})
                        }
                        this.$notify({message:'删除成功!'});
                        this.getGoodsList();
                    })
            }).catch(cancel=>{
                    this.$notify({message:'取消删除成功!'})
            })

        },

        goAddPage(){
            this.$router.push('/goods/add')
        }


    }
}
</script>
<style lang="scss" scoped>

</style>
