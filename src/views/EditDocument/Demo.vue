<template>
  <iframe class="doc" :src="documentUrl"></iframe>
</template>
<script>
export default {
  name: "demo",
  data() {
    return {
      params: {
        viewMode: "edit",
        documentCode: "test123456789",
        templateCode: "123456789",
        user: "username",
        tenantId: "sys",
        userId: "123456",
        defaultValue: JSON.stringify({
          Text311: "文字字段",
          DropDown143: "组合框",
          DropDown144: "候选列表",
          CheckBox145: true,
          Sex: "男",
          Image226: "https://baizhanke-1253522040.image.myqcloud.com/7ba300bf-2f96-4d77-a0f5-c0b5db466e83.jpg",
          Text147: "123@qq.com",
          Text148: "(123)123-1234",
          Form162: "2008-08-08 08:00:00",
          Text174: "12345-1234",
          Text218: "1234-2345-3456-5678",
          Complex219: {
            0: "123@qq.com",
            1: "复合字段",
          },
        }),
      },
    };
  },
  computed: {
    documentUrl() {
      const url = new URL(`${window.location.origin}/editDocument`);
      url.search = new URLSearchParams(this.params);
      return url.toString();
    },
  },
  mounted() {
    
  },
};
</script>
<style>
.doc {
  width: 100%;
  height: 100%;
  position: absolute;
  outline: none;
  border: none;
}
</style>