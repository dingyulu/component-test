<template>
  <Modal v-bind="$attrs" v-on="$listeners" title="新建文档" ref="Modal" :mask-closable="false" :closable="false">
    <Form
      v-if="currentDocument"
      ref="Form"
      :model="currentDocument"
      :rules="rules"
      :label-width="100"
      :key="key"
    >
      <FormItem prop="documentCode" label="文档编号">
        <Input type="text" v-model="currentDocument.documentCode"></Input>
      </FormItem>
      <!-- <FormItem prop="templateCode" label="模板">
        <Input
          type="text"
          v-model="currentDocument.componentId"
        ></Input>
      </FormItem> -->
      <FormItem prop="isUseTemplate" label="是否使用模板">
        <i-Switch v-model="currentDocument.isUseTemplate" />
      </FormItem>
      <FormItem
        v-if="currentDocument.isUseTemplate"
        prop="templateCode"
        label="模板"
      >
        <Select v-model="currentDocument.templateCode" filterable>
          <Option
            v-for="item in templateList"
            :value="item.template_code"
            :key="item.template_code"
            >{{ item.attach_show_name }}</Option
          >
        </Select>
      </FormItem>
      <FormItem v-else prop="templateFile" label="上传文件">
        <ivw-upload
          action="#"
          type="drag"
          :max-size="1024 * 10"
          accept=".xls, .xlsx, .ppt, .pptx, .doc, .docx, .pdf, .csv, .oform, .docxf, ods"
          :format="[
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
          :on-success="onSuccess"
        >
          <div style="padding: 20px 0">
            <Icon class="ivw-light-blue" type="md-grid" size="52"></Icon>
            <p>点击选择或拖拽文件到此处！</p>
          </div>
        </ivw-upload>
      </FormItem>
      <FormItem
        v-if="currentDocument.isUseTemplate && currentDocument.templateCode"
        label="模板编号"
      >
        <Input v-model="currentDocument.templateCode" disabled/>
      </FormItem>
      <div ref="ivw-hide"></div>
    </Form>
    <template #footer>
      <Button @click="onCancel">取消</Button>
      <Button type="primary" :loading="loading" @click="onConfirm">确定</Button>
    </template>
  </Modal>
</template>
<script>
export default {
  name: "AddDocument",
  props: {
    document: {
      type: Object,
      default: () => ({
        isUseTemplate: false,
        documentCode: null,
        templateFile: null,
        templateCode: null,
      }),
    },
  },
  components: {
    "ivw-upload": () => import("@/components/ivw-upload"),
  },
  data() {
    return {
      key: new Date().getTime(),
      loading: false,
      currentDocument: null,

      templateList: [],
    };
  },
  computed: {
    rules() {
      this.key = new Date().getTime()
      return {
        documentCode: [
          { required: this.currentDocument.isUseTemplate, message: "请输入文档编号", trigger: "blur" },
        ],
        templateFile: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (!this.currentDocument.templateFile) {
                callback(new Error("请选择模板文档"));
                return;
              }
              callback();
            },
          },
        ],
        templateCode: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (!this.currentDocument.templateCode) {
                callback(new Error("请选择模板"));
                return;
              }
              callback();
            },
          },
        ],
      }
    },
  },
  methods: {
    initWatch() {
      this.$watch(
        () => {
          return this.$refs.Modal.value;
        },
        () => {
          if (this.$refs.Modal.value) {
            // visible
            this.currentDocument = JSON.parse(JSON.stringify(this.document));
            this.initData();
          } else {
            // hide
            this.currentDocument = null;
          }
        },
        {
          deep: true,
        }
      );
    },
    onSuccess(file) {
      this.currentDocument.templateFile = file;
    },
    onCancel() {
      this.$emit("update:value", false);
    },
    onConfirm() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          if (this.currentDocument.isUseTemplate) {
            let form = document.createElement("form");
            form.action = process.env.VUE_APP_BASE_API + "/api/edit";
            form.target = "_blank";
            form.method = "POST";
            // // id
            // let input = document.createElement("input");
            // input.name = "id";
            // input.value = row.id;
            // form.append(input);

            // document code
            let input = document.createElement("input");
            input.name = "documentCode";
            input.value = this.currentDocument.documentCode;
            form.append(input);
            // template code
            input = document.createElement("input");
            input.name = "templateCode";
            input.value = this.currentDocument.templateCode;
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

            this.$refs["ivw-hide"].append(form);
            form.submit();
            form.remove();
          } else {
            let formData = new FormData();
            formData.append("tenantId", this.$store.state.user.tenantId);
            formData.append("userId", this.$store.state.user.userId);
            formData.append("user", this.$store.state.user.user_name);

            formData.append("documentCode", this.currentDocument.documentCode);
            formData.append("file", this.currentDocument.templateFile);
            // formData.append("templateCode", this.currentDocument.templateCode);
            if (this.currentDocument.documentCode) {
              this.$http.get(`/documentCode/count?code=${this.currentDocument.documentCode}`).then(res => {
                if (res && res.data && res.data.code == '0') {
                  this.$http
                    .post("/upload", formData, {
                      "Content-Type": "multipart/form-data",
                    })
                    .then((res) => {
                      this.$emit("update:value", false);
                      this.$emit("update:document", this.currentDocument);
                      this.$emit("success");
                      this.$Message.success("新建成功");
                    })
                    .catch((err) => {
                      this.$Message.error("新建失败!");
                    })
                } else if (res && res.data && res.data.code == '2002') {
                  this.$Message.error('文档编号已存在!')
                } else {
                  this.$Message.error('新建失败!')
                }
              })
            } else {
              this.$http
                .post("/upload", formData, {
                  "Content-Type": "multipart/form-data",
                })
                .then((res) => {
                  this.$emit("update:value", false);
                  this.$emit("update:document", this.currentDocument);
                  this.$emit("success");
                  this.$Message.success("新建成功");
                })
                .catch((err) => {
                  this.$Message.error("新建失败!");
                })
            }
          }
        } else {
          // this.$Message.error("验证失败!")
        }
      });
    },
    initData() {
      // this.templateList
      this.$http.get(`/pagination?SearchTemplateFlag=1&pageIndex=1&pageSize=9999&options=${encodeURIComponent(JSON.stringify({
        attach_time: -1,
      }))}`).then((res) => {
        this.templateList = res.data.data;
      });
    },
  },
  mounted() {
    this.initWatch();
    this.initData();
  },
};
</script>
<style lang="less" scoped>
</style>
