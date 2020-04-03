<template>
    <div class="params-container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-alert show-icon title="!只允许为第三级分类设置相关参数" type="warning" :closable="false"></el-alert>
            
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类:</span>
                    <!-- model级联选择框双向绑定的数组.  option指定数据源 .  props用来配置级联选择框-->
                    <el-cascader v-model="selectedCateKeys" :options="catelist" :props="cateProps" @change="handleChange"></el-cascader>
                </el-col>
            </el-row>


            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button :disabled="isBtnDisabled" type="primary" size="mini" @click="adddialogVisible=true">添加动态参数</el-button>

                    <!-- table -->
                    <el-table :data="manyTableData" border stripe>
                        <!-- 点击展开行 -->
                        <el-table-column type="expand">
                            
                                <template slot-scope="scope">
                                    <el-tag closable v-for="(item,i) in scope.row.attr_vals" :key="i" @close="handleTagClose(i,scope.row)">{{item}}</el-tag>
                                    
                                    <!-- 添加tag -->
                                    <el-input class="input-new-tag"
                                        v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                                        ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)">
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                </template>

                        </el-table-column>

                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="name" prop="attr_name"></el-table-column>
                        <el-table-column label="oprations">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="warning" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button :disabled="isBtnDisabled" type="primary" size="mini" @click="adddialogVisible=true">添加静态属性</el-button>

                    <!-- table -->
                    <el-table :data="onlyTableData" border stripe>

                        <!-- 点击展开行 -->
                        <el-table-column type="expand">

                                <template slot-scope="scope">
                                    <el-tag closable v-for="(item,i) in scope.row.attr_vals" :key="i" @close="handleTagClose(i,scope.row)">{{item}}</el-tag>
                                    
                                    <!-- 添加tag -->
                                    <el-input class="input-new-tag"
                                        v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                                        ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)">
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                </template>

                        </el-table-column>

                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="name" prop="attr_name"></el-table-column>
                        <el-table-column label="oprations">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="warning" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

        </el-card>

        <!-- 添加对话框 -->
        <el-dialog
            :title="'添加'+ titleText"
            :visible.sync="adddialogVisible"
            width="50%" @close="addDialogClosed">
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="adddialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
        
        <!-- 编辑对话框 -->
        <el-dialog
            :title="'修改'+ titleText"
            :visible.sync="editdialogVisible"
            width="50%" @close="editDialogClosed">
            <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
export default {
    data(){
        return {
            catelist:[],  //商品分类列表
            cateProps:{
                value:'cat_id',
                label:'cat_name',
                children: 'children'
            },
            selectedCateKeys:[],

            activeName:'many',  //默认选中项
            manyTableData:[],
            onlyTableData:[],
            adddialogVisible:false,   //添加对话框
            editdialogVisible:false,  //编辑对话框
            addForm:{},           //添加对话框 的表单数据对象
            addFormRules:{
                attr_name:[
                    {required:true,message:'请输入名称',trigger:'blur'}
                ]
            },

            editForm:{},           //编辑对话框 的表单数据对象
            editFormRules:{
                attr_name:[
                    {required:true,message:'请输入名称',trigger:'blur'}
                ]
            },
       


        }
    },
    computed:{
      
        isBtnDisabled(){         //如果按钮需要被禁用，则返回true，否则返回false
            if(this.selectedCateKeys.length != 3){
                return true;
            }else{
                return false;
            }
        },
        cateId(){   
            if(this.selectedCateKeys.length ==3){  //如果选中的是第三级分类,就返回第三级分类的id
                return this.selectedCateKeys[2]  
            }
        },

        titleText(){             //动态计算标题的文本
            if(this.activeName =='many'){
                return '动态参数'
            }else{
                return '静态属性'
            }

        }

    },
    created(){
        this.getCateList();
    },
    methods:{
        getCateList(){
            this.$axios.get('categories').then(res=>{
                 if(res.data.meta.status !==200){
                     return this.$notify({msssage:'获取商品分类数据失败'})
                 }
                 this.catelist = res.data.data;
                 console.log(this.catelist)
            })
        },
        handleChange(){
            this.getParamsData();
        },
        handleTabClick(){
            this.getParamsData();
        },
        getParamsData(){
            //证明选中的不是三级分类
            if(this.selectedCateKeys.length !== 3){
                this.selectedCateKeys = []
                this.manyTableData = [];  //有可能第二次选择的不是第三级,many&only显示的是上一次的内容
                this.onlyTableData = [];
                return;
            }
            console.log(this.selectedCateKeys);

            //通过级联的第三级的id查询 第三级该id获取所有相关类型信息,this.acitveName=many是获取动态属性的信息. =only是静态属性信息
            this.$axios.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}}).then(res=>{
                if(res.data.meta.status !==200){
                    return this.$notify({msssage:'获取参数列表失败'})
                }
                console.log(res);
                res.data.data.forEach(item=>{
                    item.attr_vals = item.attr_vals?item.attr_vals.split(','):[];
                    //控制new tag的文本框的显示与隐藏
                    //给每一行的new tag设置自己单独的显示&隐藏.&input值
                    item.inputVisible = false;
                    item.inputValue = '';
                })
                console.log(res.data.data);


                if(this.activeName == 'many'){
                    this.manyTableData = res.data.data;
                }else{
                    this.onlyTableData = res.data.data;
                }
            })
        },

        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
        },
        addParams(){
            this.$refs.addFormRef.validate(valid=>{
                if(!valid) return;
                this.$axios.post(`categories/${this.cateId}/attributes`,{
                    attr_name:this.addForm.attr_name,
                    attr_sel:this.activeName
                }).then(res=>{
                    if(res.data.meta.status !== 201){
                        return this.$notify({message:'添加参数失败!'})
                    }
                    this.$notify({message:'添加参数成功'});
                    this.adddialogVisible = false;
                    this.getParamsData();
                })
            })
        },

        showEditDialog(attr_id){   //编辑弹出框
            this.$axios.get(`categories/${this.cateId}/attributes/${attr_id}`,{params:{attr_sel:this.activeName}} ).then(res=>{
                if(res.data.meta.status != 200){
                    return this.$notify({message:'获取参数信息失败'});
                }
                this.editForm = res.data.data;
            })  
            this.editdialogVisible = true;
        },
        editDialogClosed(){
            this.$refs.editFormRef.resetFields();
        },
        editParams(){
            this.$refs.editFormRef.validate(valid=>{
                if(!valid) return;
                this.$axios.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{attr_name:this.editForm.attr_name,attr_sel:this.activeName}).then(res=>{
                            if(res.data.meta.status !==200){
                                return this.$notify({message:'修改参数失败'});
                            }
                            this.$notify({message:'修改参数成功'});
                            this.getParamsData();
                            this.editdialogVisible = false;
                })
            })
        },


        removeParams(attr_id){
            this.$confirm('将永久删除该参数,是否继续','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning'
            }).then(confirm=>{
                console.log(confirm);
                this.$axios.delete(`categories/${this.cateId}/attributes/${attr_id}`).then(res=>{
                    if(res.data.meta.status !==200){
                        return this.$notify({message:'删除参数失败'});
                    }
                    this.$notify({message:'删除参数成功'});
                    this.getParamsData();
                })
            }).catch(cancle=>{
                console.log(cancle);
                this.$notify({message:'已取消删除'})
                
            });
        },

        handleInputConfirm(row){    //添加文本的input输入框失去焦点,或按下enter都会触发
            if(row.inputValue.trim().length ===0){
                row.inputVisible = false;
                row.inputValue = false;
                return;
            }else{
                row.attr_vals.push( row.inputValue.trim() );
                row.inputValue = '';
                row.inputVisible = false;
                this.saveAttrVals(row);
            }
        },
        showInput(row){             //点击按钮,展示文本框
            row.inputVisible = true;   //把布尔值重置为true，但页面上的元素可能没有渲染出来↓,所以需要$nextTick
            this.$nextTick(_ => {     //让文本框自动获得焦点
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        saveAttrVals(row){
              this.$axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                    attr_name:row.attr_name,
                    attr_sel:row.attr_sel,
                    attr_vals:row.attr_vals.join(',')
                }).then(res=>{
                    if(res.data.meta.status !=200){
                        return this.$notify({message:'添加参数失败'});
                    }
                    this.$notify({message:'添加参数成功'});
                })
        },

        handleTagClose(i,row){
            row.attr_vals.splice(i,1);
            this.saveAttrVals(row);
        }

        
    }
}
</script>
<style lang="scss" scoped>
.cat_opt{
    margin: 10px 0;
}
.el-tag{
    margin:0 5px;
}
.input-new-tag{
    width: 120px;
}
</style>
