<template>
    <div>
        
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>



        <el-card>

            <!-- 2. 为ECharts准备一个具备大小（宽高）的Dom -->
            <div id="main" style="width: 600px;height:400px;"></div>

        </el-card>

    </div>
</template>
<script>
import echarts from 'echarts'
export default {
    data(){
        return{

            option:{

                title: {
                    text: '用户来源'
                },
                tooltip: {},
                legend: {
                    data:['销量']
                },
                xAxis: {
                    data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]

            },

        }
    },
    mounted(){
        // 3.基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        //6.请求后台数据,就可以直接渲染出折线图所有的内容.但有些内容不完整，
   
        this.$axios.get('reports/type/1').then(res=>{

            if(res.data.meta.status !==200) return this.$notify({message:'获取折线图数据失败',type:'warning'})

            //7.需要前端这边自己也在option对象添加功能,后端返回的数据对象和前端option对象合并成新的option对象,再插入到setOption中
           var mergedObj = Object.assign(this.option,res.data.data);

            myChart.setOption(mergedObj);
              
        })



        // 4. 指定图表的配置项和数据
            // var option = {
            //     title: {
            //         text: 'ECharts 入门示例'
            //     },
            //     tooltip: {},
            //     legend: {
            //         data:['销量']
            //     },
            //     xAxis: {
            //         data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            //     },
            //     yAxis: {},
            //     series: [{
            //         name: '销量',
            //         type: 'bar',
            //         data: [5, 20, 36, 10, 10, 20]
            //     }]
        // };

         //5.使用刚指定的配置项和数据显示图表。
        // myChart.setOption(option);
    },


    methods:{

    }
    
}
</script>
<style lang="scss" scoped>

</style>
