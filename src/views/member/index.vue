<template>
  <div>
    <!-- 搜索组件 -->
    <!-- :inline="true" 表单一行显示 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top:20px">
      <!-- 重置会看el-form-item组件元素的prop上是否指定了字段名，指定了才会生效 -->
      <el-form-item prop="cardNum">
        <!-- style="width=200" 按需调整宽度 -->
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员名称"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型">
          <el-option
            v-for="option in payTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <!-- value-format 指定绑定值得格式 -->
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="searchMap.birthday"
          type="date"
          placeholder="出生日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据列表
            :data绑定渲染的数据
            border表格边框 
    -->
    <el-table :data="list" height="450px" border style="width: 100%">
      <!-- type="index"获取索引值，从1开始，label显示标题,prop数据字段名
            width 列宽
      -->
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="cardNum" label="会员卡号" width="160"></el-table-column>
      <el-table-column prop="name" label="会员姓名" width="80"></el-table-column>
      <el-table-column prop="birthday" label="会员生日" width="120"></el-table-column>
      <el-table-column prop="phone" label="手机号码" width="150"></el-table-column>
      <el-table-column prop="integral" label="可用积分" width="100"></el-table-column>
      <el-table-column prop="money" label="开卡金额" width="100"></el-table-column>
      <el-table-column prop="payType" label="支付类型" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.payType | payTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="会员地址" width="180"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 弹出新增窗口
    title 窗口的标题
    :visible.sync 当他为true时，窗口会被弹出
    -->
    <el-dialog title="会员编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
        :model="pojo"
      >
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <!-- value-format 指定绑定值得格式 -->
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="pojo.birthday"
            type="date"
            placeholder="会员生日"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojo.phone"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="pojo.money" prop="cardNum"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="pojo.integral"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select v-model="pojo.payType" placeholder="支付类型">
            <el-option
              v-for="option in payTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input  type="textarea" v-model="pojo.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <el-button type="primary" @click="pojo.id === null ? addData('pojoForm') : updateDate('pojoForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import memberApi from "@/api/member";

// 支付类型
const payTypeOptions = [
  { type: "1", name: "现金" },
  { type: "2", name: "微信" },
  { type: "3", name: "支付宝" },
  { type: "4", name: "银行卡" },
];

export default {
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示10条数据
      searchMap: {
        //条件查询绑定的条件值
        cardNum: "",
        name: "",
        payType: "",
        birthday: "",
      },
      payTypeOptions,
      dialogFormVisible: false, //控制对话框
      pojo: {
        id:null,
        integral: 0,
        cardNum: "",
        name: "",
        payType: "",
        birthday: "",
        phone:'',
        address:'',
        money:''
      },
      rules: {
        //校验规则
        cardNum: [{ required: true, message: "卡号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        payType: [
          { required: true, message: "支付类型不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    //   当每页显示条数改变后，被处罚，val是最新的每页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    // 当页码改变后，被处罚，val是最新的页码
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    fetchData() {
      //   memberApi.getList().then((response) => {
      // 调用分页查询数据
      memberApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then((response) => {
          const resp = response.data;
          this.list = resp.data.rows;
          this.total = resp.data.total;
        });
    },
    // 打开编辑窗口
    handleEdit(id) {
    //   console.log("编辑", id);
    memberApi.getById(id).then(response=>{
        this.handleAdd()
        const resp = response.data
        if(resp.flag){
            this.pojo = resp.data
        }
    })
    },
    // 删除会员信息
    handleDelete(id) {
      console.log("删除", id);
      this.$confirm('确认删除这条记录吗？','提示',{
          confirmButtonText:'确认',
          cancelButtonText:'取消',
      }).then(()=>{
        //   确认
        console.log("确认")
        memberApi.deleteById(id).then(response=>{
            const resp = response.data
            this.$message({
                message:resp.message,
                type:resp.flag ? 'success' : 'error'
            })
            if(resp.flag){
                // 删除成功
                // console.log(resp)
                // 删除成功，刷新列表数据
                this.fetchData()

            }
        })
      }).catch(()=>{
        //   取消 不用操作
        console.log("取消")
      })
    },
    // 重置搜索框
    resetForm(formName) {
      // 重置会看el-form-item组件元素的prop上是否指定了字段名，指定了才会生效
      this.$refs[formName].resetFields();
    },
    // 提交新增数据
    addData(formName) {
    //   console.log("add.Data");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 验证通过提交表单
          // console.log('add.Data')
          memberApi.add(this.pojo).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              // 新增成功，刷新列表
              this.fetchData();
              this.dialogFormVisible = false; //关闭窗口
            } else {
              // 失败。来点提示信息
              this.$message({
                message: "新增失败",
                type: "warning",
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    // 弹出新增窗口
    handleAdd(){
        this.dialogFormVisible=true,
        this.$nextTick(()=>{
            //  this.$nextTick()是一个异步事件，当渲染结束之后，它的回调函数才会被执行
            // 弹出窗口打开后，需要加载Dom，需要花费一些时间
            // 我们就应该等它加载dom之后，再调用resetFields方法去重置表单和清除样式
            this.$refs['pojoForm'].resetFields();
        })
        
    },
    updateDate(formName){
        // console.log('updateDate')
        this.$refs[formName].validate(valid =>{
            if(valid){
                //提交更新
                memberApi.update(this.pojo).then(response =>{
                    const resp = response.data;
                    if(resp.flag){
                        // 刷新列表
                        this.fetchData()
                        this.dialogFormVisible=false
                    }else{
                        this.$message({
                            message:resp.message,
                            type:'warning'
                        })
                    }
                })
            }else{
                return false
            }
        })
    }
  },
  //   过滤器
  filters: {
    payTypeFilter(type) {
      //   payTypeOptions.find(obj=>{
      //       obj.type === type
      //   })
      const payObj = payTypeOptions.find((obj) => obj.type === type);
      return payObj ? payObj.name : null;
    },
  },
};
</script>