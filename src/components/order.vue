<template>
    <div>

        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" clearable >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>

            </el-row>

            <el-table :data="orderlist" border stripe>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="订单编号" prop="order_number"></el-table-column>
                    <el-table-column label="订单价格" prop="order_price"></el-table-column>
                    <el-table-column label="是否付款" prop="pay_status">
                            <template slot-scope="scope">
                                <el-tag type="success" v-if="scope.row.pay_status == 1">已付款</el-tag>
                                <el-tag type="danger" v-else>未付款</el-tag>
                            </template>
                    </el-table-column>
                    <el-table-column label="是否发货" prop="is_send"></el-table-column>
                    <el-table-column label="下单时间" prop="create_time">
                            <template slot-scope="scope">
                                {{scope.row.create_time | dateFormat}}
                            </template>
                    </el-table-column>
                    <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
                                <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
                            </template>
                    </el-table-column>
            </el-table>

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

        <el-dialog title="修改地址" :visible.sync="addressVisible"  width="50%" @close="addressDialogClosed"> 

            <el-form ref="addressForm" :rules="addressFormRules" :model="addressForm" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
                </el-form-item>

                  <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>

        </el-dialog>

        <el-dialog title="物流进度" :visible.sync="progressVisible"  width="50%" @close="progressDialogClosed"> 
                <el-timeline>
                    <el-timeline-item v-for="(activity, index) in pregressInfo" :key="index" :timestamp="activity.time">{{activity.context}}</el-timeline-item>
                </el-timeline>

        </el-dialog>

    </div>
</template>
<script>
import cityData from './citydata.js';
export default {
    data(){
        return{
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            total:0,
            orderlist:[],
            addressVisible:false,
            progressVisible:false,
            addressForm:{
                address1:[],
                address2:''
            },
            addressFormRules:{
                address1:[
                    {required:true,message:'请选择省市区县',trigger:'blur'}
                ],
                address2:[
                    {required:true,message:'请填写详细信息',trigger:'blur'}
                ],
            },
            cityData,    //导入三级联 地理数据
            pregressInfo:[],
        }
    },
    created(){
        this.getOrderList()
    },
    methods:{
        getOrderList(){
            this.$axios.get('orders',{ params: this.queryInfo }).then(res=>{
                if(res.data.meta.status !== 200){
                    return this.$notify({message:'获取订单列表失败！',type:'warning'})
                }
                console.log(res);
                this.total = res.data.data.total;
                this.orderlist = res.data.data.goods;
            })
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
        },

        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
        },

        showBox(){
            this.addressVisible = true;
        },
        addressDialogClosed(){
            this.$refs.addressForm.resetFields();
        },
        progressDialogClosed(){
            this.progressVisible = false;
        },

        showProgressBox(){
            this.$axios.get('/kuaidi/804909574412544580').then(res=>{
                if(res.data.meta.status !==200){
                    return this.$notify({message:'获取物流进度数据失败!',type:'warning'})
                }
                this.$notify({message:"获取物流进度数据成功",type:'success'})
                this.pregressInfo = res.data.data;
            })


            this.progressVisible = true;
        }

    }
    
}
</script>
<style lang="scss" scoped>

</style>
