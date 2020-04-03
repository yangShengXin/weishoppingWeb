import Vue from 'vue'
import { Button,Form,FormItem,Input,Message, Notification,
        Container,Aside,Main,Header,
        Menu,Submenu,MenuItemGroup,MenuItem,
        Breadcrumb,BreadcrumbItem,Card,Row,Col,Table,TableColumn,Switch,
        Tooltip,Pagination,Dialog,MessageBox,Tag,Tree,Select,Option,Cascader,Alert,CheckboxGroup,Checkbox,
        Tabs,TabPane,Steps,Step,Upload
}from 'element-ui'



//vue-cli-plugin-element插件&element版本不同(element有的的组件,该插件没有及时更新)
// 1.导入时间闲组件  2.并在需要使用该组件的组件里面引入样式  ...plugins/timeline/timeline.css
// import Timeline from './timeline/index.js'      
// import TimelineItem from './timeline-item/index.js'
// Vue.use(Timeline);
// Vue.use(TimelineItem);



Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Container);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Header);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItemGroup);
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Select);
Vue.use(Option);
Vue.use(Cascader);
Vue.use(Alert);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Steps);
Vue.use(Step);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Upload);

Vue.prototype.$notify=Notification;
Vue.prototype.$message=Message;
Vue.prototype.$confirm = MessageBox.confirm;  //全局调用Message的 confirm函数