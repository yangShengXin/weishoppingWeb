<template>
    <div class="add-container">

        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 提示 -->
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>

            <!-- 步骤条 -->       
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- ↑steps&↓tabs联动:steps是根据activeIndex值来切换,但必须是number类型,所以- 0。 tabs v-model根据activeIndex的值与name值来切换。 -->
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px" label-position="top">
                    <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">

                        <el-tab-pane label="基本信息" name="0">
                            <el-form-item label="商品名称" prop="goods_name">
                                <el-input v-model="addForm.goods_name"></el-input>
                            </el-form-item>
                            <el-form-item label="商品价格" prop="goods_price">
                                <el-input v-model="addForm.goods_price"></el-input>
                            </el-form-item>
                            <el-form-item label="商品重量" prop="goods_weight">
                                <el-input v-model="addForm.goods_weight"></el-input>
                            </el-form-item>
                            <el-form-item label="商品数量" prop="goods_number">
                                <el-input v-model="addForm.goods_number" type="number"></el-input>
                            </el-form-item>

                            <el-form-item label="商品分类" prop="goods_cat"> 
                                <el-cascader expand-trigger="hover" v-model="addForm.goods_cat" :options="catelist" :props="cateProps"  @change="handleChange"></el-cascader>
                            </el-form-item>

                        </el-tab-pane>


                        <el-tab-pane label="商品参数" name="1">
                            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                                    <el-checkbox-group v-model="item.attr_vals">
                                            <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
                                    </el-checkbox-group>
                            </el-form-item>
                        </el-tab-pane>

                        <el-tab-pane label="商品属性" name="2">
                            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                                <el-input v-model="item.attr_vals"></el-input>
                            </el-form-item>
                        </el-tab-pane>

                        <el-tab-pane label="商品图片" name="3">
                            <!-- action表示图片要上传到的后台API地址.on-preview预览函数.on-remove移除函数.list-type展示方式.
                            headers请求头拦截器.upload自己有一套，所以没有使用到main.js中的请求拦截器. success图片上传成功会触发的函数-->
                            <el-upload
                                class="upload-demo"
                                action="http://127.0.0.1:8888/api/private/v1/upload"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                list-type="picture"
                                :headers="headerObj"
                                :on-success="handleSuccess">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb。提示作用←</div>
                            </el-upload>
                        </el-tab-pane>

                        <el-tab-pane label="商品内容" name="4">
                             <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                             <el-button type="primary" style="margin-top:10px;" @click="add">添加商品</el-button>
                        </el-tab-pane>
                    </el-tabs>
            </el-form>

        </el-card>

        <el-dialog title="图片预览" :visible.sync="previewVisible"  width="50%">
            <img :src="previewPath" style="width:100%">
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            activeIndex:'0',       //步骤条默认index
            addForm:{
                goods_name:'',
                goods_price:null,
                goods_weight:null,
                goods_number:null,
                goods_cat:[],       //级联选择器 所选的值
                pics:[],            //上传图片 成功后触发函数返回的图片数组
                goods_introduce:'', //富文本内容
                attrs:[],          

            },
            addFormRules:{        //表单验证规则
                goods_name:[
                    { required:true,message:'请输入商品名称',trigger:'blur'},
                ],
                goods_price:[
                    { required:true,message:'请输入商品价格',trigger:'blur'},
                ],
                goods_weight:[
                    { required:true,message:'请输入商品重量',trigger:'blur'},
                ],
                goods_number:[
                    { required:true,message:'请输入商品数量',trigger:'blur'},
                ],
                goods_cat:[
                    { required:true,message:'请选择商品分类',trigger:'blur'},
                ],

            },
            catelist:[],     //商品分类列表
            cateProps:{      //级联选择器: label显示的名称value:选中的值,children：级与级之间嵌套关系.
                label:'cat_name',
                value:'cat_id',
                children:'children'
            },
            manyTableData:[],   //动态参数列表数据
            onlyTableData:[],   //静态属性列表数据
            headerObj:{         //upload自己的拦截器
                Authorization: sessionStorage.getItem('token')
            },

            previewPath:'',    //上传功能 图片预览
            previewVisible:false,

        }
    },
    created(){
        this.getCateList();
    },
    computed:{
        cateId(){
            if(this.addForm.goods_cat.length ===3){
                return this.addForm.goods_cat[2];
            }
            return null;
        }
    },
    methods:{
        getCateList(){
            this.$axios.get('categories').then(res=>{
                if(res.data.meta.status !=200){
                    return this.$notify({message:'获取商品分类数据失败'});
                }
                console.log(res);
                this.catelist = res.data.data;
            })
        },

        handleChange(){        //联系选择器改变
            console.log(this.addForm.goods_cat);
            if(this.addForm.goods_cat.length !==3){
                this.addForm.goods_cat = []
            }
        },

        beforeTabLeave(activeName,oldActiveName){
                console.log(activeName,oldActiveName);
                if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
                    this.$notify({message:'请先选择商品分类!'});
                    return false;
                }
        },
        tabClicked(){
            if(this.activeIndex === '1'){ //  /${this.addForm.goods_cat[2]}/
                this.$axios.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}}).then(res=>{
                        if(res.data.meta.status !==200){
                            return this.$notify({message:'获取动态参数列表失败'});
                        }
                        console.log(res);
                        res.data.data.forEach(item=>{
                            item.attr_vals = item.attr_vals.length === 0 ? []:item.attr_vals.split(',');
                        })
                        this.manyTableData = res.data.data;
                })
            }else 
            if(this.activeIndex ==='2'){

                this.$axios.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}}).then(res=>{
                        if(res.data.meta.status !==200){
                            return this.$notify({message:'获取静态属性列表失败'});
                        }
                        console.log(res);
                       
                        this.onlyTableData = res.data.data;
                })
            }
        },


        handlePreview(file){  //上传功能 处理图片预览效果
                console.log(file);
                this.previewPath = file.response.data.url;
                this.previewVisible = true;
        },
        handleRemove(file){   //处理移除上传功能 图片的操作
                //1.获取将要删除的图片的临时路径
                const filePath = file.response.data.tmp_path;
                //2.从pics数组中,找到这个图片对应的索引值
                const i = this.addForm.pics.findIndex(x=> x.pic ===filePath);
                //3.调用数组的splice方法,把图片信息对象,从pics数组中移除
                this.addForm.pics.splice(i,1);
                console.log(this.addForm);
        },
        handleSuccess(response){  //图片上传成功的触发函数
                //1.拼接得到一个图片信息对象
                const picInfo = { pic: response.data.tmp_path };//tmp_path图片临时存放的路径
                //2.将图片信息对象,push到pics数组中
                this.addForm.pics.push(picInfo);
                console.log(this.addForm);
        },

        add(){   //富文本 添加按钮
                console.log(this.addForm);
                this.$refs.addFormRef.validate(valid=>{
                    if(!valid) return this.$notify({message:'请填写必要的表单项'});
                    function deepClone(obj){

                        var objClone = Array.isArray(obj) ? [] : {};
                        if(obj && typeof obj === 'object'){
                            for( var key in obj){
                                if(obj && typeof obj[key] === 'object'){
                                    objClone[key] = deepClone(obj[key]);
                                }else{
                                    objClone[key] = obj[key];
                                }
                            }
                        }
                        return objClone;

                    }
                   
                    var newFORM = deepClone(this.addForm);   //利用深度克隆出newFORM. 
                                                           //↓利用newFORM解决 goods_cat数组 转换成逗号分隔的字符串
                        newFORM.goods_cat = newFORM.goods_cat.join(','); 

                        //处理动态参数
                        this.manyTableData.forEach(item=>{
                                const newInfo = {
                                    attr_id: item.attr_id,
                                    attr_value:item.attr_vals.join(' ')
                                }
                                this.addForm.attrs.push(newInfo);
                        })

                        //处理静态属性
                        this.onlyTableData.forEach(item=>{
                                const newInfo = {
                                    attr_id:item.attr_id,
                                    attr_value:item.attr_vals
                                }
                                this.addForm.attrs.push(newInfo);
                        })

                        newFORM.attrs = this.addForm.attrs;
                        console.log(newFORM);
               
                        this.$axios.post('goods',newFORM).then(res=>{
                            if(res.data.meta.status !== 201){
                                return this.$notify({message:'添加商品失败!'})
                            }
                            this.$notify({message:'添加商品成功'});
                            this.$router.push('/goods');

                        })


                })

        }
    }
}
</script>
<style lang="scss" scoped>

</style>
