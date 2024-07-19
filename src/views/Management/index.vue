<template>
  <div class="management">
    <Tabs type="card" v-model="search.SearchTemplateFlag">
      <TabPane label="普通文档" name="0">
        <div class="search">
          <Form
            inline
            style="
              display: flex;
              align-items: center;
              justify-content: space-evenly;
              flex-wrap: wrap;
            "
          >
            <FormItem label="关键词">
              <Input
                type="text"
                v-model="search.keyWord"
                placeholder="模板编号/文档编号/用户名称"
              ></Input>
            </FormItem>
            <FormItem label="文件类型">
              <Select v-model="search.fileType" filterable clearable>
                <Option
                  v-for="item in [
                    'xls',
                    'xlsx',
                    'ppt',
                    'pptx',
                    'doc',
                    'docx',
                    'pdf',
                    'csv',
                    'oform',
                    'docxf',
                    'ods',
                  ]"
                  :value="item"
                  :key="item"
                  >{{ item }}</Option
                >
              </Select>
            </FormItem>
            <FormItem label="文件名">
              <Input
                type="text"
                v-model="search.fileName"
                placeholder="请输入文件名"
              ></Input>
            </FormItem>
          </Form>
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              flex-wrap: wrap;
              margin: 10px;
            "
          >
            <Button type="primary" icon="md-search" @click="searchHandler"
              >查询</Button
            >
            <Button
              icon="md-refresh"
              @click="initData"
              style="margin-left: 10px"
              >重置</Button
            >
          </div>
        </div>
        <div class="header">
          <Button
            type="primary"
            icon="md-add"
            @click="addDocumentVisible = true"
            >新建文档</Button
          >
        </div>
        <Table
          class="table"
          ref="ivw-table"
          border
          :columns="table.columns('document')"
          :data="table.data"
        >
        </Table>
        <Page
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            margin: 10px;
          "
          @on-change="onChangePage"
          @on-page-size-change="onChangePageSize"
          :page-size="paginationInfo.pageSize"
          :total="paginationInfo.total"
          size="small"
          show-elevator
          show-total
          show-sizer
        />
      </TabPane>
      <TabPane label="模板文档" name="1">
        <div class="search">
          <Form
            inline
            style="
              display: flex;
              align-items: center;
              justify-content: space-evenly;
              flex-wrap: wrap;
            "
          >
            <FormItem label="关键词">
              <Input
                type="text"
                v-model="search.keyWord"
                placeholder="模板编号/文档编号/用户名称"
              ></Input>
            </FormItem>
            <FormItem label="文件类型">
              <Select v-model="search.fileType" filterable clearable>
                <Option
                  v-for="item in [
                    'xls',
                    'xlsx',
                    'ppt',
                    'pptx',
                    'doc',
                    'docx',
                    'pdf',
                    'csv',
                    'oform',
                    'docxf',
                    'ods',
                  ]"
                  :value="item"
                  :key="item"
                  >{{ item }}</Option
                >
              </Select>
            </FormItem>
            <FormItem label="文件名">
              <Input
                type="text"
                v-model="search.fileName"
                placeholder="请输入文件名"
              ></Input>
            </FormItem>
          </Form>
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              flex-wrap: wrap;
              margin: 10px;
            "
          >
            <Button type="primary" icon="md-search" @click="searchHandler"
              >查询</Button
            >
            <Button
              icon="md-refresh"
              @click="initData"
              style="margin-left: 10px"
              >重置</Button
            >
          </div>
        </div>
        <div class="header">
          <Button
            type="primary"
            icon="md-add"
            @click="addTemplateVisible = true"
            style="margin-left: 10px"
            >新建模板</Button
          >
        </div>
        <Table
          class="table"
          ref="ivw-table"
          border
          :columns="
            table.columns('template').filter((column) => column.key != 'document_code')
          "
          :data="table.data"
        >
        </Table>
        <Page
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            margin: 10px;
          "
          @on-change="onChangePage"
          @on-page-size-change="onChangePageSize"
          :page-size="paginationInfo.pageSize"
          :total="paginationInfo.total"
          size="small"
          show-elevator
          show-total
          show-sizer
        />
      </TabPane>
    </Tabs>
    <AddDocument
      :value.sync="addDocumentVisible"
      @success="initData"
    ></AddDocument>
    <AddTemplate
      :value.sync="addTemplateVisible"
      @success="initData"
    ></AddTemplate>
    <EditTemplateSettings
      :value.sync="editTemplateSettingsVisible"
      :document="editedTemplate"
      @success="initData"
    ></EditTemplateSettings>
    <div ref="ivw-hide"></div>
  </div>
</template>
<script>
import AddDocument from "./AddDocument";
import AddTemplate from "./AddTemplate";
import EditTemplateSettings from "./EditTemplateSettings";
const defaultPageSize = 20;
export default {
  name: "Management",
  components: {
    "ivw-upload": () => import("@/components/ivw-upload"),
    AddDocument,
    AddTemplate,
    EditTemplateSettings,
  },
  data() {
    return {
      paginationInfo: {
        pageIndex: 1,
        pageSize: defaultPageSize,
        total: 0,
      },
      pageSize: defaultPageSize,
      addDocumentVisible: false,
      addTemplateVisible: false,
      editTemplateSettingsVisible: false,
      user: {},
      search: {
        SearchTemplateFlag: "0",
      },
      editedTemplate: {},
      table: {
        columns: (code) => [
          {
            type: "index",
            title: "序号",
            align: "center",
            width: 65,
          },
          {
            key: "attach_show_name",
            title: "文件名",
            align: "left",
          },
          {
            key: "template_code",
            title: "模板编号",
            align: "left",
          },
          {
            key: "document_code",
            title: "文档编号",
            align: "left",
          },
          {
            title: "操作",
            align: "center",
            width: 360,
            render: (h, { column, row, index }) => {
              let setting = h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                  },
                  class: "ivw-light-blue",
                  on: {
                    click: () => this.setting(row),
                  },
                },
                [
                  h("Icon", { props: { type: "ios-settings" } }),
                  h("span", "配置参数"),
                ]
              );

              let edit = h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                  },
                  class: "ivw-light-blue",
                  on: {
                    click: () => this.edit(row),
                  },
                },
                [
                  h("Icon", { props: { type: "ios-list-box-outline" } }),
                  h("span", "编辑"),
                ]
              );

              let preview = h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                  },
                  class: "ivw-light-blue",
                  on: {
                    click: () => this.preview(row),
                  },
                },
                [
                  h("Icon", { props: { type: "ios-eye-outline" } }),
                  h("span", "预览"),
                ]
              );

              let forceSave = h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                  },
                  class: "ivw-orange",
                  on: {
                    click: () => this.forceSave(row),
                  },
                },
                [
                  h("Icon", { props: { type: "ios-warning-outline" } }),
                  h("span", "同步"),
                ]
              );
              let drop = h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                  },
                  class: "ivw-orange",
                  on: {
                    click: () => this.drop(row),
                  },
                },
                [
                  h("Icon", { props: { type: "ios-warning-outline" } }),
                  h("span", "删除"),
                ]
              );

              let info = h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                  },
                  class: "ivw-orange",
                  on: {
                    click: () => this.info(row),
                  },
                },
                [
                  h("Icon", { props: { type: "ios-warning-outline" } }),
                  h("span", "info"),
                ]
              );

              let license = h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                  },
                  class: "ivw-orange",
                  on: {
                    click: () => this.license(row),
                  },
                },
                [
                  h("Icon", { props: { type: "ios-warning-outline" } }),
                  h("span", "license"),
                ]
              );

              let meta = h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                  },
                  class: "ivw-orange",
                  on: {
                    click: () => this.meta(row),
                  },
                },
                [
                  h("Icon", { props: { type: "ios-warning-outline" } }),
                  h("span", "meta"),
                ]
              );

              let version = h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                  },
                  class: "ivw-orange",
                  on: {
                    click: () => this.version(row),
                  },
                },
                [
                  h("Icon", { props: { type: "ios-warning-outline" } }),
                  h("span", "version"),
                ]
              );

              return h(
                "Row",
                {
                  props: {
                    justify: "start",
                  },
                },
                [
                  ...(code == 'template' ? [setting] : []),
                  edit,
                  preview,
                  forceSave,
                  drop,
                  // info,
                  // license,
                  // meta,
                  // version
                ]
              );
            },
          },
        ],
        data: [],
      },
    };
  },
  watch: {
    "search.SearchTemplateFlag": {
      handler() {
        this.initData();
      },
    },
  },
  methods: {
    reset() {
      this.paginationInfo = {
        pageIndex: 1,
        pageSize: this.pageSize,
        total: 0,
      };
      this.search = {
        ...this.search,
        keyWord: undefined,
        fileType: undefined,
        fileName: undefined,
      };
    },
    searchHandler() {
      this.paginationInfo = {
        pageIndex: 1,
        pageSize: this.pageSize,
        total: 0,
      };
      this.pagination();
    },
    initData() {
      const parseJwt = (token) => {
        let jsonPayload = "{}";
        try {
          var base64Url = token.split(".")[1];
          var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          jsonPayload = decodeURIComponent(
            window
              .atob(base64)
              .split("")
              .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join("")
          );
        } catch {}
        return JSON.parse(jsonPayload);
      };
      this.$store.state.user = parseJwt(
        decodeURIComponent(this.$route.query.token)
      );
      this.reset();
      this.pagination();
    },
    submit() {},
    edit(row) {
      // this.$router.replace({
      //   path: '/editDocument',
      //   query: {
      //     id: row.id,
      //     user: 'test',
      //   },
      // })

      let form = document.createElement("form");
      form.action = process.env.VUE_APP_BASE_API + "/api/edit";
      form.target = "_blank";
      form.method = "POST";
      // id
      let input = document.createElement("input");
      input.name = "id";
      input.value = row.id;
      form.append(input);
      // user
      input = document.createElement("input");
      input.name = "user";
      input.value = this.$store.state.user.user_name;
      form.append(input);
      // tenant id
      input = document.createElement("input");
      input.name = "tenantId";
      input.value = this.$store.state.user.tenantId;
      form.append(input);
      // user id
      input = document.createElement("input");
      input.name = "userId";
      input.value = this.$store.state.user.userId;
      form.append(input);
      // view mode
      input = document.createElement("input");
      input.name = "viewMode";
      input.value = "edit";
      form.append(input);

      this.$refs["ivw-hide"].append(form);
      form.submit();
      form.remove();
    },
    preview(row) {
      // this.$router.replace({
      //   path: '/editDocument',
      //   query: {
      //     id: row.id,
      //     user: 'test',
      //   },
      // })

      let form = document.createElement("form");
      form.action = process.env.VUE_APP_BASE_API + "/api/edit";
      form.target = "_blank";
      form.method = "POST";
      // id
      let input = document.createElement("input");
      input.name = "id";
      input.value = row.id;
      form.append(input);
      // user
      input = document.createElement("input");
      input.name = "user";
      input.value = this.$store.state.user.user_name;
      form.append(input);
      // tenant id
      input = document.createElement("input");
      input.name = "tenantId";
      input.value = this.$store.state.user.tenantId;
      form.append(input);
      // user id
      input = document.createElement("input");
      input.name = "userId";
      input.value = this.$store.state.user.userId;
      form.append(input);
      // view mode
      input = document.createElement("input");
      input.name = "viewMode";
      input.value = "view";
      form.append(input);

      this.$refs["ivw-hide"].append(form);
      form.submit();
      form.remove();
    },
    forceSave(row) {
      this.$http.get("/force-save?id=" + row.id).then((res) => {
        this.$Message.success("同步成功");
        // this.$Message.info(res.data.data);
        // if (res.data.error == 0) {
        //   alert('文档正在编辑，5秒后开始下载最新版！');
        //   setTimeout(function () {
        //     window.location.href = "/download?name=" + 'v1' + row.file_name;
        //     // var $eleForm = $("<form method='get'></form>");
        //     // $eleForm.attr("action",  "/download?name=" + row.file_name);
        //     // $(document.body).append($eleForm);
        //     // //提交表单，实现下载
        //     // $eleForm.submit();
        //   }, 5000);
        //   return;
        // } else {
        //   alert('文档未编辑，开始下载！');
        // }
        // window.location.href = "/download?name=" + row.file_name;
        // var $eleForm = $("<form method='get'></form>");
        // $eleForm.attr("action",  "/download?name=" + row.file_name);
        // $(document.body).append($eleForm);
        // //提交表单，实现下载
        // $eleForm.submit();
      });
    },
    drop(row) {
      this.$http
        .get("/drop?id=" + row.id + "&user=" + this.$store.state.user.user_name)
        .then((res) => {
          // this.$Message.info(res.data.data);
          this.$Message.success("删除成功");
          this.initData();
        });
    },
    info(row) {
      this.$http.get("/info?id=" + row.id).then((res) => {
        this.$Message.info(res.data.data);
      });
    },
    license(row) {
      this.$http.get("/license?id=" + row.id).then((res) => {
        this.$Message.info(res.data.data);
      });
    },
    meta(row) {
      this.$http.get("/meta?id=" + row.id).then((res) => {
        this.$Message.info(res.data.data);
      });
    },
    version(row) {
      this.$http.get("/version?id=" + row.id).then((res) => {
        this.$Message.info(res.data.data);
      });
    },
    setting(row) {
      // this.$http
      //   .get("/drop?id=" + row.id + "&user=" + this.$store.state.user.user_name)
      //   .then((res) => {
      //     // this.$Message.info(res.data.data);
      //     this.$Message.success("删除成功");
      //     this.initData();
      //   });
      this.editedTemplate = row;
      this.$nextTick(() => {
        this.editTemplateSettingsVisible = true;
      })
    },
    onChangePage(page) {
      this.paginationInfo.pageIndex = page;
      this.pagination();
    },
    onChangePageSize(pageSize) {
      this.pageSize = pageSize;
      this.reset();
      this.pagination();
    },
    // 获取文件列表
    pagination() {
      let query = {
        tenantId: this.$store.state.tenantId,
        userId: this.$store.state.userId,

        SearchTemplateFlag: this.search.SearchTemplateFlag,
        keyWord: `${this.search.keyWord ? this.search.keyWord : ""}${
          this.search.fileType ? `.${this.search.fileType}` : ""
        }`,
        fileName: this.search.fileName,
      };

      const getUrlFromQuery = (query) => {
        return Object.keys(query)
          .reduce((prev, next) => {
            if (query[next]) {
              return prev + `${next}=${query[next]}&`;
            } else {
              return prev;
            }
          }, "?")
          .slice(0, -1);
      };
      this.$http
        .get(
          `/pagination${getUrlFromQuery({
            ...query,
            ...{
              options: encodeURIComponent(
                JSON.stringify({
                  attach_time: -1,
                })
              ),
              pageIndex: this.paginationInfo.pageIndex,
              pageSize: this.paginationInfo.pageSize,
            },
          })}`
        )
        .then((res) => {
          this.table.data = res.data.data;
          this.paginationInfo.pageIndex = res.data.pageIndex;
          this.paginationInfo.pageSize = res.data.pageSize;
          this.paginationInfo.total = res.data.cout;
        });
    },
  },
  created() {
    this.initData();
  },
};
</script>
<style lang="less" scoped>
.management {
  padding: 10px;
  box-sizing: border-box;
}
.search {
}
.header {
  display: flex;
  align-items: center;
  margin: 10px 0;
}
.table {
  height: calc(100vh - 300px);
  /deep/.ivu-table-body {
    height: calc(100% - 39px);
    overflow-x: hidden;
    overflow-y: auto;
  }
}
/deep/.ivu-table-title {
  display: none;
}
</style>