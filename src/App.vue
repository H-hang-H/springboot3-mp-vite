<script setup>
import {ref,onMounted,reactive} from 'vue';
import https from './api/index.js'
import { ElMessage } from 'element-plus'
const tableData = ref([]);
const total = ref(0);
const getGoodsList = () => {
  https({
    url:'/good',
    method:'get'
  }).then((res)=>{
    console.log('res',res);
    tableData.value = res;
    tableData.value.forEach(item => {
      item.num = 0;
      item.isSelect = false;
    })
  })
}
onMounted(()=>{
  getGoodsList();
})
const handleSelectionChange = (value) => {
  total.value = 0;
  tableData.value.forEach(item => {
    item.isSelect = false;
  })
  value.forEach(item => {
    item.isSelect = true;
    let tempPrice = item.num * item.price;
    total.value += tempPrice;
  })
}
const handleNum = (item,index) => {
  if( item.num == 0 && index == -1 ) return;
  item.num += index;
  if(item.isSelect){
    total.value = 0;
    tableData.value.forEach(item => {
    if(item.isSelect){
      let tempPrice = item.num * item.price;
      console.log('tempPrice',tempPrice)
      total.value += tempPrice;
    }
  })
  }
}
const buy = () => {
  //[{ids:1,price:123},{}]
  // 拿到商品id
  let orderList = [];
  tableData.value.forEach(item => {
    let obj = {
      id:item.id,
      num:item.num
    }
    orderList.push(obj);
  })
  https({
    method:'POST',
    url:'/orderAdd',
    data:orderList
  }).then(res => {
    if(res){
      ElMessage({
        message:'购买成功',
        type:'success'
      });
    }
  })
}
</script>

<template>
    <el-table
    ref="multipleTableRef"
    :data="tableData"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column type="index" label="序号" width="55" />
    <el-table-column  property="name" label="名称" width="55" />
    <el-table-column property="detail" label="描述" width="120"/>
    <el-table-column property="price" label="价格" width="150" />
    <el-table-column label="操作" width="200" align="center">
      <template #default="scope">
        <el-button @click="handleNum(scope.row,-1)">-</el-button>
        <el-text>{{ scope.row.num }}</el-text>
        <el-button @click="handleNum(scope.row,1)">+</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div>
    <h3>￥合计{{total}}</h3>
    <el-button @click="buy">购买</el-button>
  </div>
</template>

<style scoped>

</style>
