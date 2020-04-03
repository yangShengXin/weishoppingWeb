<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row style="margin-bottom:10px;">
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <tree-table :data="cateList" :columns="columns" 
                        :selection-type="false" 
                        :expand-type="false" 
                        show-index index-text="商品序号"
                        border>
                            <!-- 是否有效  列 -->
                            <template slot="isok" slot-scope="scope">
                                <i style="color:green" class="el-icon-success" v-if="scope.row.cat_deleted == false"></i>
                                <i style="color:orange" class="el-icon-error" v-else></i>
                            </template>

                            <!-- 排序 列 -->
                            <template slot="order" slot-scope="scope">
                                <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
                                <el-tag size="mini" v-if="scope.row.cat_level == 1">二级</el-tag>
                                <el-tag size="mini" v-if="scope.row.cat_level == 2">三级</el-tag>
                            </template>

                            <!-- 操作 列 -->
                            <template slot="opt" slot-scope="scope">
                                <el-button type="danger" icon="el-icon-edit" size="mini">编辑</el-button>
                                <el-button type="primary" icon="el-icon-delete" size="mini">删除</el-button>
                            </template>
                        
            </tree-table>

            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="querInfo.pagenum"
                :page-sizes="[1,3,5,10]"
                :page-size="querInfo.pagesize"
                layout=" sizes, prev, pager, next, jumper">
            </el-pagination>
        
        </el-card>

        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%"
            @close="addCateDialogClosed">
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:">
                    <!-- options用来指定数据源   :props="{ expandTrigger: 'hover' }"-->
                    <el-cascader
                        v-model="selectedKeys"
                        :options="parentCateList"
                        :props="cascaderProps"
                        change-on-select
                        clearable
                        @change="parentChanged">
                    </el-cascader>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return {
            cateList:[],     //商品分类数据列表
            querInfo:{       //查询条件
                type:3,
                pagenum:1,
                pagesize:5
            },
            total:0,  //总数据条数
            columns:[
                { 
                    label:'名称分类',  //列标题名称
                    prop:'cat_name'   //获取值(对应列内容的属性名的值)
                },
                {
                    label:'是否有效',
                    type:'template',  //表示将当前列定义为模板列
                    template:'isok'   //表示将当前这一列使用模板名称
                },
                 {
                    label:'排序',
                    type:'template',  //表示将当前列定义为模板列
                    template:'order'   //表示将当前这一列使用模板名称
                },
                {
                    label:'操作',
                    type:'template',  //表示将当前列定义为模板列
                    template:'opt'   //表示将当前这一列使用模板名称
                },
            ],
            addCateDialogVisible:false,  //添加分类
 
            addCateForm:{      //添加分类的 el-table表单数据对象
                 cat_name:'',    //将要添加的分类的名称
                 cat_pid:0,      //父级分类的ID
                 cat_level:0,    //分类的等级,默认要添加的是一级分类

            },
            addCateFormRules:{  //添加分类>表单元素的验证规则
                cat_name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
                ]
            },
            parentCateList:[],

            cascaderProps:{     //指定级联选择器的配置对象
                value:'cat_id',    //指定选中的值
                label:'cat_name',  //指定看到的名字
                children:'children' //指定父子之间嵌套属性 是通过 childern 属性链接的

            },
            selectedKeys:[          //选中的腹肌分类的ID数组

            ],

        }
    },
    created(){
        this.getCateList();
    },
    methods:{
        getCateList(){
            this.$axios.get('categories',{param:this.querInfo}).then(res=>{
                console.log(res);
                if(res.data.meta.status != 200){ this.$notify({message:'获取商品分类失败'}) };

                this.cateList = res.data.data;
                  
            })
        },

        handleSizeChange(newSize){  //每页显示多少条
            this.querInfo.pagesize = newSize;
            this.getCateList();
        },
        handleCurrentChange(newPage){  //当前页码改变
            this.querInfo.pagenum = newPage;
            this.getCateList(); 
        },

        showAddCateDialog(){           //添加分类
            this.getParentCateList();
            this.addCateDialogVisible = true;
        },

        getParentCateList(){
            this.$axios.get('categories',{params:{type:2}}).then(res=>{
                  if(res.data.meta.status != 200){
                      return this.$notify({message:'获取父级分类数据失败'});
                  }
                  console.log(res);
                  this.parentCateList = res.data.data;

            })
        },

        parentChanged(){    //级联选择器 发生change触发这个函数
            console.log(this.selectedKeys);
            //如果selectedKeys 数组中的length 大于0,证明选中的父级分类
            //反之,就说明没有选中任何父级分类
            if(this.selectedKeys.length>0){
                //父级分类的id
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length -1];
                //为当前分类的等级赋值
                this.addCateForm.cat_level = this.selectedKeys.length;
                return;
            }else{
                 //父级分类的id
                this.addCateForm.cat_pid = 0;
                //为当前分类的等级赋值
                this.addCateForm.cat_level = 0;

            }
        },
        addCate(){          //点击按钮,添加新的分类
            console.log(this.selectedKeys);
            this.$refs.addCateFormRef.validate(valid=>{
                 if(!valid) return;
                 this.$axios.post('categories',this.addCateForm).then(res=>{
                      if(res.data.meta.status !== 201){
                          return this.$notify({message:'添加分类失败!'});
                      }
                      this.$notify({message:'添加分类成功!'});
                      this.getCateList();
                      this.addCateDialogVisible = false;
                 })
            })

        },
        addCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields();
            //↑只是清空了input标签的值,而没有清空cascader的值(联级的值)
            this.selectedKeys = [];
            this.addCateForm.cat_level = 0; 
            this.addCateForm.cat_pid = 0;
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
